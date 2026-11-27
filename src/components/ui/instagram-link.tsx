/** Usuario de Instagram a partir de la URL del perfil: "https://www.instagram.com/tienda/" → "tienda". */
export function instagramHandle(url: string): string {
  return new URL(url).pathname.split("/").filter(Boolean)[0] ?? url;
}

/** Ícono de Instagram (los íconos de Material Symbols no incluyen logos de redes sociales). */
export function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Enlace al perfil de Instagram de la tienda; se abre en una pestaña nueva. */
export function InstagramLink({ url, className = "" }: { url: string; className?: string }) {
  const handle = instagramHandle(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center gap-2 ${className}`}
    >
      <InstagramIcon className="size-5 shrink-0" />
      <span>@{handle}</span>
      <span className="sr-only"> en Instagram (se abre en una pestaña nueva)</span>
    </a>
  );
}
