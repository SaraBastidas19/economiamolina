import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import storePhoto from "../../../public/brand/tienda-equipo.jpg";

export function OurStore() {
  const facts: { icon: IconName; label: string }[] = [
    { icon: "workspace_premium", label: `Más de ${business.yearsInBusiness} años` },
    { icon: "storefront", label: "Fábrica y tienda" },
    { icon: "support_agent", label: "Asesoría personalizada" },
  ];

  return (
    <section aria-labelledby="nuestra-tienda" className="bg-sand py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:px-8 lg:grid-cols-12 lg:gap-12 lg:px-14">
        <figure className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-cream shadow-lift">
            <Image
              src={storePhoto}
              alt="Fachada del Almacén La Economía con cinco asesoras de la tienda, en uniforme, sonriendo en la entrada"
              fill
              placeholder="blur"
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-label-md text-muted">Nuestro equipo te recibe en el almacén, en {business.city}.</figcaption>
        </figure>

        <div className="lg:col-span-5">
          <SectionHeading
            id="nuestra-tienda"
            eyebrow="Nuestra tienda"
            title={`Más de ${business.yearsInBusiness} años calzando a las familias de ${business.city}`}
            highlight="familias"
          />
          <p className="-mt-2 text-body-lg text-muted">
            Somos {business.name}, fábrica y tienda de calzado familiar. En el almacén te atiende un equipo de asesoras
            que conoce cada horma y te ayuda a encontrar la talla justa, con {business.promise.toLowerCase()}.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {facts.map((f) => (
              <li key={f.label} className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-label-lg text-ink shadow-card">
                <Icon name={f.icon} className="text-[18px] text-accent" />
                {f.label}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-btn bg-brand px-6 text-title-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Ver catálogo
              <Icon name="arrow_forward" className="text-[20px]" />
            </Link>
            <WhatsAppButton size="lg" variant="soft" label="Escríbenos" message="Hola, quisiera hacer una consulta sobre su calzado." />
          </div>
        </div>
      </div>
    </section>
  );
}
