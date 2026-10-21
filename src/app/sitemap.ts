import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/business";
import { getAllProductSlugs } from "@/lib/catalog";
import { allCatalogSegments } from "@/lib/catalog-filters";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllProductSlugs();

  return [
    { url: siteUrl, priority: 1 },
    { url: `${siteUrl}/catalogo`, priority: 0.9 },
    ...allCatalogSegments().map((segments) => ({ url: `${siteUrl}/catalogo/${segments.join("/")}`, priority: 0.7 })),
    ...slugs.map((slug) => ({ url: `${siteUrl}/producto/${slug}`, priority: 0.6 })),
  ];
}
