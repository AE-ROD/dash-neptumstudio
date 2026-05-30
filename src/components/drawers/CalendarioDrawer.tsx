'use client'
import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePanelContext } from '@/context/PanelContext'
import { useEventos } from '@/hooks/useEventos'
import { DrawerBase } from './DrawerBase'
import type { EventoTipo, Evento } from '@/types/panel'

const TIPO_COLOR: Record<EventoTipo, string> = {
  REUNION: '#3B5BDB', LLAMADA: '#1A7F4B', ENTREGA: '#D97706', OTRO: '#A7ADBA',
}
const TIPO_BG: Record<EventoTipo, string> = {
  REUNION: '#EEF2FF', LLAMADA: '#EDFCF2', ENTREGA: '#FFF8EC', OTRO: '#F0F2F5',
}
const TIPO_LABEL: Record<EventoTipo, string> = {
  REUNION: 'Reunión', LLAMADA: 'Llamada', ENTREGA: 'Entrega', OTRO: 'Otro',
}
const TIPOS: EventoTipo[] = ['REUNION', 'LLAMADA', 'ENTREGA', 'OTRO']

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS_CORTOS = ['Lu','Ma','Mi','Ju','Vi','Sá','Do']

function ymd(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function fechaLabel(d: Date) { return `${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}` }

export function CalendarioDrawer() {
  const { drawerAbierto, cerrarOverlay } = usePanelContext()
  const { eventos, crearEvento, eliminarEvento } = useEventos()

  const hoy = new Date()
  const [mes, setMes]           = useState(hoy.getMonth())
  const [anio, setAnio]         = useState(hoy.getFullYear())
  const [diaSelec, setDiaSelec] = useState(ymd(hoy))

  // Form
  const [mostrarForm, setMostrarForm] = useState(false)
  const [titulo,      setTitulo]      = useState('')
  const [hora,        setHora]        = useState('')
  const [tipo,        setTipo]        = useState<EventoTipo>('REUNION')
  const [desc,        setDesc]        = useState('')
  const [guardando,   setGuardando]   = useState(false)

  const estaAbierto = drawerAbierto === 'calendario'

  // ── Calendario ──
  const { primerDia, diasEnMes } = useMemo(() => {
    const d = new Date(anio, mes, 1)
    const diasEnMes = new Date(anio, mes + 1, 0).getDate()
    // Lu=0 … Do=6
    const diaSemana = (d.getDay() + 6) % 7
    return { primerDia: diaSemana, diasEnMes }
  }, [mes, anio])

  // Index por ymd para lookup rápido
  const eventosPorFecha = useMemo(() => {
    const map: Record<string, Evento[]> = {}
    for (const ev of eventos) {
      const k = ymd(new Date(ev.fecha))
      if (!map[k]) map[k] = []
      map[k].push(ev)
    }
    return map
  }, [eventos])

  const eventosDelDia = eventosPorFecha[diaSelec] ?? []

  function navMes(delta: number) {
    let nm = mes + delta
    let na = anio
    if (nm < 0) { nm = 11; na-- }
    if (nm > 11) { nm = 0; na++ }
    setMes(nm); setAnio(na)
  }

  function seleccionarDia(d: number) {
    const fecha = new Date(anio, mes, d)
    setDiaSelec(ymd(fecha))
    setMostrarForm(false)
  }

  async function guardar() {
    if (!titulo.trim()) return
    setGuardando(true)
    try {
      await crearEvento({ titulo: titulo.trim(), fecha: diaSelec, hora: hora || undefined, tipo, descripcion: desc.trim() || undefined })
      setTitulo(''); setHora(''); setDesc(''); setTipo('REUNION')
      setMostrarForm(false)
    } finally { setGuardando(false) }
  }

  const totalCeldas = primerDia + diasEnMes
  const filasCalendario = Math.ceil(totalCeldas / 7)

  return (
    <DrawerBase estaAbierto={estaAbierto} titulo="Agenda">

      {/* ── MINI CALENDARIO ── */}
      <div className="mb-5">
        {/* Nav mes */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navMes(-1)}
            className="w-7 h-7 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#415466] transition-colors text-[13px]">
            ‹
          </button>
          <span className="text-[12px] font-semibold text-[#0D1B2A] tracking-wide"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {MESES[mes]} {anio}
          </span>
          <button onClick={() => navMes(1)}
            className="w-7 h-7 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#415466] transition-colors text-[13px]">
            ›
          </button>
        </div>

        {/* Cabecera días */}
        <div className="grid grid-cols-7 mb-1">
          {DIAS_CORTOS.map(d => (
            <div key={d} className="text-center text-[9px] font-bold text-[#C5CBD6] uppercase tracking-widest py-1"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid días */}
        <div className="grid grid-cols-7" style={{ gridTemplateRows: `repeat(${filasCalendario}, 1fr)` }}>
          {/* Celdas vacías iniciales */}
          {Array.from({ length: primerDia }).map((_, i) => <div key={`pad-${i}`} />)}

          {/* Días del mes */}
          {Array.from({ length: diasEnMes }).map((_, i) => {
            const d = i + 1
            const key = ymd(new Date(anio, mes, d))
            const esHoy   = key === ymd(hoy)
            const esSelec = key === diaSelec
            const tieneEv = (eventosPorFecha[key]?.length ?? 0) > 0
            return (
              <button key={d} onClick={() => seleccionarDia(d)}
                className="flex flex-col items-center py-1 rounded-lg transition-colors relative"
                style={{
                  background: esSelec ? '#0D1B2A' : esHoy ? '#F0F2F5' : 'transparent',
                }}>
                <span className="text-[11px] leading-none"
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    color: esSelec ? '#F6F4F0' : esHoy ? '#0D1B2A' : '#415466',
                    fontWeight: esHoy || esSelec ? 600 : 400,
                  }}>
                  {d}
                </span>
                {tieneEv && (
                  <span className="mt-0.5 w-1 h-1 rounded-full"
                    style={{ background: esSelec ? '#A7ADBA' : '#3B5BDB' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── SEPARADOR ── */}
      <div className="border-t border-[#F0F2F5] mb-4" />

      {/* ── EVENTOS DEL DÍA SELECCIONADO ── */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {fechaLabel(new Date(diaSelec + 'T00:00:00'))}
          </span>
          {eventosDelDia.length > 0 && (
            <span className="ml-2 text-[10px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {eventosDelDia.length} {eventosDelDia.length === 1 ? 'evento' : 'eventos'}
            </span>
          )}
        </div>
        <button onClick={() => setMostrarForm(f => !f)}
          className="text-[10px] font-semibold text-[#0D1B2A] hover:opacity-50 transition-opacity"
          style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {mostrarForm ? '✕ Cancelar' : '+ Nuevo'}
        </button>
      </div>

      {/* Form nuevo evento */}
      <AnimatePresence>
        {mostrarForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-[#F8F9FB] rounded-2xl p-4 flex flex-col gap-3">
              {/* Título */}
              <input value={titulo} onChange={e => setTitulo(e.target.value)}
                placeholder="Título del evento *"
                className="w-full bg-white border border-[#E4E8EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans)' }} />

              {/* Hora */}
              <input value={hora} onChange={e => setHora(e.target.value)}
                type="time"
                className="w-full bg-white border border-[#E4E8EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0D1B2A] outline-none focus:border-[#0D1B2A] transition-colors"
                style={{ fontFamily: 'var(--font-outfit)' }} />

              {/* Tipo */}
              <div className="flex gap-1.5 flex-wrap">
                {TIPOS.map(t => (
                  <button key={t} onClick={() => setTipo(t)}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      borderColor: tipo === t ? TIPO_COLOR[t] : '#E4E8EE',
                      background:  tipo === t ? TIPO_BG[t]   : 'transparent',
                      color:       tipo === t ? TIPO_COLOR[t] : '#415466',
                    }}>
                    {TIPO_LABEL[t]}
                  </button>
                ))}
              </div>

              {/* Descripción */}
              <input value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="Descripción (opcional)"
                className="w-full bg-white border border-[#E4E8EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans)' }} />

              <button onClick={guardar} disabled={!titulo.trim() || guardando}
                className="w-full py-2.5 rounded-xl text-[11px] font-semibold disabled:opacity-40 transition-all"
                style={{ fontFamily: 'var(--font-dm-sans)', background: '#0D1B2A', color: '#F6F4F0' }}>
                {guardando ? 'Guardando…' : 'Guardar evento →'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista eventos del día */}
      {eventosDelDia.length === 0 && !mostrarForm ? (
        <div className="text-center py-8 opacity-40">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0D1B2A" strokeWidth="1.5" strokeLinecap="round" className="mx-auto mb-2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <p className="text-[11px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Sin eventos este día
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {eventosDelDia.map(ev => (
            <motion.div key={ev.id}
              layout
              className="flex items-start gap-3 p-3 rounded-xl border border-[#F0F2F5] group hover:border-[#E4E8EE] transition-colors">
              {/* Indicador tipo */}
              <div className="flex-shrink-0 w-1 self-stretch rounded-full"
                style={{ background: TIPO_COLOR[ev.tipo] }} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-[#0D1B2A] truncate"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {ev.titulo}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wide"
                    style={{ color: TIPO_COLOR[ev.tipo], fontFamily: 'var(--font-dm-sans)' }}>
                    {TIPO_LABEL[ev.tipo]}
                  </span>
                  {ev.hora && (
                    <span className="text-[9px] text-[#A7ADBA]"
                      style={{ fontFamily: 'var(--font-outfit)' }}>
                      {ev.hora}
                    </span>
                  )}
                </div>
                {ev.descripcion && (
                  <p className="text-[10px] text-[#A7ADBA] mt-1 leading-relaxed"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {ev.descripcion}
                  </p>
                )}
              </div>
              <button onClick={() => eliminarEvento(ev.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full hover:bg-[#FFE4E4] flex items-center justify-center text-[#C92A2A] text-[10px] flex-shrink-0">
                ✕
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </DrawerBase>
  )
}
