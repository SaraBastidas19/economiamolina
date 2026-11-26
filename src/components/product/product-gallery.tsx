"use client";

import Image from "next/image";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import type { Product, ProductImage } from "@/types/product";
import { Icon } from "@/components/ui/icon";

type SelectedColor = {
  colorId: string;
  setColorId: (id: string) => void;
  /** Talla elegida (null hasta que se elige); la usan el selector y las promociones por talla. */
  size: number | null;
  setSize: (size: number | null) => void;
};

const SelectedColorContext = createContext<SelectedColor | null>(null);

/** Primer color con alguna talla disponible: es el que se muestra al abrir la ficha. */
export function initialColorId(product: Product): string {
  return (
    product.colors.find((c) => product.variants.some((v) => v.colorId === c.id && v.stock > 0)) ?? product.colors[0]
  ).id;
}

/** Comparte el color y la talla elegidos entre la galería, el selector y las promociones de la ficha. */
export function SelectedColorProvider({ product, children }: { product: Product; children: ReactNode }) {
  const [colorId, setColorId] = useState(() => initialColorId(product));
  const [size, setSize] = useState<number | null>(null);
  return (
    <SelectedColorContext.Provider value={{ colorId, setColorId, size, setSize }}>{children}</SelectedColorContext.Provider>
  );
}

export function useSelectedColor(product: Product): SelectedColor {
  const ctx = useContext(SelectedColorContext);
  const [localColor, setLocalColor] = useState(() => initialColorId(product));
  const [localSize, setLocalSize] = useState<number | null>(null);
  return ctx ?? { colorId: localColor, setColorId: setLocalColor, size: localSize, setSize: setLocalSize };
}

/**
 * Fotos de la ficha. Si las fotos tienen color, se muestran las del color elegido (más las
 * fotos sin color). Con varias vistas, una sola foto grande con flechas para cambiar de vista.
 */
export function ProductGallery({ product, badge }: { product: Product; badge?: ReactNode }) {
  const { colorId } = useSelectedColor(product);
  const forColor = product.images.filter((img) => img.colorId === colorId);
  const general = product.images.filter((img) => !img.colorId);
  const images = forColor.length ? [...forColor, ...general] : product.images;

  // La clave reinicia la vista en la primera foto al cambiar de color.
  return <PhotoViewer key={colorId} images={images} badge={badge} />;
}

/** Arrastre horizontal mínimo (px) para cambiar de foto con el dedo. */
const SWIPE_PX = 40;

function PhotoViewer({ images, badge }: { images: ProductImage[]; badge?: ReactNode }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const many = images.length > 1;
  const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length);

  const arrowClass =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-card backdrop-blur-sm transition-colors hover:bg-soft";

  return (
    <div
      role={many ? "group" : undefined}
      aria-roledescription={many ? "galería" : undefined}
      aria-label={many ? "Fotos del producto" : undefined}
      className={`relative aspect-square overflow-hidden rounded-3xl bg-soft shadow-card ${many ? "touch-pan-y" : ""}`}
      onPointerDown={(e) => {
        if (many && e.pointerType === "touch") touchStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (touchStart.current === null) return;
        const dx = e.clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? 1 : -1);
      }}
      onPointerCancel={() => (touchStart.current = null)}
    >
      {/* Todas las vistas quedan montadas para que el cambio sea inmediato. */}
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          preload={i === 0}
          loading={i === 0 ? undefined : "eager"}
          sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
          aria-hidden={i !== index || undefined}
          className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {badge}

      {many && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="Ver la foto anterior" className={`${arrowClass} left-3`}>
            <Icon name="chevron_left" className="text-[26px]" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Ver la foto siguiente" className={`${arrowClass} right-3`}>
            <Icon name="chevron_right" className="text-[26px]" />
          </button>
          <p
            aria-live="polite"
            className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-label-md font-semibold text-ink shadow-card"
          >
            <span className="sr-only">Foto </span>
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}
