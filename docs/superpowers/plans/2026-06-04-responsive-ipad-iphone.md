# Responsive iPhone & iPad Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement native-quality iPhone (horizontal swiper) and iPad (fixed sidebar) layouts while keeping the desktop layout untouched.

**Architecture:** Three layout components (IphoneLayout, IpadLayout, DesktopLayout) selected by a `useMediaQuery` hook in `page.tsx`. All existing widgets are reused without modification. iPhone uses CSS scroll-snap + IntersectionObserver for section tracking. iPad uses a 120px fixed sidebar with `cambiarSeccion` from PanelContext.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind v4 · Framer Motion · existing hooks (useEventos, usePendientes, useProyectos, useProposals, useIngresos, useIdeas, useCotizaciones, useContacts, useInstagram)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/hooks/useMediaQuery.ts` | Create | `window.matchMedia` hook, SSR-safe |
| `src/app/globals.css` | Modify | Add `--acc-rgb` token |
| `src/components/mobile/DesktopLayout.tsx` | Create | Current page.tsx content extracted |
| `src/components/mobile/IphoneHeader.tsx` | Create | Logo + dots nav (5 sections) |
| `src/components/mobile/IphoneSwiper.tsx` | Create | scroll-snap container + IntersectionObserver |
| `src/components/mobile/sections/IphoneSectionHoy.tsx` | Create | Agenda + Pendientes |
| `src/components/mobile/sections/IphoneSectionNegocio.tsx` | Create | Balance + Pipeline + Proyectos |
| `src/components/mobile/sections/IphoneSectionIdeas.tsx` | Create | Ideas con tags |
| `src/components/mobile/sections/IphoneSectionClientes.tsx` | Create | Cotizaciones + Contactos |
| `src/components/mobile/sections/IphoneSectionStats.tsx` | Create | Instagram + Balance detallado |
| `src/components/mobile/MobileFAB.tsx` | Create | FAB + bottom sheet para SueltaloWidget |
| `src/components/mobile/IphoneLayout.tsx` | Create | Header + Swiper + FAB + Overlays |
| `src/components/mobile/IpadSidebar.tsx` | Create | Sidebar 120px con nav items |
| `src/components/mobile/IpadHomeGrid.tsx` | Create | Grid 4+2+3 para inicio en iPad |
| `src/components/mobile/IpadLayout.tsx` | Create | Sidebar + content area + Overlays |
| `src/app/page.tsx` | Modify | Routing a los tres layouts |

---

## Task 1: useMediaQuery hook + CSS token

**Files:**
- Create: `src/hooks/useMediaQuery.ts`
- Modify: `src/app/globals.css`

- [ ] **Crear `src/hooks/useMediaQuery.ts`**

```typescript
'use client'
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}
```

- [ ] **Agregar `--acc-rgb` a `src/app/globals.css`** — añadir dentro de `:root { }` después de `--acc: #E63B2E;`:

```css
  --acc-rgb:  230, 59, 46;
```

Y en el bloque `@media (prefers-color-scheme: light)` después de `--acc: #E63B2E;`:

```css
    --acc-rgb:  230, 59, 46;
```

- [ ] **Verificar TypeScript**

```bash
cd /Users/alejandrorodriguez/Desktop/neptum-dash && npx tsc --noEmit 2>&1 | head -20
```
Esperado: sin errores.

- [ ] **Commit**

```bash
git add src/hooks/useMediaQuery.ts src/app/globals.css
git commit -m "feat(mobile): add useMediaQuery hook and --acc-rgb CSS token"
```

---

## Task 2: Extraer DesktopLayout

**Files:**
- Create: `src/components/mobile/DesktopLayout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Crear `src/components/mobile/DesktopLayout.tsx`** con el contenido actual de `page.tsx` (sin el `export default`):

```tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePanelContext }            from '@/context/PanelContext'
import type { SeccionActiva }         from '@/context/PanelContext'
import { PanelHeader }                from '@/components/layout/PanelHeader'
import { IngresosHeroWidget }         from '@/components/widgets/IngresosHeroWidget'
import { PipelineStatWidget }         from '@/components/widgets/PipelineStatWidget'
import { ProyectosStatWidget }        from '@/components/widgets/ProyectosStatWidget'
import { InstagramStatWidget }        from '@/components/widgets/InstagramStatWidget'
import { ProyectosListWidget }        from '@/components/widgets/ProyectosListWidget'
import { PipelineListWidget }         from '@/components/widgets/PipelineListWidget'
import { PendientesWidget }           from '@/components/widgets/PendientesWidget'
import { CalendarioWidget }           from '@/components/widgets/CalendarioWidget'
import { SueltaloWidget }             from '@/components/widgets/SueltaloWidget'
import { IdeasWidget }                from '@/components/widgets/IdeasWidget'
import { ProyectosPageWidget }        from '@/components/widgets/ProyectosPageWidget'
import { PipelinePageWidget }         from '@/components/widgets/PipelinePageWidget'
import { ContactosWidget }            from '@/components/widgets/ContactosWidget'
import { CotizacionesWidget }         from '@/components/widgets/CotizacionesWidget'
import { PendientesPageWidget }       from '@/components/widgets/PendientesPageWidget'
import { BalancePageWidget }          from '@/components/widgets/BalancePageWidget'
import { InstagramPageWidget }        from '@/components/widgets/InstagramPageWidget'
import { ProyectoDrawer }             from '@/components/drawers/ProyectoDrawer'
import { CalendarioDrawer }           from '@/components/drawers/CalendarioDrawer'
import { PropuestaModal }             from '@/components/modals/PropuestaModal'
import { IdeaModal }                  from '@/components/modals/IdeaModal'
import { CotizacionModal }            from '@/components/modals/CotizacionModal'

type FilaPagina =
  | 'inicio'
  | 'pg-proyectos' | 'pg-pipeline' | 'pg-clientes'
  | 'pg-cotizaciones' | 'pg-contacto'
  | 'pg-pendientes' | 'pg-balance' | 'pg-instagram'

const FILAS_POR_SECCION: Record<SeccionActiva, FilaPagina[]> = {
  inicio:       ['inicio'],
  proyectos:    ['pg-proyectos'],
  clientes:     ['pg-clientes'],
  pipeline:     ['pg-pipeline'],
  cotizaciones: ['pg-cotizaciones'],
  contacto:     ['pg-contacto'],
  balance:      ['pg-balance'],
  pendientes:   ['pg-pendientes'],
  instagram:    ['pg-instagram'],
}

const fade = {
  initial:    { opacity: 0, y: 6 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -6 },
  transition: { duration: 0.22 },
}

const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
const itemFade = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function DesktopLayout() {
  const { seccionActiva } = usePanelContext()
  const filas = FILAS_POR_SECCION[seccionActiva]

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <PanelHeader />
      <main id="panel-main" className="flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-4 lg:px-9 lg:py-5 flex flex-col gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filas.includes('inicio') && (
            <motion.div key="inicio" {...fade}
              className="flex flex-col xl:grid xl:grid-cols-[1fr_260px] gap-3 items-start">
              <div className="flex flex-col gap-3">
                <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" variants={stagger} initial="initial" animate="animate">
                  <motion.div variants={itemFade}><IngresosHeroWidget /></motion.div>
                  <motion.div variants={itemFade}><PipelineStatWidget /></motion.div>
                  <motion.div variants={itemFade}><ProyectosStatWidget /></motion.div>
                  <motion.div variants={itemFade}><InstagramStatWidget /></motion.div>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
                  <ProyectosListWidget />
                  <PipelineListWidget />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <PendientesWidget />
                  <CalendarioWidget />
                  <SueltaloWidget />
                </div>
              </div>
              <div className="sticky top-0"><IdeasWidget /></div>
            </motion.div>
          )}
          {filas.includes('pg-proyectos') && (
            <motion.div key="pg-proyectos" {...fade}><ProyectosPageWidget /></motion.div>
          )}
          {filas.includes('pg-pipeline') && (
            <motion.div key="pg-pipeline" {...fade}><PipelinePageWidget /></motion.div>
          )}
          {filas.includes('pg-clientes') && (
            <motion.div key="pg-clientes" {...fade}><ContactosWidget /></motion.div>
          )}
          {filas.includes('pg-cotizaciones') && (
            <motion.div key="pg-cotizaciones" {...fade}><CotizacionesWidget /></motion.div>
          )}
          {filas.includes('pg-contacto') && (
            <motion.div key="pg-contacto" {...fade}><ContactosWidget /></motion.div>
          )}
          {filas.includes('pg-pendientes') && (
            <motion.div key="pg-pendientes" {...fade}><PendientesPageWidget /></motion.div>
          )}
          {filas.includes('pg-balance') && (
            <motion.div key="pg-balance" {...fade}><BalancePageWidget /></motion.div>
          )}
          {filas.includes('pg-instagram') && (
            <motion.div key="pg-instagram" {...fade}><InstagramPageWidget /></motion.div>
          )}
        </AnimatePresence>
      </main>
      <ProyectoDrawer />
      <CalendarioDrawer />
      <PropuestaModal />
      <IdeaModal />
      <CotizacionModal />
    </div>
  )
}
```

- [ ] **Actualizar `src/app/page.tsx`** para que solo exporte el DesktopLayout de momento:

```tsx
'use client'
import { DesktopLayout } from '@/components/mobile/DesktopLayout'

export default function PaginaPanel() {
  return <DesktopLayout />
}
```

- [ ] **Verificar build**

```bash
cd /Users/alejandrorodriguez/Desktop/neptum-dash && npm run build 2>&1 | tail -8
```
Esperado: build exitoso, sin errores TypeScript.

- [ ] **Commit**

```bash
git add src/components/mobile/DesktopLayout.tsx src/app/page.tsx
git commit -m "refactor: extract DesktopLayout component from page.tsx"
```

---

## Task 3: IphoneHeader

**Files:**
- Create: `src/components/mobile/IphoneHeader.tsx`

- [ ] **Crear `src/components/mobile/IphoneHeader.tsx`**

```tsx
'use client'

const SECCIONES = ['Hoy', 'Negocio', 'Ideas', 'Clientes', 'Stats']

interface IphoneHeaderProps {
  activeIndex: number
  onDotClick: (index: number) => void
}

export function IphoneHeader({ activeIndex, onDotClick }: IphoneHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 flex-shrink-0"
      style={{
        height: '60px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '16px' }}>⚡</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.3px' }}>
          neptumstudio
        </span>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-[6px]">
        {SECCIONES.map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            aria-label={SECCIONES[i]}
            style={{
              width: i === activeIndex ? '18px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === activeIndex ? 'var(--acc)' : 'var(--text-3)',
              transition: 'width 0.25s ease, background 0.25s ease',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Sección activa label */}
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', minWidth: '48px', textAlign: 'right' }}>
        {SECCIONES[activeIndex]}
      </span>
    </header>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/IphoneHeader.tsx
git commit -m "feat(mobile): add IphoneHeader with animated dots navigation"
```

---

## Task 4: IphoneSwiper

**Files:**
- Create: `src/components/mobile/IphoneSwiper.tsx`

- [ ] **Crear `src/components/mobile/IphoneSwiper.tsx`**

```tsx
'use client'
import { useRef, useEffect, useCallback } from 'react'
import { IphoneSectionHoy }       from './sections/IphoneSectionHoy'
import { IphoneSectionNegocio }   from './sections/IphoneSectionNegocio'
import { IphoneSectionIdeas }     from './sections/IphoneSectionIdeas'
import { IphoneSectionClientes }  from './sections/IphoneSectionClientes'
import { IphoneSectionStats }     from './sections/IphoneSectionStats'

const SECTIONS = [
  IphoneSectionHoy,
  IphoneSectionNegocio,
  IphoneSectionIdeas,
  IphoneSectionClientes,
  IphoneSectionStats,
]

interface IphoneSwiperProps {
  activeIndex: number
  onActiveChange: (index: number) => void
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export function IphoneSwiper({ activeIndex, onActiveChange, scrollRef }: IphoneSwiperProps) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, i) => {
      if (!ref) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) onActiveChange(i) },
        { root: scrollRef.current, threshold: 0.5 }
      )
      obs.observe(ref)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [onActiveChange, scrollRef])

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto flex-1"
      style={{
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {SECTIONS.map((Section, i) => (
        <div
          key={i}
          ref={el => { sectionRefs.current[i] = el }}
          style={{
            flexShrink: 0,
            width: '100vw',
            height: '100%',
            scrollSnapAlign: 'start',
            overflowY: 'auto',
          }}
        >
          <Section />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Commit** (las secciones se crean en el siguiente task)

```bash
git add src/components/mobile/IphoneSwiper.tsx
git commit -m "feat(mobile): add IphoneSwiper with scroll-snap and IntersectionObserver"
```

---

## Task 5: iPhone Section Components

**Files:**
- Create: `src/components/mobile/sections/IphoneSectionHoy.tsx`
- Create: `src/components/mobile/sections/IphoneSectionNegocio.tsx`
- Create: `src/components/mobile/sections/IphoneSectionIdeas.tsx`
- Create: `src/components/mobile/sections/IphoneSectionClientes.tsx`
- Create: `src/components/mobile/sections/IphoneSectionStats.tsx`

- [ ] **Crear `src/components/mobile/sections/IphoneSectionHoy.tsx`**

```tsx
'use client'
import { useEventos }    from '@/hooks/useEventos'
import { usePendientes } from '@/hooks/usePendientes'

const TIPO_ICON: Record<string, string> = {
  REUNION: '📅', LLAMADA: '📞', ENTREGA: '📦', OTRO: '●',
}

export function IphoneSectionHoy() {
  const { eventos }     = useEventos()
  const { pendientes, toggleCompletado } = usePendientes()

  const hoy = new Date().toDateString()
  const eventosHoy = eventos.filter(e => new Date(e.fecha).toDateString() === hoy)
  const pendientesActivos = pendientes.filter(p => !p.completado).slice(0, 4)

  const fechaLabel = new Date().toLocaleDateString('es', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className="flex flex-col gap-3 p-4" style={{ minHeight: '100%' }}>
      {/* Fecha */}
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', textTransform: 'capitalize' }}>
        {fechaLabel}
      </div>

      {/* Agenda */}
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Agenda
        </div>
        {eventosHoy.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin eventos hoy</p>
        ) : (
          <div className="flex flex-col gap-2">
            {eventosHoy.map(e => (
              <div key={e.id} className="flex items-center gap-2">
                <span style={{ fontSize: '14px' }}>{TIPO_ICON[e.tipo] ?? '●'}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{e.titulo}</div>
                  {e.hora && <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{e.hora}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pendientes */}
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Pendientes
        </div>
        {pendientesActivos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Todo al día ✓</p>
        ) : (
          <div className="flex flex-col gap-2">
            {pendientesActivos.map(p => (
              <label key={p.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.completado}
                  onChange={() => toggleCompletado(p.id, !p.completado)}
                  style={{ marginTop: '2px', accentColor: 'var(--acc)', flexShrink: 0 }}
                />
                <span style={{ fontSize: '13px', color: p.completado ? 'var(--text-3)' : 'var(--text)', textDecoration: p.completado ? 'line-through' : 'none' }}>
                  {p.texto}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Crear `src/components/mobile/sections/IphoneSectionNegocio.tsx`**

```tsx
'use client'
import { useIngresos }  from '@/hooks/useIngresos'
import { useProposals } from '@/hooks/useProposals'
import { useProyectos } from '@/hooks/useProyectos'

export function IphoneSectionNegocio() {
  const { balance }    = useIngresos()
  const { propuestas } = useProposals()
  const { proyectos }  = useProyectos()

  const urgentes   = propuestas.filter(p => p.estado === 'LEAD').length
  const activos    = proyectos.filter(p => p.estado === 'ACTIVO').slice(0, 4)

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Balance mes</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            ${balance?.balance?.toLocaleString('es') ?? '0'}
          </div>
        </div>
        <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Pipeline</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{propuestas.length}</div>
          {urgentes > 0 && (
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--acc)', marginTop: '2px' }}>{urgentes} urgentes</div>
          )}
        </div>
      </div>

      {/* Proyectos */}
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
          Proyectos activos
        </div>
        {activos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin proyectos activos</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activos.map(p => (
              <div key={p.id}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{p.nombre}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{p.progreso}%</span>
                </div>
                <div style={{ height: '4px', background: 'var(--surf)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.progreso}%`, background: 'var(--acc)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Crear `src/components/mobile/sections/IphoneSectionIdeas.tsx`**

```tsx
'use client'
import { useIdeas } from '@/hooks/useIdeas'

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  IDEA:        { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  MEJORA:      { bg: 'rgba(74,222,128,0.15)',  text: '#4ade80' },
  OPORTUNIDAD: { bg: 'rgba(129,140,248,0.15)', text: '#818cf8' },
  TAREA:       { bg: 'rgba(251,146,60,0.15)',  text: '#fb923c' },
}

export function IphoneSectionIdeas() {
  const { ideas, cargando } = useIdeas()
  const visibles = ideas.slice(0, 8)

  return (
    <div className="flex flex-col gap-3 p-4">
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px', minHeight: '200px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Ideas capturadas
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{ideas.length}</div>
        </div>

        {cargando ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Cargando...</p>
        ) : visibles.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin ideas aún. Usá el + para capturar.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {visibles.map(idea => {
              const color = TAG_COLORS[idea.etiqueta] ?? TAG_COLORS.IDEA
              return (
                <div key={idea.id} style={{ background: 'var(--surf)', borderRadius: '8px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: color.bg, color: color.text, marginBottom: '5px', display: 'inline-block' }}>
                    {idea.etiqueta}
                  </span>
                  <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.4 }}>{idea.texto}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Crear `src/components/mobile/sections/IphoneSectionClientes.tsx`**

```tsx
'use client'
import { useCotizaciones } from '@/hooks/useCotizaciones'
import { useContacts }     from '@/hooks/useContacts'

const ESTADO_COLORS: Record<string, string> = {
  BORRADOR:  '#888',
  ENVIADA:   '#fbbf24',
  APROBADA:  '#4ade80',
  RECHAZADA: '#f87171',
}

export function IphoneSectionClientes() {
  const { cotizaciones } = useCotizaciones()
  const { contactos }    = useContacts()

  const recientes = cotizaciones.slice(0, 3)
  const ultimosContactos = contactos.slice(0, 3)

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Cotizaciones */}
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Cotizaciones recientes
        </div>
        {recientes.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin cotizaciones aún</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recientes.map(c => (
              <div key={c.id} className="flex justify-between items-center">
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{c.nombreCliente}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>${c.total.toLocaleString('es')}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: ESTADO_COLORS[c.estado] ?? '#888', background: 'var(--surf)', padding: '2px 8px', borderRadius: '4px' }}>
                  {c.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contactos */}
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Contactos
        </div>
        {ultimosContactos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin contactos aún</p>
        ) : (
          <div className="flex flex-col gap-2">
            {ultimosContactos.map(c => (
              <div key={c.id} className="flex items-center gap-2">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {c.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{c.nombre}</div>
                  {c.marca && <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{c.marca}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Crear `src/components/mobile/sections/IphoneSectionStats.tsx`**

```tsx
'use client'
import { useInstagram } from '@/hooks/useInstagram'
import { useIngresos }  from '@/hooks/useIngresos'

export function IphoneSectionStats() {
  const { snapshot }   = useInstagram()
  const { balance }    = useIngresos()

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Instagram */}
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Instagram
        </div>
        {!snapshot ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin datos Instagram</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{snapshot.seguidores}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Seguidores</div>
            </div>
            {snapshot.publicaciones != null && (
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{snapshot.publicaciones}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Publicaciones</div>
              </div>
            )}
            {snapshot.alcancePromedio != null && (
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{snapshot.alcancePromedio}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Alcance prom.</div>
              </div>
            )}
            {snapshot.crecimientoSemanal != null && (
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: snapshot.crecimientoSemanal >= 0 ? '#4ade80' : '#f87171' }}>
                  {snapshot.crecimientoSemanal >= 0 ? '+' : ''}{snapshot.crecimientoSemanal}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Esta semana</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Balance */}
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Balance del mes
        </div>
        {!balance ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin datos de balance</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#4ade80' }}>${balance.ingresos.toLocaleString('es')}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Ingresos</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f87171' }}>${balance.egresos.toLocaleString('es')}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Egresos</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>${balance.balance.toLocaleString('es')}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Neto</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Verificar TypeScript**

```bash
cd /Users/alejandrorodriguez/Desktop/neptum-dash && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add src/components/mobile/sections/
git commit -m "feat(mobile): add 5 iPhone section components (Hoy, Negocio, Ideas, Clientes, Stats)"
```

---

## Task 6: MobileFAB

**Files:**
- Create: `src/components/mobile/MobileFAB.tsx`

- [ ] **Crear `src/components/mobile/MobileFAB.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SueltaloWidget } from '@/components/widgets/SueltaloWidget'

export function MobileFAB() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Capturar idea o tarea"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '20px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--acc)',
          color: '#fff',
          fontSize: '24px',
          fontWeight: 300,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(230,59,46,0.5)',
          zIndex: 50,
          lineHeight: 1,
        }}
      >
        +
      </button>

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="fab-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            {/* Backdrop */}
            <div
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{
                position: 'relative',
                background: 'var(--bg-2)',
                borderRadius: '20px 20px 0 0',
                padding: '8px 0 0',
                zIndex: 1,
              }}
            >
              {/* Drag handle */}
              <div style={{ width: '36px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 12px' }} />
              <SueltaloWidget />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/MobileFAB.tsx
git commit -m "feat(mobile): add MobileFAB floating button with SueltaloWidget bottom sheet"
```

---

## Task 7: IphoneLayout

**Files:**
- Create: `src/components/mobile/IphoneLayout.tsx`

- [ ] **Crear `src/components/mobile/IphoneLayout.tsx`**

```tsx
'use client'
import { useState, useRef, useCallback } from 'react'
import { IphoneHeader }  from './IphoneHeader'
import { IphoneSwiper }  from './IphoneSwiper'
import { MobileFAB }     from './MobileFAB'
import { ProyectoDrawer }  from '@/components/drawers/ProyectoDrawer'
import { CalendarioDrawer } from '@/components/drawers/CalendarioDrawer'
import { PropuestaModal }   from '@/components/modals/PropuestaModal'
import { IdeaModal }        from '@/components/modals/IdeaModal'
import { CotizacionModal }  from '@/components/modals/CotizacionModal'

export function IphoneLayout() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scrollToSection = useCallback((index: number) => {
    scrollRef.current?.scrollTo({ left: index * window.innerWidth, behavior: 'smooth' })
  }, [])

  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}
    >
      <IphoneHeader activeIndex={activeIndex} onDotClick={scrollToSection} />
      <IphoneSwiper
        activeIndex={activeIndex}
        onActiveChange={setActiveIndex}
        scrollRef={scrollRef}
      />
      <MobileFAB />
      <ProyectoDrawer />
      <CalendarioDrawer />
      <PropuestaModal />
      <IdeaModal />
      <CotizacionModal />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/IphoneLayout.tsx
git commit -m "feat(mobile): add IphoneLayout assembling header, swiper, FAB and overlays"
```

---

## Task 8: iPad components

**Files:**
- Create: `src/components/mobile/IpadSidebar.tsx`
- Create: `src/components/mobile/IpadHomeGrid.tsx`

- [ ] **Crear `src/components/mobile/IpadSidebar.tsx`**

```tsx
'use client'
import { usePanelContext } from '@/context/PanelContext'
import type { SeccionActiva } from '@/context/PanelContext'

const NAV_ITEMS: { id: SeccionActiva; label: string; icon: string }[] = [
  { id: 'inicio',       label: 'Inicio',       icon: '⚡' },
  { id: 'proyectos',    label: 'Proyectos',    icon: '📁' },
  { id: 'pipeline',     label: 'Pipeline',     icon: '💼' },
  { id: 'clientes',     label: 'Clientes',     icon: '👥' },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: '📄' },
  { id: 'balance',      label: 'Balance',      icon: '📊' },
  { id: 'pendientes',   label: 'Pendientes',   icon: '✓'  },
  { id: 'instagram',    label: 'Instagram',    icon: '📸' },
]

export function IpadSidebar() {
  const { seccionActiva, cambiarSeccion } = usePanelContext()

  return (
    <aside
      style={{
        width: '120px',
        flexShrink: 0,
        background: 'var(--bg-2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '16px 12px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.3px' }}>
          neptumstudio
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '6px 0', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const isActive = seccionActiva === item.id
          return (
            <button
              key={item.id}
              onClick={() => cambiarSeccion(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                border: 'none',
                borderLeft: isActive ? '2px solid var(--acc)' : '2px solid transparent',
                background: isActive ? `rgba(var(--acc-rgb), 0.08)` : 'transparent',
                color: isActive ? 'var(--acc)' : 'var(--text-2)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <span style={{ fontSize: '15px', flexShrink: 0, width: '18px', textAlign: 'center' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
```

- [ ] **Crear `src/components/mobile/IpadHomeGrid.tsx`**

```tsx
'use client'
import { IngresosHeroWidget }  from '@/components/widgets/IngresosHeroWidget'
import { PipelineStatWidget }  from '@/components/widgets/PipelineStatWidget'
import { ProyectosStatWidget } from '@/components/widgets/ProyectosStatWidget'
import { InstagramStatWidget } from '@/components/widgets/InstagramStatWidget'
import { ProyectosListWidget } from '@/components/widgets/ProyectosListWidget'
import { IdeasWidget }         from '@/components/widgets/IdeasWidget'
import { PendientesWidget }    from '@/components/widgets/PendientesWidget'
import { CalendarioWidget }    from '@/components/widgets/CalendarioWidget'
import { SueltaloWidget }      from '@/components/widgets/SueltaloWidget'

export function IpadHomeGrid() {
  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto">
      {/* Row 1: 4 stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <IngresosHeroWidget />
        <PipelineStatWidget />
        <ProyectosStatWidget />
        <InstagramStatWidget />
      </div>
      {/* Row 2: proyectos 2/3 + ideas 1/3 */}
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <ProyectosListWidget />
        <IdeasWidget />
      </div>
      {/* Row 3: pendientes + calendario + suéltalo */}
      <div className="grid grid-cols-3 gap-3">
        <PendientesWidget />
        <CalendarioWidget />
        <SueltaloWidget />
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/IpadSidebar.tsx src/components/mobile/IpadHomeGrid.tsx
git commit -m "feat(mobile): add IpadSidebar and IpadHomeGrid components"
```

---

## Task 9: IpadLayout

**Files:**
- Create: `src/components/mobile/IpadLayout.tsx`

- [ ] **Crear `src/components/mobile/IpadLayout.tsx`**

```tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePanelContext }   from '@/context/PanelContext'
import { IpadSidebar }       from './IpadSidebar'
import { IpadHomeGrid }      from './IpadHomeGrid'
import { ProyectosPageWidget }  from '@/components/widgets/ProyectosPageWidget'
import { PipelinePageWidget }   from '@/components/widgets/PipelinePageWidget'
import { ContactosWidget }      from '@/components/widgets/ContactosWidget'
import { CotizacionesWidget }   from '@/components/widgets/CotizacionesWidget'
import { PendientesPageWidget } from '@/components/widgets/PendientesPageWidget'
import { BalancePageWidget }    from '@/components/widgets/BalancePageWidget'
import { InstagramPageWidget }  from '@/components/widgets/InstagramPageWidget'
import { ProyectoDrawer }       from '@/components/drawers/ProyectoDrawer'
import { CalendarioDrawer }     from '@/components/drawers/CalendarioDrawer'
import { PropuestaModal }       from '@/components/modals/PropuestaModal'
import { IdeaModal }            from '@/components/modals/IdeaModal'
import { CotizacionModal }      from '@/components/modals/CotizacionModal'

const fade = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.18 },
}

export function IpadLayout() {
  const { seccionActiva } = usePanelContext()

  return (
    <div
      style={{ display: 'flex', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}
    >
      <IpadSidebar />

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {seccionActiva === 'inicio' && (
            <motion.div key="inicio" {...fade} style={{ flex: 1, overflow: 'hidden' }}>
              <IpadHomeGrid />
            </motion.div>
          )}
          {seccionActiva === 'proyectos' && (
            <motion.div key="proyectos" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <ProyectosPageWidget />
            </motion.div>
          )}
          {seccionActiva === 'pipeline' && (
            <motion.div key="pipeline" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <PipelinePageWidget />
            </motion.div>
          )}
          {(seccionActiva === 'clientes' || seccionActiva === 'contacto') && (
            <motion.div key="clientes" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <ContactosWidget />
            </motion.div>
          )}
          {seccionActiva === 'cotizaciones' && (
            <motion.div key="cotizaciones" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <CotizacionesWidget />
            </motion.div>
          )}
          {seccionActiva === 'pendientes' && (
            <motion.div key="pendientes" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <PendientesPageWidget />
            </motion.div>
          )}
          {seccionActiva === 'balance' && (
            <motion.div key="balance" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <BalancePageWidget />
            </motion.div>
          )}
          {seccionActiva === 'instagram' && (
            <motion.div key="instagram" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <InstagramPageWidget />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ProyectoDrawer />
      <CalendarioDrawer />
      <PropuestaModal />
      <IdeaModal />
      <CotizacionModal />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/IpadLayout.tsx
git commit -m "feat(mobile): add IpadLayout with sidebar and animated section switching"
```

---

## Task 10: Actualizar page.tsx con routing

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Actualizar `src/app/page.tsx`**

```tsx
'use client'
import { useState, useEffect } from 'react'
import { useMediaQuery }   from '@/hooks/useMediaQuery'
import { DesktopLayout }   from '@/components/mobile/DesktopLayout'
import { IphoneLayout }    from '@/components/mobile/IphoneLayout'
import { IpadLayout }      from '@/components/mobile/IpadLayout'

export default function PaginaPanel() {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)')

  useEffect(() => { setMounted(true) }, [])

  // SSR y pre-mount: renderiza DesktopLayout (evita hidratación mismatch)
  if (!mounted) return <DesktopLayout />
  if (isMobile)  return <IphoneLayout />
  if (isTablet)  return <IpadLayout />
  return <DesktopLayout />
}
```

- [ ] **Verificar TypeScript**

```bash
cd /Users/alejandrorodriguez/Desktop/neptum-dash && npx tsc --noEmit 2>&1 | head -20
```
Esperado: sin errores.

- [ ] **Build local**

```bash
cd /Users/alejandrorodriguez/Desktop/neptum-dash && npm run build 2>&1 | tail -10
```
Esperado: build exitoso.

- [ ] **Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(mobile): wire layout router — iPhone/iPad/Desktop by breakpoint"
```

---

## Task 11: Deploy y verificación

- [ ] **Push a producción**

```bash
cd /Users/alejandrorodriguez/Desktop/neptum-dash && git push origin main
```

- [ ] **Esperar deploy (~35s)**

```bash
sleep 50 && npx vercel ls 2>&1 | head -8
```
Esperado: status `● Ready`.

- [ ] **Verificar desktop (≥1280px)** — abrir `neptum-dash.vercel.app` en navegador de escritorio. Debe verse idéntico al estado anterior.

- [ ] **Verificar iPad (768–1024px)** — abrir DevTools → device emulation → iPad Air. Debe verse sidebar izquierdo + grid de contenido.

- [ ] **Verificar iPhone (390px)** — en DevTools cambiar a iPhone 14 Pro. Debe verse 5 secciones deslizables con dots arriba + FAB rojo abajo-derecha.

- [ ] **Push estado final**

```bash
git add -A && git commit -m "feat(mobile): complete iPhone swiper + iPad sidebar responsive layout" && git push origin main
```
