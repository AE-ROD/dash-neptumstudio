'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePanelContext } from '@/context/PanelContext'

interface DrawerBaseProps {
  estaAbierto: boolean
  titulo: string
  children: React.ReactNode
}

export function DrawerBase({ estaAbierto, titulo, children }: DrawerBaseProps) {
  const { cerrarOverlay } = usePanelContext()

  return (
    <AnimatePresence>
      {estaAbierto && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={cerrarOverlay}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel lateral */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-[440px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F5F3]">
              <span
                className="font-black text-[16px] text-[#111] tracking-tight"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                {titulo}
              </span>
              <button
                onClick={cerrarOverlay}
                className="w-7 h-7 rounded-full bg-[#F0F0EE] flex items-center justify-center text-[#888] hover:bg-[#E8E8E6] transition-colors text-[13px]"
              >
                ✕
              </button>
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
