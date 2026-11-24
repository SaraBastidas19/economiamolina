"use client";

import { useRouter } from "next/navigation";
import { useId, useOptimistic, useState, useTransition, type ReactNode } from "react";
import type { CatalogFacets } from "@/lib/catalog";
import { buildCatalogHref, type CatalogBase, type CatalogSelection } from "@/lib/catalog-filters";
import { formatCop } from "@/lib/format";
import { audiences, shoeTypes } from "@/lib/taxonomy";
import { Icon } from "@/components/ui/icon";

/**
 * Navega a la URL de una nueva selección. La selección se actualiza de forma
 * optimista para que las casillas respondan al instante.
 */
export function useCatalogNavigation(base: CatalogBase, selection: CatalogSelection) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setOptimistic] = useOptimistic(selection);

  function apply(next: CatalogSelection) {
    startTransition(() => {
      setOptimistic(next);
      router.push(buildCatalogHref(base, next), { scroll: false });
    });
  }

  return { selection: current, apply, pending };
}

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

interface FilterPanelProps {
  base: CatalogBase;
  selection: CatalogSelection;
  facets: CatalogFacets;
}

export function FilterPanel({ base, selection: initial, facets }: FilterPanelProps) {
  const { selection, apply, pending } = useCatalogNavigation(base, initial);
  const hasPrice = selection.precioMin !== undefined || selection.precioMax !== undefined;
  // Las tallas sin resultados se ocultan (hay muchas entre niños y adultos); las seleccionadas se mantienen.
  const sizes = facets.sizes.filter((s) => s.count > 0 || selection.talla.includes(s.size));

  return (
    <div aria-busy={pending} className={`transition-opacity ${pending ? "opacity-70" : ""}`}>
      <FilterSection title="Género" defaultOpen>
        <ul className="space-y-0.5">
          {audiences.map((a) => (
            <CheckboxOption
              key={a.slug}
              label={a.label}
              count={facets.audiences[a.value]}
              checked={selection.genero.includes(a.slug)}
              onChange={() => apply({ ...selection, genero: toggle(selection.genero, a.slug) })}
            />
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Tipo de calzado" defaultOpen>
        <ul className="space-y-0.5">
          {shoeTypes.map((t) => (
            <CheckboxOption
              key={t.slug}
              label={t.label}
              count={facets.types[t.value]}
              checked={selection.tipo.includes(t.slug)}
              onChange={() => apply({ ...selection, tipo: toggle(selection.tipo, t.slug) })}
            />
          ))}
        </ul>
      </FilterSection>

      {sizes.length > 0 && (
        <FilterSection title="Talla" defaultOpen={selection.talla.length > 0}>
          <ul className="grid grid-cols-5 gap-2" aria-label="Tallas (numeración colombiana)">
            {sizes.map(({ size, count }) => {
              const selected = selection.talla.includes(size);
              const disabled = count === 0 && !selected;
              return (
                <li key={size}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    disabled={disabled}
                    onClick={() => apply({ ...selection, talla: toggle(selection.talla, size).sort((a, b) => a - b) })}
                    className={`flex h-12 w-full flex-col items-center justify-center rounded-2xl border text-label-lg font-semibold transition-colors ${
                      selected
                        ? "border-brand bg-brand text-white"
                        : disabled
                          ? "cursor-not-allowed border-line bg-sand text-muted/50"
                          : "border-line bg-white text-ink hover:border-brand"
                    }`}
                  >
                    {size}
                    <span className={`text-label-xs font-medium ${selected ? "text-white/75" : "text-muted"}`}>
                      <span className="sr-only">, </span>
                      {count}
                      <span className="sr-only"> {count === 1 ? "producto" : "productos"}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="Precio" defaultOpen={hasPrice}>
        <PriceFilter
          key={`${selection.precioMin ?? ""}-${selection.precioMax ?? ""}`}
          min={selection.precioMin}
          max={selection.precioMax}
          onApply={(precioMin, precioMax) => apply({ ...selection, precioMin, precioMax })}
        />
      </FilterSection>

      {facets.colors.length > 0 && (
        <FilterSection title="Color" defaultOpen={selection.color.length > 0} last>
          <ul className="space-y-0.5">
            {facets.colors.map((c) => (
              <CheckboxOption
                key={c.id}
                label={c.name}
                count={c.count}
                swatch={c.hex}
                checked={selection.color.includes(c.id)}
                onChange={() => apply({ ...selection, color: toggle(selection.color, c.id) })}
              />
            ))}
          </ul>
        </FilterSection>
      )}
    </div>
  );
}

function FilterSection({
  title,
  defaultOpen = false,
  last = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  last?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={`py-4 ${last ? "" : "border-b border-line"}`}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-10 w-full items-center justify-between gap-2 rounded-2xl text-left text-title-sm font-bold text-ink"
        >
          {title}
          <Icon name="expand_more" className={`text-[22px] text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pt-2">
        {children}
      </div>
    </div>
  );
}

function CheckboxOption({
  label,
  count,
  checked,
  swatch,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  swatch?: string;
  onChange: () => void;
}) {
  const disabled = count === 0 && !checked;

  return (
    <li>
      <label
        className={`flex min-h-10 items-center gap-3 rounded-2xl px-2 text-body-md ${
          disabled ? "cursor-not-allowed text-muted/50" : "cursor-pointer text-ink hover:bg-sand"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="size-[18px] shrink-0 accent-brand"
        />
        {swatch && <span aria-hidden="true" className="size-4 shrink-0 rounded-full ring-1 ring-ink/15" style={{ backgroundColor: swatch }} />}
        <span className="flex-1">{label}</span>
        <span className="text-label-md text-muted">
          {count}
          <span className="sr-only"> {count === 1 ? "producto" : "productos"}</span>
        </span>
      </label>
    </li>
  );
}

function PriceFilter({
  min,
  max,
  onApply,
}: {
  min?: number;
  max?: number;
  onApply: (min?: number, max?: number) => void;
}) {
  const [from, setFrom] = useState(min?.toString() ?? "");
  const [to, setTo] = useState(max?.toString() ?? "");
  const id = useId();

  const parse = (v: string) => (/^\d{1,8}$/.test(v.trim()) ? Number(v.trim()) : undefined);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    let a = parse(from);
    let b = parse(to);
    if (a !== undefined && b !== undefined && a > b) [a, b] = [b, a];
    onApply(a, b);
  }

  const inputClass =
    "h-11 w-full rounded-2xl border border-line bg-white pl-7 pr-2 text-body-md text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ["min", "Mínimo", from, setFrom],
            ["max", "Máximo", to, setTo],
          ] as const
        ).map(([key, label, value, set]) => (
          <div key={key}>
            <label htmlFor={`${id}-${key}`} className="text-label-md font-semibold text-muted">
              {label}
            </label>
            <div className="relative mt-1">
              <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body-md text-muted">
                $
              </span>
              <input
                id={`${id}-${key}`}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={value}
                onChange={(e) => set(e.target.value.replace(/\D/g, ""))}
                placeholder={key === "min" ? "0" : "Sin límite"}
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-label-md text-muted" aria-live="polite">
        {min !== undefined || max !== undefined
          ? `Filtrando ${min !== undefined ? `desde ${formatCop(min)}` : ""}${min !== undefined && max !== undefined ? " " : ""}${max !== undefined ? `hasta ${formatCop(max)}` : ""}`
          : "Precios en pesos colombianos."}
      </p>
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-btn bg-brand px-4 text-label-lg font-semibold text-white hover:bg-brand-hover"
        >
          Aplicar
        </button>
        {(min !== undefined || max !== undefined) && (
          <button
            type="button"
            onClick={() => onApply(undefined, undefined)}
            className="inline-flex min-h-10 items-center justify-center rounded-btn border border-line px-4 text-label-lg font-semibold text-ink hover:bg-sand"
          >
            Quitar
          </button>
        )}
      </div>
    </form>
  );
}
