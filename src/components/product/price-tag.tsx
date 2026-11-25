import { formatCop } from "@/lib/format";

interface PriceTagProps {
  price: number;
  compareAt?: number;
  size?: "sm" | "lg";
  /** El precio cambia según la talla: se muestra "Desde" antes del menor. */
  from?: boolean;
  className?: string;
}

export function PriceTag({ price, compareAt, size = "sm", from = false, className = "" }: PriceTagProps) {
  const onSale = compareAt !== undefined && compareAt > price;

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={`font-display font-bold text-ink ${size === "lg" ? "text-headline-md" : "text-price-sm"}`}>
        {onSale && <span className="sr-only">Precio actual: </span>}
        {from && (
          <span className={`font-sans font-medium text-muted ${size === "lg" ? "text-title-sm" : "text-label-md"}`}>Desde </span>
        )}
        {formatCop(price)}
      </span>
      {onSale && (
        <span className={`text-muted line-through ${size === "lg" ? "text-title-sm" : "text-label-md"}`}>
          <span className="sr-only">Precio anterior: </span>
          {formatCop(compareAt)}
        </span>
      )}
    </p>
  );
}
