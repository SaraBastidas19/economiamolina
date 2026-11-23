import type { Metadata } from "next";
import { business } from "@/config/business";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Carrito",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8 lg:px-14">
      <h1 className="font-display text-headline-lg-mobile font-bold tracking-tight text-ink md:text-headline-lg">
        Tu carrito
      </h1>
      <CartView whatsappConfigured={business.whatsappNumber !== null} />
    </div>
  );
}
