import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { availableSizes, totalStock } from "@/lib/catalog";
import { discountPercent } from "@/lib/format";
import { audienceLabel, typeLabel } from "@/lib/taxonomy";
import { PriceTag } from "@/components/product/price-tag";

interface ProductCardProps {
  product: Product;
  /** Activa la carga prioritaria para tarjetas visibles al cargar la página. */
  eager?: boolean;
  /** -1 en las copias de la cinta infinita: siguen siendo clicables, pero el teclado no las recorre dos veces. */
  tabIndex?: number;
}

export function ProductCard({ product, eager = false, tabIndex }: ProductCardProps) {
  const image = product.images[0];
  const discount = discountPercent(product.priceCop, product.compareAtPriceCop);
  const sizes = availableSizes(product);
  const soldOut = totalStock(product) === 0;

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-soft">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, 50vw"
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {discount && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-label-xs font-bold uppercase text-on-dark">
              −{discount}%
            </span>
          )}
          {product.tags.includes("nuevo") && (
            <span className="rounded-full bg-highlight px-2.5 py-1 text-label-xs font-bold uppercase text-ink">
              Nuevo
            </span>
          )}
        </div>
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/85 py-1.5 text-center text-label-md font-semibold text-on-dark">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 md:p-4">
        <p className="text-label-xs font-bold uppercase tracking-wider text-accent-text">
          {typeLabel(product.type)} · {audienceLabel(product.audience)}
        </p>
        <h3 className="font-display text-title-sm font-semibold text-ink">
          <Link href={`/producto/${product.slug}`} tabIndex={tabIndex} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <PriceTag price={product.priceCop} compareAt={product.compareAtPriceCop} size="sm" className="mt-auto pt-1" />
        {sizes.length > 0 && (
          <p className="text-label-md text-muted">
            Tallas {sizes[0]}–{sizes[sizes.length - 1]}
          </p>
        )}
      </div>
    </article>
  );
}
