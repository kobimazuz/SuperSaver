import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import type { Product, Price } from "@shared/schema";

export default function Home() {
  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  const { data: prices, isLoading: loadingPrices } = useQuery<Price[]>({
    queryKey: ["/api/products/1/prices"]
  });

  return (
    <div className="container p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">SuperSaver</h1>
        <p className="text-muted-foreground">
          Find the best prices in Israeli supermarkets
        </p>
      </header>

      <Card>
        <CardContent className="p-4">
          <Button className="w-full justify-start" variant="secondary">
            <Search className="mr-2 h-4 w-4" />
            Search for products...
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Today's Best Deals</h2>
        
        {loadingProducts || loadingPrices ? (
          <div className="space-y-4">
            <Skeleton className="h-[140px] w-full" />
            <Skeleton className="h-[140px] w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {products?.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                prices={prices || []}
                onFavorite={() => {}}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
