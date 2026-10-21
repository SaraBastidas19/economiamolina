"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

export const navLinks = [
  { href: "/catalogo/mujer", label: "Mujer" },
  { href: "/catalogo/hombre", label: "Hombre" },
  { href: "/catalogo/ninos", label: "Niños" },
  { href: "/catalogo/ninas", label: "Niñas" },
  { href: "/catalogo/novedades", label: "Novedades" },
  { href: "/catalogo/promociones", label: "Promociones" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {navLinks.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-label-lg font-semibold transition-colors ${
                  active ? "bg-surface-warm text-primary" : "text-on-surface-variant hover:bg-surface-warm hover:text-primary"
                } ${link.href.endsWith("promociones") ? "text-alert-terracotta" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="-ml-2 flex size-11 items-center justify-center rounded-full text-primary hover:bg-surface-warm lg:hidden"
        aria-label="Abrir menú"
        aria-haspopup="dialog"
      >
        <Icon name="menu" className="text-[26px]" />
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
        aria-label="Menú"
        className="m-0 h-dvh max-h-none w-[min(85vw,340px)] max-w-none bg-white p-0 shadow-modal backdrop:bg-navy-deep/40 lg:hidden"
      >
        <div className="flex h-16 items-center justify-between border-b border-border-soft px-4">
          <span className="font-display text-title-md font-bold text-primary">Menú</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-11 items-center justify-center rounded-full text-primary hover:bg-surface-warm"
            aria-label="Cerrar menú"
          >
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>
        <nav aria-label="Principal (móvil)" className="p-2">
          <ul>
            {[{ href: "/", label: "Inicio" }, { href: "/catalogo", label: "Todo el catálogo" }, ...navLinks].map((link) => {
              const active = link.href === "/" ? pathname === "/" : isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center justify-between rounded-lg px-3 text-title-sm ${
                      active ? "bg-surface-warm text-primary" : "text-text-primary hover:bg-surface-warm"
                    }`}
                  >
                    {link.label}
                    <Icon name="chevron_right" className="text-[20px] text-outline" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
