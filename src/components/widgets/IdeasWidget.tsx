'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useIdeas } from '@/hooks/useIdeas'
import { usePanelContext } from '@/context/PanelContext'

const CHIP_COLORES: Record<string, { bg: string; text: string }> = {
  IDEA:        { bg: '#F0F0EE', text: '#555' },
  MEJORA:      { bg: '#FEF3C7', text: '#92400E' },
  OPORTUNIDAD: { bg: '#DCFCE7', text: '#166534' },
  TAREA:       { bg: '#FEE2E2', text: '#991B1B' },
}

const EMOJI_ETIQUETA: Record<string, string> = {
  IDEA: '💡', MEJORA: '🔧', OPORTUNIDAD: '🌱', TAREA: '✓',
}

export function IdeasWidget() {
  const { ideas, cargando } = useIdeas()
  const { abrirModal } = usePanelContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.72 }}
      className="rounded-2xl p-5 shadow-sm flex flex-col gap-3 min-h-0"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => abrirModal('idea')}
          className="font-black text-[15px] tracking-tight hover:text-[#E63B2E] transition-colors text-left"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito)' }}
        >
          Capturado
        </button>
        <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--text-2)' }}>
          {ideas.length}
        </span>
      </div>

      <div className="flex flex-col gap-0 overflow-hidden">
        <AnimatePresence initial={false}>
          {cargando ? (
            <span className="text-[13px] py-2" style={{ color: 'var(--text-2)' }}>Cargando...</span>
          ) : ideas.length === 0 ? (
            <span className="text-[13px] py-2" style={{ color: 'var(--text-2)' }}>Nada capturado aún</span>
          ) : (
            ideas.slice(0, 10).map((idea) => {
              const chip = CHIP_COLORES[idea.etiqueta] ?? CHIP_COLORES.IDEA
              return (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', borderColor: 'var(--border)' }}
                  className="flex items-start gap-2 py-2 border-b last:border-0"
                >
                  <span
                    style={{ background: chip.bg, color: chip.text }}
                    className="text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  >
                    {EMOJI_ETIQUETA[idea.etiqueta]} {idea.etiqueta}
                  </span>
                  <span className="text-[13px] leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
                    {idea.texto}
                  </span>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
