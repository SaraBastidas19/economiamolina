/**
 * Modelo de catálogo. Hoy se alimenta con datos de demostración
 * (src/data/demo-products.ts); en la fase de backend estas mismas
 * formas se leerán desde la base de datos.
 */

export const AUDIENCES = ["mujer", "hombre", "nino", "nina"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const SHOE_TYPES = [
  "tenis",
  "botines",
  "botas",
  "casual",
  "formal",
  "escolar",
  "deportivo",
] as const;
export type ShoeType = (typeof SHOE_TYPES)[number];

export type ProductTag = "nuevo" | "promocion";

export type PublicationStatus = "publicado" | "borrador" | "archivado";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

/** Combinación color + talla, que es la unidad real de inventario. */
export interface ProductVariant {
  sku: string;
  colorId: string;
  /** Talla colombiana (numeración nacional). */
  size: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  /** Referencia interna del almacén. */
  reference: string;
  name: string;
  description: string;
  audience: Audience;
  type: ShoeType;
  /** Precio de venta en pesos colombianos, entero y sin decimales. */
  priceCop: number;
  /** Precio anterior en COP cuando el producto está en promoción. */
  compareAtPriceCop?: number;
  images: ProductImage[];
  colors: ProductColor[];
  variants: ProductVariant[];
  tags: ProductTag[];
  status: PublicationStatus;
  brand?: string;
  materials?: {
    upper?: string;
    lining?: string;
    sole?: string;
  };
  /** Marca los productos que no son inventario real. */
  isDemo: boolean;
  createdAt: string;
}
