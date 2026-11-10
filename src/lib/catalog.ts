import { demoProducts } from "@/data/demo-products";
import type { Audience, Product, ProductTag, ShoeType } from "@/types/product";

/*
 * Capa de acceso al catálogo. Las funciones son asíncronas a propósito:
 * cuando el catálogo pase a la base de datos solo cambia este archivo.
 */

export interface CatalogQuery {
  audience?: Audience;
  type?: ShoeType;
  tag?: ProductTag;
  search?: string;
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const published = () => demoProducts.filter((p) => p.status === "publicado");

export async function getProducts(query: CatalogQuery = {}): Promise<Product[]> {
  const terms = query.search ? normalize(query.search).split(/\s+/).filter(Boolean) : [];

  return published().filter((p) => {
    if (query.audience && p.audience !== query.audience) return false;
    if (query.type && p.type !== query.type) return false;
    if (query.tag && !p.tags.includes(query.tag)) return false;
    if (terms.length) {
      const haystack = normalize(
        [p.name, p.reference, p.description, p.type, p.audience, ...p.colors.map((c) => c.name)].join(" "),
      );
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return published().find((p) => p.slug === slug);
}

/** Busca la variante (color + talla) por su SKU junto con su producto publicado. */
export async function getVariantBySku(sku: string) {
  for (const product of published()) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) {
      const color = product.colors.find((c) => c.id === variant.colorId)!;
      return { product, variant, color };
    }
  }
  return undefined;
}

export async function getAllProductSlugs(): Promise<string[]> {
  return published().map((p) => p.slug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return published()
    .filter((p) => p.id !== product.id && (p.audience === product.audience || p.type === product.type))
    .sort((a, b) => Number(b.audience === product.audience) - Number(a.audience === product.audience))
    .slice(0, limit);
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

/** Tallas con al menos una unidad en cualquier color, ordenadas. */
export function availableSizes(product: Product): number[] {
  const sizes = new Set(product.variants.filter((v) => v.stock > 0).map((v) => v.size));
  return [...sizes].sort((a, b) => a - b);
}

export function allSizes(product: Product): number[] {
  return [...new Set(product.variants.map((v) => v.size))].sort((a, b) => a - b);
}
