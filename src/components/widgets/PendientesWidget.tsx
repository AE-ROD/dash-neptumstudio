'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePendientes } from '@/hooks/usePendientes'
import { usePanelContext } from '@/context/PanelContext'

function IconoBasura() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

export function PendientesWidget() {
  const { pendientes, cargando, toggleCompletado, eliminarPendiente } = usePendientes()
  const { cambiarSeccion } = usePanelContext()
  const visibles = pendientes.slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.48 }}
      className="rounded-2xl p-5 shadow-sm"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-black text-[13px] tracking-tight"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito)' }}
        >
          Pendientes
        </span>
        <button
          onClick={() => cambiarSeccion('pendientes')}
          className="text-[11px] font-bold text-[#E63B2E]"
        >
          + Agregar
        </button>
      </div>

      <div className="flex flex-col">
        <AnimatePresence>
          {cargando
            ? <span className="text-xs py-4 text-center" style={{ color: 'var(--text-2)' }}>Cargando...</span>
            : visibles.map((pendiente) => (
              <motion.div
                key={pendiente.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', borderColor: 'var(--border)' }}
                className="flex items-center gap-2.5 py-1.5 border-b last:border-0 group"
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleCompletado(pendiente.id, !pendiente.completado)}
                  className="w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors duration-150"
                  style={{
                    borderColor: pendiente.completado ? '#1A7F4B' : '#D0D5DD',
                    background:  pendiente.completado ? '#1A7F4B' : 'transparent',
                  }}
                >
                  {pendiente.completado && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      xmlns="http://www.w3.org/2000/svg" width="8" height="8"
                      viewBox="0 0 24 24" fill="none" stroke="white"
                      strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"/>
                    </motion.svg>
                  )}
                </button>

                {/* Texto */}
                <span
                  className="flex-1 text-[12px] leading-snug transition-all duration-200 min-w-0"
                  style={{
                    color:          pendiente.completado ? 'var(--text-2)' : 'var(--text)',
                    textDecoration: pendiente.completado ? 'line-through' : 'none',
                  }}
                >
                  {pendiente.texto}
                </span>

                {/* Basura */}
                <button
                  onClick={() => eliminarPendiente(pendiente.id)}
                  className="flex-shrink-0 text-[#ccc] hover:text-[#E63B2E] transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Eliminar"
                >
                  <IconoBasura />
                </button>
              </motion.div>
            ))
          }
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
