'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePendientes } from '@/hooks/usePendientes'
import { usePanelContext } from '@/context/PanelContext'

export function PendientesWidget() {
  const { pendientes, cargando, toggleCompletado } = usePendientes()
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
                className="flex items-start gap-2.5 py-1.5 border-b last:border-0"
              >
                <button
                  onClick={() => toggleCompletado(pendiente.id, !pendiente.completado)}
                  className={`
                    w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center
                    transition-colors duration-150
                    ${pendiente.completado
                      ? 'border-[#111]'
                      : 'border-[#ccc]'
                    }
                  `}
                >
                  {pendiente.completado && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white text-[8px] font-black"
                    >
                      ✓
                    </motion.span>
                  )}
                </button>
                <span
                  className="text-[12px] leading-snug transition-all duration-200"
                  style={{ color: pendiente.completado ? 'var(--text-2)' : 'var(--text)', textDecoration: pendiente.completado ? 'line-through' : 'none' }}
                >
                  {pendiente.texto}
                </span>
              </motion.div>
            ))
          }
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
