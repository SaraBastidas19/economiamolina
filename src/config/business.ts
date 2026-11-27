/**
 * Datos del negocio. Los valores `null` están pendientes de confirmación
 * por el propietario: los componentes ocultan o adaptan lo que depende
 * de ellos, para no publicar información comercial no verificada.
 */

function envOrNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const business = {
  name: "Economía Molina Muñoz",
  tagline: "Calzado para toda la familia",
  promise: "Calidad al mejor precio",
  yearsInBusiness: 25,

  /**
   * Logo del encabezado. Guarda el archivo en public/brand/ y completa
   * la ruta y su tamaño en píxeles; con `null` se muestra el nombre en texto.
   * Ejemplo: { src: "/brand/logo.png", width: 480, height: 160 }
   */
  logo: { src: "/brand/logo.png", width: 1332, height: 762 } as { src: string; width: number; height: number } | null,
  city: "Pasto",
  region: "Nariño",
  country: "Colombia",

  /** Número en formato internacional sin "+" ni espacios, p. ej. 573001234567. */
  whatsappNumber: envOrNull(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),

  address: null as string | null,
  addressReference: null as string | null,
  openingHours: null as string | null,
  instagramUrl: "https://www.instagram.com/ecomolinamunoz/" as string | null,

  policies: {
    exchanges: null as string | null,
    delivery: null as string | null,
    paymentMethods: null as string | null,
  },
} as const;

export const siteUrl = envOrNull(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000";

/**
 * Permite la indexación en buscadores. Debe quedar en `false` mientras el
 * catálogo sea de demostración, para no publicar productos ficticios.
 */
export const siteIndexable = process.env.SITE_INDEXABLE === "true";
