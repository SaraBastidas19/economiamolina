import { buildOrderMessage, parseCartItems, parseCustomer, quoteCart } from "@/lib/order";
import { whatsappUrl } from "@/lib/whatsapp";

const MAX_BODY_BYTES = 10_000;

function error(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

/**
 * POST /api/pedido
 *   { action: "cotizar", items }             → precios, inventario y total validados
 *   { action: "whatsapp", items, customer }  → además, el enlace de WhatsApp con el pedido
 */
export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return error("La solicitud es demasiado grande.", 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return error("Solicitud no válida.");
  }

  const items = parseCartItems(body?.items);
  if (!items) return error("El carrito no es válido.");

  const quote = await quoteCart(items);

  if (body.action === "cotizar") return Response.json({ quote });
  if (body.action !== "whatsapp") return error("Acción no válida.");

  if (items.length === 0) return error("El carrito está vacío.");
  if (quote.hasIssues) {
    return Response.json({ quote, error: "Revisa los productos marcados antes de enviar el pedido." }, { status: 409 });
  }

  const { customer, error: customerError } = parseCustomer(body.customer);
  if (!customer) return Response.json({ quote, error: customerError }, { status: 400 });

  const url = whatsappUrl(buildOrderMessage(quote, customer));
  if (!url) return Response.json({ quote, error: "El número de WhatsApp de la tienda aún no está configurado." }, { status: 503 });

  return Response.json({ quote, whatsappUrl: url });
}
