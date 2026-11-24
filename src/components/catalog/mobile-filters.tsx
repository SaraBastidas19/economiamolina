"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CatalogFacets } from "@/lib/catalog";
import { activeFilterCount, clearedSelection, type CatalogBase, type CatalogSelection } from "@/lib/catalog-filters";
import { Icon } from "@/components/ui/icon";
import { FilterPanel, useCatalogNavigation } from "@/components/catalog/filter-panel";
import { SortSelect } from "@/components/catalog/sort-select";

interface MobileFiltersProps {
  base: CatalogBase;
  selection: CatalogSelection;
  facets: CatalogFacets;
  total: number;
}

/** Barra "Filtrar / Ordenar" y panel inferior de filtros para pantallas pequeñas. */
export function MobileFilters({ base, selection, facets, total }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { apply, pending } = useCatalogNavigation(base, selection);
  const titleId = useId();
  const count = activeFilterCount(selection);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <div className="lg:hidden">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-btn border border-line bg-white text-label-lg font-semibold text-ink"
        >
          <Icon name="tune" className="text-[20px]" />
          Filtrar
          {count > 0 && (
            <span className="flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-label-xs font-bold text-on-dark">
              {count}
              <span className="sr-only"> {count === 1 ? "filtro activo" : "filtros activos"}</span>
            </span>
          )}
        </button>
        <SortSelect base={base} selection={selection} variant="compact" />
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
        className="m-0 mt-auto max-h-[88dvh] w-full max-w-none animate-sheet-up overflow-hidden rounded-t-3xl bg-background p-0 shadow-modal backdrop:bg-ink/40"
      >
        <div className="flex max-h-[88dvh] flex-col">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 id={titleId} className="font-display text-title-md font-bold text-ink">
              Filtrar
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-11 items-center justify-center rounded-full text-ink hover:bg-soft"
              aria-label="Cerrar filtros"
            >
              <Icon name="close" className="text-[24px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            <FilterPanel base={base} selection={selection} facets={facets} />
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-line bg-white px-4 py-3">
            <button
              type="button"
              onClick={() => apply(clearedSelection(selection))}
              disabled={count === 0 && !selection.q}
              className="inline-flex min-h-12 items-center justify-center rounded-btn border border-line px-5 text-label-lg font-semibold text-ink disabled:text-muted/50"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-btn bg-primary px-5 text-title-sm font-semibold text-on-dark hover:bg-primary-hover"
            >
              <span aria-live="polite">
                {pending ? "Actualizando…" : `Ver ${total} ${total === 1 ? "resultado" : "resultados"}`}
              </span>
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
