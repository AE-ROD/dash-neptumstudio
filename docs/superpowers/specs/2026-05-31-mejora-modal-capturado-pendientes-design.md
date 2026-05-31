# Mejora Modal Capturado + Página Pendientes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el widget Capturado en un modal completo con todas las ideas por categoría, eliminar el drawer lateral de Pendientes y añadir un panel de Capturado por categorías en la página de Pendientes.

**Architecture:** Tres cambios aislados en componentes existentes: (1) `IdeaModal` pasa a visor completo de ideas agrupadas por categoría, activado desde `IdeasWidget`; (2) `PanelHeader` deja de abrir el drawer al presionar el pill Pendientes; (3) `PendientesPageWidget` adopta layout 2 columnas con panel derecho de Capturado por categorías.

**Tech Stack:** Next.js App Router, React, Framer Motion, Tailwind CSS, `useIdeas` hook existente, `PanelContext` existente.

---

## Archivos involucrados

| Acción | Archivo |
|--------|---------|
| Modificar | `src/components/widgets/IdeasWidget.tsx` |
| Modificar | `src/components/modals/IdeaModal.tsx` |
| Modificar | `src/components/layout/PanelHeader.tsx` |
| Modificar | `src/components/widgets/PendientesPageWidget.tsx` |
| Modificar | `src/app/page.tsx` (quitar `PendientesDrawer`) |

---

## Cambio 1: Modal de Capturado

### Comportamiento
- El título "Capturado" en `IdeasWidget` se vuelve clickeable → llama `abrirModal('idea')` via `usePanelContext`
- `IdeaModal` reemplaza su contenido "Próximamente" por la lista completa de ideas agrupadas por categoría
- Las categorías son: IDEA, MEJORA, OPORTUNIDAD, TAREA (en ese orden)
- Cada categoría se renderiza solo si tiene al menos 1 idea
- El modal usa `ModalBase` existente (`max-w-[520px]`, `max-h-[80vh]`, scroll)
- El contenido hace fetch via `useIdeas()` directamente en `IdeaModal`

### UI del modal
```
Header oscuro: "Capturado" + botón ✕

Cuerpo scrollable:
  💡 IDEA  (n)
    · texto de la idea
    · texto de la idea
  🔧 MEJORA  (n)
    · texto...
  🌱 OPORTUNIDAD  (n)
    · texto...
  ✓ TAREA  (n)
    · texto...
```

Colores de categoría (mismos que `IdeasWidget`):
- IDEA: `bg #F0F0EE`, text `#555`
- MEJORA: `bg #FEF3C7`, text `#92400E`
- OPORTUNIDAD: `bg #DCFCE7`, text `#166534`
- TAREA: `bg #FEE2E2`, text `#991B1B`

---

## Cambio 2: Pill Pendientes sin drawer

### Comportamiento
- En `PanelHeader.tsx`, función `manejarPill`: eliminar `if (id === 'pendientes') abrirDrawer('pendientes')`
- El pill solo llama `cambiarSeccion('pendientes')` — navega a la página dedicada
- En `page.tsx`: eliminar import y uso de `<PendientesDrawer />`
- `PendientesDrawer` y `DrawerBase` no se tocan (pueden quedar para otros drawers)

---

## Cambio 3: Página Pendientes con Capturado por categorías

### Layout
`PendientesPageWidget` pasa de columna única a grid `grid-cols-[1fr_320px] gap-4 items-start`:

**Columna izquierda (existente, sin cambios de lógica):**
- Stats 4 cards
- Input agregar nuevo
- Lista con filtros PENDIENTE / DONE / TODOS

**Columna derecha (nueva):**
- Card `bg-white rounded-2xl shadow-sm p-5`
- Header: "Capturado" en bold + contador total
- Ideas agrupadas por categoría con header de sección:
  ```
  💡 IDEA (n)
    · texto (text-[12px], color #333)
  🔧 MEJORA (n)
    · texto
  ```
- Si no hay ideas: "Nada capturado aún" en gris
- El panel es `sticky top-0` para que no scrollee con la lista
- Usa `useIdeas()` directamente — sin props adicionales
- Escucha el evento `captura-guardada` via el hook (ya implementado en `useIdeas`)
