# Branding: Economía Molina Muñoz

Fuente: indicaciones de la propietaria (noviembre de 2026). Respetarlo en todo el diseño.

- **Marca:** Economía Molina Muñoz, fábrica y tienda de calzado familiar en Pasto, Nariño, con más de 25 años.
- **Eslogan:** "Calzado para toda la familia". **Promesa:** calidad al mejor precio.
- **Estilo:** cálido, cercano y familiar; elegante pero accesible.

## Colores (tokens en `src/app/globals.css`)

Paleta ónix, carbón, bronce y champaña (24 de noviembre de 2026). Reemplaza la paleta vino y rosa palo
anterior: negro ónix `#000000`, carbón `#2D2D2D`, bronce `#A67C52`, champaña dorado `#D9C5A0` y
champaña claro `#E5DFD0`.

| Uso | Color | Token |
|---|---|---|
| Botones principales y elementos activos (filtros, tallas, casillas) | `#000000` (hover `#2D2D2D`) | `primary`, `primary-hover` |
| Texto sobre botones y bloques oscuros | `#E5DFD0` | `on-dark` |
| Bloques oscuros (footer, promociones, CTA final) | `#000000` | `dark` |
| Acentos, íconos y líneas decorativas | `#A67C52` | `accent` |
| Palabra clave de los títulos sobre fondo claro | `#946B42` | `accent-strong` |
| Texto en bronce (letra pequeña) | `#7A5733` | `accent-text` |
| Badges "Nuevo", filtros activos y destacados (texto `#2D2D2D`) | `#D9C5A0` | `highlight` |
| Secciones alternas y fondos suaves | `#E5DFD0` | `soft` |
| Fondo general | `#F7F4EC` | `background` |
| Tarjetas | `#FFFFFF` | `white` |
| Bordes | `#DFD2B8` | `line` |
| Títulos grandes | `#000000` | `heading` |
| Texto principal | `#2D2D2D` | `ink` |
| Texto secundario | `#5C5650` | `muted` |

`accent-strong`, `accent-text`, `background`, `line` y `muted` son tonos derivados de la paleta (más
claros u oscuros) para cumplir el contraste mínimo de lectura (WCAG AA). Los colores de WhatsApp y de
error no forman parte de la paleta y no se cambian.

## Tipografía y forma

- Onest en todo el sitio; titulares en negrita grande con una palabra clave en bronce
  (prop `highlight` de `SectionHeading`).
- Bordes muy redondeados (24 px → `rounded-3xl`), botones en forma de píldora, sombras suaves.
- Fotos de producto cálidas sobre fondos neutros.
- Logo "Emmz Economía Molina Muñoz" en la esquina superior izquierda (`public/brand/`).
