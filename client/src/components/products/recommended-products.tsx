import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./product-card";
import type { Product, Price } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface ProductRecommendation {
  productId: number;
  reason: string;
  score: number;
}

export default function RecommendedProducts() {
  const { t } = useTranslation();
  const userId = 1; // Hardcoded for demo

  const { data: recommendations, isLoading: loadingRecommendations } = useQuery<ProductRecommendation[]>({
    queryKey: [`/api/users/${userId}/recommendations`]
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  const { data: prices } = useQuery<Price[]>({
    queryKey: ["/api/products/1/prices"]
  });

  if (loadingRecommendations) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[140px] w-full" />
        <Skeleton className="h-[140px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations?.map((rec) => {
        const product = products?.find(p => p.id === rec.productId);
        if (!product) return null;

        return (
          <div key={rec.productId} className="space-y-2">
            <ProductCard
              product={product}
              prices={prices || []}
              onFavorite={() => {}}
            />
            <p className="text-sm text-muted-foreground px-2">
              {rec.reason}
            </p>
          </div>
        );
      })}
    </div>
  );
}
