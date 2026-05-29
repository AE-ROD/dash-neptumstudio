'use client'
import { motion } from 'framer-motion'
import { useCotizaciones } from '@/hooks/useCotizaciones'
import { usePanelContext } from '@/context/PanelContext'
import type { CotizacionEstado } from '@/types/panel'

const BADGE: Record<CotizacionEstado, { bg: string; text: string; label: string }> = {
  BORRADOR:  { bg: '#F5F5F3', text: '#888',    label: 'Borrador'  },
  ENVIADA:   { bg: '#FFF3E0', text: '#E6852E', label: 'Enviada'   },
  APROBADA:  { bg: '#E8F5E9', text: '#4CAF50', label: 'Aprobada'  },
  RECHAZADA: { bg: '#FFEBEE', text: '#E63B2E', label: 'Rechazada' },
}

export function CotizacionesWidget() {
  const { cotizaciones, cargando } = useCotizaciones()
  const { abrirModal } = usePanelContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-black text-[14px] text-[#111] tracking-tight" style={{ fontFamily: 'var(--font-nunito)' }}>
            Cotizaciones
          </span>
          <span className="ml-2 text-[11px] text-[#bbb]">{cotizaciones.length}</span>
        </div>
        <button
          onClick={() => abrirModal('cotizacion')}
          className="text-[11px] font-bold text-[#E63B2E] hover:opacity-70 transition-opacity"
        >
          + Nueva →
        </button>
      </div>

      {/* Lista */}
      {cargando ? (
        <p className="text-center text-[#ccc] text-[11px] py-8">Cargando...</p>
      ) : cotizaciones.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[#ccc] text-[12px]" style={{ fontFamily: 'var(--font-dm-sans)' }}>Sin cotizaciones todavía</p>
          <p className="text-[#ddd] text-[11px] mt-1">Crea la primera con el botón de arriba</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {cotizaciones.map((c, i) => {
            const badge = BADGE[c.estado]
            return (
              <motion.button
                key={c.id}
                onClick={() => abrirModal('cotizacion', c.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between py-3 border-b border-[#F5F5F3] last:border-0 text-left w-full group"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold text-[#111] truncate">{c.nombreCliente}</div>
                  <div className="text-[10px] text-[#bbb] mt-0.5">
                    {c.items.length} {c.items.length === 1 ? 'servicio' : 'servicios'}
                    {' · '}
                    {new Date(c.creadoEn).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <span className="font-black text-[13px] text-[#111]">
                    ${c.total.toLocaleString('es-CL')}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: badge.bg, color: badge.text }}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[#ddd] group-hover:text-[#999] text-[11px] transition-colors">›</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
