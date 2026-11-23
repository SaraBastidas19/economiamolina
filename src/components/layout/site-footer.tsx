import Link from "next/link";
import { business } from "@/config/business";
import { audiences, shoeTypes } from "@/lib/taxonomy";
import { Icon } from "@/components/ui/icon";

export function SiteFooter() {
  const contact = [
    business.address && { icon: "location_on" as const, text: business.address },
    business.openingHours && { icon: "schedule" as const, text: business.openingHours },
  ].filter((item) => !!item);

  return (
    <footer className="mt-auto bg-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-14">
        <div>
          <p className="font-display text-headline-sm font-bold text-white">{business.name}</p>
          <p className="mt-2 text-body-sm">
            {business.tagline} en {business.city}, {business.region}.
          </p>
          {contact.length > 0 && (
            <ul className="mt-5 space-y-2 text-body-sm">
              {contact.map((item) => (
                <li key={item.text} className="flex gap-2">
                  <Icon name={item.icon} className="text-[18px] text-gold-soft" />
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        <FooterColumn
          title="Comprar por público"
          links={audiences.map((a) => ({ href: `/catalogo/${a.slug}`, label: a.label }))}
        />
        <FooterColumn
          title="Tipos de calzado"
          links={shoeTypes.map((t) => ({ href: `/catalogo/${t.slug}`, label: t.title }))}
        />
        <FooterColumn
          title="Tienda"
          links={[
            { href: "/catalogo", label: "Todo el catálogo" },
            { href: "/catalogo/novedades", label: "Novedades" },
            { href: "/catalogo/promociones", label: "Promociones" },
            { href: "/#guia-de-tallas", label: "Guía de tallas" },
            { href: "/#preguntas-frecuentes", label: "Preguntas frecuentes" },
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-label-md md:flex-row md:items-center md:justify-between md:px-8 lg:px-14">
          <p>
            © {business.name} · {business.city}, {business.region}, {business.country}
          </p>
          <p className="text-white/60">Productos, precios e imágenes de demostración. Fotografías: StockSnap (CC0).</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="text-label-xs font-bold uppercase tracking-wider text-gold-soft">{title}</p>
      <ul className="mt-4 space-y-2.5 text-body-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-white hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
