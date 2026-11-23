import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

interface ProductGridProps {
  products: Product[];
  /** Cantidad de tarjetas iniciales que se cargan sin diferir la imagen. */
  eagerCount?: number;
  columns?: "3" | "4";
}

export function ProductGrid({ products, eagerCount = 0, columns = "4" }: ProductGridProps) {
  return (
    <ul
      className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 ${columns === "4" ? "xl:grid-cols-4" : ""}`}
    >
      {products.map((product, i) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} eager={i < eagerCount} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="overflow-hidden rounded-3xl border border-line bg-white">
          <div className="aspect-[4/5] animate-pulse bg-sand" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/2 animate-pulse rounded bg-sand" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-sand" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-sand" />
          </div>
        </li>
      ))}
    </ul>
  );
}
