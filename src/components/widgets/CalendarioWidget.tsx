'use client'
import { motion } from 'framer-motion'
import { useEventos } from '@/hooks/useEventos'
import { usePanelContext } from '@/context/PanelContext'
import type { EventoTipo } from '@/types/panel'

const TIPO_COLOR: Record<EventoTipo, string> = {
  REUNION:  '#3B5BDB',
  LLAMADA:  '#1A7F4B',
  ENTREGA:  '#D97706',
  OTRO:     '#A7ADBA',
}
const TIPO_LABEL: Record<EventoTipo, string> = {
  REUNION: 'Reunión', LLAMADA: 'Llamada', ENTREGA: 'Entrega', OTRO: 'Otro',
}

function esMismaFecha(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const DIAS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

export function CalendarioWidget() {
  const { eventos, cargando } = useEventos()
  const { abrirDrawer } = usePanelContext()

  const hoy = new Date()
  const proximosEventos = eventos
    .filter(e => new Date(e.fecha) >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()))
    .slice(0, 3)

  const eventosHoy = eventos.filter(e => esMismaFecha(new Date(e.fecha), hoy))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.52 }}
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-[11px] text-[#A7ADBA] uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Agenda
          </div>
          <div className="text-[13px] font-medium text-[#0D1B2A] mt-0.5"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {DIAS_ES[hoy.getDay()]}, {hoy.getDate()} de {MESES_ES[hoy.getMonth()]}
          </div>
        </div>
        <button
          onClick={() => abrirDrawer('calendario')}
          className="text-[11px] font-bold text-[#0D1B2A] hover:opacity-50 transition-opacity"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        >
          Ver todo →
        </button>
      </div>

      {/* Badge hoy */}
      {eventosHoy.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 bg-[#EEF2FF] rounded-full px-3 py-1.5 self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB]" />
          <span className="text-[10px] font-semibold text-[#3B5BDB]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {eventosHoy.length} {eventosHoy.length === 1 ? 'evento hoy' : 'eventos hoy'}
          </span>
        </div>
      )}

      {/* Lista próximos eventos */}
      <div className="flex flex-col gap-2 flex-1">
        {cargando ? (
          <div className="text-[11px] text-[#A7ADBA] text-center py-4"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Cargando…
          </div>
        ) : proximosEventos.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-1 py-2 opacity-40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B2A" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <span className="text-[10px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Sin eventos próximos
            </span>
          </div>
        ) : (
          proximosEventos.map(ev => {
            const fecha = new Date(ev.fecha)
            const esHoy = esMismaFecha(fecha, hoy)
            return (
              <button
                key={ev.id}
                onClick={() => abrirDrawer('calendario')}
                className="flex items-start gap-2.5 text-left group"
              >
                <div className="flex-shrink-0 w-0.5 self-stretch rounded-full mt-0.5"
                  style={{ background: TIPO_COLOR[ev.tipo] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-[#0D1B2A] truncate group-hover:opacity-60 transition-opacity"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {ev.titulo}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wide"
                      style={{ color: TIPO_COLOR[ev.tipo], fontFamily: 'var(--font-dm-sans)' }}>
                      {TIPO_LABEL[ev.tipo]}
                    </span>
                    <span className="text-[9px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      {esHoy ? `Hoy${ev.hora ? ` · ${ev.hora}` : ''}` : `${fecha.getDate()} ${MESES_ES[fecha.getMonth()]}${ev.hora ? ` · ${ev.hora}` : ''}`}
                    </span>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Footer add */}
      <button
        onClick={() => abrirDrawer('calendario')}
        className="mt-3 pt-3 border-t border-[#F5F7FA] text-[10px] font-semibold text-[#A7ADBA] hover:text-[#0D1B2A] transition-colors text-left"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        + Agregar evento
      </button>
    </motion.div>
  )
}
