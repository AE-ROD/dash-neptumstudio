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

export function IdeasWidget() {
  const { ideas, cargando, completarIdea, descompletarIdea, eliminarIdea } = useIdeas()
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
              const completada = idea.estado === 'COMPLETADA'
              return (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ overflow: 'hidden', borderColor: 'var(--border)' }}
                  className="flex items-center gap-2 py-2 border-b last:border-0"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => completada ? descompletarIdea(idea.id) : completarIdea(idea.id)}
                    className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all duration-150"
                    style={{
                      borderColor: completada ? '#1A7F4B' : '#D0D5DD',
                      background:  completada ? '#1A7F4B' : 'transparent',
                    }}
                  >
                    {completada && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }}
                        xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24"
                        fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </motion.svg>
                    )}
                  </button>

                  {/* Chip etiqueta */}
                  <span
                    style={{ background: chip.bg, color: chip.text }}
                    className="text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0"
                  >
                    {EMOJI_ETIQUETA[idea.etiqueta]} {idea.etiqueta}
                  </span>

                  {/* Texto */}
                  <span
                    className="flex-1 text-[12px] leading-snug line-clamp-2 min-w-0 transition-all duration-200"
                    style={{
                      color:          completada ? 'var(--text-2)' : 'var(--text)',
                      textDecoration: completada ? 'line-through' : 'none',
                    }}
                  >
                    {idea.texto}
                  </span>

                  {/* Basura */}
                  <button
                    onClick={() => eliminarIdea(idea.id)}
                    className="flex-shrink-0 text-[#555] hover:text-[#E63B2E] active:text-[#E63B2E] transition-colors opacity-40 hover:opacity-100"
                    aria-label="Eliminar"
                  >
                    <IconoBasura />
                  </button>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
