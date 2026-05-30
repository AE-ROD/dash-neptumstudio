'use client'
import { motion } from 'framer-motion'
import { useProyectos } from '@/hooks/useProyectos'
import { usePanelContext } from '@/context/PanelContext'
import { BarraProgreso } from '@/components/ui/BarraProgreso'
import type { ProjectEstado } from '@/types/panel'

const BADGE: Record<ProjectEstado, { bg: string; text: string; label: string; dot: string }> = {
  ACTIVO:     { bg: '#EDFCF2', text: '#1A7F4B', label: 'Activo',     dot: '#1A7F4B' },
  PAUSADO:    { bg: '#FFF8EC', text: '#D97706', label: 'Pausado',    dot: '#D97706' },
  COMPLETADO: { bg: '#EEF2FF', text: '#3B5BDB', label: 'Completado', dot: '#3B5BDB' },
  ARCHIVADO:  { bg: '#F0F2F5', text: '#415466', label: 'Archivado',  dot: '#A7ADBA' },
}

export function ProyectosPageWidget() {
  const { proyectos, cargando } = useProyectos()
  const { abrirDrawer } = usePanelContext()

  const stats = {
    total:      proyectos.length,
    activos:    proyectos.filter(p => p.estado === 'ACTIVO').length,
    pausados:   proyectos.filter(p => p.estado === 'PAUSADO').length,
    completados:proyectos.filter(p => p.estado === 'COMPLETADO').length,
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',      value: stats.total,       color: '#0D1B2A' },
          { label: 'Activos',    value: stats.activos,     color: '#1A7F4B' },
          { label: 'Pausados',   value: stats.pausados,    color: '#D97706' },
          { label: 'Completados',value: stats.completados, color: '#3B5BDB' },
        ].map(stat => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <div className="text-[10px] font-semibold text-[#A7ADBA] uppercase tracking-widest mb-1"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {stat.label}
            </div>
            <div className="font-bold text-[28px] leading-none"
              style={{ color: stat.color, fontFamily: 'var(--font-cormorant)' }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lista */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="bg-[#0D1B2A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <path d="M20 2 L20 30" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 2 L14 10" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 2 L26 10" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M11 14 L11 28" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M29 14 L29 28" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M8 30 Q20 36 32 30" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="font-semibold text-[13px] text-white tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em' }}>
              Proyectos
            </span>
          </div>
        </div>

        {/* Cabecera columnas */}
        {proyectos.length > 0 && (
          <div className="grid grid-cols-[1.5fr_1.2fr_120px_80px_44px] gap-0 px-6 py-2.5 border-b border-[#F0F2F5]">
            {['Proyecto', 'Stack', 'Progreso', 'Estado', ''].map(h => (
              <span key={h} className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Filas */}
        {cargando ? (
          <div className="py-16 text-center text-[#A7ADBA] text-[12px]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Cargando proyectos…
          </div>
        ) : proyectos.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="text-center">
              <p className="text-[13px] font-medium text-[#415466]"
                style={{ fontFamily: 'var(--font-cormorant)' }}>Sin proyectos todavía</p>
              <p className="text-[11px] text-[#A7ADBA] mt-0.5"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>Agrega el primero para empezar a registrar tu trabajo</p>
            </div>
          </div>
        ) : proyectos.map((p, i) => {
          const badge = BADGE[p.estado]
          return (
            <motion.button key={p.id}
              onClick={() => abrirDrawer('proyecto', p.id)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ backgroundColor: '#FAFBFC' }}
              className="w-full grid grid-cols-[1.5fr_1.2fr_120px_80px_44px] gap-0 px-6 py-4 border-b border-[#F5F7FA] last:border-0 text-left transition-colors group items-center">
              <div>
                <div className="text-[15px] font-semibold text-[#0D1B2A]"
                  style={{ fontFamily: 'var(--font-cormorant)' }}>
                  {p.nombre}
                </div>
                {p.descripcion && (
                  <div className="text-[10px] text-[#A7ADBA] mt-0.5 truncate max-w-xs"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {p.descripcion}
                  </div>
                )}
              </div>
              <div className="flex gap-1 flex-wrap">
                {p.stack.slice(0, 3).map(s => (
                  <span key={s} className="text-[9px] bg-[#F0F2F5] text-[#415466] px-2 py-0.5 rounded-full"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pr-4">
                <BarraProgreso porcentaje={p.progreso} colorBarra={p.estado === 'PAUSADO' ? '#D0D5DD' : '#0D1B2A'} altura="h-1" />
                <span className="text-[10px] font-medium text-[#415466] flex-shrink-0"
                  style={{ fontFamily: 'var(--font-outfit)' }}>
                  {p.progreso}%
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: badge.bg, color: badge.text, fontFamily: 'var(--font-dm-sans)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: badge.dot }} />
                  {badge.label}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-[#D0D5DD] group-hover:text-[#415466] transition-colors text-[16px]">›</span>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
