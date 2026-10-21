/**
 * Íconos de Material Symbols, como en el diseño de Stitch. Solo se descarga
 * el subconjunto listado aquí: al usar un ícono nuevo, agrégalo a ICON_NAMES.
 */
export const ICON_NAMES = [
  "arrow_back",
  "arrow_forward",
  "call",
  "chat",
  "check",
  "chevron_right",
  "close",
  "expand_more",
  "info",
  "local_shipping",
  "location_on",
  "menu",
  "payments",
  "schedule",
  "search",
  "search_off",
  "storefront",
  "straighten",
  "support_agent",
  "sync_alt",
  "verified",
  "workspace_premium",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const iconFontUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&icon_names=${[...ICON_NAMES].sort().join(",")}&display=block`;

interface IconProps {
  name: IconName;
  className?: string;
  filled?: boolean;
}

export function Icon({ name, className = "", filled = false }: IconProps) {
  return (
    <span aria-hidden="true" className={`icon ${filled ? "icon-filled" : ""} ${className}`}>
      {name}
    </span>
  );
}
