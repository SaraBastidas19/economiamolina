"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { addToCart, MAX_QTY_PER_LINE, useCart } from "@/lib/cart-store";
import { priceRange, variantPriceCop } from "@/lib/pricing";
import { formatCop } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { useSelectedColor } from "@/components/product/product-gallery";

type Status = { kind: "ok" | "error"; text: string } | null;

export function VariantPicker({ product }: { product: Product }) {
  const { colorId, setColorId } = useSelectedColor(product);
  const prices = priceRange(product);
  const variablePrice = prices.min < prices.max;
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<Status>(null);
  const cart = useCart();

  const sizes = product.variants.filter((v) => v.colorId === colorId).sort((a, b) => a.size - b.size);
  const variant = sizes.find((v) => v.size === size);
  const inCart = variant ? (cart.find((i) => i.sku === variant.sku)?.qty ?? 0) : 0;
  const maxQty = variant ? Math.max(0, Math.min(variant.stock, MAX_QTY_PER_LINE) - inCart) : 1;

  function selectColor(id: string) {
    setColorId(id);
    setSize(null);
    setQty(1);
    setStatus(null);
  }

  function selectSize(value: number) {
    setSize(value);
    setQty(1);
    setStatus(null);
  }

  function handleAdd() {
    if (!variant) {
      setStatus({ kind: "error", text: "Elige una talla para continuar." });
      return;
    }
    if (maxQty === 0) {
      setStatus({ kind: "error", text: "Ya tienes en el carrito todas las unidades disponibles de esta talla." });
      return;
    }
    const added = addToCart(variant.sku, Math.min(qty, maxQty), variant.stock);
    setQty(1);
    setStatus({
      kind: "ok",
      text: `Agregaste ${added} ${added === 1 ? "par" : "pares"} talla ${variant.size} al carrito.`,
    });
  }

  const colorName = product.colors.find((c) => c.id === colorId)?.name;

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-label-lg font-semibold text-ink">
          Color: <span className="font-normal text-muted">{colorName}</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.colors.map((c) => {
            const selected = c.id === colorId;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectColor(c.id)}
                className={`flex min-h-11 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-label-lg transition-colors ${
                  selected ? "border-primary ring-2 ring-primary/25" : "border-line bg-white hover:border-primary"
                }`}
              >
                <span className="size-7 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c.hex }} aria-hidden="true" />
                {c.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <div className="flex items-center justify-between">
          <legend className="text-label-lg font-semibold text-ink">Talla (Colombia)</legend>
          <Link href="/#guia-de-tallas" className="text-label-md font-semibold text-accent-text underline-offset-4 hover:underline">
            Guía de tallas
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((v) => {
            const selected = v.size === size;
            const soldOut = v.stock === 0;
            return (
              <button
                key={v.sku}
                type="button"
                disabled={soldOut}
                aria-pressed={selected}
                onClick={() => selectSize(v.size)}
                className={`flex size-11 items-center justify-center rounded-2xl border text-label-lg font-semibold transition-[transform,colors] ${
                  soldOut
                    ? "cursor-not-allowed border-line bg-soft text-muted/60 line-through"
                    : selected
                      ? "scale-105 border-primary bg-primary text-on-dark"
                      : "border-line bg-white text-ink hover:border-primary"
                }`}
              >
                {v.size}
                {soldOut && <span className="sr-only"> (agotada)</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-label-md text-muted">
          {variant
            ? variant.stock <= 3
              ? `¡Quedan ${variant.stock} ${variant.stock === 1 ? "par" : "pares"} en talla ${variant.size}!`
              : `Disponible en talla ${variant.size}.`
            : sizes.some((v) => v.stock === 0)
              ? "Las tallas tachadas están agotadas."
              : variablePrice
                ? "Elige tu talla para ver el precio."
                : "Elige tu talla."}
        </p>
        {variablePrice && variant && (
          <p className="mt-3 flex items-baseline gap-2" aria-live="polite">
            <span className="text-label-lg text-muted">Precio talla {variant.size}:</span>
            <span className="font-display text-price-display font-bold text-ink">{formatCop(variantPriceCop(product, variant))}</span>
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-center rounded-btn border border-line bg-white" role="group" aria-label="Cantidad">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="flex size-12 items-center justify-center text-ink disabled:text-muted/40"
            aria-label="Disminuir cantidad"
          >
            <Icon name="remove" className="text-[20px]" />
          </button>
          <output className="w-8 text-center font-display text-title-md font-semibold" aria-live="polite">
            {qty}
          </output>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            disabled={!variant || qty >= maxQty}
            className="flex size-12 items-center justify-center text-ink disabled:text-muted/40"
            aria-label="Aumentar cantidad"
          >
            <Icon name="add" className="text-[20px]" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-btn bg-primary px-6 text-title-sm font-semibold text-on-dark shadow-card transition-colors hover:bg-primary-hover"
        >
          <Icon name="shopping_bag" className="text-[20px]" />
          Agregar al carrito
        </button>
      </div>

      <div aria-live="polite">
        {status && (
          <p
            className={`flex flex-wrap items-center gap-2 rounded-2xl px-4 py-3 text-body-sm ${
              status.kind === "ok" ? "bg-whatsapp-vibrant/10 text-whatsapp-text" : "bg-error-container text-error"
            }`}
          >
            <Icon name={status.kind === "ok" ? "check" : "error"} className="text-[18px]" />
            {status.text}
            {status.kind === "ok" && (
              <Link href="/carrito" className="ml-auto font-semibold underline underline-offset-4">
                Ver carrito
              </Link>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
