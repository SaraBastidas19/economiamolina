"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

interface ProductMarqueeProps {
  /** Tarjetas de la pista completa: dos mitades idénticas, una detrás de otra. */
  items: ReactNode[];
  /** Cuántas tarjetas del inicio son reales; el resto son copias del loop (ocultas al teclado y lectores). */
  uniqueCount: number;
  /** Nombre accesible de la región, p. ej. "Productos recién llegados". */
  label: string;
  /** Enlace que va encima de la cinta (p. ej. "Ver todos…"). */
  action?: ReactNode;
}

/** Segundos que tarda cada tarjeta en recorrer su ancho: marca la velocidad de la cinta. */
const SECONDS_PER_ITEM = 5;
/** Tras soltar el dedo o pulsar una flecha, la cinta espera esto antes de volver a moverse. */
const RESUME_DELAY_MS = 3000;
/** Desplazamiento mínimo para considerar que el toque fue un arrastre y no un clic. */
const DRAG_THRESHOLD_PX = 6;
/** Duración del paso de una tarjeta al pulsar una flecha. */
const STEP_MS = 450;

const wrap = (time: number, duration: number) => ((time % duration) + duration) % duration;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Cinta de productos que avanza sola hacia la izquierda, con flechas a cada lado.
 *
 * El movimiento es una animación CSS de `transform` (corre en el compositor, no se
 * traba en celulares). JavaScript solo la pausa/reanuda y, al arrastrar con el dedo o
 * pulsar una flecha, ajusta su `currentTime`. Con "reducir movimiento" la animación se
 * apaga y queda una fila quieta con scroll horizontal; las flechas la desplazan.
 */
export function ProductMarquee({ items, uniqueCount, label, action }: ProductMarqueeProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; time: number; moved: boolean } | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const step = useRef<{ frame: number; target: number } | null>(null);

  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  /** Pausa temporal tras tocar la cinta o pulsar una flecha. */
  const [holding, setHolding] = useState(false);

  const paused = hovering || focused || holding;

  const animation = () => trackRef.current?.getAnimations()[0];

  useEffect(() => {
    const anim = animation();
    if (!anim || step.current) return; // sin animación ("reducir movimiento") o en medio de un paso
    if (paused) anim.pause();
    else anim.play();
  }, [paused]);

  useEffect(
    () => () => {
      clearTimeout(resumeTimer.current);
      if (step.current) cancelAnimationFrame(step.current.frame);
    },
    [],
  );

  const loopDuration = () => {
    const d = animation()?.effect?.getTiming().duration;
    return typeof d === "number" ? d : 0;
  };

  function hold() {
    clearTimeout(resumeTimer.current);
    setHolding(true);
  }

  function releaseLater() {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      drag.current = null;
      setHolding(false);
    }, RESUME_DELAY_MS);
  }

  /** Avanza (1) o retrocede (-1) una tarjeta y la deja alineada al borde izquierdo. */
  function move(dir: 1 | -1) {
    const region = regionRef.current;
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!region || !track || !card) return;
    const cardWidth = card.offsetWidth;

    const anim = animation();
    if (!anim) {
      // "Reducir movimiento": fila quieta con scroll, sin desplazamiento suave.
      region.scrollBy({ left: dir * cardWidth, behavior: "auto" });
      return;
    }

    const duration = loopDuration();
    const halfWidth = track.scrollWidth / 2;
    if (!duration || !halfWidth) return;
    const timePerPx = duration / halfWidth;

    hold();
    anim.pause();

    // Pulsaciones seguidas suman pasos a partir del destino anterior.
    const from = Number(anim.currentTime ?? 0);
    const base = step.current ? step.current.target : from;
    const baseCard = Math.round(base / timePerPx / cardWidth);
    const target = (baseCard + dir) * cardWidth * timePerPx;
    // Recorrido más corto (puede cruzar el inicio del loop sin notarse).
    const startUnwrapped = Math.abs(target - from) > duration / 2 ? from + Math.sign(target - from) * duration : from;

    if (step.current) cancelAnimationFrame(step.current.frame);
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / STEP_MS);
      anim.currentTime = wrap(startUnwrapped + (target - startUnwrapped) * easeOutCubic(p), duration);
      if (p < 1) step.current = { frame: requestAnimationFrame(tick), target };
      else step.current = null;
    };
    step.current = { frame: requestAnimationFrame(tick), target };
    releaseLater();
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType !== "touch") return;
    const anim = animation();
    if (!anim) return;
    if (step.current) {
      cancelAnimationFrame(step.current.frame);
      step.current = null;
    }
    hold();
    anim.pause();
    drag.current = { x: e.clientX, time: Number(anim.currentTime ?? 0), moved: false };
  }

  function onPointerMove(e: React.PointerEvent) {
    const start = drag.current;
    const anim = animation();
    const track = trackRef.current;
    if (!start || !anim || !track) return;

    const dx = e.clientX - start.x;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX) start.moved = true;

    const duration = loopDuration();
    const halfWidth = track.scrollWidth / 2;
    if (!duration || !halfWidth) return;
    // Arrastrar a la derecha retrocede la cinta; se envuelve para que el loop no tenga fin.
    anim.currentTime = wrap(start.time - (dx / halfWidth) * duration, duration);
  }

  function onPointerEnd(e: React.PointerEvent) {
    if (e.pointerType !== "touch") return;
    const moved = drag.current?.moved ?? false;
    drag.current = moved ? { x: 0, time: 0, moved: true } : null;
    releaseLater();
  }

  /**
   * Con teclado, el navegador desplazaría el contenedor para mostrar la tarjeta enfocada y la
   * cinta quedaría corrida (con huecos al final). En su lugar se deja el contenedor en 0 y se
   * lleva la animación hasta esa tarjeta. Solo con foco visible: un clic con mouse no debe
   * mover la tarjeta que está bajo el cursor. El foco de teclado en las flechas solo pausa.
   */
  function onFocus(e: React.FocusEvent) {
    const target = e.target as HTMLElement;
    // Solo pausa el foco de teclado: el foco que deja un clic o un toque en una flecha
    // no debe dejar la cinta detenida.
    setFocused(target.matches(":focus-visible"));
    const li = target.closest("li");
    const region = regionRef.current;
    const track = trackRef.current;
    if (!li || !region || !track || !animation() || !target.matches(":focus-visible")) return;

    const align = () => {
      const anim = animation();
      const duration = loopDuration();
      const halfWidth = track.scrollWidth / 2;
      region.scrollLeft = 0;
      if (!anim || !duration || !halfWidth) return;
      const x = Math.max(0, li.offsetLeft - 24); // margen para que el degradado no tape la tarjeta
      anim.currentTime = ((x / halfWidth) * duration) % duration;
    };
    align();
    requestAnimationFrame(align);
  }

  // Un arrastre no debe abrir la ficha del producto que quedó bajo el dedo.
  function onClickCapture(e: React.MouseEvent) {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current = null;
    }
  }

  const arrowClass =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-card backdrop-blur-sm transition-colors hover:bg-soft";

  return (
    <div>
      {action && <div className="mb-5 flex min-h-11 items-center">{action}</div>}

      <div
        className="relative"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
        onFocus={onFocus}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        <div
          ref={regionRef}
          role="region"
          aria-label={label}
          // pan-y: el dedo mueve la cinta en horizontal sin bloquear el scroll vertical de la página.
          // Con "reducir movimiento" vuelve el gesto normal para el scroll horizontal manual.
          className="relative -my-3 touch-pan-y overflow-hidden py-3 motion-reduce:touch-auto motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onClickCapture={onClickCapture}
        >
          <ul
            ref={trackRef}
            className="flex w-max animate-marquee will-change-transform motion-reduce:animate-none"
            style={{ ["--marquee-duration" as string]: `${(items.length / 2) * SECONDS_PER_ITEM}s` }}
          >
            {items.map((item, i) => {
              // Las copias se ven y se pueden pulsar (la cinta las muestra la mitad del tiempo),
              // pero los lectores de pantalla y el teclado solo recorren los productos reales.
              const clone = i >= uniqueCount;
              return (
                <li
                  key={i}
                  aria-hidden={clone || undefined}
                  className={`flex w-[calc((100vw-2rem)/1.5)] shrink-0 snap-start pr-3 sm:w-[calc((100vw-2rem)/2.5)] md:w-[calc((100vw-4rem)/3.3)] md:pr-4 lg:w-[284px] ${
                    clone ? "motion-reduce:hidden" : ""
                  }`}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Degradados del color de fondo: los productos aparecen y desaparecen suavemente. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent md:w-16" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent md:w-16" />

        <button type="button" onClick={() => move(-1)} aria-label="Ver productos anteriores" className={`${arrowClass} left-1 md:left-2`}>
          <Icon name="chevron_left" className="text-[26px]" />
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Ver más productos" className={`${arrowClass} right-1 md:right-2`}>
          <Icon name="chevron_right" className="text-[26px]" />
        </button>
      </div>
    </div>
  );
}
