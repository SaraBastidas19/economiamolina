"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { clearCart, MAX_QTY_PER_LINE, removeFromCart, setCartQty, useCart, type CartItem } from "@/lib/cart-store";
import { formatCop } from "@/lib/format";
import type { CartQuote, QuotedLine } from "@/lib/order";
import { Icon } from "@/components/ui/icon";

const subscribeNoop = () => () => {};
const useHydrated = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

const cartKey = (items: CartItem[]) => items.map((i) => `${i.sku}:${i.qty}`).join("|");

async function postOrder(body: unknown): Promise<{ quote?: CartQuote; whatsappUrl?: string; error?: string }> {
  try {
    const res = await fetch("/api/pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return { error: "No pudimos conectar con la tienda. Revisa tu conexión e inténtalo de nuevo." };
  }
}

const issueText: Record<NonNullable<QuotedLine["issue"]>, (l: QuotedLine) => string> = {
  no_disponible: () => "Este producto ya no está disponible. Quítalo del carrito.",
  agotado: () => "Esta talla se agotó. Quítala del carrito o elige otra.",
  stock_insuficiente: (l) => `Solo quedan ${l.stock} ${l.stock === 1 ? "par" : "pares"}. Ajusta la cantidad.`,
};

export function CartView({ whatsappConfigured }: { whatsappConfigured: boolean }) {
  const hydrated = useHydrated();
  const items = useCart();
  const key = cartKey(items);
  const [quoted, setQuoted] = useState<{ key: string; quote?: CartQuote; error?: string } | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    postOrder({ action: "cotizar", items }).then((data) => {
      if (!cancelled) setQuoted({ key, quote: data.quote, error: data.quote ? undefined : data.error });
    });
    return () => {
      cancelled = true;
    };
    // `key` resume el contenido del carrito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!hydrated) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-border-warm bg-white px-6 py-16 text-center">
        <Icon name="shopping_bag" className="text-[44px] text-outline" />
        <h2 className="mt-3 font-display text-title-md font-semibold text-primary">Tu carrito está vacío</h2>
        <p className="mt-1 max-w-md text-body-md text-on-surface-variant">
          Elige un modelo, selecciona tu talla y agrégalo para armar tu pedido.
        </p>
        <Link
          href="/catalogo"
          className="mt-5 inline-flex min-h-11 items-center rounded-btn bg-primary-container px-5 text-label-lg font-semibold text-white hover:bg-navy-deep"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  const current = quoted?.key === key ? quoted : null;
  const quote = current?.quote ?? (quoted?.quote ? quoted.quote : undefined);
  const loading = !current;

  if (!quote) {
    return current?.error ? <ErrorBox text={current.error} /> : <CartSkeleton />;
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-12">
      <section aria-label="Productos del carrito" className="lg:col-span-7">
        <ul className="divide-y divide-border-soft rounded-xl border border-border-soft bg-white shadow-card">
          {quote.lines.filter((line) => items.some((i) => i.sku === line.sku)).map((line) => (
            <CartLine key={line.sku} line={line} qty={items.find((i) => i.sku === line.sku)?.qty ?? line.qty} />
          ))}
        </ul>
        <button
          type="button"
          onClick={() => clearCart()}
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 px-1 text-label-lg font-semibold text-slate hover:text-alert-terracotta"
        >
          <Icon name="delete" className="text-[18px]" />
          Vaciar carrito
        </button>
      </section>

      <aside className="lg:col-span-5">
        <div className="space-y-5 rounded-xl border border-border-soft bg-white p-5 shadow-card md:p-6 lg:sticky lg:top-24">
          <div aria-live="polite" className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <div className="flex items-baseline justify-between">
              <span className="text-body-md text-on-surface-variant">
                Subtotal ({quote.unitCount} {quote.unitCount === 1 ? "par" : "pares"})
              </span>
              <span className="font-display text-headline-sm font-bold text-primary">{formatCop(quote.totalCop)}</span>
            </div>
            <p className="mt-1 text-label-md text-slate">
              El costo de envío y la forma de pago se confirman por WhatsApp.
            </p>
          </div>
          <OrderForm
            items={items}
            disabled={loading || quote.hasIssues || !whatsappConfigured}
            hasIssues={quote.hasIssues}
            whatsappConfigured={whatsappConfigured}
          />
        </div>
      </aside>
    </div>
  );
}

function CartLine({ line, qty }: { line: QuotedLine; qty: number }) {
  const maxQty = Math.min(Math.max(line.stock, 1), MAX_QTY_PER_LINE);

  return (
    <li className="flex gap-4 p-4">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-surface-warm">
        {line.image && <Image src={line.image.src} alt={line.image.alt} fill sizes="96px" className="object-cover" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {line.slug ? (
              <Link href={`/producto/${line.slug}`} className="font-display text-title-sm font-semibold text-text-primary hover:underline">
                {line.name}
              </Link>
            ) : (
              <span className="font-display text-title-sm font-semibold text-text-primary">{line.name}</span>
            )}
            {line.size !== null && (
              <p className="text-label-md text-slate">
                {line.colorName} · Talla {line.size} · Ref. {line.reference}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(line.sku)}
            className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-slate hover:bg-surface-warm hover:text-alert-terracotta"
            aria-label={`Quitar ${line.name}${line.size ? ` talla ${line.size}` : ""} del carrito`}
          >
            <Icon name="delete" className="text-[20px]" />
          </button>
        </div>

        {line.issue && (
          <p className="flex items-center gap-1.5 text-label-md font-semibold text-alert-terracotta">
            <Icon name="error" className="text-[16px]" />
            {issueText[line.issue](line)}
          </p>
        )}

        {line.issue !== "no_disponible" && line.issue !== "agotado" && (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center rounded-btn border border-border-warm" role="group" aria-label={`Cantidad de ${line.name}`}>
              <button
                type="button"
                onClick={() => setCartQty(line.sku, qty - 1)}
                disabled={qty <= 1}
                className="flex size-10 items-center justify-center text-primary disabled:text-outline-variant"
                aria-label="Disminuir cantidad"
              >
                <Icon name="remove" className="text-[18px]" />
              </button>
              <output className="w-7 text-center text-label-lg font-semibold">{qty}</output>
              <button
                type="button"
                onClick={() => setCartQty(line.sku, Math.min(qty + 1, maxQty))}
                disabled={qty >= maxQty}
                className="flex size-10 items-center justify-center text-primary disabled:text-outline-variant"
                aria-label="Aumentar cantidad"
              >
                <Icon name="add" className="text-[18px]" />
              </button>
            </div>
            <p className="text-right">
              <span className="block font-display text-price-sm font-bold text-primary-container">
                {formatCop(line.unitPriceCop * qty)}
              </span>
              {qty > 1 && <span className="text-label-md text-slate">{formatCop(line.unitPriceCop)} c/u</span>}
            </p>
          </div>
        )}
      </div>
    </li>
  );
}

function OrderForm({
  items,
  disabled,
  hasIssues,
  whatsappConfigured,
}: {
  items: CartItem[];
  disabled: boolean;
  hasIssues: boolean;
  whatsappConfigured: boolean;
}) {
  const [delivery, setDelivery] = useState<"tienda" | "domicilio">("tienda");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string; url?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSending(true);
    setMessage(null);

    const data = await postOrder({
      action: "whatsapp",
      items,
      customer: {
        name: form.get("name"),
        delivery,
        address: form.get("address") ?? "",
        notes: form.get("notes") ?? "",
      },
    });
    setSending(false);

    if (!data.whatsappUrl) {
      setMessage({ kind: "error", text: data.error ?? "No pudimos preparar el pedido. Inténtalo de nuevo." });
      return;
    }

    const opened = window.open(data.whatsappUrl, "_blank");
    if (opened) opened.opener = null;
    setMessage({
      kind: "ok",
      url: data.whatsappUrl,
      text: opened
        ? "Abrimos WhatsApp con tu pedido. Envía el mensaje para que la tienda confirme disponibilidad, envío y pago."
        : "Tu pedido está listo. Abre WhatsApp para enviarlo.",
    });
  }

  const inputClass =
    "mt-1 h-12 w-full rounded-btn border border-border-warm bg-white px-3.5 text-body-md focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-border-soft pt-5">
      <h2 className="font-display text-title-md font-semibold text-primary">Datos para tu pedido</h2>

      <div>
        <label htmlFor="name" className="text-label-lg font-semibold text-primary">
          Nombre <span className="text-alert-terracotta" aria-hidden="true">*</span>
        </label>
        <input id="name" name="name" required minLength={2} maxLength={60} autoComplete="name" className={inputClass} />
      </div>

      <fieldset>
        <legend className="text-label-lg font-semibold text-primary">¿Cómo quieres recibirlo?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(
            [
              ["tienda", "Recoger en tienda"],
              ["domicilio", "A domicilio"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-btn border px-3 text-label-lg ${
                delivery === value ? "border-primary-container bg-surface-warm font-semibold text-primary" : "border-border-warm"
              }`}
            >
              <input
                type="radio"
                name="delivery"
                value={value}
                checked={delivery === value}
                onChange={() => setDelivery(value)}
                className="accent-primary-container"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {delivery === "domicilio" && (
        <div>
          <label htmlFor="address" className="text-label-lg font-semibold text-primary">
            Dirección de entrega <span className="text-alert-terracotta" aria-hidden="true">*</span>
          </label>
          <input
            id="address"
            name="address"
            required
            minLength={5}
            maxLength={150}
            autoComplete="street-address"
            placeholder="Barrio, calle y número"
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="notes" className="text-label-lg font-semibold text-primary">
          Notas <span className="font-normal text-slate">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          maxLength={300}
          rows={2}
          className={`${inputClass} h-auto py-2.5`}
          placeholder="Ej.: horario para recibir"
        />
      </div>

      <button
        type="submit"
        disabled={disabled || sending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-btn bg-whatsapp-vibrant px-6 text-title-sm font-semibold text-navy-deep transition-colors hover:bg-[#1fbe5b] disabled:cursor-not-allowed disabled:bg-surface-warm disabled:text-on-surface-variant"
      >
        <Icon name="chat" className="text-[20px]" />
        {sending ? "Preparando pedido…" : "Enviar pedido por WhatsApp"}
      </button>

      {!whatsappConfigured && (
        <p className="text-label-md text-slate">
          El número de WhatsApp de la tienda aún no está configurado, por eso el envío está deshabilitado.
        </p>
      )}
      {whatsappConfigured && hasIssues && (
        <p className="text-label-md text-alert-terracotta">Revisa los productos marcados antes de enviar el pedido.</p>
      )}

      <div aria-live="polite">
        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-body-sm ${
              message.kind === "ok" ? "bg-whatsapp-vibrant/10 text-whatsapp-text" : "bg-error-container text-error"
            }`}
          >
            <p>{message.text}</p>
            {message.url && (
              <a href={message.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-semibold underline underline-offset-4">
                Abrir WhatsApp
              </a>
            )}
          </div>
        )}
      </div>

      <p className="text-label-md text-slate">
        Tus datos solo se incluyen en el mensaje de WhatsApp; la tienda no los guarda en este sitio.
      </p>
    </form>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <p className="mt-8 flex items-center gap-2 rounded-lg bg-error-container px-4 py-3 text-body-md text-error">
      <Icon name="error" className="text-[20px]" />
      {text}
    </p>
  );
}

function CartSkeleton() {
  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-12" aria-hidden="true">
      <div className="space-y-3 lg:col-span-7">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-border-soft bg-white p-4">
            <div className="size-24 animate-pulse rounded-lg bg-surface-warm" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded bg-surface-warm" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-surface-warm" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-white lg:col-span-5" />
    </div>
  );
}
