import { business } from "@/config/business";
import { getVariantBySku } from "@/lib/catalog";
import { formatCop } from "@/lib/format";

/*
 * Cálculo del pedido en el servidor. El navegador solo envía SKU y cantidad:
 * precios, nombres, inventario y totales se toman siempre del catálogo.
 */

export const MAX_CART_LINES = 30;
export const MAX_QTY_PER_LINE = 10;

export interface CartItemInput {
  sku: string;
  qty: number;
}

export type LineIssue = "no_disponible" | "agotado" | "stock_insuficiente";

export interface QuotedLine {
  sku: string;
  slug: string | null;
  name: string;
  reference: string | null;
  colorName: string | null;
  size: number | null;
  image: { src: string; alt: string } | null;
  unitPriceCop: number;
  qty: number;
  stock: number;
  lineTotalCop: number;
  issue?: LineIssue;
}

export interface CartQuote {
  lines: QuotedLine[];
  totalCop: number;
  unitCount: number;
  hasIssues: boolean;
}

export interface CustomerInput {
  name: string;
  delivery: "tienda" | "domicilio";
  address: string;
  notes: string;
}

/** Valida la forma de los ítems recibidos; devuelve `null` si no es válida. */
export function parseCartItems(value: unknown): CartItemInput[] | null {
  if (!Array.isArray(value) || value.length > MAX_CART_LINES) return null;
  const items: CartItemInput[] = [];
  for (const raw of value) {
    if (typeof raw !== "object" || raw === null) return null;
    const { sku, qty } = raw as Record<string, unknown>;
    if (typeof sku !== "string" || sku.length === 0 || sku.length > 60) return null;
    if (!Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_QTY_PER_LINE) return null;
    if (items.some((i) => i.sku === sku)) return null;
    items.push({ sku, qty: qty as number });
  }
  return items;
}

/** Quita caracteres de control y recorta espacios; limita la longitud. */
function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function parseCustomer(value: unknown): { customer?: CustomerInput; error?: string } {
  if (typeof value !== "object" || value === null) return { error: "Faltan los datos del pedido." };
  const raw = value as Record<string, unknown>;
  const name = cleanText(raw.name, 60);
  const delivery = raw.delivery === "domicilio" ? "domicilio" : raw.delivery === "tienda" ? "tienda" : null;
  const address = cleanText(raw.address, 150);
  const notes = cleanText(raw.notes, 300);

  if (name.length < 2) return { error: "Escribe tu nombre." };
  if (!delivery) return { error: "Elige cómo quieres recibir el pedido." };
  if (delivery === "domicilio" && address.length < 5) return { error: "Escribe la dirección de entrega." };
  return { customer: { name, delivery, address: delivery === "domicilio" ? address : "", notes } };
}

export async function quoteCart(items: CartItemInput[]): Promise<CartQuote> {
  const lines: QuotedLine[] = [];

  for (const item of items) {
    const found = await getVariantBySku(item.sku);
    if (!found) {
      lines.push({
        sku: item.sku,
        slug: null,
        name: "Producto no disponible",
        reference: null,
        colorName: null,
        size: null,
        image: null,
        unitPriceCop: 0,
        qty: item.qty,
        stock: 0,
        lineTotalCop: 0,
        issue: "no_disponible",
      });
      continue;
    }

    const { product, variant, color } = found;
    const issue: LineIssue | undefined =
      variant.stock === 0 ? "agotado" : item.qty > variant.stock ? "stock_insuficiente" : undefined;

    lines.push({
      sku: variant.sku,
      slug: product.slug,
      name: product.name,
      reference: product.reference,
      colorName: color.name,
      size: variant.size,
      image: { src: product.images[0].src, alt: product.images[0].alt },
      unitPriceCop: product.priceCop,
      qty: item.qty,
      stock: variant.stock,
      lineTotalCop: issue ? 0 : product.priceCop * item.qty,
      issue,
    });
  }

  const valid = lines.filter((l) => !l.issue);
  return {
    lines,
    totalCop: valid.reduce((sum, l) => sum + l.lineTotalCop, 0),
    unitCount: valid.reduce((sum, l) => sum + l.qty, 0),
    hasIssues: lines.some((l) => l.issue),
  };
}

export function buildOrderMessage(quote: CartQuote, customer: CustomerInput): string {
  const lines = quote.lines.map(
    (l, i) =>
      `${i + 1}. ${l.name} (Ref. ${l.reference})\n   Color: ${l.colorName} · Talla: ${l.size} · Cantidad: ${l.qty}\n   ${formatCop(l.unitPriceCop)} c/u = ${formatCop(l.lineTotalCop)}`,
  );

  return [
    `Hola, quiero hacer este pedido en ${business.name}:`,
    "",
    ...lines,
    "",
    `Total productos: ${formatCop(quote.totalCop)} (${quote.unitCount} ${quote.unitCount === 1 ? "par" : "pares"})`,
    "",
    `Nombre: ${customer.name}`,
    customer.delivery === "domicilio" ? `Entrega a domicilio: ${customer.address}` : "Entrega: recoger en la tienda",
    customer.notes ? `Notas: ${customer.notes}` : null,
    "",
    "Quedo atento(a) a la confirmación de disponibilidad, costo de envío y forma de pago.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}
