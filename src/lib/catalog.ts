import { demoProducts } from "@/data/demo-products";
import { AUDIENCES, SHOE_TYPES, type Audience, type Product, type ProductTag, type ShoeType } from "@/types/product";

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

/** Filtros del catálogo: dentro de un grupo se combinan con "o", entre grupos con "y". */
export interface ProductFilters {
  audiences: Audience[];
  types: ShoeType[];
  sizes: number[];
  colors: string[];
  priceMin?: number;
  priceMax?: number;
  tag?: ProductTag;
  search?: string;
}

export type SortKey = "recientes" | "precio-asc" | "precio-desc";

type FacetGroup = "audiences" | "types" | "sizes" | "colors" | "price";

export interface CatalogFacets {
  audiences: Record<Audience, number>;
  types: Record<ShoeType, number>;
  sizes: { size: number; count: number }[];
  colors: { id: string; name: string; hex: string; count: number }[];
}

function searchMatches(p: Product, terms: string[]): boolean {
  if (!terms.length) return true;
  const haystack = normalize(
    [p.name, p.reference, p.description, p.type, p.audience, ...p.colors.map((c) => c.name)].join(" "),
  );
  return terms.every((t) => haystack.includes(t));
}

const hasSizeInStock = (p: Product, size: number) => p.variants.some((v) => v.size === size && v.stock > 0);

/** Comprueba los filtros de grupo; `skip` excluye uno para calcular sus conteos. */
function matchesGroups(p: Product, f: ProductFilters, skip?: FacetGroup): boolean {
  if (skip !== "audiences" && f.audiences.length && !f.audiences.includes(p.audience)) return false;
  if (skip !== "types" && f.types.length && !f.types.includes(p.type)) return false;
  if (skip !== "sizes" && f.sizes.length && !f.sizes.some((s) => hasSizeInStock(p, s))) return false;
  if (skip !== "colors" && f.colors.length && !p.colors.some((c) => f.colors.includes(c.id))) return false;
  if (skip !== "price") {
    if (f.priceMin !== undefined && p.priceCop < f.priceMin) return false;
    if (f.priceMax !== undefined && p.priceCop > f.priceMax) return false;
  }
  return true;
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  recientes: (a, b) => b.createdAt.localeCompare(a.createdAt) || a.name.localeCompare(b.name, "es"),
  "precio-asc": (a, b) => a.priceCop - b.priceCop,
  "precio-desc": (a, b) => b.priceCop - a.priceCop,
};

/**
 * Productos filtrados y ordenados, junto con cuántos productos tendría cada
 * opción si se agregara a los filtros actuales (conteos por faceta).
 */
export async function searchCatalog(
  f: ProductFilters,
  sort: SortKey,
): Promise<{ products: Product[]; facets: CatalogFacets }> {
  const terms = f.search ? normalize(f.search).split(/\s+/).filter(Boolean) : [];
  const base = published().filter((p) => (!f.tag || p.tags.includes(f.tag)) && searchMatches(p, terms));

  const count = (skip: FacetGroup, test: (p: Product) => boolean) =>
    base.filter((p) => matchesGroups(p, f, skip) && test(p)).length;

  const sizes = [...new Set(base.flatMap((p) => p.variants.filter((v) => v.stock > 0).map((v) => v.size)))].sort((a, b) => a - b);
  const colors = new Map(base.flatMap((p) => p.colors).map((c) => [c.id, c]));

  const facets: CatalogFacets = {
    audiences: Object.fromEntries(AUDIENCES.map((a) => [a, count("audiences", (p) => p.audience === a)])) as Record<Audience, number>,
    types: Object.fromEntries(SHOE_TYPES.map((t) => [t, count("types", (p) => p.type === t)])) as Record<ShoeType, number>,
    sizes: sizes.map((size) => ({ size, count: count("sizes", (p) => hasSizeInStock(p, size)) })),
    colors: [...colors.values()]
      .map((c) => ({ id: c.id, name: c.name, hex: c.hex, count: count("colors", (p) => p.colors.some((pc) => pc.id === c.id)) }))
      .sort((a, b) => a.name.localeCompare(b.name, "es")),
  };

  const products = base.filter((p) => matchesGroups(p, f)).sort(sorters[sort]);
  return { products, facets };
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
