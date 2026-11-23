import Link from "next/link";
import { Icon } from "@/components/ui/icon";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Palabra o frase del título que se resalta en rosa palo. */
  highlight?: string;
  description?: string;
  id?: string;
  action?: { href: string; label: string };
  tone?: "light" | "dark";
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, highlight, description, id, action, tone = "light", align = "left" }: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div
      className={`mb-6 flex flex-col gap-3 md:mb-8 ${
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        <p className={`text-label-xs font-bold uppercase tracking-wider ${dark ? "text-accent-soft" : "text-accent-text"}`}>
          {eyebrow}
        </p>
        <h2
          id={id}
          className={`mt-1 font-display text-headline-lg-mobile font-bold tracking-tight md:text-headline-lg ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          <HighlightedText text={title} highlight={highlight} className={dark ? "text-accent-soft" : "text-accent"} />
        </h2>
        {description && <p className={`mt-2 text-body-md ${dark ? "text-white/75" : "text-muted"}`}>{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`inline-flex shrink-0 items-center gap-1 text-label-lg font-semibold underline-offset-4 hover:underline ${
            dark ? "text-white" : "text-brand"
          }`}
        >
          {action.label}
          <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      )}
    </div>
  );
}

/** Muestra el texto con la palabra clave en el color indicado. */
export function HighlightedText({ text, highlight, className }: { text: string; highlight?: string; className: string }) {
  const index = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span className={className}>{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}
