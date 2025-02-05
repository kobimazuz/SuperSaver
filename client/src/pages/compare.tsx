import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Product, Price, Store } from "@shared/schema";

export default function Compare() {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  const { data: stores } = useQuery<Store[]>({
    queryKey: ["/api/stores"]
  });

  const { data: prices } = useQuery<Price[]>({
    queryKey: ["/api/products/1/prices"]
  });

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Compare Prices</h1>
        <p className="text-muted-foreground mt-2">
          Find the best deals across stores
        </p>
      </header>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {filteredProducts?.map(product => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedProduct && (
          <div className="space-y-4 mt-6">
            <h2 className="text-lg font-semibold">Price Comparison</h2>
            {stores?.map(store => {
              const price = prices?.find(p => p.storeId === store.id);
              return (
                <Card key={store.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{store.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {store.address}
                        </p>
                      </div>
                      {price && (
                        <span className="text-lg font-semibold">
                          ₪{(price.price / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
