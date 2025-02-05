import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, RefreshCcw } from "lucide-react";
import type { Product, Price } from "@shared/schema";
import { webSocketService } from "@/lib/websocket";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProductCardProps {
  product: Product;
  prices: Price[];
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export default function ProductCard({ product, prices: initialPrices, onFavorite, isFavorite }: ProductCardProps) {
  const [prices, setPrices] = useState<Price[]>(initialPrices);
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Listen for price updates
    const unsubscribe = webSocketService.onMessage((message) => {
      if (message.type === 'PRICE_UPDATE' && 
          message.data.productId === product.id) {
        setPrices(currentPrices => 
          currentPrices.map(price => 
            price.storeId === message.data.storeId
              ? { ...price, price: message.data.price }
              : price
          )
        );

        // Show a toast notification for price updates
        toast({
          title: "מחיר התעדכן",
          description: `המחיר של ${product.name} התעדכן`,
        });
      }
    });

    return () => unsubscribe();
  }, [product.id, toast]);

  // Function to test price update
  const handleTestUpdate = async () => {
    if (prices.length === 0) return;

    setIsUpdating(true);
    try {
      const priceToUpdate = prices[0];
      const newPrice = priceToUpdate.price + 100; // Add 1 NIS for testing

      await apiRequest("PATCH", `/api/prices/${priceToUpdate.id}`, {
        price: newPrice
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לעדכן את המחיר",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const lowestPrice = Math.min(...prices.map(p => p.price));
  const highestPrice = Math.max(...prices.map(p => p.price));

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
          {product.imageUrl && (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="space-y-1">
            <Badge variant="secondary">{product.category}</Badge>
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                ₪{(lowestPrice / 100).toFixed(2)}
              </span>
              {highestPrice !== lowestPrice && (
                <span className="text-muted-foreground ml-1">
                  - ₪{(highestPrice / 100).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {onFavorite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFavorite}
                className={isFavorite ? "text-red-500" : "text-muted-foreground"}
              >
                <Heart className="h-5 w-5" />
              </Button>
            )}

            {/* Test update button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleTestUpdate}
              disabled={isUpdating}
            >
              <RefreshCcw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}