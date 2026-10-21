import { Icon } from "@/components/ui/icon";
import { whatsappUrl } from "@/lib/whatsapp";

/** Botón flotante de WhatsApp; no se muestra mientras falte el número. */
export function WhatsAppFab() {
  const href = whatsappUrl("Hola, quisiera hacer una consulta sobre su calzado.");
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-whatsapp-vibrant text-navy-deep shadow-sticky transition-transform hover:scale-105 md:bottom-8 md:right-8"
    >
      <Icon name="chat" className="text-[28px]" filled />
    </a>
  );
}
