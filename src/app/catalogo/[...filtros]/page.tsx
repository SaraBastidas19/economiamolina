import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  allCatalogSegments,
  catalogPath,
  filterDescription,
  filterTitle,
  parseCatalogSegments,
} from "@/lib/catalog-filters";

export function generateStaticParams() {
  return allCatalogSegments().map((filtros) => ({ filtros }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo/[...filtros]">): Promise<Metadata> {
  const filter = parseCatalogSegments((await params).filtros);
  if (!filter) return {};

  return {
    title: filterTitle(filter),
    description: filterDescription(filter),
    alternates: {
      canonical: filter.collection ? `/catalogo/${filter.collection.slug}` : catalogPath(filter),
    },
  };
}

export default async function FilteredCatalogPage({ params, searchParams }: PageProps<"/catalogo/[...filtros]">) {
  const filter = parseCatalogSegments((await params).filtros);
  if (!filter) notFound();

  return <CatalogView filter={filter} searchParams={searchParams} />;
}
