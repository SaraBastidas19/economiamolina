import Link from "next/link";
import { Suspense } from "react";
import { business } from "@/config/business";
import { Icon } from "@/components/ui/icon";
import { MainNav, MobileMenu } from "@/components/layout/main-nav";
import { SearchForm } from "@/components/layout/search-form";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-[72px] md:px-8 lg:px-14">
        <MobileMenu />

        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${business.name}, ir al inicio`}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-container text-white">
            <Icon name="storefront" className="text-[20px]" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-title-md font-bold text-primary">{business.name}</span>
            <span className="hidden text-label-xs font-semibold uppercase tracking-wider text-secondary sm:block">
              Calzado · {business.city}
            </span>
          </span>
        </Link>

        <MainNav />

        <div className="ml-auto hidden w-full max-w-xs md:block">
          <Suspense>
            <SearchForm />
          </Suspense>
        </div>
        <Link
          href="/catalogo"
          className="ml-auto flex size-11 items-center justify-center rounded-full text-primary hover:bg-surface-warm md:hidden"
          aria-label="Buscar en el catálogo"
        >
          <Icon name="search" className="text-[24px]" />
        </Link>
      </div>
    </header>
  );
}
