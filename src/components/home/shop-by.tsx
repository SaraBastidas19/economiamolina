import Image from "next/image";
import Link from "next/link";
import { audiences, shoeTypes } from "@/lib/taxonomy";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Audience, ShoeType } from "@/types/product";

const audienceImages: Record<Audience, { src: string; alt: string }> = {
  mujer: { src: "/demo/botin-tacon-negro.jpg", alt: "Botines negros de tacón para mujer" },
  hombre: { src: "/demo/oxford-tienda.jpg", alt: "Zapatos Oxford de cuero para hombre" },
  nino: { src: "/demo/botas-montana-nino.jpg", alt: "Botas de montaña infantiles" },
  nina: { src: "/demo/rosado-nina.jpg", alt: "Zapatos fucsia para niña" },
};

const typeImages: Record<ShoeType, string> = {
  tenis: "/demo/tenis-oliva.jpg",
  botines: "/demo/botin-brogue-negro.jpg",
  botas: "/demo/bota-alta-cafe.jpg",
  casual: "/demo/nautico-cafe.jpg",
  formal: "/demo/oxford-cafe.jpg",
  escolar: "/demo/merceditas-negras.jpg",
  deportivo: "/demo/deportivo-magenta.jpg",
};

export function ShopByAudience() {
  return (
    <section aria-labelledby="por-publico" className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-14">
      <SectionHeading id="por-publico" eyebrow="Variedad para todos" title="Compra por categoría" highlight="categoría" />
      <ul className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
        {audiences.map((a) => (
          <li key={a.value}>
            <Link
              href={`/catalogo/${a.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-sand shadow-card"
            >
              <Image
                src={audienceImages[a.value].src}
                alt={audienceImages[a.value].alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white md:p-5">
                <span>
                  <span className="block font-display text-headline-sm font-bold md:text-headline-md">{a.label}</span>
                  <span className="text-label-md text-white/80">Ver modelos</span>
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-white group-hover:text-ink">
                  <Icon name="arrow_forward" className="text-[20px]" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ShopByType() {
  return (
    <section aria-labelledby="por-tipo" className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-14">
      <SectionHeading id="por-tipo" eyebrow="Encuentra tu estilo" title="Tipos de calzado" highlight="calzado" />
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-7">
        {shoeTypes.map((t) => (
          <li key={t.value} className="w-32 shrink-0 snap-start md:w-auto">
            <Link
              href={`/catalogo/${t.slug}`}
              className="group flex flex-col items-center gap-2 rounded-3xl border border-line bg-white p-2.5 text-center shadow-card transition-shadow hover:shadow-lift"
            >
              <span className="relative aspect-square w-full overflow-hidden rounded-2xl bg-sand">
                <Image
                  src={typeImages[t.value]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 160px, 128px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="pb-1 text-label-lg font-semibold text-ink">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
