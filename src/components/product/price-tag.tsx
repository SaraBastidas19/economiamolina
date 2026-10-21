import { formatCop } from "@/lib/format";

interface PriceTagProps {
  price: number;
  compareAt?: number;
  size?: "sm" | "lg";
  className?: string;
}

export function PriceTag({ price, compareAt, size = "sm", className = "" }: PriceTagProps) {
  const onSale = compareAt !== undefined && compareAt > price;

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={`font-display font-bold text-primary-container ${size === "lg" ? "text-headline-md" : "text-price-sm"}`}>
        {onSale && <span className="sr-only">Precio actual: </span>}
        {formatCop(price)}
      </span>
      {onSale && (
        <span className={`text-slate line-through ${size === "lg" ? "text-title-sm" : "text-label-md"}`}>
          <span className="sr-only">Precio anterior: </span>
          {formatCop(compareAt)}
        </span>
      )}
    </p>
  );
}
