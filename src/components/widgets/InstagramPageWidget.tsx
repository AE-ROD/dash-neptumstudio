'use client'
import { motion } from 'framer-motion'
import { useInstagram } from '@/hooks/useInstagram'

export function InstagramPageWidget() {
  const { snapshot, cargando } = useInstagram()

  const stats = [
    { label: 'Seguidores',       value: snapshot?.seguidores         ?? 0, color: '#0D1B2A' },
    { label: 'Publicaciones',    value: snapshot?.publicaciones      ?? 0, color: '#415466' },
    { label: 'Alcance promedio', value: snapshot?.alcancePromedio    ?? 0, color: '#3B5BDB' },
    { label: 'Crecim. semanal',  value: snapshot?.crecimientoSemanal ?? 0, color: '#1A7F4B' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <div className="text-[10px] font-semibold text-[#A7ADBA] uppercase tracking-widest mb-1"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>{s.label}</div>
            <div className="font-bold text-[28px] leading-none"
              style={{ color: s.color, fontFamily: 'var(--font-cormorant)' }}>
              {cargando ? '—' : s.value.toLocaleString('es-CL')}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detalle */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <div className="bg-[#0D1B2A] px-6 py-4 flex items-center gap-3">
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
            @neptumstudio
          </span>
        </div>

        <div className="px-8 py-10 flex flex-col items-center gap-3">
          {cargando ? (
            <p className="text-[12px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>Cargando…</p>
          ) : (
            <>
              <div className="font-light leading-none"
                style={{ fontFamily: 'var(--font-cormorant)', fontSize: '80px', color: '#0D1B2A' }}>
                {snapshot?.seguidores ?? 0}
              </div>
              <div className="text-[11px] font-semibold text-[#A7ADBA] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                seguidores
              </div>
              {(snapshot?.crecimientoSemanal ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 mt-2 bg-[#EDFCF2] rounded-full px-4 py-1.5">
                  <span className="text-[12px] font-bold text-[#1A7F4B]">
                    +{snapshot!.crecimientoSemanal}
                  </span>
                  <span className="text-[11px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    esta semana
                  </span>
                </div>
              )}
              <p className="text-[11px] text-[#C5CBD6] mt-3 text-center max-w-xs"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Cuenta nueva — los datos se actualizan manualmente desde el panel
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
