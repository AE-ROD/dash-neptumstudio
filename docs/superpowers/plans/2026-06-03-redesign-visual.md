# Rediseño Visual Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir dark/light mode automático, header con gradientes por horario en ambos modos, tridente SVG como logo, NavSheet mobile y layout responsive al dashboard neptum-dash.

**Architecture:** Los tokens de color se definen en `globals.css` con `prefers-color-scheme`. `PanelHeader` detecta el modo con `matchMedia` y elige entre `GRADIENTES_DARK`/`GRADIENTES_HEADER` según horario. Los widgets migran sus colores hardcodeados a variables CSS. El layout de `page.tsx` pasa a ser responsive con un `NavSheet` de Framer Motion para mobile.

**Tech Stack:** Next.js 15 · TypeScript · Framer Motion · Tailwind CSS · CSS custom properties

---

## Mapa de archivos

| Archivo | Acción |
|---|---|
| `src/app/globals.css` | Modificar — tokens dark/light + transición |
| `src/lib/tiempo.ts` | Modificar — añadir `GRADIENTES_DARK`, `COLORES_DARK` |
| `src/components/layout/PanelHeader.tsx` | Modificar — logo SVG, dark detection, hamburger |
| `src/components/layout/NavSheet.tsx` | **Crear** — bottom sheet mobile |
| `src/app/page.tsx` | Modificar — bg token, responsive grid, hamburger, stagger |
| `src/components/widgets/IngresosHeroWidget.tsx` | Modificar — tokens color |
| `src/components/widgets/PipelineStatWidget.tsx` | Modificar — tokens color + Cormorant |
| `src/components/widgets/ProyectosStatWidget.tsx` | Modificar — tokens color + Cormorant |
| `src/components/widgets/InstagramStatWidget.tsx` | Modificar — tokens color + Cormorant |
| `src/components/widgets/PendientesWidget.tsx` | Modificar — bg token |
| `src/components/widgets/IdeasWidget.tsx` | Modificar — bg token |
| `src/components/widgets/SueltaloWidget.tsx` | Modificar — bg token |
| `src/components/widgets/CalendarioWidget.tsx` | Modificar — bg token |

---

### Task 1: Crear rama + actualizar `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Crear rama de trabajo**

```bash
cd /Users/alejandrorodriguez/Desktop/Brain-Strom/neptumstudio
git checkout -b feat/redesign-visual
```

- [ ] **Reemplazar el contenido completo de `src/app/globals.css`:**

```css
@import "tailwindcss";

:root {
  /* ── Dark mode (default) ── */
  --bg:       #0D1B2A;
  --bg-2:     #1B2B45;
  --text:     #FFFFFF;
  --text-2:   #A7ADBA;
  --text-3:   #415466;
  --border:   rgba(255,255,255,0.08);
  --surf:     rgba(255,255,255,0.04);
  --acc:      #E63B2E;
  --font-display: var(--font-cormorant), serif;
  --font-body:    var(--font-dm-sans), sans-serif;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg:     #F6F4F0;
    --bg-2:   #FFFFFF;
    --text:   #0D1B2A;
    --text-2: #415466;
    --text-3: #A7ADBA;
    --border: #D4D2CE;
    --surf:   #FFFFFF;
    --acc:    #E63B2E;
  }
}

/* Transición suave al cambiar modo del sistema */
*, *::before, *::after {
  transition: background-color 0.35s ease, border-color 0.35s ease, color 0.2s ease;
}

body {
  background: var(--bg);
  font-family: var(--font-body);
  color: var(--text);
  height: 100vh;
  overflow: hidden;
}
```

- [ ] **Verificar que el dev server arranca sin errores:**

```bash
npm run dev
```
Esperado: sin errores en consola.

- [ ] **Commit:**

```bash
git add src/app/globals.css
git commit -m "feat(design): add dark/light CSS tokens with prefers-color-scheme"
```

---

### Task 2: Extender `lib/tiempo.ts` con variantes dark

**Files:**
- Modify: `src/lib/tiempo.ts`

- [ ] **Reemplazar el contenido completo de `src/lib/tiempo.ts`:**

```typescript
export type TemaTiempo = 'manana' | 'tarde' | 'noche'

export function getTemaTiempo(hora: number): TemaTiempo {
  if (hora >= 6 && hora < 12) return 'manana'
  if (hora >= 12 && hora < 20) return 'tarde'
  return 'noche'
}

export function getSaludo(tema: TemaTiempo): string {
  const saludos: Record<TemaTiempo, string> = {
    manana: 'Buenos días',
    tarde:  'Buenas tardes',
    noche:  'Buenas noches',
  }
  return saludos[tema]
}

/** Gradientes para light mode (mañana cálida, tarde fresca, noche neutra) */
export const GRADIENTES_HEADER: Record<TemaTiempo, string> = {
  manana:  'linear-gradient(120deg, #FEF3C7, #FDE68A)',
  tarde:   'linear-gradient(120deg, #E0F2FE, #BAE6FD)',
  noche:   'linear-gradient(120deg, #F6F4F0, #EDE9E3)',
}

/** Gradientes para dark mode (versiones oscuras del mismo horario) */
export const GRADIENTES_DARK: Record<TemaTiempo, string> = {
  manana: 'linear-gradient(120deg, #1a0f00, #2d1a00)',
  tarde:  'linear-gradient(120deg, #001a2d, #002a40)',
  noche:  'linear-gradient(120deg, #0D1B2A, #1B2B45)',
}

/** Colores de pills/texto para light mode */
export const COLORES_PILL: Record<TemaTiempo, { texto: string; activo: string; activoTexto: string }> = {
  manana: { texto: '#92400E', activo: '#78350F',  activoTexto: '#FFFFFF' },
  tarde:  { texto: '#0C4A6E', activo: '#0369A1',  activoTexto: '#FFFFFF' },
  noche:  { texto: '#0D1B2A', activo: '#1B2B45',  activoTexto: '#FFFFFF' },
}

/** Colores de pills/texto para dark mode */
export const COLORES_DARK: Record<TemaTiempo, { texto: string; activo: string; activoTexto: string }> = {
  manana: { texto: '#FDE68A', activo: '#FEF3C7', activoTexto: '#1a0f00' },
  tarde:  { texto: '#BAE6FD', activo: '#E0F2FE', activoTexto: '#001a2d' },
  noche:  { texto: '#A7ADBA', activo: '#F8FAFC', activoTexto: '#0F172A' },
}

export function getTemaTiempoActual(): TemaTiempo {
  return getTemaTiempo(new Date().getHours())
}
```

- [ ] **Verificar tipos TypeScript:**

```bash
npx tsc --noEmit
```
Esperado: 0 errores.

- [ ] **Commit:**

```bash
git add src/lib/tiempo.ts
git commit -m "feat(design): add GRADIENTES_DARK and COLORES_DARK for dark mode header"
```

---

### Task 3: Actualizar `PanelHeader.tsx` — logo SVG + dark detection + hamburger

**Files:**
- Modify: `src/components/layout/PanelHeader.tsx`

- [ ] **Reemplazar el contenido completo de `src/components/layout/PanelHeader.tsx`:**

```tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getTemaTiempo, getSaludo,
  GRADIENTES_HEADER, GRADIENTES_DARK,
  COLORES_PILL, COLORES_DARK,
} from '@/lib/tiempo'
import { usePanelContext } from '@/context/PanelContext'
import type { SeccionActiva } from '@/context/PanelContext'
import { NavSheet } from './NavSheet'

const PILLS_NAV: { id: SeccionActiva; etiqueta: string; tieneActividad: boolean }[] = [
  { id: 'inicio',        etiqueta: 'Inicio',        tieneActividad: false },
  { id: 'proyectos',     etiqueta: 'Proyectos',     tieneActividad: false },
  { id: 'clientes',      etiqueta: 'Clientes',      tieneActividad: false },
  { id: 'pipeline',      etiqueta: 'Pipeline',      tieneActividad: false },
  { id: 'cotizaciones',  etiqueta: 'Cotizaciones',  tieneActividad: false },
  { id: 'contacto',      etiqueta: 'Contacto',      tieneActividad: false },
  { id: 'balance',       etiqueta: 'Balance',       tieneActividad: false },
  { id: 'pendientes',    etiqueta: 'Pendientes',    tieneActividad: false },
  { id: 'instagram',     etiqueta: 'Instagram',     tieneActividad: false },
]

export function PanelHeader() {
  const [horaActual,  setHoraActual]  = useState(new Date().getHours())
  const [esDark,      setEsDark]      = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [navOpen, setNavOpen] = useState(false)
  const { seccionActiva, cambiarSeccion, abrirDrawer } = usePanelContext()

  useEffect(() => {
    const intervalo = setInterval(() => setHoraActual(new Date().getHours()), 60_000)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setEsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const tema      = getTemaTiempo(horaActual)
  const saludo    = getSaludo(tema)
  const gradiente = esDark ? GRADIENTES_DARK[tema]  : GRADIENTES_HEADER[tema]
  const colores   = esDark ? COLORES_DARK[tema]      : COLORES_PILL[tema]

  function manejarPill(id: SeccionActiva) {
    cambiarSeccion(id)
    if (id === 'instagram') abrirDrawer('instagram')
  }

  return (
    <>
      <motion.header
        animate={{ background: gradiente }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="flex-shrink-0 relative z-10"
      >
        {/* ── Desktop / Tablet (≥768px) ── */}
        <div className="hidden md:flex h-[76px] items-center px-6 lg:px-9 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 68"
              fill="none"
              style={{ color: colores.texto, width: 22, height: 22, flexShrink: 0 }}
            >
              <line x1="30" y1="4" x2="30" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <polyline points="25,14 30,4 35,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="20" x2="12" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <polyline points="8,28 12,20 16,28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="48" y1="20" x2="48" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <polyline points="44,28 48,20 52,28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 56 Q19 50 30 56 Q41 62 52 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            <div className="flex flex-col gap-0">
              <span style={{ color: colores.texto, fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 18, letterSpacing: '0.04em', lineHeight: 1 }}>
                neptumstudio
              </span>
              <span style={{ color: colores.texto, fontFamily: 'var(--font-dm-sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>
                panel
              </span>
            </div>
          </div>

          <div style={{ background: colores.texto }} className="w-px h-5 opacity-20 flex-shrink-0" />

          {/* Pills — scroll horizontal en tablet */}
          <nav className="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
            <div
              style={{ background: `${colores.texto}14` }}
              className="flex items-center gap-1 rounded-full p-1 min-w-max"
            >
              {PILLS_NAV.map((pill) => {
                const estaActiva = seccionActiva === pill.id
                return (
                  <motion.button
                    key={pill.id}
                    onClick={() => manejarPill(pill.id)}
                    style={{
                      color: estaActiva ? colores.activoTexto : colores.texto,
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                    className="relative px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {estaActiva && (
                      <motion.span
                        layoutId="pill-activa-fondo"
                        style={{ background: colores.activo }}
                        className="absolute inset-0 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{pill.etiqueta}</span>
                    {pill.tieneActividad && (
                      <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#E63B2E]" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </nav>

          {/* Saludo + avatar */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
              <span style={{ color: colores.texto, fontFamily: 'var(--font-dm-sans)' }} className="text-[11px] font-bold opacity-70">
                {saludo}
              </span>
            </div>
            <div style={{ background: '#E63B2E' }} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span style={{ fontFamily: 'var(--font-nunito)' }} className="font-black text-[13px] text-white">A</span>
            </div>
          </div>
        </div>

        {/* ── Mobile (<768px) ── */}
        <div className="flex md:hidden h-[60px] items-center px-4 justify-between">
          {/* Logo compacto */}
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 68" fill="none"
              style={{ color: colores.texto, width: 20, height: 20 }}>
              <line x1="30" y1="4" x2="30" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <polyline points="25,14 30,4 35,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="20" x2="12" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="48" y1="20" x2="48" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M8 56 Q19 50 30 56 Q41 62 52 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            <span style={{ color: colores.texto, fontFamily: 'var(--font-cormorant)', fontSize: 16, fontWeight: 400 }}>
              neptumstudio
            </span>
          </div>

          {/* Sección activa + hamburger */}
          <div className="flex items-center gap-3">
            <span style={{ color: colores.texto, fontFamily: 'var(--font-dm-sans)', fontSize: 11, fontWeight: 600, textTransform: 'capitalize', opacity: 0.8 }}>
              {seccionActiva}
            </span>
            <button
              onClick={() => setNavOpen(true)}
              className="flex flex-col gap-[5px] p-1"
              aria-label="Abrir navegación"
            >
              {[0,1,2].map(i => (
                <span key={i} style={{ background: colores.texto }} className="block w-5 h-[1.5px] rounded-full opacity-80" />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* NavSheet — solo visible en mobile */}
      <NavSheet
        open={navOpen}
        onClose={() => setNavOpen(false)}
        colores={colores}
        seccionActiva={seccionActiva}
        onSelect={(id) => {
          manejarPill(id)
          setNavOpen(false)
        }}
      />
    </>
  )
}
```

- [ ] **Verificar tipos:**

```bash
npx tsc --noEmit
```
Esperado: 0 errores (NavSheet aún no existe — habrá error de import. Crear en Task 4 primero si el compilador lo bloquea, o ignorar hasta Task 4).

- [ ] **Commit:**

```bash
git add src/components/layout/PanelHeader.tsx
git commit -m "feat(header): trident SVG logo, dark/light mode detection, mobile hamburger"
```

---

### Task 4: Crear `NavSheet.tsx` — bottom sheet mobile

**Files:**
- Create: `src/components/layout/NavSheet.tsx`

- [ ] **Crear el archivo `src/components/layout/NavSheet.tsx`:**

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { SeccionActiva } from '@/context/PanelContext'

const SECCIONES: { id: SeccionActiva; etiqueta: string }[] = [
  { id: 'inicio',       etiqueta: 'Inicio'       },
  { id: 'proyectos',    etiqueta: 'Proyectos'    },
  { id: 'clientes',     etiqueta: 'Clientes'     },
  { id: 'pipeline',     etiqueta: 'Pipeline'     },
  { id: 'cotizaciones', etiqueta: 'Cotizaciones' },
  { id: 'contacto',     etiqueta: 'Contacto'     },
  { id: 'balance',      etiqueta: 'Balance'      },
  { id: 'pendientes',   etiqueta: 'Pendientes'   },
  { id: 'instagram',    etiqueta: 'Instagram'    },
]

interface Props {
  open: boolean
  onClose: () => void
  colores: { texto: string; activo: string; activoTexto: string }
  seccionActiva: SeccionActiva
  onSelect: (id: SeccionActiva) => void
}

export function NavSheet({ open, onClose, colores, seccionActiva, onSelect }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-4 pb-10"
            style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* Handle */}
            <div
              className="w-10 h-1 rounded-full mx-auto mb-5"
              style={{ background: 'var(--border)' }}
            />

            <div className="grid grid-cols-3 gap-2">
              {SECCIONES.map(({ id, etiqueta }) => {
                const activa = seccionActiva === id
                return (
                  <motion.button
                    key={id}
                    onClick={() => onSelect(id)}
                    className="py-3 px-2 rounded-xl text-xs font-semibold capitalize"
                    style={{
                      background:  activa ? colores.activo : 'var(--surf)',
                      color:       activa ? colores.activoTexto : 'var(--text-2)',
                      fontFamily:  'var(--font-body)',
                      border:      `1px solid var(--border)`,
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {etiqueta}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Verificar tipos:**

```bash
npx tsc --noEmit
```
Esperado: 0 errores.

- [ ] **Verificar en browser — mobile (DevTools iPhone):**
  - Abrir DevTools → responsive → iPhone 14 Pro (393px)
  - Debe verse: header compacto con logo + hamburger
  - Al click del hamburger debe aparecer el sheet desde abajo con las 9 secciones
  - Seleccionar una sección debe cerrar el sheet

- [ ] **Commit:**

```bash
git add src/components/layout/NavSheet.tsx
git commit -m "feat(nav): NavSheet mobile bottom sheet navigation"
```

---

### Task 5: Actualizar `page.tsx` — background token + responsive + stagger

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Cambiar la línea 64 — `bg-[#EFEFED]` → `bg-[var(--bg)]`:**

```tsx
// ANTES (línea 64):
<div className="flex flex-col h-screen overflow-hidden bg-[#EFEFED]">

// DESPUÉS:
<div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
```

- [ ] **Cambiar `px-9 py-5` en el `<main>` para responsive (línea 67):**

```tsx
// ANTES:
<main id="panel-main" className="flex-1 overflow-y-auto px-9 py-5 flex flex-col gap-3">

// DESPUÉS:
<main id="panel-main" className="flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-4 lg:px-9 lg:py-5 flex flex-col gap-3">
```

- [ ] **Hacer el grid del inicio responsive (línea 73 — `grid-cols-[1fr_260px]`):**

```tsx
// ANTES:
<motion.div key="inicio" {...fade}
  className="grid grid-cols-[1fr_260px] gap-3 items-start">

// DESPUÉS:
<motion.div key="inicio" {...fade}
  className="flex flex-col xl:grid xl:grid-cols-[1fr_260px] gap-3 items-start">
```

- [ ] **Hacer el grid de stats responsive (línea 78 — `grid-cols-[1.5fr_1fr_1fr_1fr]`):**

```tsx
// ANTES:
<div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3">

// DESPUÉS:
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
```

- [ ] **Hacer el grid de listas responsive (línea 85 — `grid-cols-[2fr_1fr]`):**

```tsx
// ANTES:
<div className="grid grid-cols-[2fr_1fr] gap-3">

// DESPUÉS:
<div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
```

- [ ] **Hacer el grid de día responsive (línea 90 — `grid-cols-3`):**

```tsx
// ANTES:
<div className="grid grid-cols-3 gap-3">

// DESPUÉS:
<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
```

- [ ] **Quitar los `motion.div` individuales con delays hardcodeados en los stat widgets (los propios widgets ya tienen su animación). En su lugar, envolver cada sección de stats con stagger vía `variants` de Framer Motion en el contenedor. Añadir al inicio del componente:**

```tsx
// Añadir justo antes del return, después de la línea 61:
const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}
const itemFade = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
}
```

```tsx
// Cambiar el div de stats para usar motion.div con variants:
// ANTES:
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  <IngresosHeroWidget />
  <PipelineStatWidget />
  <ProyectosStatWidget />
  <InstagramStatWidget />
</div>

// DESPUÉS:
<motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" variants={stagger} initial="initial" animate="animate">
  <motion.div variants={itemFade}><IngresosHeroWidget /></motion.div>
  <motion.div variants={itemFade}><PipelineStatWidget /></motion.div>
  <motion.div variants={itemFade}><ProyectosStatWidget /></motion.div>
  <motion.div variants={itemFade}><InstagramStatWidget /></motion.div>
</motion.div>
```

- [ ] **Verificar en browser — desktop, tablet (iPad 820px), mobile (iPhone 393px):**
  - Desktop: layout de 4 columnas en stats, sidebar de Ideas a la derecha
  - Tablet: stats en 2 columnas, listas apiladas
  - Mobile: todo en 1 columna, sidebar de Ideas baja al final

- [ ] **Commit:**

```bash
git add src/app/page.tsx
git commit -m "feat(layout): responsive grid, CSS bg token, stagger animation on stats"
```

---

### Task 6: Migrar tokens en los 4 stat widgets

**Files:**
- Modify: `src/components/widgets/IngresosHeroWidget.tsx`
- Modify: `src/components/widgets/PipelineStatWidget.tsx`
- Modify: `src/components/widgets/ProyectosStatWidget.tsx`
- Modify: `src/components/widgets/InstagramStatWidget.tsx`

- [ ] **Reemplazar `IngresosHeroWidget.tsx` completo:**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useIngresos } from '@/hooks/useIngresos'

function useContadorAnimado(objetivo: number, duracion = 1000) {
  const [valor, setValor] = useState(0)
  useEffect(() => {
    if (!objetivo) return
    const inicio = performance.now()
    const animar = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1)
      const ease     = 1 - Math.pow(1 - progreso, 3)
      setValor(Math.floor(ease * objetivo))
      if (progreso < 1) requestAnimationFrame(animar)
    }
    requestAnimationFrame(animar)
  }, [objetivo, duracion])
  return valor
}

export function IngresosHeroWidget() {
  const { balance, cargando } = useIngresos()
  const balanceAnimado = useContadorAnimado(balance?.balance ?? 0)

  return (
    <div
      className="rounded-2xl p-5 flex flex-col shadow-sm"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}
      >
        Balance del mes
      </span>

      <span
        className="text-[34px] font-light leading-none mt-2"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}
      >
        {cargando ? '—' : `$${balanceAnimado.toLocaleString('es-CL')}`}
      </span>

      <div className="flex items-center gap-2 mt-2">
        {balance && balance.ingresos > 0 && (
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: '#1A7F4B', background: '#EDFCF2', fontFamily: 'var(--font-dm-sans)' }}
          >
            +${balance.ingresos.toLocaleString('es-CL')} ing.
          </span>
        )}
        {balance && balance.egresos > 0 && (
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: '#C92A2A', background: '#FFF1F0', fontFamily: 'var(--font-dm-sans)' }}
          >
            −${balance.egresos.toLocaleString('es-CL')} egr.
          </span>
        )}
        {(!balance || (balance.ingresos === 0 && balance.egresos === 0)) && (
          <span
            className="text-[9px]"
            style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}
          >
            Recién empezando
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Reemplazar `PipelineStatWidget.tsx` completo:**

```tsx
'use client'
import { useProposals } from '@/hooks/useProposals'

export function PipelineStatWidget() {
  const { propuestas, cargando } = useProposals()
  const urgentes = propuestas.filter(p => p.estado === 'PROPUESTA').length

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1.5"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}
      >
        Pipeline
      </span>
      <span
        className="text-[30px] font-light leading-none"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}
      >
        {cargando ? '—' : propuestas.length}
      </span>
      <span
        className="self-start text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full"
        style={{ background: '#E63B2E' }}
      >
        {urgentes} urgentes
      </span>
    </div>
  )
}
```

- [ ] **Reemplazar `ProyectosStatWidget.tsx` completo:**

```tsx
'use client'
import { useProyectos } from '@/hooks/useProyectos'

export function ProyectosStatWidget() {
  const { proyectos, cargando } = useProyectos()
  const activos = proyectos.filter(p => p.estado === 'ACTIVO').length

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1.5"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}
      >
        Proyectos
      </span>
      <span
        className="text-[30px] font-light leading-none"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}
      >
        {cargando ? '—' : proyectos.length}
      </span>
      <span
        className="self-start text-[9px] font-extrabold px-2 py-0.5 rounded-full"
        style={{ background: 'var(--text-3)', color: 'var(--bg)' }}
      >
        {activos} activos
      </span>
    </div>
  )
}
```

- [ ] **Reemplazar `InstagramStatWidget.tsx` completo:**

```tsx
'use client'
import { useInstagram } from '@/hooks/useInstagram'

export function InstagramStatWidget() {
  const { snapshot, cargando } = useInstagram()

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1.5"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}
      >
        Instagram
      </span>
      <span
        className="text-[30px] font-light leading-none"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}
      >
        {cargando ? '—' : (snapshot?.seguidores.toLocaleString('es-CL') ?? '—')}
      </span>
      <span
        className="self-start text-[9px] font-extrabold px-2 py-0.5 rounded-full"
        style={{ background: 'var(--text-3)', color: 'var(--bg)' }}
      >
        +{snapshot?.crecimientoSemanal ?? 0} sem.
      </span>
    </div>
  )
}
```

- [ ] **Verificar en browser dark mode y light mode:**
  - Dark: todos los widgets con fondo navy mid, texto blanco, números en Cormorant
  - Light: todos con fondo blanco, texto navy, mismos números en Cormorant

- [ ] **Commit:**

```bash
git add src/components/widgets/IngresosHeroWidget.tsx \
        src/components/widgets/PipelineStatWidget.tsx \
        src/components/widgets/ProyectosStatWidget.tsx \
        src/components/widgets/InstagramStatWidget.tsx
git commit -m "feat(widgets): migrate stat widgets to CSS tokens + Cormorant Garamond numbers"
```

---

### Task 7: Migrar tokens en widgets del dashboard (PendientesWidget, IdeasWidget, SueltaloWidget, CalendarioWidget)

**Files:**
- Modify: `src/components/widgets/PendientesWidget.tsx`
- Modify: `src/components/widgets/IdeasWidget.tsx`
- Modify: `src/components/widgets/SueltaloWidget.tsx`
- Modify: `src/components/widgets/CalendarioWidget.tsx`

En cada uno de estos 4 archivos, aplicar estos reemplazos exactos de className/style:

- [ ] **En los 4 archivos — reemplazar `className="bg-white ..."`:**

```
ANTES:  className="bg-white rounded-2xl p-5 shadow-sm ..."
DESPUÉS: className="rounded-2xl p-5 ..." style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
```

- [ ] **En los 4 archivos — reemplazar `text-[#111]` con `var(--text)`:**

```
ANTES:  className="... text-[#111] ..."
DESPUÉS: style={{ color: 'var(--text)' }}   (mover a style si hay otras clases que preservar)
```

- [ ] **En los 4 archivos — reemplazar `text-[#bbb]` con `var(--text-2)`:**

```
ANTES:  className="... text-[#bbb] ..."
DESPUÉS: style={{ color: 'var(--text-2)' }}
```

- [ ] **En los 4 archivos — reemplazar `text-[#415466]` con `var(--text-3)`:**

```
ANTES:  className="... text-[#415466] ..."
DESPUÉS: style={{ color: 'var(--text-3)' }}
```

- [ ] **Específico para `SueltaloWidget` — el input/textarea usa clases Tailwind con colores fijos. Localizar y aplicar:**

```
ANTES:  className="... bg-gray-50 border-gray-200 text-gray-900 ..."
DESPUÉS: style={{ background: 'var(--surf)', border: '1px solid var(--border)', color: 'var(--text)' }}
```

- [ ] **Verificar en browser:**

```bash
# En DevTools: toggle dark/light mode
# Cada widget debe cambiar suavemente (0.35s) entre fondos
```

- [ ] **Commit:**

```bash
git add src/components/widgets/PendientesWidget.tsx \
        src/components/widgets/IdeasWidget.tsx \
        src/components/widgets/SueltaloWidget.tsx \
        src/components/widgets/CalendarioWidget.tsx
git commit -m "feat(widgets): migrate dashboard widgets to CSS color tokens"
```

---

### Task 8: Migrar tokens en widgets de lista + ModalBase

**Files:**
- Modify: `src/components/widgets/ProyectosListWidget.tsx`
- Modify: `src/components/widgets/PipelineListWidget.tsx`
- Modify: `src/components/widgets/BalancePageWidget.tsx`
- Modify: `src/components/widgets/ContactosWidget.tsx`
- Modify: `src/components/widgets/CotizacionesWidget.tsx`
- Modify: `src/components/modals/ModalBase.tsx`

- [ ] **En `ProyectosListWidget.tsx`, `PipelineListWidget.tsx`, `BalancePageWidget.tsx`, `ContactosWidget.tsx` y `CotizacionesWidget.tsx` — mismo patrón que Task 7:**

Buscar y reemplazar en cada archivo:
```
bg-white        → style={{ background: 'var(--bg-2)' }}
bg-gray-50      → style={{ background: 'var(--surf)' }}
text-gray-900   → style={{ color: 'var(--text)' }}
text-gray-500   → style={{ color: 'var(--text-2)' }}
text-gray-400   → style={{ color: 'var(--text-3)' }}
border-gray-100 → style={{ borderColor: 'var(--border)' }}
border-gray-200 → style={{ borderColor: 'var(--border)' }}
text-[#111]     → style={{ color: 'var(--text)' }}
text-[#bbb]     → style={{ color: 'var(--text-2)' }}
```

- [ ] **En `ModalBase.tsx` — fondo del modal:**

```
ANTES:  className="... bg-white ..."   (el panel del modal)
DESPUÉS: style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}

ANTES:  className="... bg-black/50 ..."   (el backdrop)
DESPUÉS: sin cambio — el backdrop negro funciona en ambos modos
```

- [ ] **Verificar build completo:**

```bash
npm run build
```
Esperado: build exitoso sin errores TypeScript.

- [ ] **Commit:**

```bash
git add src/components/widgets/ProyectosListWidget.tsx \
        src/components/widgets/PipelineListWidget.tsx \
        src/components/widgets/BalancePageWidget.tsx \
        src/components/widgets/ContactosWidget.tsx \
        src/components/widgets/CotizacionesWidget.tsx \
        src/components/modals/ModalBase.tsx
git commit -m "feat(widgets): migrate list/page widgets and modal to CSS tokens"
```

---

### Task 9: Verificación final responsive + merge a main

- [ ] **Verificar los 3 breakpoints en DevTools:**

| Dispositivo | Ancho | Qué verificar |
|---|---|---|
| iPhone 14 Pro | 393px | Header compacto, hamburger visible, NavSheet funcional |
| iPad Air | 820px | Pills en scroll horizontal, stats en 2 columnas |
| MacBook 13" | 1280px | Layout completo, sidebar Ideas visible |

- [ ] **Verificar dark/light mode:**

En DevTools → Rendering → `prefers-color-scheme: dark` → fondo navy, texto blanco, gradientes oscuros en header
En DevTools → Rendering → `prefers-color-scheme: light` → fondo cream, texto navy, gradientes vivos en header

- [ ] **Verificar que la transición es suave:**

Cambiar manualmente en macOS: Preferencias → Apariencia → Oscuro/Claro. El dashboard debe cambiar con animación de 0.35s.

- [ ] **Merge a main:**

```bash
git checkout main
git merge feat/redesign-visual --no-ff -m "feat: visual redesign — dark/light mode, time-based header, trident logo, responsive"
git push origin main
```

- [ ] **Deploy a Vercel:**

```bash
npx vercel deploy --prod --yes
```
Esperado: `readyState: READY`.
