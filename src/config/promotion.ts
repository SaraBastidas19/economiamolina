import { cacheLife } from "next/cache";

/**
 * Promoción destacada del inicio. Mientras esté vigente, el banner tipo cupón
 * reemplaza al encabezado principal; al vencer `endsAt` desaparece solo.
 */
export const promotion = {
  enabled: true,
  /** Fin de la promoción (exclusivo): el 30-11-26 termina a medianoche, hora de Colombia. */
  endsAt: "2026-12-01T00:00:00-05:00",
  dateLabel: "27-11-26 — 30-11-26",
  details: ["Referencias seleccionadas", "Aplican T&C"],
  headline: { top: "Hasta 40%", bottom: "en toda la tienda" },
  cta: { href: "/catalogo/promociones", label: "Ver ofertas" },
  /** Reemplazar por la foto real de la campaña (p. ej. /brand/banner-familia.jpg). */
  image: {
    src: "/demo/banner-familia.jpg",
    alt: "Familia caminando por un parque con tenis, botines y zapatos casuales",
    width: 960,
    height: 640,
  },
} as const;

/** Se recalcula como máximo cada hora para no mostrar la promoción vencida. */
export async function isPromotionVisible(): Promise<boolean> {
  "use cache";
  cacheLife("hours");
  return promotion.enabled && Date.now() < Date.parse(promotion.endsAt);
}
