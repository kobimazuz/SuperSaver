import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import type { Product, Price } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  prices: Price[];
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export default function ProductCard({ product, prices, onFavorite, isFavorite }: ProductCardProps) {
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
        </div>
      </CardContent>
    </Card>
  );
}
