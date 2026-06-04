# Responsive Mobile — iPhone & iPad Design Spec
**Date:** 2026-06-04
**Project:** neptum-dash
**Status:** Approved

---

## Contexto

El dashboard actualmente tiene estructura responsive básica (breakpoint `md:` en 768px para cambiar de 1 a 2 columnas), un NavSheet bottom drawer para mobile y PanelHeader con hamburger. La experiencia en iPhone y iPad no está optimizada: los widgets se apilan verticalmente en mobile sin jerarquía clara, y en iPad no aprovecha el espacio disponible con una navegación adecuada.

**Objetivo:** Implementar una experiencia native-quality para iPhone (pantallas deslizables) y iPad (sidebar fijo), reutilizando todos los widgets existentes y reorganizando el layout por breakpoint.

---

## Breakpoints

| Dispositivo | Breakpoint | Resolución típica |
|-------------|-----------|-------------------|
| iPhone | `< 768px` | 390×844, 430×932 |
| iPad | `768px – 1279px` | 768×1024, 820×1180, 1024×1366 |
| Desktop | `≥ 1280px` | 1440px+ (layout actual sin cambios) |

---

## iPhone — Pantallas deslizables (< 768px)

### Concepto

5 "cards" horizontales que se navegan con swipe gesture. Cada card ocupa el 100% del viewport. El header siempre muestra el nombre de la sección activa y los dots de navegación.

### Header mobile
```
┌─────────────────────────────┐
│ ⚡ neptumstudio    ●○○○○  A│
└─────────────────────────────┘
```
- Logo + nombre del proyecto a la izquierda
- Dots de navegación (5) en el centro — dot activo = rojo (`var(--acc)`)
- Avatar/iniciales a la derecha
- Altura: `60px`
- Sin hamburger menu (eliminado — reemplazado por el swipe)

### Secciones

**1 — Hoy** (primera card, index 0)
- Agenda del día: lista de eventos de `useEventos` filtrada por fecha actual
- Pendientes: primeros 3-4 items de `usePendientes` con checkbox
- Indicador de fecha en encabezado de la card

**2 — Negocio** (index 1)
- Row 2 cols: Balance del mes + Pipeline count
- Lista de proyectos activos con nombre y progress bar (max 4)

**3 — Ideas** (index 2)
- Lista de ideas capturadas de `useIdeas` con tag de color por tipo (IDEA/MEJORA/OPORTUNIDAD/TAREA)
- Máximo 8 ideas, scroll vertical si hay más

**4 — Clientes** (index 3)
- Cotizaciones recientes (últimas 3) de `useCotizaciones`
- Contactos recientes (últimos 3) de `useContacts`

**5 — Stats** (index 4)
- Widget de Instagram (seguidores, publicaciones, alcance)
- Balance del mes detallado

### Gestures y transición
- **Swipe horizontal** nativo via `overflow-x: scroll` con `scroll-snap-type: x mandatory` en el contenedor
- Cada sección: `scroll-snap-align: start`, `width: 100vw`
- Sin animación custom — el scroll snap del browser es suficiente
- Los dots se actualizan via `IntersectionObserver`

### FAB — Suéltalo
- Botón circular `+` de 52px, color `var(--acc)` (`#E63B2E`), posición `fixed bottom-6 right-5`
- `z-index: 50`
- Al tocar: abre el bottom sheet del `SueltaloWidget` existente
- Visible en **todas** las secciones del iPhone
- Oculto en breakpoints `≥ 768px` (desktop/iPad tienen el Suéltalo inline)

### Estructura de componentes nuevos

```
src/components/mobile/
  MobileLayout.tsx       ← wrapper que elige iPhone vs iPad vs Desktop
  IphoneSwiper.tsx       ← contenedor scroll-snap con IntersectionObserver
  IphoneSectionHoy.tsx   ← card 1
  IphoneSectionNegocio.tsx ← card 2
  IphoneSectionIdeas.tsx   ← card 3
  IphoneSectionClientes.tsx ← card 4
  IphoneSectionStats.tsx   ← card 5
  MobileFAB.tsx          ← botón flotante + (abre SueltaloWidget)
```

---

## iPad — Sidebar fijo (768px – 1279px)

### Concepto

Layout de 2 columnas: sidebar de `120px` a la izquierda + área de contenido flexible. El sidebar siempre visible, sin colapso. Cada ítem de nav resalta en rojo cuando está activo. La sección se renderiza en el área de contenido a la derecha.

### Sidebar
```
┌──────────────────┐
│ neptumstudio     │ ← logo, 14px bold
│ ─────────────── │
│ ⚡  Inicio       │ ← activo: fondo rojo 8%, texto rojo
│ 📁  Proyectos    │
│ 💼  Pipeline     │
│ 👥  Clientes     │
│ 📄  Cotizaciones │
│ 📊  Balance      │
│ ✓   Pendientes   │
│ 📸  Instagram    │
└──────────────────┘
```
- Ancho: `120px` fijo
- Fondo: `var(--bg-2)` con `border-right: 1px solid var(--border)`
- Ítems: ícono (18px) + label (12px), altura 36px, padding horizontal 12px
- Ítem activo: `background: rgba(var(--acc-rgb), 0.08)`, `color: var(--acc)`, borde izquierdo `2px solid var(--acc)`
- Ítem inactivo: `color: var(--text-2)`

### Grid de contenido — Inicio

```
┌──────────────────────────────────────────────────────┐
│  $0        │   0        │    0       │    3          │
│  balance   │  pipeline  │ proyectos  │  instagram    │
├────────────────────────────┬─────────────────────────┤
│                            │                         │
│      proyectos activos     │       ideas             │
│      (lista con %)         │       (lista con tags)  │
│                            │                         │
├──────────────┬─────────────┴──┬──────────────────────┤
│  pendientes  │   agenda hoy   │      suéltalo        │
│              │                │                      │
└──────────────┴────────────────┴──────────────────────┘
```

- **Row 1:** `grid-cols-4 gap-3` — 4 stat cards
- **Row 2:** `grid-cols-[2fr_1fr] gap-3` — proyectos + ideas  
- **Row 3:** `grid-cols-3 gap-3` — pendientes + agenda + suéltalo

### Secciones internas (Proyectos, Pipeline, etc.)

Cada section widget (`ProyectosPageWidget`, `PipelinePageWidget`, etc.) se renderiza full-width en el área de contenido (sin cambios al componente — solo el layout container cambia).

### Estructura de componentes nuevos

```
src/components/mobile/
  IpadLayout.tsx         ← sidebar + content area wrapper
  IpadSidebar.tsx        ← sidebar con nav items
  IpadHomeGrid.tsx       ← grid específico de la vista inicio en iPad
```

---

## Implementación — page.tsx

El `page.tsx` actual renderiza todo el dashboard. Se refactoriza con un switch por breakpoint usando `useMediaQuery` o `tailwind` clases:

```tsx
// Lógica de decisión:
// < 768px  → <IphoneLayout>
// 768-1279 → <IpadLayout>
// ≥ 1280   → <DesktopLayout> (layout actual, sin cambios)
```

Usar un único `MobileLayout.tsx` que detecta breakpoint con un hook propio `useMediaQuery` (sin dependencias externas — usa `window.matchMedia` + listener de resize). El hook se crea en `src/hooks/useMediaQuery.ts`.

---

## CSS / Tokens requeridos

Nuevas variables a agregar en `globals.css`:
```css
--acc-rgb: 230, 59, 46;  /* para rgba() en sidebar activo */
```

No se agregan nuevos breakpoints de Tailwind — se usan los existentes `md:` y `xl:`.

---

## Lo que NO cambia

- Todos los widgets existentes (PageWidgets, ListWidgets, StatWidgets) se reutilizan sin modificaciones
- El NavSheet y hamburger menu se eliminan en el iPhone (reemplazados por swipe) — se mantienen solo como fallback para resoluciones intermedias si las hubiera
- El layout desktop (≥ 1280px) no se toca
- Los hooks de datos no cambian
- El sistema de contexto `PanelContext` y `PanelProvider` sigue igual

---

## Criterios de éxito

- iPhone (390px): 5 secciones deslizables, FAB visible en todas, sin scroll vertical en la card principal
- iPad (768px–1024px): sidebar visible, grid de 4 stats, contenido en 2-3 columnas
- Desktop (≥ 1280px): sin regresiones visuales
- Sin errores de hidratación (SSR compatible)
- Transiciones suaves entre secciones en iPhone
