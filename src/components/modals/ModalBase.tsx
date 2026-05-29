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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={cerrarOverlay}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(4px) brightness(0.95)' }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{ scale: 0.95,    opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[80vh] overflow-hidden flex flex-col"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
