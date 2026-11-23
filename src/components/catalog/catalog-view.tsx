import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/catalog";
import {
  type CatalogFilter,
  catalogPath,
  filterDescription,
  filterTitle,
  filterToQuery,
} from "@/lib/catalog-filters";
import { audiences, shoeTypes } from "@/lib/taxonomy";
import { Icon } from "@/components/ui/icon";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface CatalogViewProps {
  filter: CatalogFilter;
  searchParams: SearchParams;
}

export function CatalogView({ filter, searchParams }: CatalogViewProps) {
  const title = filterTitle(filter);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8 lg:px-14">
      <nav aria-label="Ruta de navegación" className="text-label-md text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">Inicio</Link>
          </li>
          <li aria-hidden="true"><Icon name="chevron_right" className="text-[16px]" /></li>
          {filter.audience || filter.type || filter.collection ? (
            <>
              <li>
                <Link href="/catalogo" className="hover:text-ink hover:underline">Catálogo</Link>
              </li>
              <li aria-hidden="true"><Icon name="chevron_right" className="text-[16px]" /></li>
              <li aria-current="page" className="font-semibold text-ink">{title}</li>
            </>
          ) : (
            <li aria-current="page" className="font-semibold text-ink">Catálogo</li>
          )}
        </ol>
      </nav>

      <header className="mt-4 max-w-2xl">
        <h1 className="font-display text-headline-lg-mobile font-bold tracking-tight text-ink md:text-headline-lg">{title}</h1>
        <p className="mt-2 text-body-md text-muted">{filterDescription(filter)}</p>
      </header>

      {!filter.collection && <FilterChips filter={filter} />}

      <Suspense fallback={<ProductGridSkeleton />}>
        <Results filter={filter} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function FilterChips({ filter }: { filter: CatalogFilter }) {
  const chip = (href: string, label: string, active: boolean) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`inline-flex min-h-10 items-center rounded-full border px-4 text-label-lg font-semibold transition-colors ${
          active
            ? "border-brand bg-brand text-white"
            : "border-line bg-white text-muted hover:border-brand hover:text-ink"
        }`}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <div className="mt-6 space-y-3 border-y border-line py-4">
      <nav aria-label="Filtrar por público">
        <ul className="flex flex-wrap gap-2">
          {chip(catalogPath({ type: filter.type }), "Todos", !filter.audience)}
          {audiences.map((a) => chip(catalogPath({ audience: a, type: filter.type }), a.label, filter.audience?.value === a.value))}
        </ul>
      </nav>
      <nav aria-label="Filtrar por tipo de calzado">
        <ul className="flex flex-wrap gap-2">
          {chip(catalogPath({ audience: filter.audience }), "Todos los tipos", !filter.type)}
          {shoeTypes.map((t) => chip(catalogPath({ audience: filter.audience, type: t }), t.label, filter.type?.value === t.value))}
        </ul>
      </nav>
    </div>
  );
}

async function Results({ filter, searchParams }: CatalogViewProps) {
  const { q } = await searchParams;
  const search = typeof q === "string" ? q.trim().slice(0, 80) : "";
  const products = await getProducts({ ...filterToQuery(filter), search: search || undefined });

  return (
    <section aria-label="Resultados" className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2" aria-live="polite">
        <p className="text-body-sm text-muted">
          {search && (
            <>
              Resultados para <strong className="text-ink">“{search}”</strong> ·{" "}
            </>
          )}
          {products.length} {products.length === 1 ? "modelo" : "modelos"}
        </p>
        {search && (
          <Link href={catalogPath(filter)} className="text-label-lg font-semibold text-brand hover:underline">
            Quitar búsqueda
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} eagerCount={4} />
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center">
          <Icon name="search_off" className="text-[40px] text-muted" />
          <h2 className="mt-3 font-display text-title-md font-semibold text-ink">No encontramos modelos</h2>
          <p className="mt-1 max-w-md text-body-md text-muted">
            {search
              ? "Prueba con otra palabra, revisa la ortografía o explora todo el catálogo."
              : "Por ahora no hay modelos en esta categoría. Explora otras opciones del catálogo."}
          </p>
          <Link
            href="/catalogo"
            className="mt-5 inline-flex min-h-11 items-center rounded-btn bg-brand px-5 text-label-lg font-semibold text-white hover:bg-brand-hover"
          >
            Ver todo el catálogo
          </Link>
        </div>
      )}
    </section>
  );
}
