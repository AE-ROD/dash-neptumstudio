'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePanelContext } from '@/context/PanelContext'
import { useEffect } from 'react'

interface ModalBaseProps {
  estaAbierto: boolean
  children: React.ReactNode
}

export function ModalBase({ estaAbierto, children }: ModalBaseProps) {
  const { cerrarOverlay } = usePanelContext()

  useEffect(() => {
    function manejarEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrarOverlay()
    }
    if (estaAbierto) document.addEventListener('keydown', manejarEscape)
    return () => document.removeEventListener('keydown', manejarEscape)
  }, [estaAbierto, cerrarOverlay])

  return (
    <AnimatePresence>
      {estaAbierto && (
        /* Backdrop — opacity-only, sin blur para evitar repaint constante */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={cerrarOverlay}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35"
        >
          {/* Card — will-change promueve a capa GPU, scale range pequeño */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{ scale: 0.97,    opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            style={{ willChange: 'transform, opacity' }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[80vh] overflow-hidden flex flex-col"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
