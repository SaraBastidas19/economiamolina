import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";
import { promotion } from "@/config/promotion";
import { Icon } from "@/components/ui/icon";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

/** Ruido fractal para la textura de papel del cupón. */
const paperTexture = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/></filter><rect width="100%" height="100%" filter="url(#p)"/></svg>',
)}")`;

const perforation = "border-dashed border-accent/45";

/**
 * Banner de temporada: foto ancha de la tienda con eslogan y llamados a la acción,
 * y encima (si `promotion.showCoupon`) una franja tipo cupón recortable (ónix).
 */
export function PromoBanner() {
  return (
    <section aria-labelledby="promo-titulo" className="relative">
      {promotion.showCoupon && <CouponStrip />}

      {/* Fotografía con llamada a la acción */}
      <PhotoWithCta />
    </section>
  );
}

/** Franja tipo cupón con la vigencia, el titular de la promoción y el logo. */
function CouponStrip() {
  return (
    <>
      <StampFilter />
      <div className={`relative overflow-hidden border-b-2 bg-primary text-on-dark ${perforation}`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.13] mix-blend-overlay" style={{ backgroundImage: paperTexture }} />
        {/* Muescas de ticket en los extremos de la línea de corte */}
        <span aria-hidden="true" className="absolute -bottom-3 -left-3 size-6 rounded-full bg-background" />
        <span aria-hidden="true" className="absolute -bottom-3 -right-3 size-6 rounded-full bg-background" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[1fr_2.6fr_1fr]">
          <ul
            className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-3 text-center text-label-md font-semibold uppercase tracking-tight text-accent md:flex-col md:items-start md:justify-center md:gap-1.5 md:py-6 md:pl-8 md:text-left lg:pl-14 border-b-2 md:border-b-0 md:border-r-2 ${perforation}`}
          >
            <li className="flex items-center gap-1.5">
              <Icon name="schedule" className="text-[15px]" />
              <span className="sr-only">Vigencia: </span>
              {promotion.dateLabel}
            </li>
            {promotion.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>

          <p
            className={`px-4 py-4 text-center font-display font-black uppercase leading-[0.88] tracking-tight md:py-6 border-b-2 md:border-b-0 md:border-r-2 ${perforation}`}
            style={{ filter: "url(#sello)" }}
          >
            <span className="block text-[clamp(3rem,9vw,6.5rem)]">{promotion.headline.top}</span>
            <span className="block text-[clamp(1.35rem,3.6vw,2.6rem)] text-accent">{promotion.headline.bottom}</span>
          </p>

          <div className="flex items-center justify-center px-4 py-4 md:py-6 md:pr-8 lg:pr-14" style={{ filter: "url(#sello)" }}>
            {business.logo ? (
              <Image
                src={business.logo.src}
                alt={business.name}
                width={business.logo.width}
                height={business.logo.height}
                className="h-16 w-auto -rotate-6 opacity-90 brightness-0 invert md:h-20"
              />
            ) : (
              <span
                role="img"
                aria-label={business.name}
                className="flex -rotate-6 flex-col items-center rounded-full border-[3px] border-accent/80 px-6 py-3 text-accent"
              >
                <span className="font-display text-[2.6rem] font-black italic leading-none tracking-tight">Emmz</span>
                <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em]">Economía Molina Muñoz</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PhotoWithCta() {
  return (
      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-soft sm:aspect-[16/9] lg:aspect-[16/6]">
          {/* El punto de recorte depende de la foto (promotion.image.position) */}
          <Image
            src={promotion.image.src}
            alt={promotion.image.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: promotion.image.position }}
          />
          <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-tr from-ink/80 via-ink/20 to-transparent sm:block" />
        </div>

        {/* En celular va debajo de la foto para no tapar el calzado */}
        <div className="bg-dark sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:pt-0 md:px-8 md:pb-10 lg:px-14">
            <h1 id="promo-titulo" className="max-w-md text-balance font-display text-headline-lg-mobile font-bold text-on-dark md:text-display">
              {business.tagline}
            </h1>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href={promotion.cta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-btn bg-primary px-7 text-title-sm font-semibold text-on-dark shadow-sticky ring-1 ring-accent transition-colors hover:bg-primary-hover"
              >
                {promotion.cta.label}
                <Icon name="arrow_forward" className="text-[20px]" />
              </Link>
              <WhatsAppButton
                size="lg"
                variant="outline-dark"
                label="Escríbenos por WhatsApp"
                message="Hola, quiero saber más sobre la promoción de hasta 40%."
              />
            </div>
          </div>
        </div>
      </div>
  );
}

/** Filtro SVG que desgasta el texto como un sello entintado. */
function StampFilter() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <filter id="sello" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="ruido" />
        <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -20 15.5" result="mascara" />
        <feComposite in="SourceGraphic" in2="mascara" operator="in" />
      </filter>
    </svg>
  );
}
