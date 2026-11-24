"use client";

import Link from "next/link";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-headline-lg-mobile font-bold text-heading">Algo salió mal</h1>
      <p className="mt-2 text-body-md text-muted">
        No pudimos cargar esta página. Intenta de nuevo en unos segundos.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-11 items-center rounded-btn bg-primary px-5 text-label-lg font-semibold text-on-dark hover:bg-primary-hover"
        >
          Reintentar
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-btn bg-soft px-5 text-label-lg font-semibold text-ink">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
