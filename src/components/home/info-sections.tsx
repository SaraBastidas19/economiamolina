import { business } from "@/config/business";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export function WhyUs() {
  const reasons: { icon: IconName; title: string; text: string }[] = [
    {
      icon: "straighten",
      title: "Te asesoramos con la talla",
      text: "Te orientamos con la medida de tu pie en centímetros para que el calzado te quede bien a la primera.",
    },
    {
      icon: "storefront",
      title: "Para toda la familia",
      text: "Mujer, hombre, niños y niñas: tenis, botines, botas y zapatos casuales, formales y escolares.",
    },
    {
      icon: "support_agent",
      title: "Atención cercana",
      text: "Resolvemos tus dudas sobre modelos, colores y disponibilidad de forma directa y personal.",
    },
    business.policies.exchanges
      ? { icon: "sync_alt", title: "Cambios", text: business.policies.exchanges }
      : { icon: "location_on", title: `Tienda en ${business.city}`, text: `Somos un negocio local de ${business.city}, ${business.region}.` },
  ];

  return (
    <section aria-labelledby="por-que" className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:px-14">
      <SectionHeading
        id="por-que"
        eyebrow="Nuestra promesa"
        title="¿Por qué comprarnos?"
        description="La confianza de comprarle a un negocio local que te acompaña en cada par."
        align="center"
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {reasons.map((r) => (
          <li key={r.title} className="rounded-xl border border-border-soft bg-white p-6 shadow-card">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-warm text-secondary">
              <Icon name={r.icon} className="text-[24px]" />
            </span>
            <h3 className="mt-4 font-display text-title-md font-semibold text-primary">{r.title}</h3>
            <p className="mt-1.5 text-body-sm text-on-surface-variant">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HowToBuy() {
  const steps = [
    { title: "Elige tu modelo", text: "Explora el catálogo por categoría o tipo y revisa los colores y tallas disponibles." },
    { title: "Escríbenos con tu talla", text: "Envíanos la referencia del producto y tu talla por WhatsApp para confirmar disponibilidad." },
    {
      title: "Coordina el pago y la entrega",
      text: business.policies.delivery ?? "Acordamos contigo la forma de pago y cómo recibir tu calzado.",
    },
  ];

  return (
    <section aria-labelledby="como-comprar" className="bg-surface-warm py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-14">
        <SectionHeading id="como-comprar" eyebrow="Proceso simple" title="Cómo comprar" align="center" />
        <ol className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-xl bg-white p-6 shadow-card">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-container font-display text-title-md font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-title-md font-semibold text-primary">{s.title}</h3>
              <p className="mt-1.5 text-body-sm text-on-surface-variant">{s.text}</p>
            </li>
          ))}
        </ol>
        {business.policies.paymentMethods && (
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-body-md text-on-surface-variant">
            <Icon name="payments" className="text-[20px] text-secondary" />
            Medios de pago: {business.policies.paymentMethods}
          </p>
        )}
      </div>
    </section>
  );
}

const sizeRows = [
  { line: "Mujer", sizes: "35 – 39", foot: "22,5 – 25,5 cm", us: "US 5,5 – 8,5", tip: "Horma estándar nacional." },
  { line: "Hombre", sizes: "38 – 43", foot: "24,5 – 28,5 cm", us: "US 7 – 10,5", tip: "Si estás entre dos tallas, elige la mayor." },
  { line: "Niños y niñas", sizes: "20 – 36", foot: "12,5 – 23 cm", us: "Infantil 4 – Juvenil 4", tip: "Deja cerca de 1 cm de holgura para el crecimiento." },
];

export function SizeGuide() {
  return (
    <section
      aria-labelledby="guia-de-tallas-titulo"
      id="guia-de-tallas"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 md:px-8 lg:px-14"
    >
      <SectionHeading
        id="guia-de-tallas-titulo"
        eyebrow="Ajuste perfecto"
        title="Guía de tallas"
        description="Medidas de referencia en centímetros según la numeración colombiana. Cada horma puede variar."
      />
      <div className="overflow-x-auto rounded-xl border border-border-soft bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-body-sm">
          <caption className="sr-only">Equivalencias de tallas por línea de calzado</caption>
          <thead className="bg-surface-warm text-label-md uppercase tracking-wide text-primary">
            <tr>
              <th scope="col" className="px-5 py-3">Línea</th>
              <th scope="col" className="px-5 py-3">Talla Colombia</th>
              <th scope="col" className="px-5 py-3">Largo del pie</th>
              <th scope="col" className="px-5 py-3">Equivalente US</th>
              <th scope="col" className="px-5 py-3">Recomendación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {sizeRows.map((r) => (
              <tr key={r.line}>
                <th scope="row" className="px-5 py-3.5 font-semibold text-primary">{r.line}</th>
                <td className="px-5 py-3.5">{r.sizes}</td>
                <td className="px-5 py-3.5">{r.foot}</td>
                <td className="px-5 py-3.5">{r.us}</td>
                <td className="px-5 py-3.5 text-on-surface-variant">{r.tip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-col gap-4 rounded-xl bg-surface-warm p-5 md:flex-row md:items-center md:justify-between">
        <p className="flex gap-2 text-body-md text-on-surface-variant">
          <Icon name="straighten" className="text-[22px] text-secondary" />
          Para medir tu pie, apóyalo descalzo sobre una hoja y mide desde el talón hasta la punta del dedo más largo.
        </p>
        <WhatsAppButton
          label="Pedir asesoría de talla"
          variant="soft"
          message="Hola, necesito ayuda para elegir mi talla."
          className="shrink-0"
        />
      </div>
    </section>
  );
}

export function Faq() {
  const items = [
    {
      q: "¿Cómo sé cuál es mi talla?",
      a: "Mide el largo de tu pie en centímetros y compáralo con nuestra guía de tallas. Si tienes dudas, escríbenos con la medida y el modelo que te interesa y te orientamos.",
    },
    {
      q: "¿Tienen calzado escolar?",
      a: "Sí, en el catálogo encuentras la categoría escolar con zapatos colegiales y tenis para educación física para niños y niñas.",
    },
    {
      q: "¿Cómo hago un pedido?",
      a: "Elige el modelo, revisa los colores y tallas disponibles y escríbenos por WhatsApp con la referencia del producto. Confirmamos la disponibilidad antes de cualquier pago.",
    },
    business.policies.delivery && { q: "¿Hacen entregas a domicilio?", a: business.policies.delivery },
    business.policies.paymentMethods && { q: "¿Qué medios de pago aceptan?", a: business.policies.paymentMethods },
    business.policies.exchanges && { q: "¿Puedo cambiar mi calzado?", a: business.policies.exchanges },
  ].filter((item) => !!item);

  return (
    <section
      aria-labelledby="preguntas-frecuentes-titulo"
      id="preguntas-frecuentes"
      className="mx-auto max-w-3xl scroll-mt-24 px-4 py-14 md:px-8"
    >
      <SectionHeading id="preguntas-frecuentes-titulo" eyebrow="Resolvemos tus inquietudes" title="Preguntas frecuentes" align="center" />
      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.q} className="group rounded-xl border border-border-soft bg-white shadow-card open:shadow-lift">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-display text-title-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
              {item.q}
              <Icon name="expand_more" className="text-[24px] text-outline transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 text-body-md text-on-surface-variant">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-final" className="bg-primary-container py-14 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
        <h2 id="cta-final" className="text-balance font-display text-headline-lg-mobile font-bold md:text-headline-lg">
          ¿Encontraste lo que buscabas? Pregúntanos por tu talla
        </h2>
        <p className="text-body-lg text-white/80">
          Te ayudamos con modelos, colores y disponibilidad para que compres con tranquilidad.
        </p>
        <WhatsAppButton size="lg" label="Consultar por WhatsApp" message="Hola, quisiera hacer una consulta sobre su calzado." />
      </div>
    </section>
  );
}
