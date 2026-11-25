import type { Product, ProductVariant } from "@/types/product";

/*
 * Cálculos de precio sin acceso a datos: se pueden usar también en componentes de
 * cliente sin incluir el catálogo en el código que descarga el navegador.
 */

/** Precio de una talla concreta: el suyo propio o, si no tiene, el del producto. */
export function variantPriceCop(product: Product, variant: ProductVariant): number {
  return variant.priceCop ?? product.priceCop;
}

/** Precio menor y mayor entre todas las tallas (iguales si el precio no cambia con la talla). */
export function priceRange(product: Product): { min: number; max: number } {
  const prices = product.variants.map((v) => variantPriceCop(product, v));
  return prices.length
    ? { min: Math.min(...prices), max: Math.max(...prices) }
    : { min: product.priceCop, max: product.priceCop };
}

/** Rangos de tallas consecutivas con el mismo precio, p. ej. 23–27: $50.000. */
export function priceBySizeRanges(product: Product): { from: number; to: number; priceCop: number }[] {
  const bySize = new Map<number, number>();
  for (const v of product.variants) if (!bySize.has(v.size)) bySize.set(v.size, variantPriceCop(product, v));
  const ranges: { from: number; to: number; priceCop: number }[] = [];
  for (const [size, priceCop] of [...bySize].sort((a, b) => a[0] - b[0])) {
    const last = ranges.at(-1);
    if (last && last.priceCop === priceCop && last.to === size - 1) last.to = size;
    else ranges.push({ from: size, to: size, priceCop });
  }
  return ranges;
}
