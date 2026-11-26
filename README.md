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

## Publicar (GitHub + Vercel)

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) entra con tu cuenta de GitHub → **Add New… → Project** → importa el repositorio.
   Vercel detecta Next.js; no cambies los comandos de compilación.
3. En **Settings → Environment Variables** agrega:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: número que recibe los pedidos (p. ej. `573001234567`).
   - `NEXT_PUBLIC_SITE_URL`: la URL que asigne Vercel (p. ej. `https://tu-proyecto.vercel.app`).
   - `SITE_INDEXABLE`: déjala en `false` mientras el catálogo sea de demostración.
4. Cada `git push` a la rama principal publica una nueva versión. Si cambias variables de entorno,
   vuelve a desplegar (**Deployments → Redeploy**), porque las `NEXT_PUBLIC_*` se fijan al compilar.

GitHub Pages no sirve para esta tienda: solo publica archivos estáticos y la tienda necesita
el servidor para validar precios e inventario del pedido (`/api/pedido`).

## Marca, logo e imágenes

- **Guía de marca:** [design/BRANDING.md](design/BRANDING.md). Los colores están en `src/app/globals.css` (`@theme`).
- **Logo:** guarda el archivo en `public/brand/` (por ejemplo `logo.png` o `logo.svg`, fondo transparente)
  y completa `logo` en `src/config/business.ts` con su ruta y tamaño en píxeles.
- **Fotos de productos:** una carpeta por modelo en `public/productos/`, con el nombre del zapato en
  minúsculas y con guiones (el mismo que su dirección en la tienda), y una foto por color con el nombre
  del color: `public/productos/colegial-vena/negro.jpg`, `azul.jpg`… Cada modelo distinto va en su
  propia carpeta, aunque se parezca a otro. Una familia de modelos parecidos puede agruparse con una
  subcarpeta por modelo: `public/productos/colegial-blanco/retro/blanco.jpg`.
  En la ficha, al elegir un color se muestra su foto.
  Recomendado: cuadradas (1:1), mínimo 1200 × 1200 px, JPG de unos 200 KB, fondo neutro y luz cálida,
  nombres en minúsculas, sin espacios ni tildes. Las fotos de demostración están en `public/demo/`.
- **Productos reales:** se registran en `src/data/products.ts` (referencia, precios por rango de tallas,
  colores, secciones). Los de demostración están en `src/data/demo-products.ts`.

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
