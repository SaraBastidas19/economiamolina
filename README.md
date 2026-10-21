# Tienda de calzado · Pasto, Nariño

Tienda online de calzado para mujer, hombre, niños y niñas. Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind CSS 4.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev                  # http://localhost:3000
npm run build && npm start   # versión de producción
npm run lint
```

## Estructura

| Ruta | Contenido |
|---|---|
| `design/` | Exportación original de Google Stitch (referencia, no se modifica) |
| `src/app/` | Páginas: inicio, `/catalogo`, `/catalogo/[público]/[tipo]`, `/producto/[slug]` |
| `src/components/` | Componentes de layout, inicio, catálogo, producto y UI |
| `src/config/business.ts` | Datos del negocio (los pendientes están en `null`) |
| `src/data/demo-products.ts` | Catálogo de **demostración** |
| `src/lib/catalog.ts` | Acceso al catálogo (se reemplazará por la base de datos) |
| `public/demo/` | Fotografías de demostración (StockSnap, CC0) |

## Estado

- Productos, precios, inventario e imágenes son de demostración.
- Datos pendientes del negocio: número de WhatsApp, dirección, horario y políticas de cambios, domicilios y pagos.
  Mientras falte el número, los botones de WhatsApp aparecen deshabilitados.
- El sitio no se indexa en buscadores hasta definir `SITE_INDEXABLE=true`.
