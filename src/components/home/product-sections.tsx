import { getProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export async function NewArrivals() {
  const products = (await getProducts({ tag: "nuevo" })).slice(0, 8);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="novedades" className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-14">
      <SectionHeading
        id="novedades"
        eyebrow="Recién llegados"
        title="Novedades de la semana"
        highlight="Novedades"
        action={{ href: "/catalogo/novedades", label: "Ver todas" }}
      />
      <ProductGrid products={products} />
    </section>
  );
}

export async function Promotions() {
  const products = (await getProducts({ tag: "promocion" })).slice(0, 4);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="promociones" className="bg-dark py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-14">
        <SectionHeading
          id="promociones"
          tone="dark"
          eyebrow="Precios especiales"
          title="Promociones"
          description="Modelos seleccionados con descuento por tiempo limitado."
          action={{ href: "/catalogo/promociones", label: "Ver todas las promociones" }}
        />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
