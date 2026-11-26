import type { Product, ProductColor, ProductVariant } from "@/types/product";

/*
 * CATÁLOGO REAL DEL ALMACÉN
 *
 * Para agregar un producto:
 * 1. Guarda sus fotos en public/productos/<nombre-del-zapato>/ (el mismo texto que `slug`,
 *    p. ej. public/productos/colegial-vena/), una por color, con el nombre del color en
 *    minúsculas y sin tildes: negro.jpg, azul.jpg… Cuadradas, mínimo 1200 px.
 * 2. Copia el bloque de un producto de abajo y cambia sus datos.
 * 3. Los precios van en pesos, sin puntos: 55000. Si el precio cambia según la talla,
 *    usa `prices` con un rango por línea.
 */

/** Mientras no se lleve inventario, cada talla se ofrece como disponible. */
const STOCK_SIN_CONTROL = 99;

interface PriceBySize {
  from: number;
  to: number;
  priceCop: number;
}

interface RealProductInput {
  reference: string;
  slug: string;
  /** Carpeta de las fotos dentro de public/productos/ si no es igual al slug (p. ej. "colegial-blanco/clasico"). */
  photoFolder?: string;
  name: string;
  description: string;
  audiences: Product["audiences"];
  type: Product["type"];
  /** Precios por rango de tallas; las tallas se toman de estos rangos. */
  prices: PriceBySize[];
  /** Colores en el orden en que se muestran; la primera foto es la de la tarjeta. */
  colors: (ProductColor & { photoAlt: string })[];
  tags?: Product["tags"];
  materials?: Product["materials"];
  createdAt: string;
}

function realProduct(input: RealProductInput): Product {
  const sizes = input.prices.flatMap((r) =>
    Array.from({ length: r.to - r.from + 1 }, (_, i) => ({ size: r.from + i, priceCop: r.priceCop })),
  );
  const variants: ProductVariant[] = input.colors.flatMap((color) =>
    sizes.map(({ size, priceCop }) => ({
      sku: `${input.reference}-${color.id.toUpperCase()}-${size}`,
      colorId: color.id,
      size,
      stock: STOCK_SIN_CONTROL,
      priceCop,
    })),
  );

  return {
    id: input.reference,
    slug: input.slug,
    reference: input.reference,
    name: input.name,
    description: input.description,
    audiences: input.audiences,
    type: input.type,
    priceCop: Math.min(...sizes.map((s) => s.priceCop)),
    images: input.colors.map((c) => ({
      src: `/productos/${input.photoFolder ?? input.slug}/${c.id}.jpg`,
      alt: c.photoAlt,
      width: 1600,
      height: 1600,
      colorId: c.id,
    })),
    colors: input.colors.map(({ id, name, hex }) => ({ id, name, hex })),
    variants,
    tags: input.tags ?? [],
    status: "publicado",
    materials: input.materials,
    isDemo: false,
    createdAt: input.createdAt,
  };
}

/** Precios de los colegiales por rango de tallas (Vena; por ahora también los blancos). */
const PRECIOS_COLEGIAL: PriceBySize[] = [
  { from: 23, to: 27, priceCop: 50000 },
  { from: 28, to: 33, priceCop: 55000 },
  { from: 34, to: 37, priceCop: 60000 },
  { from: 38, to: 42, priceCop: 70000 },
];

/** Los colegiales se venden en todas las secciones: van de tallas de niño a adulto. */
const TODA_LA_FAMILIA: Product["audiences"] = ["nino", "nina", "mujer", "hombre"];

/**
 * Familia "Colegial Blanco": cada modelo es un producto propio, con su foto en
 * public/productos/colegial-blanco/<modelo>/blanco.jpg.
 */
function colegialBlanco(input: { reference: string; model: string; name: string; description: string; photoAlt: string }): Product {
  return realProduct({
    reference: input.reference,
    slug: `colegial-blanco-${input.model}`,
    photoFolder: `colegial-blanco/${input.model}`,
    name: `Colegial Blanco ${input.name}`,
    description: `${input.description} Todo blanco, ideal para el uniforme de educación física, en tallas de niño a adulto.`,
    audiences: TODA_LA_FAMILIA,
    type: "escolar",
    prices: PRECIOS_COLEGIAL,
    colors: [{ id: "blanco", name: "Blanco", hex: "#f5f5f2", photoAlt: input.photoAlt }],
    tags: ["nuevo"],
    createdAt: "2026-11-26",
  });
}

export const products: Product[] = [
  realProduct({
    reference: "EMM-001",
    slug: "colegial-vena",
    name: "Colegial Vena",
    description:
      "Zapato colegial de cordones con capellada en cuero, costuras a la vista y suela color crema. Cómodo para toda la jornada escolar, en tallas de niño a adulto.",
    audiences: TODA_LA_FAMILIA,
    type: "escolar",
    prices: PRECIOS_COLEGIAL,
    colors: [
      { id: "negro", name: "Negro", hex: "#1f1f1f", photoAlt: "Par de zapatos colegiales Vena negros, de cordones, sobre fondo beige" },
      { id: "azul", name: "Azul", hex: "#1f2a44", photoAlt: "Par de zapatos colegiales Vena azul oscuro, de cordones, sobre fondo beige" },
      { id: "cafe", name: "Café", hex: "#5a2a24", photoAlt: "Par de zapatos colegiales Vena café, de cordones, sobre fondo beige" },
      { id: "vino", name: "Vino", hex: "#6d1a2a", photoAlt: "Par de zapatos colegiales Vena color vino, de cordones, sobre fondo beige" },
    ],
    tags: ["nuevo"],
    materials: { upper: "Cuero" },
    createdAt: "2026-11-25",
  }),
  realProduct({
    reference: "EMM-011",
    slug: "colegial-mafalda",
    name: "Colegial Mafalda",
    description:
      "Zapato colegial tipo mafalda con correa y hebilla en el empeine, costuras a la vista y punta redondeada. Cómodo para toda la jornada escolar, en tallas de niña a adulta.",
    // Todas las secciones, empezando por Niñas (es la que usan las migas de pan).
    audiences: ["nina", "nino", "mujer", "hombre"],
    type: "escolar",
    prices: PRECIOS_COLEGIAL,
    colors: [
      { id: "negro", name: "Negro suela crema", hex: "#1f1f1f", photoAlt: "Par de zapatos colegiales Mafalda negros con correa y hebilla, de suela color crema, sobre fondo beige" },
      { id: "negro-suela-negra", name: "Negro suela negra", hex: "#111111", photoAlt: "Par de zapatos colegiales Mafalda completamente negros, con correa y hebilla y suela negra, sobre fondo beige" },
      { id: "azul", name: "Azul", hex: "#1f2a44", photoAlt: "Par de zapatos colegiales Mafalda azul oscuro con correa y hebilla, sobre fondo beige" },
      { id: "vino", name: "Vino", hex: "#6d1a2a", photoAlt: "Par de zapatos colegiales Mafalda color vino con correa y hebilla, sobre fondo beige" },
    ],
    tags: ["nuevo"],
    createdAt: "2026-11-26",
  }),

  // ——— Colegial Blanco ———
  colegialBlanco({
    reference: "EMM-002",
    model: "clasico",
    name: "Clásico",
    description: "Tenis colegial de cordones, de perfil bajo y líneas clásicas, con franjas laterales en relieve.",
    photoAlt: "Par de tenis colegiales blancos de perfil bajo con franjas laterales en relieve, sobre fondo beige",
  }),
  colegialBlanco({
    reference: "EMM-003",
    model: "concha",
    name: "Punta Concha",
    description: "Tenis colegial de cordones con puntera reforzada tipo concha y suela de goma.",
    photoAlt: "Par de tenis colegiales blancos con puntera reforzada tipo concha, sobre fondo beige",
  }),
  colegialBlanco({
    reference: "EMM-004",
    model: "urbano",
    name: "Urbano",
    description: "Tenis colegial de cordones, de perfil bajo, con puntera perforada y suela gruesa.",
    photoAlt: "Par de tenis colegiales blancos de suela gruesa y puntera perforada, sobre fondo beige",
  }),
  colegialBlanco({
    reference: "EMM-005",
    model: "letras",
    name: "Letras",
    description: "Tenis colegial de cordones con letras en relieve en el costado y suela gruesa.",
    photoAlt: "Par de tenis colegiales blancos con letras en relieve en el costado, sobre fondo beige",
  }),
  colegialBlanco({
    reference: "EMM-006",
    model: "h",
    name: "H",
    description: "Tenis colegial de cordones con costuras en relieve y suela ancha.",
    photoAlt: "Par de tenis colegiales blancos con costuras en relieve y suela ancha, sobre fondo beige",
  }),
  colegialBlanco({
    reference: "EMM-007",
    model: "bota",
    name: "Bota",
    description: "Tenis colegial de caña alta con cordones y correa de velcro en el tobillo.",
    photoAlt: "Par de tenis colegiales blancos de caña alta con correa de velcro, sobre fondo beige",
  }),
  colegialBlanco({
    reference: "EMM-008",
    model: "deportivo",
    name: "Deportivo",
    description: "Tenis colegial deportivo de cordones, con capas superpuestas y suela gruesa.",
    photoAlt: "Par de tenis colegiales blancos deportivos con capas superpuestas y suela gruesa, sobre fondo beige",
  }),
  colegialBlanco({
    reference: "EMM-009",
    model: "retro",
    name: "Retro",
    description: "Tenis colegial de cordones de estilo retro, de perfil bajo y suela delgada.",
    photoAlt: "Par de tenis colegiales blancos de estilo retro y perfil bajo, sobre fondo beige",
  }),
  colegialBlanco({
    reference: "EMM-010",
    model: "casual",
    name: "Casual",
    description: "Tenis colegial de cordones, de perfil bajo con franja lateral y suela plana.",
    photoAlt: "Par de tenis colegiales blancos de perfil bajo con franja lateral, sobre fondo beige",
  }),
];
