import type { Product, ProductColor, ProductVariant } from "@/types/product";

/*
 * CATÁLOGO REAL DEL ALMACÉN
 *
 * Para agregar un producto:
 * 1. Guarda sus fotos en public/productos/<REFERENCIA>/, una por color, con el nombre
 *    del color en minúsculas y sin tildes: negro.jpg, azul.jpg… Cuadradas, mínimo 1200 px.
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
      src: `/productos/${input.reference}/${c.id}.jpg`,
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

export const products: Product[] = [
  realProduct({
    reference: "EMM-001",
    slug: "colegial-vena",
    name: "Colegial Vena",
    description:
      "Zapato colegial de cordones con capellada en cuero, costuras a la vista y suela color crema. Cómodo para toda la jornada escolar, en tallas de niño a adulto.",
    audiences: ["nino", "nina", "mujer", "hombre"],
    type: "escolar",
    prices: [
      { from: 23, to: 27, priceCop: 50000 },
      { from: 28, to: 33, priceCop: 55000 },
      { from: 34, to: 37, priceCop: 60000 },
      { from: 38, to: 42, priceCop: 70000 },
    ],
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
];
