import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductMarquee } from "@/components/product/product-marquee";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

/** La mitad de la cinta debe ser más ancha que la pantalla para que el loop no deje huecos. */
const MIN_ITEMS_PER_HALF = 6;
/** Tarjetas visibles al cargar (escritorio): se cargan de inmediato; el resto, en diferido. */
const EAGER_ITEMS = 4;

export async function NewArrivals() {
  const products = (await getProducts({ tag: "nuevo" })).slice(0, 10);
  if (products.length === 0) return null;

  // Cinta = dos mitades idénticas. Si hay pocos productos, se repiten dentro de cada mitad.
  const repeats = Math.ceil(MIN_ITEMS_PER_HALF / products.length);
  const half = Array.from({ length: repeats }, () => products).flat();
  const track = [...half, ...half];

  return (
    <section aria-labelledby="lo-nuevo" className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-14">
      <SectionHeading id="lo-nuevo" eyebrow="Recién llegados" title="Lo nuevo de la semana" highlight="Lo nuevo" />
      <div className="-mt-3 md:-mt-5">
        <ProductMarquee
          label="Productos recién llegados"
          uniqueCount={products.length}
          items={track.map((product, i) => (
            <ProductCard
              key={i}
              product={product}
              eager={i < EAGER_ITEMS}
              tabIndex={i >= products.length ? -1 : undefined}
            />
          ))}
          action={
            <Link
              href="/catalogo/recien-llegados"
              className="inline-flex items-center gap-1 text-label-lg font-semibold text-accent-text underline-offset-4 hover:underline"
            >
              Ver todos los recién llegados
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          }
        />
      </div>
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
