import { Icon } from "@/components/ui/icon";
import { whatsappUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  message: string;
  label: string;
  variant?: "solid" | "soft";
  size?: "md" | "lg";
  className?: string;
}

const variants = {
  solid: "bg-whatsapp-vibrant text-navy-deep hover:bg-[#1fbe5b]",
  soft: "bg-white text-whatsapp-text ring-1 ring-whatsapp-dark/30 hover:bg-whatsapp-vibrant/10",
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
        className={`${base} cursor-not-allowed bg-surface-warm text-on-surface-variant ring-1 ring-border-warm`}
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
