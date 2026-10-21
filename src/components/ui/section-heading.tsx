import Link from "next/link";
import { Icon } from "@/components/ui/icon";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  action?: { href: string; label: string };
  tone?: "light" | "dark";
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, description, id, action, tone = "light", align = "left" }: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div
      className={`mb-6 flex flex-col gap-3 md:mb-8 ${
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        <p className={`text-label-xs font-bold uppercase tracking-wider ${dark ? "text-heritage-gold" : "text-secondary"}`}>
          {eyebrow}
        </p>
        <h2
          id={id}
          className={`mt-1 font-display text-headline-lg-mobile font-bold tracking-tight md:text-headline-lg ${
            dark ? "text-white" : "text-primary"
          }`}
        >
          {title}
        </h2>
        {description && <p className={`mt-2 text-body-md ${dark ? "text-white/75" : "text-on-surface-variant"}`}>{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`inline-flex shrink-0 items-center gap-1 text-label-lg font-semibold underline-offset-4 hover:underline ${
            dark ? "text-white" : "text-primary-container"
          }`}
        >
          {action.label}
          <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      )}
    </div>
  );
}
