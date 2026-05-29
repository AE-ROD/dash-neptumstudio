'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePanelContext } from '@/context/PanelContext'
import { usePendientes } from '@/hooks/usePendientes'
import { DrawerBase } from './DrawerBase'

type FiltroTipo = 'HOY' | 'SEMANA' | 'TODOS'

const ETIQUETAS_FILTRO: Record<FiltroTipo, string> = {
  HOY: 'Hoy',
  SEMANA: 'Esta semana',
  TODOS: 'Todos',
}

export function PendientesDrawer() {
  const { drawerAbierto } = usePanelContext()
  const { pendientes, toggleCompletado, agregarPendiente } = usePendientes()
  const [filtro,     setFiltro]     = useState<FiltroTipo>('SEMANA')
  const [nuevoTexto, setNuevoTexto] = useState('')

  const estaAbierto = drawerAbierto === 'pendientes'

  const pendientesFiltrados = pendientes.filter(p => {
    if (filtro === 'TODOS') return true
    if (filtro === 'SEMANA') return p.estaSemana
    return !p.completado // HOY muestra solo incompletos
  })

  async function agregarNuevo() {
    if (!nuevoTexto.trim()) return
    await agregarPendiente(nuevoTexto)
    setNuevoTexto('')
  }

  return (
    <DrawerBase estaAbierto={estaAbierto} titulo="Pendientes">
      <div className="flex flex-col gap-4">

        {/* Filtros */}
        <div className="flex gap-1.5">
          {(Object.keys(ETIQUETAS_FILTRO) as FiltroTipo[]).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`
                text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all
                ${filtro === f
                  ? 'bg-[#111] text-white border-[#111]'
                  : 'border-[#ddd] text-[#888] hover:border-[#111]'
                }
              `}
            >
              {ETIQUETAS_FILTRO[f]}
            </button>
          ))}
        </div>

        {/* Lista */}
        <AnimatePresence mode="popLayout">
          {pendientesFiltrados.map((pendiente) => (
            <motion.div
              key={pendiente.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
              className="flex items-start gap-3 py-2 border-b border-[#F5F5F3] last:border-0"
            >
              <button
                onClick={() => toggleCompletado(pendiente.id, !pendiente.completado)}
                className={`
                  w-[18px] h-[18px] rounded border-[1.5px] mt-0.5 flex-shrink-0 flex items-center justify-center
                  transition-colors duration-150
                  ${pendiente.completado ? 'bg-[#111] border-[#111]' : 'border-[#ccc]'}
                `}
              >
                {pendiente.completado && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-white text-[10px] font-black"
                  >
                    ✓
                  </motion.span>
                )}
              </button>
              <span className={`text-[13px] leading-snug ${
                pendiente.completado ? 'line-through text-[#ccc]' : 'text-[#111]'
              }`}>
                {pendiente.texto}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input para agregar nuevo */}
        <div className="flex gap-2 pt-2 border-t border-[#F5F5F3]">
          <input
            value={nuevoTexto}
            onChange={e => setNuevoTexto(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && agregarNuevo()}
            placeholder="Nuevo pendiente..."
            className="flex-1 bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#111] transition-colors"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          />
          <button
            onClick={agregarNuevo}
            className="bg-[#111] text-white rounded-lg px-4 py-2 font-black text-[12px]"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            +
          </button>
        </div>
      </div>
    </DrawerBase>
  )
}
