'use client'
import { useInstagram } from '@/hooks/useInstagram'

export function InstagramStatWidget() {
  const { snapshot, cargando } = useInstagram()

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1.5"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}>
        Instagram
      </span>
      <span className="text-[30px] font-light leading-none"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}>
        {cargando ? '—' : (snapshot?.seguidores.toLocaleString('es-CL') ?? '—')}
      </span>
      <span className="self-start text-[9px] font-extrabold px-2 py-0.5 rounded-full"
        style={{ background: 'var(--text-3)', color: 'var(--bg)' }}>
        +{snapshot?.crecimientoSemanal ?? 0} sem.
      </span>
    </div>
  )
}
