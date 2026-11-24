"use client";

import { useId } from "react";
import type { SortKey } from "@/lib/catalog";
import { SORT_OPTIONS, type CatalogBase, type CatalogSelection } from "@/lib/catalog-filters";
import { Icon } from "@/components/ui/icon";
import { useCatalogNavigation } from "@/components/catalog/filter-panel";

interface SortSelectProps {
  base: CatalogBase;
  selection: CatalogSelection;
  /** "compact" es el botón "Ordenar" de la barra móvil. */
  variant?: "default" | "compact";
}

export function SortSelect({ base, selection: initial, variant = "default" }: SortSelectProps) {
  const { selection, apply } = useCatalogNavigation(base, initial);
  const id = useId();
  const compact = variant === "compact";

  return (
    <div className={compact ? "relative flex-1" : "flex items-center gap-2"}>
      <label htmlFor={id} className={compact ? "sr-only" : "whitespace-nowrap text-label-lg font-semibold text-muted"}>
        Ordenar por
      </label>
      <div className="relative w-full">
        {compact && (
          <Icon name="swap_vert" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-ink" />
        )}
        <select
          id={id}
          value={selection.orden}
          onChange={(e) => apply({ ...selection, orden: e.target.value as SortKey })}
          className={`w-full cursor-pointer appearance-none rounded-btn border border-line bg-white text-label-lg font-semibold text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 ${
            compact ? "h-11 pl-11 pr-9" : "h-10 pl-4 pr-9"
          }`}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-muted" />
      </div>
    </div>
  );
}
