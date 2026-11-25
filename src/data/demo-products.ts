import type { Audience, Product, ProductColor, ProductTag, ProductVariant, ShoeType } from "@/types/product";

/*
 * CATÁLOGO DE DEMOSTRACIÓN
 * Nombres, referencias, precios e inventario son ficticios y sirven solo para
 * desarrollar y probar la tienda. Las fotografías son de StockSnap (licencia CC0)
 * y no corresponden a productos reales del almacén.
 */

const C = {
  negro: { id: "negro", name: "Negro", hex: "#1f1f1f" },
  cafe: { id: "cafe", name: "Café", hex: "#6b4226" },
  cafeOscuro: { id: "cafe-oscuro", name: "Café oscuro", hex: "#3e2a1e" },
  miel: { id: "miel", name: "Miel", hex: "#b7742f" },
  beige: { id: "beige", name: "Beige", hex: "#cdbfa8" },
  gris: { id: "gris", name: "Gris", hex: "#8a8d91" },
  nude: { id: "nude", name: "Nude", hex: "#d9b99b" },
  naranja: { id: "naranja", name: "Naranja", hex: "#e8682c" },
  blanco: { id: "blanco", name: "Blanco", hex: "#f5f5f2" },
  menta: { id: "menta", name: "Menta", hex: "#a8d8c8" },
  magenta: { id: "magenta", name: "Magenta", hex: "#9b2c6e" },
  rosado: { id: "rosado", name: "Negro con rosado", hex: "#e45d8a" },
  oliva: { id: "oliva", name: "Verde oliva", hex: "#7a7d55" },
  azul: { id: "azul", name: "Azul", hex: "#2f3e5c" },
  fucsia: { id: "fucsia", name: "Fucsia", hex: "#d63384" },
} satisfies Record<string, ProductColor>;

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Inventario determinista: mismas cantidades en cada ejecución, con algunas tallas agotadas. */
function buildVariants(reference: string, colors: ProductColor[], sizes: number[]): ProductVariant[] {
  let seed = [...reference].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return colors.flatMap((color) =>
    sizes.map((size) => {
      seed = (seed * 9301 + 49297) % 233280;
      const roll = seed / 233280;
      const stock = roll < 0.15 ? 0 : Math.ceil(roll * 6);
      return { sku: `${reference}-${color.id.toUpperCase()}-${size}`, colorId: color.id, size, stock };
    }),
  );
}

interface DemoInput {
  slug: string;
  name: string;
  description: string;
  audience: Audience;
  type: ShoeType;
  priceCop: number;
  compareAtPriceCop?: number;
  photos: { file: string; alt: string }[];
  colors: ProductColor[];
  sizes: number[];
  tags?: ProductTag[];
  materials?: Product["materials"];
}

let counter = 0;

function demo(input: DemoInput): Product {
  counter += 1;
  const reference = `DEMO-${String(counter).padStart(3, "0")}`;
  const tags = [...(input.tags ?? [])];
  if (input.compareAtPriceCop && !tags.includes("promocion")) tags.push("promocion");

  return {
    id: `demo-${counter}`,
    slug: input.slug,
    reference,
    name: input.name,
    description: input.description,
    audiences: [input.audience],
    type: input.type,
    priceCop: input.priceCop,
    compareAtPriceCop: input.compareAtPriceCop,
    images: input.photos.map((p) => ({ src: `/demo/${p.file}.jpg`, alt: p.alt, width: 640, height: 640 })),
    colors: input.colors,
    variants: buildVariants(reference, input.colors, input.sizes),
    tags,
    status: "publicado",
    materials: input.materials,
    isDemo: true,
    createdAt: `2026-10-${String(1 + (counter % 20)).padStart(2, "0")}`,
  };
}

export const demoProducts: Product[] = [
  // ——— Mujer ———
  demo({
    slug: "botin-tacon-acolchado-negro",
    name: "Botín de tacón acolchado",
    description: "Botín de caña corta con tacón ancho de 6 cm, laterales acolchados y cremallera interna para calzarlo fácil.",
    audience: "mujer",
    type: "botines",
    priceCop: 159900,
    compareAtPriceCop: 189900,
    photos: [{ file: "botin-tacon-negro", alt: "Botines negros de tacón ancho con detalle acolchado" }],
    colors: [C.negro],
    sizes: range(35, 39),
    materials: { upper: "Material sintético tipo cuero", lining: "Textil", sole: "Caucho" },
  }),
  demo({
    slug: "botin-hebilla-negro",
    name: "Botín con hebilla",
    description: "Botín de tacón bajo con correa y hebilla metálica. Combina con jeans, faldas y vestidos.",
    audience: "mujer",
    type: "botines",
    priceCop: 139900,
    photos: [{ file: "botin-hebilla-negro", alt: "Botín negro con hebilla lateral sobre piso de madera" }],
    colors: [C.negro, C.cafe],
    sizes: range(35, 39),
    tags: ["nuevo"],
    materials: { upper: "Material sintético", sole: "Caucho antideslizante" },
  }),
  demo({
    slug: "botin-cordones-cafe-mujer",
    name: "Botín de cordones",
    description: "Botín estilo militar con cordones, puntera redonda y suela con labrado para mayor agarre.",
    audience: "mujer",
    type: "botines",
    priceCop: 129900,
    photos: [{ file: "botin-cordon-cafe-mujer", alt: "Botines café de cordones vistos de frente" }],
    colors: [C.cafeOscuro],
    sizes: range(35, 39),
    materials: { upper: "Material sintético", sole: "Caucho" },
  }),
  demo({
    slug: "bota-cana-media-beige",
    name: "Bota de caña media",
    description: "Bota de caña media con caída suave y forro cálido, pensada para los días fríos.",
    audience: "mujer",
    type: "botas",
    priceCop: 169900,
    photos: [{ file: "bota-cana-media-beige", alt: "Botas beige de caña media sobre una escalera eléctrica" }],
    colors: [C.beige, C.gris],
    sizes: range(35, 39),
    tags: ["nuevo"],
    materials: { upper: "Gamuza sintética", lining: "Textil afelpado", sole: "Caucho" },
  }),
  demo({
    slug: "bota-alta-cafe",
    name: "Bota alta de tacón bajo",
    description: "Bota alta hasta la rodilla con tacón bajo y cremallera interna. Cómoda para caminar todo el día.",
    audience: "mujer",
    type: "botas",
    priceCop: 219900,
    compareAtPriceCop: 249900,
    photos: [{ file: "bota-alta-cafe", alt: "Bota alta color café sobre la nieve" }],
    colors: [C.cafe],
    sizes: range(35, 39),
    materials: { upper: "Material sintético tipo cuero", sole: "Caucho" },
  }),
  demo({
    slug: "zapato-tacon-clasico-nude",
    name: "Zapato de tacón clásico",
    description: "Zapato cerrado de tacón alto y puntera en punta, ideal para eventos y oficina.",
    audience: "mujer",
    type: "formal",
    priceCop: 119900,
    photos: [{ file: "tacon-nude", alt: "Zapatos de tacón alto color nude con iluminación cálida" }],
    colors: [C.nude, C.negro],
    sizes: range(34, 39),
    materials: { upper: "Charol sintético", sole: "Sintética" },
  }),
  demo({
    slug: "tacon-puntilla-naranja",
    name: "Tacón puntilla",
    description: "Zapato de tacón puntilla en color vibrante para darle un toque especial a tu atuendo.",
    audience: "mujer",
    type: "formal",
    priceCop: 109900,
    photos: [{ file: "tacon-naranja", alt: "Zapatos de tacón puntilla color naranja" }],
    colors: [C.naranja],
    sizes: range(35, 38),
    tags: ["nuevo"],
  }),
  demo({
    slug: "tenis-brillo-blanco",
    name: "Tenis con brillo",
    description: "Tenis de caña baja con capellada de brillos y suela blanca. Livianos y fáciles de combinar.",
    audience: "mujer",
    type: "tenis",
    priceCop: 99900,
    photos: [{ file: "tenis-blanco-brillo", alt: "Tenis blancos con brillos sobre una mesa" }],
    colors: [C.blanco],
    sizes: range(35, 40),
    materials: { upper: "Textil con aplicaciones", sole: "Caucho vulcanizado" },
  }),
  demo({
    slug: "tenis-lona-menta",
    name: "Tenis de lona menta",
    description: "Tenis de lona en tono menta con plantilla acolchada para el uso diario.",
    audience: "mujer",
    type: "tenis",
    priceCop: 79900,
    compareAtPriceCop: 94900,
    photos: [{ file: "tenis-menta", alt: "Tenis color menta vistos desde arriba sobre el césped" }],
    colors: [C.menta],
    sizes: range(35, 40),
    materials: { upper: "Lona", sole: "Caucho" },
  }),
  demo({
    slug: "tenis-deportivo-liviano-magenta",
    name: "Tenis deportivo liviano",
    description: "Tenis deportivo en tejido transpirable con suela amortiguada para entrenar y caminar.",
    audience: "mujer",
    type: "deportivo",
    priceCop: 139900,
    photos: [{ file: "deportivo-magenta", alt: "Tenis deportivos color magenta junto a unas mancuernas" }],
    colors: [C.magenta],
    sizes: range(35, 40),
    tags: ["nuevo"],
    materials: { upper: "Tejido transpirable", sole: "EVA y caucho" },
  }),
  demo({
    slug: "tenis-running-negro-rosado",
    name: "Tenis para correr",
    description: "Tenis de running con malla ventilada y suela con buen retorno de energía.",
    audience: "mujer",
    type: "deportivo",
    priceCop: 149900,
    photos: [{ file: "deportivo-rosado-negro", alt: "Persona amarrando un tenis negro con suela rosada sobre una banca" }],
    colors: [C.rosado],
    sizes: range(35, 40),
    materials: { upper: "Malla", sole: "EVA y caucho" },
  }),

  // ——— Hombre ———
  demo({
    slug: "zapato-oxford-cuero-miel",
    name: "Zapato Oxford en cuero",
    description: "Oxford clásico de cordones con puntera recta. Un básico para oficina, grados y matrimonios.",
    audience: "hombre",
    type: "formal",
    priceCop: 189900,
    photos: [
      { file: "oxford-cafe", alt: "Zapatos Oxford color miel sobre el césped" },
      { file: "oxford-tienda", alt: "Zapatos Oxford color miel exhibidos junto a camisas dobladas" },
    ],
    colors: [C.miel],
    sizes: range(38, 43),
    tags: ["nuevo"],
    materials: { upper: "Cuero", lining: "Cuero", sole: "Sintética" },
  }),
  demo({
    slug: "zapato-brogue-cafe",
    name: "Zapato Brogue",
    description: "Zapato formal con perforaciones tipo brogue y puntera de ala. Elegante y versátil.",
    audience: "hombre",
    type: "formal",
    priceCop: 199900,
    compareAtPriceCop: 229900,
    photos: [
      { file: "wingtip-cafe", alt: "Zapatos brogue café exhibidos en una repisa de madera" },
      { file: "wingtip-flatlay", alt: "Zapatos brogue color miel junto a una corbata y una cámara" },
    ],
    colors: [C.cafe],
    sizes: range(38, 43),
    materials: { upper: "Cuero", sole: "Sintética" },
  }),
  demo({
    slug: "botin-casual-cordones-cafe",
    name: "Botín casual de cordones",
    description: "Botín de cuero con cordones y suela delgada. Funciona con jean o pantalón de dril.",
    audience: "hombre",
    type: "botines",
    priceCop: 179900,
    photos: [{ file: "botin-cafe-hombre", alt: "Botines café de cordones junto a un cinturón y un reloj" }],
    colors: [C.cafe, C.negro],
    sizes: range(38, 43),
    materials: { upper: "Cuero", sole: "Caucho" },
  }),
  demo({
    slug: "botin-brogue-suela-blanca",
    name: "Botín brogue suela blanca",
    description: "Botín negro con perforaciones brogue y suela blanca gruesa. Estilo urbano con carácter.",
    audience: "hombre",
    type: "botines",
    priceCop: 229900,
    photos: [{ file: "botin-brogue-negro", alt: "Botín negro tipo brogue con suela blanca exhibido sobre una caja de madera" }],
    colors: [C.negro],
    sizes: range(39, 43),
    tags: ["nuevo"],
    materials: { upper: "Cuero granulado", sole: "Caucho" },
  }),
  demo({
    slug: "bota-trabajo-miel",
    name: "Bota de trabajo",
    description: "Bota resistente de caña alta con suela gruesa de alto agarre para jornadas exigentes.",
    audience: "hombre",
    type: "botas",
    priceCop: 189900,
    photos: [{ file: "bota-trabajo", alt: "Botas de trabajo color miel sobre un tablón de madera" }],
    colors: [C.miel],
    sizes: range(38, 44),
    materials: { upper: "Nobuk", lining: "Textil", sole: "Caucho de alta tracción" },
  }),
  demo({
    slug: "bota-urbana-cafe-oscuro",
    name: "Bota urbana",
    description: "Bota de cordones con caña media y suela dentada, cómoda para la lluvia y la ciudad.",
    audience: "hombre",
    type: "botas",
    priceCop: 169900,
    compareAtPriceCop: 199900,
    photos: [{ file: "bota-urbana-cafe", alt: "Botas café oscuro sobre el pavimento mojado" }],
    colors: [C.cafeOscuro],
    sizes: range(38, 43),
    materials: { upper: "Cuero", sole: "Caucho" },
  }),
  demo({
    slug: "zapato-nautico-cafe",
    name: "Zapato náutico",
    description: "Zapato náutico de cuero con cordón perimetral y suela blanca. Cómodo para el fin de semana.",
    audience: "hombre",
    type: "casual",
    priceCop: 129900,
    photos: [
      { file: "nautico-cafe", alt: "Zapatos náuticos café sobre piso de madera" },
      { file: "nautico-flatlay", alt: "Zapatos náuticos café junto a una camisa a cuadros" },
    ],
    colors: [C.cafe],
    sizes: range(38, 43),
    materials: { upper: "Cuero", sole: "Caucho" },
  }),
  demo({
    slug: "tenis-cana-alta-oliva",
    name: "Tenis de caña alta",
    description: "Tenis de caña alta en gamuza con suela vulcanizada. Para un look casual y cómodo.",
    audience: "hombre",
    type: "tenis",
    priceCop: 119900,
    photos: [{ file: "tenis-oliva", alt: "Tenis de caña alta verde oliva junto a ropa doblada" }],
    colors: [C.oliva],
    sizes: range(38, 43),
    tags: ["nuevo"],
    materials: { upper: "Gamuza sintética", sole: "Caucho vulcanizado" },
  }),
  demo({
    slug: "tenis-running-gris",
    name: "Tenis de running",
    description: "Tenis para correr con amortiguación en el talón y malla transpirable.",
    audience: "hombre",
    type: "deportivo",
    priceCop: 159900,
    photos: [{ file: "deportivo-hombre", alt: "Persona corriendo por una carretera al atardecer" }],
    colors: [C.gris],
    sizes: range(38, 44),
    materials: { upper: "Malla", sole: "EVA y caucho" },
  }),

  // ——— Niños ———
  demo({
    slug: "zapato-escolar-cuero-negro-nino",
    name: "Zapato escolar en cuero",
    description: "Zapato colegial negro de cordones, en cuero, con suela resistente al uso diario.",
    audience: "nino",
    type: "escolar",
    priceCop: 89900,
    photos: [{ file: "derby-negro", alt: "Zapatos negros de cordones en cuero brillante" }],
    colors: [C.negro],
    sizes: range(27, 38),
    materials: { upper: "Cuero", lining: "Sintético", sole: "Caucho" },
  }),
  demo({
    slug: "tenis-lona-azul-nino",
    name: "Tenis de lona",
    description: "Tenis de lona con suela de caucho y cordones. Resistentes para el juego y el colegio.",
    audience: "nino",
    type: "tenis",
    priceCop: 59900,
    compareAtPriceCop: 69900,
    photos: [{ file: "tenis-lona-azul", alt: "Tenis de lona azul con suela blanca" }],
    colors: [C.azul],
    sizes: range(26, 36),
    materials: { upper: "Lona", sole: "Caucho" },
  }),
  demo({
    slug: "bota-montana-infantil",
    name: "Bota de montaña infantil",
    description: "Bota de caña media con suela de alto agarre para caminatas y días de lluvia.",
    audience: "nino",
    type: "botas",
    priceCop: 119900,
    photos: [{ file: "botas-montana-nino", alt: "Botas de montaña de varios tamaños sobre una roca" }],
    colors: [C.gris],
    sizes: range(28, 36),
    tags: ["nuevo"],
    materials: { upper: "Sintético y textil", sole: "Caucho" },
  }),

  // ——— Niñas ———
  demo({
    slug: "zapato-escolar-mercedita-negro",
    name: "Zapato escolar tipo mercedita",
    description: "Mercedita escolar negra con correa y suela antideslizante, cómoda para toda la jornada.",
    audience: "nina",
    type: "escolar",
    priceCop: 84900,
    photos: [{ file: "merceditas-negras", alt: "Zapatos negros tipo mercedita con medias a rayas" }],
    colors: [C.negro],
    sizes: range(27, 38),
    materials: { upper: "Cuero sintético", sole: "Caucho" },
  }),
  demo({
    slug: "zapato-casual-velcro-fucsia",
    name: "Zapato casual con velcro",
    description: "Zapato abierto con cierre de velcro y suela flexible para los primeros pasos y el juego.",
    audience: "nina",
    type: "casual",
    priceCop: 69900,
    photos: [{ file: "rosado-nina", alt: "Niña en el césped con zapatos fucsia de velcro" }],
    colors: [C.fucsia],
    sizes: range(20, 28),
    tags: ["nuevo"],
    materials: { upper: "Sintético", sole: "Caucho flexible" },
  }),
  demo({
    slug: "tenis-velcro-nina",
    name: "Tenis con velcro",
    description: "Tenis livianos con cierre de velcro, fáciles de poner y quitar.",
    audience: "nina",
    type: "tenis",
    priceCop: 74900,
    photos: [{ file: "tenis-nina", alt: "Niña con tenis grises y fucsia junto a un adulto" }],
    colors: [C.gris],
    sizes: range(20, 30),
    materials: { upper: "Textil", sole: "EVA" },
  }),
  demo({
    slug: "tenis-blanco-lona-nina",
    name: "Tenis blanco de lona",
    description: "Tenis blanco de cordones, una opción práctica para la clase de educación física.",
    audience: "nina",
    type: "tenis",
    priceCop: 64900,
    photos: [{ file: "tenis-blanco-nina", alt: "Tenis blancos de lona con cordones sobre piso de baldosa" }],
    colors: [C.blanco],
    sizes: range(30, 38),
    materials: { upper: "Lona", sole: "Caucho" },
  }),
  demo({
    slug: "botas-lluvia-estampadas-nina",
    name: "Botas de lluvia estampadas",
    description: "Botas impermeables de caucho con estampado, perfectas para los días lluviosos.",
    audience: "nina",
    type: "botas",
    priceCop: 59900,
    compareAtPriceCop: 74900,
    photos: [{ file: "botas-lluvia-nina", alt: "Niña con botas de lluvia estampadas, foto en blanco y negro" }],
    colors: [C.blanco],
    sizes: range(24, 32),
    materials: { upper: "Caucho", sole: "Caucho" },
  }),
];
