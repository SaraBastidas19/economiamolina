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
  /**
   * Colores en el orden en que se muestran; la primera foto es la de la tarjeta.
   * `morePhotoAlts` describe fotos adicionales del mismo color: <color>-2.jpg, <color>-3.jpg…
   */
  colors: (ProductColor & { photoAlt: string; morePhotoAlts?: string[] })[];
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
    images: input.colors.flatMap((c) =>
      [c.photoAlt, ...(c.morePhotoAlts ?? [])].map((alt, i) => ({
        src: `/productos/${input.photoFolder ?? input.slug}/${c.id}${i === 0 ? "" : `-${i + 1}`}.jpg`,
        alt,
        width: 1600,
        height: 1600,
        colorId: c.id,
      })),
    ),
    colors: input.colors.map(({ id, name, hex }) => ({ id, name, hex })),
    variants,
    tags: input.tags ?? [],
    status: "publicado",
    materials: input.materials,
    isDemo: false,
    createdAt: input.createdAt,
  };
}

/** Precios por rango de tallas del Vena; por ahora los usan todos los productos reales. */
const PRECIOS_COLEGIAL: PriceBySize[] = [
  { from: 23, to: 27, priceCop: 50000 },
  { from: 28, to: 33, priceCop: 55000 },
  { from: 34, to: 37, priceCop: 60000 },
  { from: 38, to: 42, priceCop: 70000 },
];

/** Los colegiales aparecen solo en las secciones Niños y Niñas. */
const NINOS_Y_NINAS: Product["audiences"] = ["nino", "nina"];

interface ColegialFamilia {
  /** Carpeta y comienzo del slug: "colegial-blanco". */
  folder: string;
  /** Comienzo del nombre: "Colegial Blanco". */
  name: string;
  color: ProductColor;
  /** Frase que se agrega al final de cada descripción. */
  closing: string;
}

const BLANCO: ColegialFamilia = {
  folder: "colegial-blanco",
  name: "Colegial Blanco",
  color: { id: "blanco", name: "Blanco", hex: "#f5f5f2" },
  closing: "Todo blanco, ideal para el uniforme de educación física, en tallas de niño a adulto.",
};
const NEGRO: ColegialFamilia = {
  folder: "colegial-negro",
  name: "Colegial Negro",
  color: { id: "negro", name: "Negro", hex: "#1f1f1f" },
  closing: "Todo negro, para el uniforme de diario, en tallas de niño a adulto.",
};
const CAFE: ColegialFamilia = {
  folder: "colegial-cafe",
  name: "Colegial Café",
  color: { id: "cafe", name: "Café", hex: "#5a2a24" },
  closing: "En color café, para el uniforme de diario, en tallas de niño a adulto.",
};
const ELEGANTE: ColegialFamilia = {
  folder: "colegial-elegante",
  name: "Colegial Elegante",
  color: { id: "negro", name: "Negro", hex: "#1f1f1f" },
  closing: "Para el uniforme de diario o de gala, en tallas de niño a adulto.",
};

/**
 * Familia de colegiales de un solo color: cada modelo es un producto propio, con su
 * foto en public/productos/<familia>/<modelo>/<color>.jpg.
 */
function colegial(
  family: ColegialFamilia,
  input: { reference: string; model: string; name: string; description: string; photoAlt: string },
): Product {
  return realProduct({
    reference: input.reference,
    slug: `${family.folder}-${input.model}`,
    photoFolder: `${family.folder}/${input.model}`,
    name: `${family.name} ${input.name}`,
    description: `${input.description} ${family.closing}`,
    audiences: NINOS_Y_NINAS,
    type: "escolar",
    prices: PRECIOS_COLEGIAL,
    colors: [{ ...family.color, photoAlt: input.photoAlt }],
    tags: ["nuevo"],
    createdAt: "2026-11-26",
  });
}

const colegialBlanco = (input: Parameters<typeof colegial>[1]) => colegial(BLANCO, input);

/** Foto de grupo con varios modelos: el cliente indica cuál quiere en el pedido o por WhatsApp. */
const VARIOS_MODELOS: ProductColor = { id: "surtido", name: "Varios modelos", hex: "#c8b8a6" };
const ELIGE_MODELO = "Al hacer tu pedido, indica en las notas cuál modelo y color prefieres, o escríbenos por WhatsApp.";

/**
 * Producto que agrupa varios modelos en una sola foto, en
 * public/productos/<familia>/<modelo>/surtido.jpg.
 */
function surtido(input: {
  reference: string;
  family: "sandalias" | "tenis-deportivos";
  model: string;
  name: string;
  description: string;
  photoAlt: string;
}): Product {
  const sandalias = input.family === "sandalias";
  return realProduct({
    reference: input.reference,
    slug: `${input.family}-${input.model}`,
    photoFolder: `${input.family}/${input.model}`,
    name: input.name,
    description: `${input.description} ${ELIGE_MODELO}`,
    audiences: sandalias ? ["nina"] : ["mujer"],
    type: sandalias ? "sandalias" : "deportivo",
    prices: PRECIOS_COLEGIAL,
    colors: [{ ...VARIOS_MODELOS, photoAlt: input.photoAlt }],
    tags: ["nuevo"],
    createdAt: "2026-11-27",
  });
}

export const products: Product[] = [
  realProduct({
    reference: "EMM-001",
    slug: "colegial-vena",
    name: "Colegial Vena",
    description:
      "Zapato colegial de cordones con capellada en cuero, costuras a la vista y suela color crema. Cómodo para toda la jornada escolar, en tallas de niño a adulto.",
    audiences: NINOS_Y_NINAS,
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
    // Niñas primero: es la sección que usan las migas de pan.
    audiences: ["nina", "nino"],
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

  // ——— Colegial Elegante ———
  colegial(ELEGANTE, {
    reference: "EMM-012",
    model: "liso",
    name: "Liso",
    description: "Zapato colegial negro de cordones, de punta lisa y suela gruesa.",
    photoAlt: "Par de zapatos colegiales negros de cordones con punta lisa y suela gruesa, sobre fondo beige",
  }),
  colegial(ELEGANTE, {
    reference: "EMM-013",
    model: "puntera",
    name: "Puntera",
    description: "Zapato colegial negro de cordones, con costura en la puntera y cuello acolchado.",
    photoAlt: "Par de zapatos colegiales negros de cordones con costura en la puntera, sobre fondo beige",
  }),

  // ——— Colegial Negro y Café ———
  colegial(NEGRO, {
    reference: "EMM-014",
    model: "urbano",
    name: "Urbano",
    description: "Tenis colegial de cordones, de perfil bajo, con puntera perforada y suela gruesa.",
    photoAlt: "Par de tenis colegiales negros de suela gruesa y puntera perforada, sobre fondo beige",
  }),
  colegial(CAFE, {
    reference: "EMM-015",
    model: "retro",
    name: "Retro",
    description: "Tenis colegial de cordones de estilo retro, de perfil bajo, con costuras decorativas y suela color crema.",
    photoAlt: "Par de tenis colegiales café de estilo retro con suela color crema, sobre fondo beige",
  }),

  // ——— Tenis de tela (por ahora solo en la sección Mujer) ———
  realProduct({
    reference: "EMM-016",
    slug: "tenis-tela",
    photoFolder: "tenis-tela/tela",
    name: "Tenis de Tela",
    description:
      "Tenis sin cordones en tela tejida, con cuello alto tipo media y franjas tejidas. Livianos y fáciles de poner, con suela gruesa.",
    audiences: ["mujer"],
    type: "tenis",
    prices: PRECIOS_COLEGIAL,
    colors: [
      { id: "negro", name: "Negro suela negra", hex: "#1f1f1f",
        photoAlt: "Par de tenis de tela negros sin cordones, con suela negra, vistos de lado sobre fondo beige",
        morePhotoAlts: ["Par de tenis de tela negros sin cordones, con suela negra, vistos de frente sobre fondo beige"] },
      { id: "negro-suela-blanca", name: "Negro suela blanca", hex: "#262626",
        photoAlt: "Par de tenis de tela negros sin cordones, con suela blanca, vistos de lado sobre fondo beige",
        morePhotoAlts: ["Par de tenis de tela negros sin cordones, con suela blanca, vistos desde arriba sobre fondo beige"] },
      { id: "azul", name: "Azul", hex: "#1f3a8a",
        photoAlt: "Par de tenis de tela azules sin cordones, vistos de lado sobre fondo beige",
        morePhotoAlts: ["Par de tenis de tela azules sin cordones, vistos de frente sobre fondo beige"] },
      { id: "blanco", name: "Blanco", hex: "#f5f5f2",
        photoAlt: "Par de tenis de tela blancos sin cordones, vistos de frente sobre fondo beige",
        morePhotoAlts: ["Par de tenis de tela blancos sin cordones, vistos desde arriba sobre fondo beige"] },
      { id: "palo-rosa", name: "Palo rosa", hex: "#c9aeb0",
        photoAlt: "Par de tenis de tela palo rosa sin cordones, vistos de lado sobre fondo beige",
        morePhotoAlts: ["Par de tenis de tela palo rosa sin cordones, vistos de frente sobre fondo beige"] },
    ],
    tags: ["nuevo"],
    createdAt: "2026-11-26",
  }),
  realProduct({
    reference: "EMM-017",
    slug: "tenis-tela-corto",
    photoFolder: "tenis-tela/corto",
    name: "Tenis de Tela Corto",
    description: "Tenis sin cordones en tela tejida, de cuello bajo. Livianos y fáciles de poner, con suela gruesa.",
    audiences: ["mujer"],
    type: "tenis",
    prices: PRECIOS_COLEGIAL,
    colors: [
      { id: "azul", name: "Azul", hex: "#1f2a6b",
        photoAlt: "Par de tenis de tela azules de cuello bajo, vistos de lado sobre fondo beige",
        morePhotoAlts: ["Par de tenis de tela azules de cuello bajo, vistos de frente sobre fondo beige"] },
      { id: "negro", name: "Negro", hex: "#1f1f1f",
        photoAlt: "Par de tenis de tela negros de cuello bajo, vistos de lado sobre fondo beige",
        morePhotoAlts: ["Par de tenis de tela negros de cuello bajo, vistos de frente sobre fondo beige"] },
    ],
    tags: ["nuevo"],
    createdAt: "2026-11-26",
  }),
  realProduct({
    reference: "EMM-018",
    slug: "tenis-tela-corto-abertura",
    photoFolder: "tenis-tela/corto-abertura",
    name: "Tenis de Tela Corto con Abertura",
    description:
      "Tenis sin cordones en tela tejida, de cuello bajo y con abertura en el empeine. Livianos y fáciles de poner.",
    audiences: ["mujer"],
    type: "tenis",
    prices: PRECIOS_COLEGIAL,
    colors: [
      { id: "negro", name: "Negro", hex: "#1f1f1f",
        photoAlt: "Par de tenis de tela negros de cuello bajo con abertura en el empeine, vistos de lado sobre fondo beige",
        morePhotoAlts: ["Par de tenis de tela negros de cuello bajo con abertura en el empeine, vistos de frente sobre fondo beige"] },
      { id: "azul", name: "Azul", hex: "#1f2a6b",
        photoAlt: "Par de tenis de tela azules de cuello bajo con abertura en el empeine, vistos de frente sobre fondo beige" },
    ],
    tags: ["nuevo"],
    createdAt: "2026-11-26",
  }),

  // ——— Sandalias para niña (cada foto reúne varios modelos) ———
  surtido({
    reference: "EMM-019", family: "sandalias", model: "trenzadas", name: "Sandalias Trenzadas",
    description: "Sandalias para niña con tiras trenzadas y hebilla al tobillo, en tonos dorado, lila y azul.",
    photoAlt: "Tres pares de sandalias para niña con tiras trenzadas en dorado, lila y azul, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-020", family: "sandalias", model: "flores", name: "Sandalias con Flores",
    description: "Sandalias para niña con apliques de flores y correa al tobillo, en rosado metalizado, plateado y dorado.",
    photoAlt: "Tres pares de sandalias para niña con apliques de flores en rosado metalizado, plateado y dorado, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-021", family: "sandalias", model: "brillantes", name: "Sandalias Brillantes",
    description: "Sandalias para niña con tiras brillantes y correa al tobillo, en negro, plateado y azul.",
    photoAlt: "Tres pares de sandalias para niña con tiras brillantes en negro, plateado y azul, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-022", family: "sandalias", model: "tejidas", name: "Sandalias Tejidas",
    description: "Sandalias para niña con tiras tejidas y brillantes, en dorado, multicolor y rosado.",
    photoAlt: "Tres pares de sandalias para niña con tiras tejidas en dorado, multicolor y rosado, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-023", family: "sandalias", model: "metalizadas", name: "Sandalias Metalizadas",
    description: "Sandalias para niña con tiras metalizadas y detalles brillantes, en dorado, blanco, rosado y azul.",
    photoAlt: "Cuatro pares de sandalias para niña metalizadas en dorado, blanco, rosado y azul, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-024", family: "sandalias", model: "clasicas", name: "Sandalias Clásicas",
    description: "Sandalias para niña de suela plana con correa al tobillo, en blanco, rosado y azul.",
    photoAlt: "Varios pares de sandalias para niña de suela plana en blanco, rosado y azul, sobre fondo beige",
  }),

  // ——— Tenis deportivos de suela gruesa (cada foto reúne varios colores) ———
  surtido({
    reference: "EMM-025", family: "tenis-deportivos", model: "pastel", name: "Tenis Deportivo Pastel",
    description: "Tenis deportivos de cordones con suela gruesa, en beige, crema y azul con detalles rosados.",
    photoAlt: "Tres tenis deportivos de suela gruesa en beige, crema y azul, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-026", family: "tenis-deportivos", model: "oscuro", name: "Tenis Deportivo Oscuro",
    description: "Tenis deportivos de cordones con suela gruesa, en negro, azul oscuro y gris.",
    photoAlt: "Cuatro tenis deportivos de suela gruesa en negro, azul oscuro y gris, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-027", family: "tenis-deportivos", model: "gris", name: "Tenis Deportivo Gris",
    description: "Tenis deportivos de cordones con suela gruesa, en gris con detalles menta, rosados y lila.",
    photoAlt: "Cinco tenis deportivos grises de suela gruesa con detalles de colores, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-028", family: "tenis-deportivos", model: "detalles", name: "Tenis Deportivo Detalles de Color",
    description: "Tenis deportivos de cordones con suela gruesa, blancos con detalles celestes, rosados y lila.",
    photoAlt: "Cuatro tenis deportivos blancos de suela gruesa con detalles celestes, rosados y lila, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-029", family: "tenis-deportivos", model: "blanco", name: "Tenis Deportivo Blanco",
    description: "Tenis deportivos de cordones con suela gruesa, blancos con detalles rosados, lila y negros.",
    photoAlt: "Cuatro tenis deportivos blancos de suela gruesa con detalles rosados, lila y negros, sobre fondo beige",
  }),
  surtido({
    reference: "EMM-030", family: "tenis-deportivos", model: "plataforma", name: "Tenis Deportivo Plataforma",
    description: "Tenis deportivos de cordones con suela de plataforma, blancos con detalles azules, fucsia y dorados.",
    photoAlt: "Cuatro tenis deportivos blancos de plataforma con detalles azules, fucsia y dorados, sobre fondo beige",
  }),
];
