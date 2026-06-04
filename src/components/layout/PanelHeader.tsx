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
  const [horaActual,  setHoraActual]  = useState(12) // valor neutro para SSR
  const [esDark,      setEsDark]      = useState<boolean>(true)
  const [navOpen, setNavOpen] = useState(false)
  const { seccionActiva, cambiarSeccion, abrirDrawer } = usePanelContext()

  useEffect(() => {
    setHoraActual(new Date().getHours())
    const intervalo = setInterval(() => setHoraActual(new Date().getHours()), 60_000)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setEsDark(mq.matches)
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

          {/* Pills */}
          <nav className="flex-1 flex justify-center overflow-x-auto">
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
              <span className="font-black text-[13px] text-white" style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
          </div>
        </div>

        {/* ── Mobile (<768px) ── */}
        <div className="flex md:hidden h-[60px] items-center px-4 justify-between">
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
