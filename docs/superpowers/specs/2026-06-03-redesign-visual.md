# Rediseño Visual Dashboard — Design Spec
**Date:** 2026-06-03
**Project:** dash-neptumstudio
**Branch:** feat/mejora-modal → nueva rama `feat/redesign-visual`
**Status:** Approved

---

## Objetivo

Rediseñar el shell visual del dashboard para que:
1. Se adapte automáticamente al modo oscuro/claro del dispositivo (`prefers-color-scheme`)
2. El header tenga colores distintos según horario **en ambos modos** (no solo en light)
3. Incorpore el tridente SVG como logo oficial
4. Sea responsive (desktop / tablet / mobile)
5. Los widgets entren con stagger escalonado sin pantalla de carga

---

## Decisiones de diseño

| Aspecto | Decisión |
|---|---|
| Paleta base dark | Navy deep `#0D1B2A` + cards navy mid `#1B2B45` |
| Paleta base light | Cream `#F6F4F0` + cards blancas `#FFFFFF` |
| Header dark | Gradientes oscuros según horario (ámbar profundo / azul noche / navy) |
| Header light | Gradientes actuales (ámbar cálido / azul cielo / cream neutro) |
| Logo | Tridente SVG + "neptumstudio" en Cormorant Garamond |
| Loader | Sin loader — widgets con stagger `delay: i * 0.06s` |
| Responsive | Desktop ≥1024px / Tablet 768-1023px / Mobile <768px |

---

## Archivos a modificar / crear

**Modificar:**
- `src/app/globals.css` — tokens CSS dark/light + transición suave
- `src/lib/tiempo.ts` — añadir `GRADIENTES_DARK` y `COLORES_DARK`
- `src/components/layout/PanelHeader.tsx` — logo SVG, detección de modo, responsive
- `src/app/layout.tsx` — añadir `prefers-color-scheme` en `<html>` + JetBrains Mono
- `src/app/page.tsx` — grid responsive + stagger de entrada por widget

**Crear:**
- `src/components/layout/NavSheet.tsx` — bottom sheet mobile para navegación

**Widgets (ajuste de tokens):**
Todos los widgets que tengan colores hardcodeados como `bg-white`, `text-gray-*`, `border-gray-*` deben migrar a `var(--bg-2)`, `var(--text)`, `var(--border)`. No se cambia la lógica de negocio.

---

## Sección 1: `globals.css`

```css
@import "tailwindcss";

:root {
  /* Dark mode (default) */
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

---

## Sección 2: `lib/tiempo.ts`

Añadir a los exports existentes:

```typescript
export const GRADIENTES_DARK: Record<TemaTiempo, string> = {
  manana: 'linear-gradient(120deg, #1a0f00, #2d1a00)',
  tarde:  'linear-gradient(120deg, #001a2d, #002a40)',
  noche:  'linear-gradient(120deg, #0D1B2A, #1B2B45)',
}

export const COLORES_DARK: Record<TemaTiempo, { texto: string; activo: string; activoTexto: string }> = {
  manana: { texto: '#FDE68A', activo: '#FEF3C7', activoTexto: '#1a0f00' },
  tarde:  { texto: '#BAE6FD', activo: '#E0F2FE', activoTexto: '#001a2d' },
  noche:  { texto: '#A7ADBA', activo: '#F8FAFC', activoTexto: '#0F172A' },
}
```

---

## Sección 3: `PanelHeader.tsx`

### Logo
Reemplazar el bloque de texto actual por:
```tsx
<div className="flex items-center gap-2 min-w-fit">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 68" fill="none"
    style={{ color: colores.texto, width: 22, height: 22, flexShrink: 0 }}>
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
```

### Detección de dark/light mode
```tsx
const [esDark, setEsDark] = useState<boolean>(() => {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})

useEffect(() => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: MediaQueryListEvent) => setEsDark(e.matches)
  mq.addEventListener('change', handler)
  return () => mq.removeEventListener('change', handler)
}, [])

const gradiente = esDark ? GRADIENTES_DARK[tema] : GRADIENTES_HEADER[tema]
const colores   = esDark ? COLORES_DARK[tema]    : COLORES_PILL[tema]
```

### Responsive
- **Desktop (≥768px):** comportamiento actual, pills completas
- **Mobile (<768px):** logo + botón hamburger. Pills ocultas. Botón abre `<NavSheet>`.
- En mobile, el `<nav>` con las pills se oculta con `hidden md:flex`.
- El botón hamburger visible solo en mobile: `flex md:hidden`.

---

## Sección 4: `NavSheet.tsx` (nuevo)

Bottom sheet de navegación para mobile:

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePanelContext } from '@/context/PanelContext'
import type { SeccionActiva } from '@/context/PanelContext'

interface Props {
  open: boolean
  onClose: () => void
  colores: { texto: string; activo: string; activoTexto: string }
}

export function NavSheet({ open, onClose, colores }: Props) {
  const { seccionActiva, cambiarSeccion } = usePanelContext()
  const PILLS = ['inicio','proyectos','clientes','pipeline','cotizaciones',
                 'contacto','balance','pendientes','instagram'] as SeccionActiva[]

  function seleccionar(id: SeccionActiva) {
    cambiarSeccion(id)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-4 pb-8"
            style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--border)' }} />
            <div className="grid grid-cols-3 gap-2">
              {PILLS.map(id => (
                <button key={id} onClick={() => seleccionar(id)}
                  className="py-3 px-2 rounded-xl text-xs font-semibold capitalize transition-colors"
                  style={{
                    background: seccionActiva === id ? colores.activo : 'var(--surf)',
                    color: seccionActiva === id ? colores.activoTexto : 'var(--text-2)',
                    fontFamily: 'var(--font-body)',
                  }}>
                  {id}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## Sección 5: `page.tsx` — Grid responsive + stagger

### Grid contenedor
Cada widget del dashboard inicio se envuelve individualmente en un `motion.div` con índice explícito para el delay. No se crea un array dinámico — cada widget JSX existente en la sección `inicio` recibe su propio `motion.div` con `delay: 0`, `delay: 0.06`, `delay: 0.12`, etc., asignados manualmente en orden de aparición visual (top-left → bottom-right).

```tsx
// Ejemplo para los primeros 3 widgets del inicio
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, delay: 0, ease: [0.16, 1, 0.3, 1] }}>
  <IngresosHeroWidget />
</motion.div>
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}>
  <PipelineStatWidget />
</motion.div>
// etc.
```

---

## Sección 6: Tipografía aplicada

| Componente | Cambio |
|---|---|
| `IngresosHeroWidget` | Valor principal → `font-family: var(--font-cormorant); font-weight: 300` |
| `PipelineStatWidget` | Número de leads → Cormorant Garamond |
| `ProyectosStatWidget` | Número de proyectos → Cormorant Garamond |
| `BalancePageWidget` | Totales → Cormorant Garamond |
| Todos los widgets | Colores hardcodeados → `var(--text)`, `var(--text-2)`, `var(--bg-2)`, `var(--border)` |

---

## Sección 7: Border radius estandarizado

| Elemento | Valor |
|---|---|
| Cards / widgets | `rounded-xl` (12px) |
| Pills navegación | `rounded-full` |
| Botones de acción | `rounded-md` (6px) |
| NavSheet (mobile) | `rounded-t-2xl` (20px top) |
| Badges / chips | `rounded-full` |

---

## Scope — lo que NO cambia

- Lógica de negocio de todos los widgets
- Hooks (`useIngresos`, `usePendientes`, etc.)
- API routes y Prisma schema
- Modales y drawers (solo actualización de tokens de color)
- `PanelContext` — sin cambios

---

## Checklist de verificación

```bash
npm run dev
```
- [ ] Dark mode: fondo navy, cards navy mid, header con gradientes oscuros según hora
- [ ] Light mode: fondo cream, cards blancas, header con gradientes vivos según hora
- [ ] Transición suave al cambiar modo del sistema (0.35s)
- [ ] Logo tridente visible en todas las horas y ambos modos
- [ ] Mobile (<768px): hamburger visible, pills ocultas, NavSheet funcional
- [ ] Tablet (768px): header en 1 línea compacta, pills en scroll horizontal
- [ ] Widgets entran con stagger sin loader
- [ ] Sin errores TypeScript: `npm run build`
