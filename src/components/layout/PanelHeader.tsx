'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTemaTiempo, getSaludo, GRADIENTES_HEADER, COLORES_PILL } from '@/lib/tiempo'

const PILLS_NAV = [
  { id: 'inicio',      etiqueta: 'Inicio',      tieneActividad: false },
  { id: 'proyectos',   etiqueta: 'Proyectos',   tieneActividad: true  },
  { id: 'clientes',    etiqueta: 'Clientes',    tieneActividad: false },
  { id: 'pipeline',    etiqueta: 'Pipeline',    tieneActividad: true  },
  { id: 'ingresos',    etiqueta: 'Ingresos',    tieneActividad: false },
  { id: 'pendientes',  etiqueta: 'Pendientes',  tieneActividad: false },
  { id: 'instagram',   etiqueta: 'Instagram',   tieneActividad: false },
] as const

type PillId = typeof PILLS_NAV[number]['id']

export function PanelHeader() {
  const [horaActual,  setHoraActual]  = useState(new Date().getHours())
  const [pillActiva,  setPillActiva]  = useState<PillId>('inicio')

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraActual(new Date().getHours())
    }, 60_000)
    return () => clearInterval(intervalo)
  }, [])

  const tema      = getTemaTiempo(horaActual)
  const saludo    = getSaludo(tema)
  const gradiente = GRADIENTES_HEADER[tema]
  const colores   = COLORES_PILL[tema]

  return (
    <motion.header
      style={{ background: gradiente }}
      animate={{ background: gradiente }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="h-[76px] flex items-center px-9 gap-4 flex-shrink-0 relative z-10"
    >
      {/* Logo izquierda */}
      <div className="flex flex-col gap-0.5 min-w-fit">
        <span
          style={{ color: colores.activo, fontFamily: 'var(--font-nunito)' }}
          className="font-black text-[22px] tracking-tight leading-none"
        >
          NeptumStudio
          <span style={{ color: '#E63B2E' }}>.</span>
        </span>
        <span
          style={{ color: colores.texto }}
          className="text-[10px] font-semibold uppercase tracking-widest opacity-70"
        >
          panel de control
        </span>
      </div>

      {/* Separador */}
      <div
        style={{ background: colores.texto }}
        className="w-px h-5 opacity-20 flex-shrink-0"
      />

      {/* Pills centradas */}
      <nav className="flex-1 flex justify-center">
        <div
          style={{ background: `${colores.texto}14` }}
          className="flex items-center gap-1 rounded-full p-1"
        >
          {PILLS_NAV.map((pill) => {
            const estaActiva = pillActiva === pill.id
            return (
              <motion.button
                key={pill.id}
                onClick={() => setPillActiva(pill.id)}
                style={{
                  color: estaActiva ? colores.activoTexto : colores.texto,
                  fontFamily: 'var(--font-dm-sans)',
                }}
                className="relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                  <span
                    className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#E63B2E]"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </nav>

      {/* Derecha: saludo + avatar */}
      <div className="flex items-center gap-3 min-w-fit">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
          <span
            style={{ color: colores.texto }}
            className="text-[11px] font-bold opacity-70"
          >
            {saludo}
          </span>
        </div>
        <div
          style={{ background: '#E63B2E' }}
          className="w-8 h-8 rounded-full flex items-center justify-center"
        >
          <span
            style={{ fontFamily: 'var(--font-nunito)' }}
            className="font-black text-[13px] text-white"
          >
            A
          </span>
        </div>
      </div>
    </motion.header>
  )
}
