import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts, totalStock } from "@/lib/catalog";
import { catalogPath } from "@/lib/catalog-filters";
import { discountPercent } from "@/lib/format";
import { audiences, shoeTypes } from "@/lib/taxonomy";
import { Icon } from "@/components/ui/icon";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { PriceTag } from "@/components/product/price-tag";
import { ProductGrid } from "@/components/product/product-grid";
import { VariantPicker } from "@/components/product/variant-picker";

export async function generateStaticParams() {
  return (await getAllProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: { images: [{ url: product.images[0].src, alt: product.images[0].alt }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const audience = audiences.find((a) => a.value === product.audience)!;
  const type = shoeTypes.find((t) => t.value === product.type)!;
  const stock = totalStock(product);
  const discount = discountPercent(product.priceCop, product.compareAtPriceCop);
  const related = await getRelatedProducts(product);
  const [mainImage, ...extraImages] = product.images;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8 lg:px-14">
      <nav aria-label="Ruta de navegación" className="text-label-md text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-ink hover:underline">Inicio</Link></li>
          <li aria-hidden="true"><Icon name="chevron_right" className="text-[16px]" /></li>
          <li><Link href={catalogPath({ audience })} className="hover:text-ink hover:underline">{audience.label}</Link></li>
          <li aria-hidden="true"><Icon name="chevron_right" className="text-[16px]" /></li>
          <li><Link href={catalogPath({ audience, type })} className="hover:text-ink hover:underline">{type.label}</Link></li>
          <li aria-hidden="true"><Icon name="chevron_right" className="text-[16px]" /></li>
          <li aria-current="page" className="font-semibold text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-sand shadow-card">
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              preload
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            {discount && (
              <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-label-md font-bold uppercase text-white">
                −{discount}%
              </span>
            )}
          </div>
          {extraImages.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-4">
              {extraImages.map((img) => (
                <li key={img.src} className="relative aspect-square overflow-hidden rounded-3xl bg-sand">
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 340px, 50vw" className="object-cover" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-5">
          <p className="text-label-xs font-bold uppercase tracking-wider text-gold-text">
            {type.label} · {audience.label}
          </p>
          <h1 className="mt-1 font-display text-headline-lg-mobile font-bold tracking-tight text-ink md:text-headline-lg">
            {product.name}
          </h1>
          <p className="mt-1 text-label-md text-muted">
            Ref. {product.reference}
            {product.isDemo && <span className="ml-2 rounded bg-sand px-1.5 py-0.5 font-semibold text-gold-text">Demostración</span>}
          </p>

          <PriceTag price={product.priceCop} compareAt={product.compareAtPriceCop} size="lg" className="mt-4" />

          <p className={`mt-2 flex items-center gap-1.5 text-label-lg font-semibold ${stock > 0 ? "text-whatsapp-text" : "text-brand"}`}>
            <Icon name={stock > 0 ? "check" : "close"} className="text-[18px]" />
            {stock > 0 ? "Disponible" : "Agotado"}
          </p>

          <p className="mt-5 text-body-md text-muted">{product.description}</p>

          <div className="mt-6 border-t border-line pt-6">
            <VariantPicker product={product} />
          </div>

          <div className="mt-4">
            <WhatsAppButton
              variant="soft"
              size="lg"
              label="Consultar antes de comprar"
              className="w-full"
              message={`Hola, me interesa el producto "${product.name}" (Ref. ${product.reference}). ¿Me confirman disponibilidad en mi talla?`}
            />
          </div>

          {product.materials && (
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-3xl bg-sand p-5 text-body-sm">
              {product.materials.upper && (<><dt className="font-semibold text-ink">Capellada</dt><dd>{product.materials.upper}</dd></>)}
              {product.materials.lining && (<><dt className="font-semibold text-ink">Forro</dt><dd>{product.materials.lining}</dd></>)}
              {product.materials.sole && (<><dt className="font-semibold text-ink">Suela</dt><dd>{product.materials.sole}</dd></>)}
            </dl>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-16">
          <h2 id="relacionados" className="mb-6 font-display text-headline-md font-bold text-ink">
            También te puede interesar
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
