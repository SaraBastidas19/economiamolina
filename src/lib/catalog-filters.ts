import {
  audienceBySlug,
  audiences,
  collectionBySlug,
  collections,
  shoeTypes,
  typeBySlug,
} from "@/lib/taxonomy";
import type { ProductFilters, SortKey } from "@/lib/catalog";

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

/*
 * Filtros de la barra lateral, guardados en la URL:
 *   ?genero=mujer,ninas&tipo=tenis,botas&talla=37&color=negro&precio_min=50000&precio_max=150000&orden=precio-asc
 * Si la URL no trae `genero` o `tipo`, se toman de la ruta (/catalogo/mujer/botines),
 * así los enlaces existentes abren el catálogo con esos filtros marcados.
 */

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
];

export interface CatalogSelection {
  genero: string[];
  tipo: string[];
  talla: number[];
  color: string[];
  precioMin?: number;
  precioMax?: number;
  orden: SortKey;
  q?: string;
}

type RawParams = Record<string, string | string[] | undefined>;

const MAX_PRICE = 10_000_000;

function listParam(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : (value ?? "");
  return [...new Set(raw.split(",").map((v) => v.trim()).filter(Boolean))].slice(0, 30);
}

function priceParam(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string" || !/^\d{1,8}$/.test(value)) return undefined;
  const n = Number(value);
  return n <= MAX_PRICE ? n : undefined;
}

export function parseSelection(params: RawParams, base: CatalogFilter): CatalogSelection {
  const genero = "genero" in params ? listParam(params.genero) : base.audience ? [base.audience.slug] : [];
  const tipo = "tipo" in params ? listParam(params.tipo) : base.type ? [base.type.slug] : [];
  const orden = SORT_OPTIONS.find((o) => o.value === params.orden)?.value ?? "recientes";
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";

  return {
    genero: genero.filter((slug) => audienceBySlug(slug)),
    tipo: tipo.filter((slug) => typeBySlug(slug)),
    talla: listParam(params.talla).filter((v) => /^\d{1,2}$/.test(v)).map(Number).sort((a, b) => a - b),
    color: listParam(params.color).filter((v) => /^[a-z-]{1,30}$/.test(v)),
    precioMin: priceParam(params.precio_min),
    precioMax: priceParam(params.precio_max),
    orden,
    q: q || undefined,
  };
}

export function selectionToFilters(sel: CatalogSelection, base: CatalogFilter): ProductFilters {
  return {
    audiences: sel.genero.map((slug) => audienceBySlug(slug)!.value),
    types: sel.tipo.map((slug) => typeBySlug(slug)!.value),
    sizes: sel.talla,
    colors: sel.color,
    priceMin: sel.precioMin,
    priceMax: sel.precioMax,
    tag: base.collection?.value,
    search: sel.q,
  };
}

/**
 * Ruta actual y los filtros que ya implica. Los filtros se aplican sobre la misma
 * ruta (así la página no se vuelve a montar) y en la URL solo va lo que difiere de ella.
 */
export interface CatalogBase {
  path: string;
  genero: string[];
  tipo: string[];
}

export function catalogBase(base: CatalogFilter): CatalogBase {
  return {
    path: base.collection ? `/catalogo/${base.collection.slug}` : catalogPath(base),
    genero: base.audience ? [base.audience.slug] : [],
    tipo: base.type ? [base.type.slug] : [],
  };
}

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((v) => b.includes(v));

export function buildCatalogHref(base: CatalogBase, sel: CatalogSelection): string {
  const parts: string[] = [];
  const add = (key: string, values: (string | number)[]) => {
    if (values.length) parts.push(`${key}=${values.map((v) => encodeURIComponent(String(v))).join(",")}`);
  };
  // Género y tipo se escriben (aunque queden vacíos) cuando difieren de lo que implica la ruta.
  const addGroup = (key: string, values: string[], implied: string[]) => {
    if (sameList(values, implied)) return;
    if (values.length) add(key, values);
    else parts.push(`${key}=`);
  };
  if (sel.q) add("q", [sel.q]);
  addGroup("genero", sel.genero, base.genero);
  addGroup("tipo", sel.tipo, base.tipo);
  add("talla", sel.talla);
  add("color", sel.color);
  if (sel.precioMin !== undefined) add("precio_min", [sel.precioMin]);
  if (sel.precioMax !== undefined) add("precio_max", [sel.precioMax]);
  if (sel.orden !== "recientes") add("orden", [sel.orden]);
  return parts.length ? `${base.path}?${parts.join("&")}` : base.path;
}

/** Selección sin filtros ni búsqueda (conserva el orden). */
export function clearedSelection(sel: CatalogSelection): CatalogSelection {
  return { genero: [], tipo: [], talla: [], color: [], orden: sel.orden };
}

export function activeFilterCount(sel: CatalogSelection): number {
  const price = sel.precioMin !== undefined || sel.precioMax !== undefined ? 1 : 0;
  return sel.genero.length + sel.tipo.length + sel.talla.length + sel.color.length + price;
}

/** Título según la selección: "Calzado para mujer", "Botines para niñas"… */
export function selectionTitle(sel: CatalogSelection, base: CatalogFilter): string {
  if (base.collection) return base.collection.title;
  return filterTitle({
    audience: sel.genero.length === 1 ? audienceBySlug(sel.genero[0]) : undefined,
    type: sel.tipo.length === 1 ? typeBySlug(sel.tipo[0]) : undefined,
  });
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
