"use client";

import Image from "next/image";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/types/product";

type SelectedColor = { colorId: string; setColorId: (id: string) => void };

const SelectedColorContext = createContext<SelectedColor | null>(null);

/** Primer color con alguna talla disponible: es el que se muestra al abrir la ficha. */
export function initialColorId(product: Product): string {
  return (
    product.colors.find((c) => product.variants.some((v) => v.colorId === c.id && v.stock > 0)) ?? product.colors[0]
  ).id;
}

/** Comparte el color elegido entre la galería y el selector de variantes de la ficha. */
export function SelectedColorProvider({ product, children }: { product: Product; children: ReactNode }) {
  const [colorId, setColorId] = useState(() => initialColorId(product));
  return <SelectedColorContext.Provider value={{ colorId, setColorId }}>{children}</SelectedColorContext.Provider>;
}

export function useSelectedColor(product: Product): SelectedColor {
  const ctx = useContext(SelectedColorContext);
  const [local, setLocal] = useState(() => initialColorId(product));
  return ctx ?? { colorId: local, setColorId: setLocal };
}

/**
 * Fotos de la ficha. Si las fotos tienen color, la principal es la del color elegido y
 * las demás de ese color van debajo; las fotos sin color se muestran siempre.
 */
export function ProductGallery({ product, badge }: { product: Product; badge?: ReactNode }) {
  const { colorId } = useSelectedColor(product);
  const forColor = product.images.filter((img) => img.colorId === colorId);
  const general = product.images.filter((img) => !img.colorId);
  const images = forColor.length ? [...forColor, ...general] : product.images;
  const [main, ...extra] = images;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-soft shadow-card">
        <Image
          key={main.src}
          src={main.src}
          alt={main.alt}
          fill
          preload
          sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
        {badge}
      </div>
      {extra.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-4">
          {extra.map((img) => (
            <li key={img.src} className="relative aspect-square overflow-hidden rounded-3xl bg-soft">
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 340px, 50vw" className="object-cover" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
