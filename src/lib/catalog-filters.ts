import {
  audienceBySlug,
  audiences,
  collectionBySlug,
  collections,
  shoeTypes,
  typeBySlug,
} from "@/lib/taxonomy";
import type { CatalogQuery } from "@/lib/catalog";

/**
 * Filtros expresados en la ruta del catálogo:
 *   /catalogo/mujer, /catalogo/botas, /catalogo/mujer/botines, /catalogo/novedades
 */
export interface CatalogFilter {
  audience?: (typeof audiences)[number];
  type?: (typeof shoeTypes)[number];
  collection?: (typeof collections)[number];
}

export function parseCatalogSegments(segments: string[]): CatalogFilter | null {
  if (segments.length === 0) return {};
  if (segments.length > 2) return null;

  const [first, second] = segments;
  const audience = audienceBySlug(first);

  if (segments.length === 2) {
    const type = typeBySlug(second);
    return audience && type ? { audience, type } : null;
  }
  if (audience) return { audience };
  const type = typeBySlug(first);
  if (type) return { type };
  const collection = collectionBySlug(first);
  if (collection) return { collection };
  return null;
}

export function catalogPath(filter: { audience?: { slug: string }; type?: { slug: string } }): string {
  return ["/catalogo", filter.audience?.slug, filter.type?.slug].filter(Boolean).join("/");
}

export function filterToQuery(filter: CatalogFilter): CatalogQuery {
  return {
    audience: filter.audience?.value,
    type: filter.type?.value,
    tag: filter.collection?.value,
  };
}

export function filterTitle(filter: CatalogFilter): string {
  if (filter.collection) return filter.collection.title;
  if (filter.audience && filter.type) return `${filter.type.title} para ${filter.audience.label.toLowerCase()}`;
  if (filter.audience) return filter.audience.title;
  if (filter.type) return filter.type.title;
  return "Catálogo de calzado";
}

export function filterDescription(filter: CatalogFilter): string {
  if (filter.collection) return filter.collection.description;
  if (filter.audience && filter.type) {
    return `${filter.type.title} para ${filter.audience.label.toLowerCase()} en Pasto, Nariño. Consulta tallas y colores disponibles.`;
  }
  return (filter.audience ?? filter.type)?.description ?? "Calzado para mujer, hombre, niños y niñas en Pasto, Nariño.";
}

/** Todas las combinaciones válidas, para prerenderizarlas. */
export function allCatalogSegments(): string[][] {
  return [
    ...audiences.map((a) => [a.slug]),
    ...shoeTypes.map((t) => [t.slug]),
    ...collections.map((c) => [c.slug]),
    ...audiences.flatMap((a) => shoeTypes.map((t) => [a.slug, t.slug])),
  ];
}
