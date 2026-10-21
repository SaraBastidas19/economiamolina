import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <Icon name="search_off" className="text-[48px] text-outline" />
      <h1 className="mt-4 font-display text-headline-lg-mobile font-bold text-primary">No encontramos esta página</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        Es posible que el producto ya no esté disponible o que el enlace haya cambiado.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className="inline-flex min-h-11 items-center rounded-btn bg-primary-container px-5 text-label-lg font-semibold text-white hover:bg-navy-deep">
          Ver catálogo
        </Link>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-btn bg-surface-warm px-5 text-label-lg font-semibold text-primary hover:bg-border-soft">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
