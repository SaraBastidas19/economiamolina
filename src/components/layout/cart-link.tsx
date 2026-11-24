"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart-store";
import { Icon } from "@/components/ui/icon";

export function CartLink() {
  const count = useCartCount();

  return (
    <Link
      href="/carrito"
      className="relative flex size-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-soft"
      aria-label={count > 0 ? `Carrito, ${count} ${count === 1 ? "producto" : "productos"}` : "Carrito vacío"}
    >
      <Icon name="shopping_bag" className="text-[24px]" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-0.5 top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-label-xs font-bold text-on-dark"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
