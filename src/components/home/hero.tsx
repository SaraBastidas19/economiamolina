import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";
import { Icon, type IconName } from "@/components/ui/icon";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import heroImage from "../../../public/demo/hero-tienda.jpg";

const highlights: { icon: IconName; label: string }[] = [
  { icon: "workspace_premium", label: `Más de ${business.yearsInBusiness} años` },
  { icon: "storefront", label: "Fábrica y tienda" },
  { icon: "straighten", label: "Asesoría con tu talla" },
  { icon: "location_on", label: `${business.city}, ${business.region}` },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-7xl px-4 pb-14 pt-8 md:px-8 md:pt-12 lg:px-14">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="animate-fade-up space-y-5 lg:col-span-6">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 text-label-xs font-bold uppercase tracking-wider text-gold-text">
            <Icon name="workspace_premium" filled className="text-[16px] text-gold" />
            {business.promise}
          </p>
          <h1
            id="hero-title"
            className="text-balance font-display text-display-mobile font-bold tracking-tight text-ink md:text-display"
          >
            Calzado para toda la <span className="text-brand">familia</span>
          </h1>
          <p className="max-w-xl text-body-lg text-muted">
            Somos fábrica y tienda de calzado familiar en {business.city}, {business.region}, con más de{" "}
            {business.yearsInBusiness} años. Tenis, botines, botas y zapatos casuales, formales y escolares para mujer,
            hombre, niños y niñas.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/catalogo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-btn bg-brand px-6 text-title-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-hover"
            >
              Ver catálogo
              <Icon name="arrow_forward" className="text-[20px]" />
            </Link>
            <WhatsAppButton
              size="lg"
              variant="soft"
              label="Pregunta por tu talla"
              message="Hola, quisiera consultar la disponibilidad de una talla."
            />
          </div>
          <ul className="flex flex-wrap gap-2 pt-3">
            {highlights.map((h) => (
              <li
                key={h.label}
                className="flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-label-lg text-ink shadow-card"
              >
                <Icon name={h.icon} className="text-[18px] text-gold" />
                {h.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand shadow-lift">
            <Image
              src={heroImage}
              alt="Zapatos Oxford de cuero exhibidos sobre una mesa de madera en una tienda"
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-3xl bg-white/95 p-3 shadow-card backdrop-blur md:inset-x-6 md:bottom-6 md:p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Icon name="storefront" className="text-[20px]" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-title-sm font-bold text-ink">{business.name}</p>
              <p className="truncate text-body-sm text-muted">
                {business.address ?? `Tienda de calzado en ${business.city}, ${business.region}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
