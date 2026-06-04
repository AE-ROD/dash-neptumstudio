# Mejora Modal Capturado + Página Pendientes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el widget Capturado en un modal completo con ideas por categoría, eliminar el drawer de Pendientes del pill de navegación, y añadir un panel de Capturado por categorías en la página dedicada de Pendientes.

**Architecture:** Tres cambios independientes sobre componentes existentes. `IdeaModal` se convierte en visor completo usando `useIdeas()`. `PanelHeader` deja de llamar `abrirDrawer` al presionar el pill Pendientes. `PendientesPageWidget` adopta grid 2 columnas con panel derecho de Capturado.

**Tech Stack:** Next.js 15 App Router, React 19, Framer Motion, Tailwind CSS, `useIdeas` y `usePanelContext` hooks existentes.

---

## Estructura de archivos

| Acción | Archivo |
|--------|---------|
| Modificar | `src/components/widgets/IdeasWidget.tsx` — añadir click en título |
| Modificar | `src/components/modals/IdeaModal.tsx` — reemplazar contenido por visor de ideas |
| Modificar | `src/components/layout/PanelHeader.tsx` — quitar `abrirDrawer('pendientes')` |
| Modificar | `src/app/page.tsx` — quitar import y uso de `PendientesDrawer` |
| Modificar | `src/components/widgets/PendientesPageWidget.tsx` — layout 2 columnas + panel Capturado |

---

## Task 1: Crear rama de trabajo

**Files:**
- Ninguno (operación git)

- [ ] **Step 1: Crear y cambiar a la rama `feat/mejora-modal`**

Ejecutar desde `/Users/alejandrorodriguez/Desktop/Brain-Strom/neptumstudio`:

```bash
git checkout -b feat/mejora-modal
```

Resultado esperado: `Switched to a new branch 'feat/mejora-modal'`

---

## Task 2: Hacer el título de IdeasWidget clickeable

**Files:**
- Modify: `src/components/widgets/IdeasWidget.tsx`

El widget actualmente muestra el título "Capturado" como un `<span>` estático. Hay que añadir `usePanelContext` e invocar `abrirModal('idea')` al hacer clic en él.

- [ ] **Step 1: Reemplazar el contenido completo de `IdeasWidget.tsx`**

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useIdeas } from '@/hooks/useIdeas'
import { usePanelContext } from '@/context/PanelContext'

const CHIP_COLORES: Record<string, { bg: string; text: string }> = {
  IDEA:        { bg: '#F0F0EE', text: '#555' },
  MEJORA:      { bg: '#FEF3C7', text: '#92400E' },
  OPORTUNIDAD: { bg: '#DCFCE7', text: '#166534' },
  TAREA:       { bg: '#FEE2E2', text: '#991B1B' },
}

const EMOJI_ETIQUETA: Record<string, string> = {
  IDEA: '💡', MEJORA: '🔧', OPORTUNIDAD: '🌱', TAREA: '✓',
}

export function IdeasWidget() {
  const { ideas, cargando } = useIdeas()
  const { abrirModal } = usePanelContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.72 }}
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 min-h-0"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => abrirModal('idea')}
          className="font-black text-[15px] text-[#111] tracking-tight hover:text-[#E63B2E] transition-colors text-left"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          Capturado
        </button>
        <span className="text-[12px] text-[#bbb] font-bold tabular-nums">
          {ideas.length}
        </span>
      </div>

      <div className="flex flex-col gap-0 overflow-hidden">
        <AnimatePresence initial={false}>
          {cargando ? (
            <span className="text-[#bbb] text-[13px] py-2">Cargando...</span>
          ) : ideas.length === 0 ? (
            <span className="text-[#bbb] text-[13px] py-2">Nada capturado aún</span>
          ) : (
            ideas.slice(0, 10).map((idea) => {
              const chip = CHIP_COLORES[idea.etiqueta] ?? CHIP_COLORES.IDEA
              return (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                  className="flex items-start gap-2 py-2 border-b border-[#F5F5F3] last:border-0"
                >
                  <span
                    style={{ background: chip.bg, color: chip.text }}
                    className="text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  >
                    {EMOJI_ETIQUETA[idea.etiqueta]} {idea.etiqueta}
                  </span>
                  <span className="text-[13px] text-[#333] leading-snug line-clamp-2">
                    {idea.texto}
                  </span>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Verificar que no hay errores de TypeScript**

```bash
cd /Users/alejandrorodriguez/Desktop/Brain-Strom/neptumstudio && npx tsc --noEmit 2>&1 | head -20
```

Resultado esperado: sin output (0 errores).

- [ ] **Step 3: Commit**

```bash
git add src/components/widgets/IdeasWidget.tsx
git commit -m "feat: IdeasWidget título clickeable abre modal Capturado"
```

---

## Task 3: Reescribir IdeaModal como visor completo de Capturado

**Files:**
- Modify: `src/components/modals/IdeaModal.tsx`

Actualmente muestra "Próximamente". Lo reemplazamos por la lista completa de ideas agrupadas por categoría en el orden: IDEA → MEJORA → OPORTUNIDAD → TAREA.

- [ ] **Step 1: Reemplazar el contenido completo de `IdeaModal.tsx`**

```tsx
'use client'
import { usePanelContext } from '@/context/PanelContext'
import { useIdeas } from '@/hooks/useIdeas'
import { ModalBase } from './ModalBase'

const CATEGORIAS = ['IDEA', 'MEJORA', 'OPORTUNIDAD', 'TAREA'] as const
type Categoria = typeof CATEGORIAS[number]

const CHIP_COLORES: Record<Categoria, { bg: string; text: string }> = {
  IDEA:        { bg: '#F0F0EE', text: '#555' },
  MEJORA:      { bg: '#FEF3C7', text: '#92400E' },
  OPORTUNIDAD: { bg: '#DCFCE7', text: '#166534' },
  TAREA:       { bg: '#FEE2E2', text: '#991B1B' },
}

const EMOJI_ETIQUETA: Record<Categoria, string> = {
  IDEA: '💡', MEJORA: '🔧', OPORTUNIDAD: '🌱', TAREA: '✓',
}

export function IdeaModal() {
  const { modalAbierto, cerrarOverlay } = usePanelContext()
  const { ideas, cargando } = useIdeas()
  const estaAbierto = modalAbierto === 'idea'

  const porCategoria = CATEGORIAS.reduce<Record<Categoria, typeof ideas>>(
    (acc, cat) => {
      acc[cat] = ideas.filter(i => i.etiqueta === cat)
      return acc
    },
    { IDEA: [], MEJORA: [], OPORTUNIDAD: [], TAREA: [] }
  )

  return (
    <ModalBase estaAbierto={estaAbierto}>
      {/* Header */}
      <div className="bg-[#111] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="font-black text-[15px] text-white"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            Capturado
          </span>
          <span className="text-[11px] text-white/40 font-bold tabular-nums">
            {ideas.length}
          </span>
        </div>
        <button
          onClick={cerrarOverlay}
          aria-label="Cerrar"
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors text-[13px]"
        >
          ✕
        </button>
      </div>

      {/* Cuerpo scrollable */}
      <div className="px-6 py-5 overflow-y-auto flex flex-col gap-5">
        {cargando ? (
          <p className="text-[13px] text-[#bbb]">Cargando...</p>
        ) : ideas.length === 0 ? (
          <p className="text-[13px] text-[#bbb]">Nada capturado aún</p>
        ) : (
          CATEGORIAS.map(cat => {
            const items = porCategoria[cat]
            if (items.length === 0) return null
            const chip = CHIP_COLORES[cat]
            return (
              <div key={cat} className="flex flex-col gap-2">
                {/* Header de categoría */}
                <div className="flex items-center gap-2">
                  <span
                    style={{ background: chip.bg, color: chip.text }}
                    className="text-[11px] font-extrabold px-2.5 py-1 rounded-full"
                  >
                    {EMOJI_ETIQUETA[cat]} {cat}
                  </span>
                  <span className="text-[11px] text-[#bbb] font-bold">{items.length}</span>
                </div>
                {/* Items */}
                <div className="flex flex-col gap-0">
                  {items.map(idea => (
                    <div
                      key={idea.id}
                      className="py-2 border-b border-[#F5F5F3] last:border-0"
                    >
                      <p className="text-[13px] text-[#333] leading-snug">{idea.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </ModalBase>
  )
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/alejandrorodriguez/Desktop/Brain-Strom/neptumstudio && npx tsc --noEmit 2>&1 | head -20
```

Resultado esperado: sin output.

- [ ] **Step 3: Commit**

```bash
git add src/components/modals/IdeaModal.tsx
git commit -m "feat: IdeaModal muestra todas las ideas agrupadas por categoría"
```

---

## Task 4: Eliminar drawer del pill Pendientes

**Files:**
- Modify: `src/components/layout/PanelHeader.tsx` (línea 36)
- Modify: `src/app/page.tsx` (quitar import y uso de `PendientesDrawer`)

- [ ] **Step 1: Editar `PanelHeader.tsx` — quitar la llamada a `abrirDrawer`**

Localizar la función `manejarPill` (líneas 34–38):

```tsx
// ANTES
function manejarPill(id: SeccionActiva) {
  cambiarSeccion(id)
  if (id === 'pendientes') abrirDrawer('pendientes')
  if (id === 'instagram')  abrirDrawer('instagram')
}
```

Reemplazar por:

```tsx
// DESPUÉS
function manejarPill(id: SeccionActiva) {
  cambiarSeccion(id)
  if (id === 'instagram') abrirDrawer('instagram')
}
```

- [ ] **Step 2: Verificar si `abrirDrawer` sigue siendo necesario en PanelHeader**

Con la línea de `pendientes` eliminada, `abrirDrawer` sigue siendo usado para `instagram`. No hay que quitar la desestructuración de `usePanelContext`.

- [ ] **Step 3: Editar `src/app/page.tsx` — quitar PendientesDrawer**

Localizar y eliminar la línea de import (línea 27):
```tsx
import { PendientesDrawer }           from '@/components/drawers/PendientesDrawer'
```

Localizar y eliminar el uso en el JSX (dentro de `{/* Overlays */}`, línea 136):
```tsx
<PendientesDrawer />
```

- [ ] **Step 4: Verificar TypeScript**

```bash
cd /Users/alejandrorodriguez/Desktop/Brain-Strom/neptumstudio && npx tsc --noEmit 2>&1 | head -20
```

Resultado esperado: sin output.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/PanelHeader.tsx src/app/page.tsx
git commit -m "feat: pill Pendientes navega a página sin abrir drawer lateral"
```

---

## Task 5: Layout 2 columnas en PendientesPageWidget con panel Capturado

**Files:**
- Modify: `src/components/widgets/PendientesPageWidget.tsx`

La página actualmente es una columna. La envolvemos en un grid `grid-cols-[1fr_320px]`. La columna derecha es un nuevo componente inline con las ideas agrupadas por categoría.

- [ ] **Step 1: Reemplazar el contenido completo de `PendientesPageWidget.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePendientes } from '@/hooks/usePendientes'
import { useIdeas } from '@/hooks/useIdeas'

const CATEGORIAS = ['IDEA', 'MEJORA', 'OPORTUNIDAD', 'TAREA'] as const
type Categoria = typeof CATEGORIAS[number]

const CHIP_COLORES: Record<Categoria, { bg: string; text: string }> = {
  IDEA:        { bg: '#F0F0EE', text: '#555' },
  MEJORA:      { bg: '#FEF3C7', text: '#92400E' },
  OPORTUNIDAD: { bg: '#DCFCE7', text: '#166534' },
  TAREA:       { bg: '#FEE2E2', text: '#991B1B' },
}

const EMOJI_ETIQUETA: Record<Categoria, string> = {
  IDEA: '💡', MEJORA: '🔧', OPORTUNIDAD: '🌱', TAREA: '✓',
}

function CapturadoPanel() {
  const { ideas, cargando } = useIdeas()

  const porCategoria = CATEGORIAS.reduce<Record<Categoria, typeof ideas>>(
    (acc, cat) => {
      acc[cat] = ideas.filter(i => i.etiqueta === cat)
      return acc
    },
    { IDEA: [], MEJORA: [], OPORTUNIDAD: [], TAREA: [] }
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-0 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span
          className="font-black text-[15px] text-[#111] tracking-tight"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          Capturado
        </span>
        <span className="text-[12px] text-[#bbb] font-bold tabular-nums">
          {ideas.length}
        </span>
      </div>

      {cargando ? (
        <p className="text-[13px] text-[#bbb]">Cargando...</p>
      ) : ideas.length === 0 ? (
        <p className="text-[13px] text-[#bbb]">Nada capturado aún</p>
      ) : (
        <div className="flex flex-col gap-4">
          {CATEGORIAS.map(cat => {
            const items = porCategoria[cat]
            if (items.length === 0) return null
            const chip = CHIP_COLORES[cat]
            return (
              <div key={cat} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    style={{ background: chip.bg, color: chip.text }}
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                  >
                    {EMOJI_ETIQUETA[cat]} {cat}
                  </span>
                  <span className="text-[10px] text-[#bbb] font-bold">{items.length}</span>
                </div>
                <div className="flex flex-col">
                  {items.map(idea => (
                    <div
                      key={idea.id}
                      className="py-1.5 border-b border-[#F5F5F3] last:border-0"
                    >
                      <p className="text-[12px] text-[#333] leading-snug">{idea.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function PendientesPageWidget() {
  const { pendientes, cargando, toggleCompletado, agregarPendiente } = usePendientes()
  const [nuevo,      setNuevo]      = useState('')
  const [guardando,  setGuardando]  = useState(false)
  const [filtro,     setFiltro]     = useState<'TODOS' | 'PENDIENTE' | 'DONE'>('PENDIENTE')

  const filtrados = pendientes.filter(p =>
    filtro === 'TODOS'     ? true :
    filtro === 'PENDIENTE' ? !p.completado :
    p.completado
  )
  const stats = {
    total:     pendientes.length,
    pendiente: pendientes.filter(p => !p.completado).length,
    hechos:    pendientes.filter(p =>  p.completado).length,
    semana:    pendientes.filter(p => p.estaSemana && !p.completado).length,
  }

  async function agregar() {
    if (!nuevo.trim()) return
    setGuardando(true)
    try { await agregarPendiente(nuevo.trim()); setNuevo('') }
    finally { setGuardando(false) }
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4 items-start">

      {/* Columna izquierda: pendientes */}
      <div className="flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total',      value: stats.total,     color: '#0D1B2A' },
            { label: 'Esta semana',value: stats.semana,    color: '#3B5BDB' },
            { label: 'Pendientes', value: stats.pendiente, color: '#D97706' },
            { label: 'Completados',value: stats.hechos,    color: '#1A7F4B' },
          ].map(s => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm">
              <div
                className="text-[10px] font-semibold text-[#A7ADBA] uppercase tracking-widest mb-1"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                {s.label}
              </div>
              <div
                className="font-bold text-[28px] leading-none"
                style={{ color: s.color, fontFamily: 'var(--font-cormorant)' }}
              >
                {s.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lista */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#0D1B2A] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <path d="M20 2 L20 30" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M20 2 L14 10" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M20 2 L26 10" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M11 14 L11 28" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M29 14 L29 28" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M8 30 Q20 36 32 30" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
              <span
                className="font-semibold text-[13px] text-white tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em' }}
              >
                Pendientes
              </span>
            </div>
            <div className="flex bg-white/10 rounded-full p-0.5 gap-0.5">
              {(['PENDIENTE', 'DONE', 'TODOS'] as const).map(f => (
                <button key={f} onClick={() => setFiltro(f)}
                  className="text-[10px] font-semibold px-3 py-1 rounded-full transition-all"
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    background: filtro === f ? '#F6F4F0' : 'transparent',
                    color:      filtro === f ? '#0D1B2A' : '#A7ADBA',
                  }}
                >
                  {f === 'PENDIENTE' ? 'Pendientes' : f === 'DONE' ? 'Completados' : 'Todos'}
                </button>
              ))}
            </div>
          </div>

          {/* Input agregar */}
          <div className="px-6 py-3 border-b border-[#F0F2F5] flex gap-3">
            <input
              value={nuevo}
              onChange={e => setNuevo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && agregar()}
              placeholder="Nuevo pendiente… (Enter para guardar)"
              className="flex-1 bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            />
            <button
              onClick={agregar}
              disabled={!nuevo.trim() || guardando}
              className="px-4 py-2 rounded-xl text-[11px] font-semibold text-white disabled:opacity-40"
              style={{ background: '#0D1B2A', fontFamily: 'var(--font-dm-sans)' }}
            >
              {guardando ? '…' : '+ Agregar'}
            </button>
          </div>

          {/* Lista */}
          {cargando ? (
            <div
              className="py-16 text-center text-[#A7ADBA] text-[12px]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Cargando…
            </div>
          ) : filtrados.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-[#415466]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {filtro === 'DONE' ? 'Nada completado aún' : 'Todo al día'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filtrados.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-[#F5F7FA] last:border-0 group hover:bg-[#FAFBFC] transition-colors"
                >
                  <button
                    onClick={() => toggleCompletado(p.id, !p.completado)}
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all"
                    style={{
                      borderColor: p.completado ? '#1A7F4B' : '#D0D5DD',
                      background:  p.completado ? '#1A7F4B' : 'transparent',
                    }}
                  >
                    {p.completado && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <span
                    className="flex-1 text-[13px]"
                    style={{
                      fontFamily:     'var(--font-dm-sans)',
                      color:          p.completado ? '#A7ADBA' : '#0D1B2A',
                      textDecoration: p.completado ? 'line-through' : 'none',
                    }}
                  >
                    {p.texto}
                  </span>
                  {p.estaSemana && !p.completado && (
                    <span
                      className="text-[9px] font-semibold text-[#3B5BDB] bg-[#EEF2FF] px-2 py-0.5 rounded-full"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                      Esta semana
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Columna derecha: Capturado */}
      <CapturadoPanel />
    </div>
  )
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd /Users/alejandrorodriguez/Desktop/Brain-Strom/neptumstudio && npx tsc --noEmit 2>&1 | head -20
```

Resultado esperado: sin output.

- [ ] **Step 3: Commit**

```bash
git add src/components/widgets/PendientesPageWidget.tsx
git commit -m "feat: página Pendientes con panel Capturado por categorías"
```

---

## Task 6: Verificación final y push

**Files:**
- Ninguno (verificación + git)

- [ ] **Step 1: Arrancar el servidor de desarrollo**

```bash
cd /Users/alejandrorodriguez/Desktop/Brain-Strom/neptumstudio && npm run dev
```

Abrir `http://localhost:3000` y verificar:

1. **Capturado widget (inicio):** hacer clic en "Capturado" → se abre el modal con todas las ideas agrupadas por categoría. Cerrar con ✕ o Escape.
2. **Pill Pendientes:** hacer clic → navega a la página Pendientes sin que se abra ningún drawer lateral.
3. **Página Pendientes:** se ve el grid de 2 columnas — lista de pendientes a la izquierda, panel "Capturado" con categorías a la derecha.

- [ ] **Step 2: Push de la rama**

```bash
git push -u origin feat/mejora-modal
```

Resultado esperado: rama publicada en `https://github.com/AE-ROD/neptum-dash`.
