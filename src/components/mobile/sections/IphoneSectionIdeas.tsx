'use client'
import { useIdeas } from '@/hooks/useIdeas'

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  IDEA:        { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  MEJORA:      { bg: 'rgba(74,222,128,0.15)',  text: '#4ade80' },
  OPORTUNIDAD: { bg: 'rgba(129,140,248,0.15)', text: '#818cf8' },
  TAREA:       { bg: 'rgba(251,146,60,0.15)',  text: '#fb923c' },
}

export function IphoneSectionIdeas() {
  const { ideas, cargando } = useIdeas()
  const visibles = ideas.slice(0, 8)

  return (
    <div className="flex flex-col gap-3 p-4">
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px', minHeight: '200px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Ideas capturadas
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{ideas.length}</div>
        </div>
        {cargando ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Cargando...</p>
        ) : visibles.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin ideas aún. Usá el + para capturar.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {visibles.map(idea => {
              const color = TAG_COLORS[idea.etiqueta] ?? TAG_COLORS.IDEA
              return (
                <div key={idea.id} style={{ background: 'var(--surf)', borderRadius: '8px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: color.bg, color: color.text, marginBottom: '5px', display: 'inline-block' }}>
                    {idea.etiqueta}
                  </span>
                  <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.4 }}>{idea.texto}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
