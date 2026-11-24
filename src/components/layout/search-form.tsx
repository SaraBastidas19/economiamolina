"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export function SearchForm({ id = "busqueda" }: { id?: string }) {
  const query = useSearchParams().get("q") ?? "";

  return (
    <Form action="/catalogo" role="search" className="relative">
      <label htmlFor={id} className="sr-only">
        Buscar calzado
      </label>
      <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-muted" />
      <input
        key={query}
        id={id}
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Buscar tenis, botas, escolar…"
        maxLength={80}
        className="h-11 w-full rounded-full border border-line bg-background pl-10 pr-4 text-body-md text-ink placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </Form>
  );
}
