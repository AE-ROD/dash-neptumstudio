'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePanelContext } from '@/context/PanelContext'
import { useIdeas } from '@/hooks/useIdeas'
import { ModalBase } from './ModalBase'

const CATEGORIAS = ['IDEA', 'MEJORA', 'OPORTUNIDAD', 'TAREA'] as const
type Categoria = typeof CATEGORIAS[number]

const CHIP_COLORES: Record<Categoria, { bg: string; text: string }> = {
  IDEA:        { bg: '#F0F0EE', text: '#555' },
  MEJORA:      { bg: '#FEF3C7', text: '#92400E' },
  OPORTUNIDAD: { bg: '#DCFCE7', text: '#166534' },
  TAREA:       { bg: '#FEE2E2', text: '#991B1B' },
}

const EMOJI_ETIQUETA: Record<Categoria, string> = {
  IDEA: '💡', MEJORA: '🔧', OPORTUNIDAD: '🌱', TAREA: '✓',
}

function IconoBasura() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

export function IdeaModal() {
  const { modalAbierto, cerrarOverlay } = usePanelContext()
  const { ideas, cargando, completarIdea, descompletarIdea, eliminarIdea } = useIdeas()
  const estaAbierto = modalAbierto === 'idea'

  const porCategoria = CATEGORIAS.reduce<Record<Categoria, typeof ideas>>(
    (acc, cat) => {
      acc[cat] = ideas.filter(i => i.etiqueta === cat)
      return acc
    },
    { IDEA: [], MEJORA: [], OPORTUNIDAD: [], TAREA: [] }
  )

  const totalCompletadas = ideas.filter(i => i.estado === 'COMPLETADA').length

  return (
    <ModalBase estaAbierto={estaAbierto}>
      {/* Header */}
      <div className="bg-[#111] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-black text-[15px] text-white" style={{ fontFamily: 'var(--font-nunito)' }}>
            Capturado
          </span>
          <span className="text-[11px] text-white/40 font-bold tabular-nums">{ideas.length}</span>
          {totalCompletadas > 0 && (
            <span className="text-[10px] text-white/30 font-bold">· {totalCompletadas} listo</span>
          )}
        </div>
        <button
          onClick={cerrarOverlay}
          aria-label="Cerrar"
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors text-[13px]"
        >
          ✕
        </button>
      </div>

      {/* Cuerpo scrollable */}
      <div className="flex-1 px-6 py-5 overflow-y-auto flex flex-col gap-5">
        {cargando ? (
          <p className="text-[13px] text-[#bbb]">Cargando...</p>
        ) : ideas.length === 0 ? (
          <p className="text-[13px] text-[#bbb]">Nada capturado aún</p>
        ) : (
          CATEGORIAS.map(cat => {
            const items = porCategoria[cat]
            if (items.length === 0) return null
            const chip = CHIP_COLORES[cat]
            return (
              <div key={cat} className="flex flex-col gap-2">
                {/* Header de categoría */}
                <div className="flex items-center gap-2">
                  <span
                    style={{ background: chip.bg, color: chip.text }}
                    className="text-[11px] font-extrabold px-2.5 py-1 rounded-full"
                  >
                    {EMOJI_ETIQUETA[cat]} {cat}
                  </span>
                  <span className="text-[11px] text-[#bbb] font-bold">{items.length}</span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-0">
                  <AnimatePresence initial={false}>
                    {items.map(idea => {
                      const completada = idea.estado === 'COMPLETADA'
                      return (
                        <motion.div
                          key={idea.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex items-center gap-3 py-2.5 border-b border-[#F5F5F3] last:border-0 group">
                            {/* Checkbox */}
                            <button
                              onClick={() => completada ? descompletarIdea(idea.id) : completarIdea(idea.id)}
                              className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all duration-150"
                              style={{
                                borderColor: completada ? '#1A7F4B' : '#D0D5DD',
                                background:  completada ? '#1A7F4B' : 'transparent',
                              }}
                              aria-label={completada ? 'Desmarcar' : 'Marcar como lista'}
                            >
                              {completada && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  xmlns="http://www.w3.org/2000/svg" width="9" height="9"
                                  viewBox="0 0 24 24" fill="none" stroke="white"
                                  strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12"/>
                                </motion.svg>
                              )}
                            </button>

                            {/* Texto */}
                            <p
                              className="flex-1 text-[13px] leading-snug transition-all duration-200 min-w-0"
                              style={{
                                color:          completada ? '#A7ADBA' : '#333',
                                textDecoration: completada ? 'line-through' : 'none',
                              }}
                            >
                              {idea.texto}
                            </p>

                            {/* Basura — siempre visible */}
                            <button
                              onClick={() => eliminarIdea(idea.id)}
                              className="flex-shrink-0 text-[#ddd] hover:text-[#E63B2E] active:text-[#E63B2E] transition-colors"
                              aria-label="Eliminar"
                            >
                              <IconoBasura />
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )
          })
        )}
      </div>
    </ModalBase>
  )
}
