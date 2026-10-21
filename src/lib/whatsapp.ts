import { business } from "@/config/business";

/** Enlace wa.me con mensaje prellenado, o `null` si el número no está configurado. */
export function whatsappUrl(message: string): string | null {
  if (!business.whatsappNumber) return null;
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
