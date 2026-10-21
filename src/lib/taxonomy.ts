import type { Audience, ShoeType } from "@/types/product";

interface TaxonomyEntry<T extends string> {
  value: T;
  slug: string;
  label: string;
  /** Texto para títulos: "Calzado para mujer", "Botines". */
  title: string;
  description: string;
}

export const audiences: TaxonomyEntry<Audience>[] = [
  {
    value: "mujer",
    slug: "mujer",
    label: "Mujer",
    title: "Calzado para mujer",
    description: "Tenis, botines, botas y zapatos casuales y formales para mujer.",
  },
  {
    value: "hombre",
    slug: "hombre",
    label: "Hombre",
    title: "Calzado para hombre",
    description: "Zapatos formales, casuales, botas y tenis para hombre.",
  },
  {
    value: "nino",
    slug: "ninos",
    label: "Niños",
    title: "Calzado para niños",
    description: "Zapatos escolares, tenis y botas resistentes para niños.",
  },
  {
    value: "nina",
    slug: "ninas",
    label: "Niñas",
    title: "Calzado para niñas",
    description: "Zapatos escolares, tenis y botines cómodos para niñas.",
  },
];

export const shoeTypes: TaxonomyEntry<ShoeType>[] = [
  { value: "tenis", slug: "tenis", label: "Tenis", title: "Tenis", description: "Tenis urbanos y de uso diario." },
  { value: "botines", slug: "botines", label: "Botines", title: "Botines", description: "Botines de caña corta para toda ocasión." },
  { value: "botas", slug: "botas", label: "Botas", title: "Botas", description: "Botas para el clima de Pasto y uso exigente." },
  { value: "casual", slug: "casual", label: "Casual", title: "Zapatos casuales", description: "Zapatos casuales cómodos para el día a día." },
  { value: "formal", slug: "formal", label: "Formal", title: "Zapatos formales", description: "Zapatos formales para oficina y eventos." },
  { value: "escolar", slug: "escolar", label: "Escolar", title: "Zapatos escolares", description: "Zapatos colegiales y tenis para educación física." },
  { value: "deportivo", slug: "deportivo", label: "Deportivo", title: "Calzado deportivo", description: "Calzado para correr, entrenar y hacer deporte." },
];

export const collections = [
  { value: "nuevo", slug: "novedades", label: "Novedades", title: "Novedades", description: "Los modelos más recientes del catálogo." },
  { value: "promocion", slug: "promociones", label: "Promociones", title: "Promociones", description: "Modelos con precio especial por tiempo limitado." },
] as const;

export type Collection = (typeof collections)[number];

export const audienceBySlug = (slug: string) => audiences.find((a) => a.slug === slug);
export const typeBySlug = (slug: string) => shoeTypes.find((t) => t.slug === slug);
export const collectionBySlug = (slug: string) => collections.find((c) => c.slug === slug);

export const audienceLabel = (value: Audience) => audiences.find((a) => a.value === value)!.label;
export const audienceSlug = (value: Audience) => audiences.find((a) => a.value === value)!.slug;
export const typeLabel = (value: ShoeType) => shoeTypes.find((t) => t.value === value)!.label;
export const typeSlug = (value: ShoeType) => shoeTypes.find((t) => t.value === value)!.slug;
