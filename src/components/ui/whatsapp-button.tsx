import { Icon } from "@/components/ui/icon";
import { whatsappUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  message: string;
  label: string;
  variant?: "solid" | "soft" | "light" | "outline-dark";
  size?: "md" | "lg";
  className?: string;
}

const variants = {
  solid: "bg-brand text-white hover:bg-brand-hover",
  soft: "bg-white text-brand ring-1 ring-brand/30 hover:bg-blush",
  light: "bg-white text-deep hover:bg-blush",
  "outline-dark": "border-2 border-accent bg-ink/25 text-white backdrop-blur-sm hover:bg-white/10",
};

const sizes = {
  md: "min-h-11 px-4 text-label-lg",
  lg: "min-h-12 px-6 text-title-sm",
};

/**
 * Botón de conversación por WhatsApp. Mientras el número no esté configurado
 * (NEXT_PUBLIC_WHATSAPP_NUMBER) se muestra deshabilitado y lo indica.
 */
export function WhatsAppButton({ message, label, variant = "solid", size = "md", className = "" }: WhatsAppButtonProps) {
  const href = whatsappUrl(message);
  const base = `inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors ${sizes[size]} ${className}`;

  if (!href) {
    return (
      <button
        type="button"
        disabled
        title="El número de WhatsApp aún no está configurado"
        className={`${base} cursor-not-allowed bg-sand text-muted ring-1 ring-line`}
      >
        <Icon name="chat" className="text-[20px]" />
        <span>
          {label}
          <span className="sr-only"> (no disponible todavía)</span>
        </span>
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${variants[variant]}`}>
      <Icon name="chat" className="text-[20px]" />
      <span>{label}</span>
    </a>
  );
}
