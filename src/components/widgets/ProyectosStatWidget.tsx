'use client'
import { useProyectos } from '@/hooks/useProyectos'

export function ProyectosStatWidget() {
  const { proyectos, cargando } = useProyectos()
  const activos = proyectos.filter(p => p.estado === 'ACTIVO').length

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1.5"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}>
        Proyectos
      </span>
      <span className="text-[30px] font-light leading-none"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}>
        {cargando ? '—' : proyectos.length}
      </span>
      <span className="self-start text-[9px] font-extrabold px-2 py-0.5 rounded-full"
        style={{ background: 'var(--text-3)', color: 'var(--bg)' }}>
        {activos} activos
      </span>
    </div>
  )
}
