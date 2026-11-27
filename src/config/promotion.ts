import { cacheLife } from "next/cache";

/**
 * Promoción destacada del inicio. Mientras esté vigente, el banner tipo cupón
 * reemplaza al encabezado principal; al vencer `endsAt` desaparece solo.
 */
export const promotion = {
  enabled: true,
  /** Franja negra tipo cupón ("Hasta 40%…") encima de la foto. En false se muestra solo la foto. */
  showCoupon: false,
  /** Fin de la promoción (exclusivo): el 30-11-26 termina a medianoche, hora de Colombia. */
  endsAt: "2026-12-01T00:00:00-05:00",
  dateLabel: "27-11-26 — 30-11-26",
  details: ["Referencias seleccionadas", "Aplican T&C"],
  headline: { top: "Hasta 40%", bottom: "en toda la tienda" },
  cta: { href: "/catalogo/promociones", label: "Ver ofertas" },
  image: {
    src: "/brand/portada-tienda.jpg",
    alt: "Fachada del almacén Economía Molina Muñoz con su letrero, la puerta abierta y vitrinas llenas de calzado",
    width: 2400,
    height: 1800,
    /**
     * Punto de la foto que se mantiene visible al recortarla: 35% vertical deja el letrero en la
     * franja ancha de escritorio; 38% horizontal lo deja completo en el recorte vertical del celular.
     */
    position: "38% 35%",
  },
} as const;

/** Se recalcula como máximo cada hora para no mostrar la promoción vencida. */
export async function isPromotionVisible(): Promise<boolean> {
  "use cache";
  cacheLife("hours");
  return promotion.enabled && Date.now() < Date.parse(promotion.endsAt);
}
