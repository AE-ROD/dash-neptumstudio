'use client'
import { motion } from 'framer-motion'
import { useCotizaciones } from '@/hooks/useCotizaciones'
import { usePanelContext } from '@/context/PanelContext'
import type { CotizacionEstado } from '@/types/panel'

const BADGE: Record<CotizacionEstado, { bg: string; text: string; label: string; dot: string }> = {
  BORRADOR:  { bg: '#F0F2F5', text: '#415466', label: 'Borrador',  dot: '#A7ADBA' },
  ENVIADA:   { bg: '#EEF2FF', text: '#3B5BDB', label: 'Enviada',   dot: '#3B5BDB' },
  APROBADA:  { bg: '#EDFCF2', text: '#1A7F4B', label: 'Aprobada',  dot: '#1A7F4B' },
  RECHAZADA: { bg: '#FFF1F0', text: '#C92A2A', label: 'Rechazada', dot: '#C92A2A' },
}

export function CotizacionesWidget() {
  const { cotizaciones, cargando } = useCotizaciones()
  const { abrirModal } = usePanelContext()

  const totalesEstado = {
    borradores: cotizaciones.filter(c => c.estado === 'BORRADOR').length,
    enviadas:   cotizaciones.filter(c => c.estado === 'ENVIADA').length,
    aprobadas:  cotizaciones.filter(c => c.estado === 'APROBADA').length,
  }
  const totalFacturable = cotizaciones
    .filter(c => c.estado === 'APROBADA')
    .reduce((s, c) => s + c.total, 0)

  return (
    <div className="flex flex-col gap-4">

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: cotizaciones.length, color: '#0D1B2A' },
          { label: 'Borradores',value: totalesEstado.borradores, color: '#415466' },
          { label: 'Enviadas',  value: totalesEstado.enviadas,   color: '#3B5BDB' },
          { label: 'Aprobadas', value: totalesEstado.aprobadas,  color: '#1A7F4B' },
        ].map(stat => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl px-5 py-4 shadow-sm"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          >
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

      {/* Lista principal */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl shadow-sm overflow-hidden"
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
      >
        {/* Header de la tabla */}
        <div className="bg-[#0D1B2A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Isotipo SVG */}
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
              <path d="M20 2 L20 30" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 2 L14 10" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 2 L26 10" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M11 14 L11 28" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M29 14 L29 28" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M8 30 Q20 36 32 30" stroke="#F6F4F0" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            <div>
              <div className="font-semibold text-[13px] text-white tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em' }}>
                Cotizaciones
              </div>
              {totalFacturable > 0 && (
                <div className="text-[11px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  ${totalFacturable.toLocaleString('es-CL')} aprobados
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => abrirModal('cotizacion')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors text-white text-[11px] font-semibold px-4 py-2 rounded-full"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            + Nueva cotización
          </button>
        </div>

        {/* Cabecera columnas */}
        {cotizaciones.length > 0 && (
          <div className="grid grid-cols-[1fr_120px_100px_80px_44px] gap-0 px-6 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            {['Cliente', 'Servicios', 'Total', 'Estado', ''].map(h => (
              <span key={h} className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Filas */}
        {cargando ? (
          <div className="py-16 text-center text-[#A7ADBA] text-[12px]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Cargando cotizaciones…
          </div>
        ) : cotizaciones.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" opacity="0.2">
              <path d="M20 2 L20 30" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 2 L14 10" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 2 L26 10" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M11 14 L11 28" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M29 14 L29 28" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M8 30 Q20 36 32 30" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            <div className="text-center">
              <p className="text-[13px] font-medium text-[#415466]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Sin cotizaciones todavía
              </p>
              <p className="text-[11px] text-[#A7ADBA] mt-0.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Crea la primera para empezar a registrar tus propuestas
              </p>
            </div>
          </div>
        ) : (
          cotizaciones.map((c, i) => {
            const badge = BADGE[c.estado]
            return (
              <motion.button
                key={c.id}
                onClick={() => abrirModal('cotizacion', c.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ backgroundColor: '#FAFBFC' }}
                className="w-full grid grid-cols-[1fr_120px_100px_80px_44px] gap-0 px-6 py-4 border-b last:border-0 text-left transition-colors group"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)', fontSize: '15px' }}>
                    {c.nombreCliente}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                    {new Date(c.creadoEn).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-[11px]" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                    {c.items.length} {c.items.length === 1 ? 'servicio' : 'servicios'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-[14px]" style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}>
                    ${c.total.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: badge.bg, color: badge.text, fontFamily: 'var(--font-dm-sans)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: badge.dot }} />
                    {badge.label}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-[#D0D5DD] group-hover:text-[#415466] transition-colors text-[16px]">›</span>
                </div>
              </motion.button>
            )
          })
        )}
      </motion.div>
    </div>
  )
}
