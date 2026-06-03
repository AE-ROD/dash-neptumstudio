'use client'
import { useProposals } from '@/hooks/useProposals'

export function PipelineStatWidget() {
  const { propuestas, cargando } = useProposals()
  const urgentes = propuestas.filter(p => p.estado === 'PROPUESTA').length

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1.5"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}>
        Pipeline
      </span>
      <span className="text-[30px] font-light leading-none"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}>
        {cargando ? '—' : propuestas.length}
      </span>
      <span className="self-start text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full"
        style={{ background: '#E63B2E' }}>
        {urgentes} urgentes
      </span>
    </div>
  )
}
