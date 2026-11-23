# Branding: Economía Molina Muñoz

Fuente: indicaciones de la propietaria (noviembre de 2026). Respetarlo en todo el diseño.

- **Marca:** Economía Molina Muñoz, fábrica y tienda de calzado familiar en Pasto, Nariño, con más de 25 años.
- **Eslogan:** "Calzado para toda la familia". **Promesa:** calidad al mejor precio.
- **Estilo:** cálido, cercano y familiar; elegante pero accesible.

## Colores (tokens en `src/app/globals.css`)

Paleta vino y rosa palo elegida por la propietaria (23 de noviembre de 2026), tomada de los colores
visibles de su imagen de referencia. Los códigos escritos en esa imagen no coincidían con las franjas
y se descartaron por decisión suya. Reemplaza la paleta terracota/dorado anterior.

| Uso | Color | Token |
|---|---|---|
| Botones y llamados a la acción | `#50181B` (hover `#320B0E`) | `brand`, `brand-hover` |
| Bloques oscuros (footer, promociones, CTA final) | `#320B0E` | `deep` |
| Acentos, íconos y palabra clave de los títulos | `#8F5853` | `accent` |
| Texto en rosa palo (letra pequeña) | `#7A4842` | `accent-text` |
| Beige rosado | `#CFB2A2` | `beige` |
| Fondo de badges y destacados | `#ECDCD3` | `blush`, `accent-soft` |
| Secciones alternas | `#F0E3DB` | `sand` |
| Fondo general | `#F7F1ED` | `cream` |
| Tarjetas | `#FFFFFF` | `white` |
| Bordes | `#E6D6CC` | `line` |
| Texto principal | `#241E1A` | `ink` |
| Texto secundario | `#6F6761` | `muted` |

`accent-text`, `accent-soft`, `cream` y `line` son tonos derivados de la paleta (más claros u oscuros)
para cumplir el contraste mínimo de lectura (WCAG AA).

## Tipografía y forma

- Onest en todo el sitio; titulares en negrita grande con una palabra clave en rosa palo
  (prop `highlight` de `SectionHeading`).
- Bordes muy redondeados (24 px → `rounded-3xl`), botones en forma de píldora, sombras suaves.
- Fotos de producto cálidas sobre fondos neutros.
- Logo "Emmz Economía Molina Muñoz" en la esquina superior izquierda (`public/brand/`).
