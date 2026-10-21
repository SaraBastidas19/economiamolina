import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";

export const metadata: Metadata = {
  title: "Catálogo de calzado",
  description: "Tenis, botines, botas y zapatos casuales, formales, escolares y deportivos para toda la familia en Pasto, Nariño.",
  alternates: { canonical: "/catalogo" },
};

export default function CatalogPage({ searchParams }: PageProps<"/catalogo">) {
  return <CatalogView filter={{}} searchParams={searchParams} />;
}
