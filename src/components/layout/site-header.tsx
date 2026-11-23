import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { business } from "@/config/business";
import { Icon } from "@/components/ui/icon";
import { MainNav, MobileMenu } from "@/components/layout/main-nav";
import { SearchForm } from "@/components/layout/search-form";
import { CartLink } from "@/components/layout/cart-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-[72px] md:px-8 lg:px-14">
        <MobileMenu />

        <Link href="/" className="flex shrink-0 items-center" aria-label={`${business.name}, ir al inicio`}>
          {business.logo ? (
            <Image
              src={business.logo.src}
              alt={business.name}
              width={business.logo.width}
              height={business.logo.height}
              preload
              className="h-11 w-auto md:h-14"
            />
          ) : (
            <span className="leading-none">
              <span className="block text-label-xs font-bold uppercase tracking-[0.18em] text-accent-text">Economía</span>
              <span className="mt-0.5 block font-display text-title-md font-bold text-ink md:text-headline-sm">Molina Muñoz</span>
            </span>
          )}
        </Link>

        <MainNav />

        <div className="ml-auto hidden w-full max-w-xs md:block">
          <Suspense>
            <SearchForm />
          </Suspense>
        </div>
        <Link
          href="/catalogo"
          className="ml-auto flex size-11 items-center justify-center rounded-full text-ink hover:bg-sand md:hidden"
          aria-label="Buscar en el catálogo"
        >
          <Icon name="search" className="text-[24px]" />
        </Link>
        <CartLink />
      </div>
    </header>
  );
}
