import Link from "next/link";
import { Suspense } from "react";
import { searchCatalog, type CatalogFacets } from "@/lib/catalog";
import {
  type CatalogBase,
  type CatalogFilter,
  type CatalogSelection,
  buildCatalogHref,
  catalogBase,
  clearedSelection,
  filterDescription,
  filterTitle,
  parseSelection,
  selectionTitle,
  selectionToFilters,
} from "@/lib/catalog-filters";
import { formatCop } from "@/lib/format";
import { audienceBySlug, typeBySlug } from "@/lib/taxonomy";
import { Icon } from "@/components/ui/icon";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import { FilterPanel } from "@/components/catalog/filter-panel";
import { MobileFilters } from "@/components/catalog/mobile-filters";
import { SortSelect } from "@/components/catalog/sort-select";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface CatalogViewProps {
  filter: CatalogFilter;
  searchParams: SearchParams;
}

export function CatalogView({ filter, searchParams }: CatalogViewProps) {
  const routeTitle = filterTitle(filter);

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
              <li aria-current="page" className="font-semibold text-ink">{routeTitle}</li>
            </>
          ) : (
            <li aria-current="page" className="font-semibold text-ink">Catálogo</li>
          )}
        </ol>
      </nav>

      <Suspense fallback={<CatalogSkeleton title={routeTitle} />}>
        <CatalogBody filter={filter} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CatalogBody({ filter, searchParams }: CatalogViewProps) {
  const selection = parseSelection(await searchParams, filter);
  const base = catalogBase(filter);
  const { products, facets } = await searchCatalog(selectionToFilters(selection, filter), selection.orden);
  const clearHref = buildCatalogHref(base, clearedSelection(selection));

  return (
    <>
      <header className="mt-4 max-w-2xl">
        <h1 className="font-display text-headline-lg-mobile font-bold tracking-tight text-ink md:text-headline-lg">
          {selectionTitle(selection, filter)} <span className="font-medium text-muted">({products.length})</span>
        </h1>
        <p className="mt-2 text-body-md text-muted">{filterDescription(filter)}</p>
      </header>

      <div className="mt-6">
        <MobileFilters base={base} selection={selection} facets={facets} total={products.length} />
      </div>

      <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        <aside aria-labelledby="filtros-titulo" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2">
            <h2 id="filtros-titulo" className="sr-only">Filtros</h2>
            <FilterPanel base={base} selection={selection} facets={facets} />
          </div>
        </aside>

        <section aria-label="Resultados">
          <p className="sr-only" aria-live="polite">
            {products.length} {products.length === 1 ? "resultado" : "resultados"}
          </p>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <ActiveFilters base={base} selection={selection} facets={facets} clearHref={clearHref} />
            <div className="ml-auto hidden lg:block">
              <SortSelect base={base} selection={selection} />
            </div>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} eagerCount={3} columns="3" />
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center">
              <Icon name="search_off" className="text-[40px] text-muted" />
              <h2 className="mt-3 font-display text-title-md font-semibold text-ink">No encontramos modelos con estos filtros</h2>
              <p className="mt-1 max-w-md text-body-md text-muted">
                Prueba quitando algún filtro o ampliando el rango de precio. También puedes escribirnos y te ayudamos a
                encontrar tu talla.
              </p>
              <Link
                href={clearHref}
                scroll={false}
                className="mt-5 inline-flex min-h-11 items-center rounded-btn bg-brand px-5 text-label-lg font-semibold text-white hover:bg-brand-hover"
              >
                Limpiar filtros
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function ActiveFilters({
  base,
  selection,
  facets,
  clearHref,
}: {
  base: CatalogBase;
  selection: CatalogSelection;
  facets: CatalogFacets;
  clearHref: string;
}) {
  const without = (patch: Partial<CatalogSelection>) => buildCatalogHref(base, { ...selection, ...patch });
  const colorName = (id: string) => facets.colors.find((c) => c.id === id)?.name ?? id;

  const chips = [
    ...(selection.q ? [{ label: `“${selection.q}”`, href: without({ q: undefined }) }] : []),
    ...selection.genero.map((slug) => ({ label: audienceBySlug(slug)!.label, href: without({ genero: selection.genero.filter((v) => v !== slug) }) })),
    ...selection.tipo.map((slug) => ({ label: typeBySlug(slug)!.label, href: without({ tipo: selection.tipo.filter((v) => v !== slug) }) })),
    ...selection.talla.map((size) => ({ label: `Talla ${size}`, href: without({ talla: selection.talla.filter((v) => v !== size) }) })),
    ...selection.color.map((id) => ({ label: colorName(id), href: without({ color: selection.color.filter((v) => v !== id) }) })),
    ...(selection.precioMin !== undefined || selection.precioMax !== undefined
      ? [
          {
            label:
              selection.precioMin !== undefined && selection.precioMax !== undefined
                ? `${formatCop(selection.precioMin)} – ${formatCop(selection.precioMax)}`
                : selection.precioMin !== undefined
                  ? `Desde ${formatCop(selection.precioMin)}`
                  : `Hasta ${formatCop(selection.precioMax!)}`,
            href: without({ precioMin: undefined, precioMax: undefined }),
          },
        ]
      : []),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="sr-only">Filtros activos</h2>
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip.href}>
            <Link
              href={chip.href}
              scroll={false}
              aria-label={`Quitar filtro: ${chip.label}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-white py-1 pl-3.5 pr-2 text-label-lg font-medium text-ink transition-colors hover:border-brand"
            >
              {chip.label}
              <Icon name="close" className="text-[16px] text-muted" />
            </Link>
          </li>
        ))}
      </ul>
      <Link href={clearHref} scroll={false} className="px-1 text-label-lg font-semibold text-brand underline-offset-4 hover:underline">
        Limpiar todo
      </Link>
    </div>
  );
}

function CatalogSkeleton({ title }: { title: string }) {
  return (
    <>
      <div className="mt-4">
        <p className="font-display text-headline-lg-mobile font-bold tracking-tight text-ink md:text-headline-lg">{title}</p>
      </div>
      <div className="mt-8 lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        <div className="hidden space-y-3 lg:block" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-2xl bg-sand" />
          ))}
        </div>
        <ProductGridSkeleton count={6} />
      </div>
    </>
  );
}
