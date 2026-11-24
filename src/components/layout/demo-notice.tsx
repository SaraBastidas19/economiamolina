import { Icon } from "@/components/ui/icon";

/** Aviso visible mientras el catálogo y los datos del negocio sean de demostración. */
export function DemoNotice() {
  return (
    <div className="bg-dark text-on-dark">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-label-md font-medium">
        <Icon name="info" className="text-[16px] text-accent" />
        Tienda en preparación: productos, precios e imágenes son de demostración.
      </p>
    </div>
  );
}
