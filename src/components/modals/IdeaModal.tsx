'use client'
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

export function IdeaModal() {
  const { modalAbierto, cerrarOverlay } = usePanelContext()
  const { ideas, cargando } = useIdeas()
  const estaAbierto = modalAbierto === 'idea'

  const porCategoria = CATEGORIAS.reduce<Record<Categoria, typeof ideas>>(
    (acc, cat) => {
      acc[cat] = ideas.filter(i => i.etiqueta === cat)
      return acc
    },
    { IDEA: [], MEJORA: [], OPORTUNIDAD: [], TAREA: [] }
  )

  return (
    <ModalBase estaAbierto={estaAbierto}>
      {/* Header */}
      <div className="bg-[#111] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="font-black text-[15px] text-white"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            Capturado
          </span>
          <span className="text-[11px] text-white/40 font-bold tabular-nums">
            {ideas.length}
          </span>
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
      <div className="px-6 py-5 overflow-y-auto flex flex-col gap-5">
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
                  {items.map(idea => (
                    <div
                      key={idea.id}
                      className="py-2 border-b border-[#F5F5F3] last:border-0"
                    >
                      <p className="text-[13px] text-[#333] leading-snug">{idea.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </ModalBase>
  )
}
