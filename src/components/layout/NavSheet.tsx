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
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-4 pb-10"
            style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }} />
            <div className="grid grid-cols-3 gap-2">
              {SECCIONES.map(({ id, etiqueta }) => {
                const activa = seccionActiva === id
                return (
                  <motion.button
                    key={id}
                    onClick={() => onSelect(id)}
                    className="py-3 px-2 rounded-xl text-xs font-semibold capitalize"
                    style={{
                      background: activa ? colores.activo : 'var(--surf)',
                      color:      activa ? colores.activoTexto : 'var(--text-2)',
                      fontFamily: 'var(--font-body)',
                      border:     '1px solid var(--border)',
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
