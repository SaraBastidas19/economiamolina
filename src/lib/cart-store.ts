"use client";

import { useSyncExternalStore } from "react";

/*
 * Carrito guardado en el navegador (localStorage). Solo guarda qué variante
 * y cuántas unidades: precios y disponibilidad los calcula el servidor.
 */

export interface CartItem {
  sku: string;
  qty: number;
}

const STORAGE_KEY = "carrito-v1";
export const MAX_QTY_PER_LINE = 10;
const EMPTY: CartItem[] = [];

let cache: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(parsed)
      ? parsed.filter((i) => typeof i?.sku === "string" && Number.isInteger(i?.qty) && i.qty > 0)
      : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Sin almacenamiento disponible (modo privado): el carrito vive solo en memoria.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useCartCount(): number {
  return useCart().reduce((sum, item) => sum + item.qty, 0);
}

/**
 * Agrega unidades de una variante sin superar el inventario conocido.
 * Devuelve cuántas unidades se agregaron realmente.
 */
export function addToCart(sku: string, qty: number, stock: number): number {
  const items = read();
  const current = items.find((i) => i.sku === sku)?.qty ?? 0;
  const limit = Math.min(stock, MAX_QTY_PER_LINE);
  const added = Math.max(0, Math.min(qty, limit - current));
  if (added === 0) return 0;

  write(
    items.some((i) => i.sku === sku)
      ? items.map((i) => (i.sku === sku ? { ...i, qty: i.qty + added } : i))
      : [...items, { sku, qty: added }],
  );
  return added;
}

export function setCartQty(sku: string, qty: number) {
  const clamped = Math.max(1, Math.min(qty, MAX_QTY_PER_LINE));
  write(read().map((i) => (i.sku === sku ? { ...i, qty: clamped } : i)));
}

export function removeFromCart(sku: string) {
  write(read().filter((i) => i.sku !== sku));
}

export function clearCart() {
  write([]);
}
