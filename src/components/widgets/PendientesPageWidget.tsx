'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePendientes } from '@/hooks/usePendientes'

export function PendientesPageWidget() {
  const { pendientes, cargando, toggleCompletado, agregarPendiente } = usePendientes()
  const [nuevo,      setNuevo]      = useState('')
  const [guardando,  setGuardando]  = useState(false)
  const [filtro,     setFiltro]     = useState<'TODOS' | 'PENDIENTE' | 'DONE'>('PENDIENTE')

  const filtrados = pendientes.filter(p =>
    filtro === 'TODOS'    ? true :
    filtro === 'PENDIENTE'? !p.completado :
    p.completado
  )
  const stats = {
    total:    pendientes.length,
    pendiente:pendientes.filter(p => !p.completado).length,
    hechos:   pendientes.filter(p =>  p.completado).length,
    semana:   pendientes.filter(p => p.estaSemana && !p.completado).length,
  }

  async function agregar() {
    if (!nuevo.trim()) return
    setGuardando(true)
    try { await agregarPendiente(nuevo.trim()); setNuevo('') }
    finally { setGuardando(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: stats.total,     color: '#0D1B2A' },
          { label: 'Esta semana',value: stats.semana,   color: '#3B5BDB' },
          { label: 'Pendientes',value: stats.pendiente, color: '#D97706' },
          { label: 'Completados',value: stats.hechos,   color: '#1A7F4B' },
        ].map(s => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <div className="text-[10px] font-semibold text-[#A7ADBA] uppercase tracking-widest mb-1"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>{s.label}</div>
            <div className="font-bold text-[28px] leading-none"
              style={{ color: s.color, fontFamily: 'var(--font-cormorant)' }}>{s.value}</div>
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
              Pendientes
            </span>
          </div>
          {/* Filtros */}
          <div className="flex bg-white/10 rounded-full p-0.5 gap-0.5">
            {(['PENDIENTE', 'DONE', 'TODOS'] as const).map(f => (
              <button key={f} onClick={() => setFiltro(f)}
                className="text-[10px] font-semibold px-3 py-1 rounded-full transition-all"
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  background: filtro === f ? '#F6F4F0' : 'transparent',
                  color: filtro === f ? '#0D1B2A' : '#A7ADBA',
                }}>
                {f === 'PENDIENTE' ? 'Pendientes' : f === 'DONE' ? 'Completados' : 'Todos'}
              </button>
            ))}
          </div>
        </div>

        {/* Agregar nuevo */}
        <div className="px-6 py-3 border-b border-[#F0F2F5] flex gap-3">
          <input value={nuevo} onChange={e => setNuevo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && agregar()}
            placeholder="Nuevo pendiente… (Enter para guardar)"
            className="flex-1 bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
            style={{ fontFamily: 'var(--font-dm-sans)' }} />
          <button onClick={agregar} disabled={!nuevo.trim() || guardando}
            className="px-4 py-2 rounded-xl text-[11px] font-semibold text-white disabled:opacity-40"
            style={{ background: '#0D1B2A', fontFamily: 'var(--font-dm-sans)' }}>
            {guardando ? '…' : '+ Agregar'}
          </button>
        </div>

        {/* Lista */}
        {cargando ? (
          <div className="py-16 text-center text-[#A7ADBA] text-[12px]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>Cargando…</div>
        ) : filtrados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[13px] text-[#415466]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {filtro === 'DONE' ? 'Nada completado aún' : 'Todo al día'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filtrados.map((p, i) => (
              <motion.div key={p.id} layout
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-6 py-3.5 border-b border-[#F5F7FA] last:border-0 group hover:bg-[#FAFBFC] transition-colors">
                <button onClick={() => toggleCompletado(p.id, !p.completado)}
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all"
                  style={{
                    borderColor: p.completado ? '#1A7F4B' : '#D0D5DD',
                    background:  p.completado ? '#1A7F4B' : 'transparent',
                  }}>
                  {p.completado && (
                    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <span className="flex-1 text-[13px]"
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    color: p.completado ? '#A7ADBA' : '#0D1B2A',
                    textDecoration: p.completado ? 'line-through' : 'none',
                  }}>
                  {p.texto}
                </span>
                {p.estaSemana && !p.completado && (
                  <span className="text-[9px] font-semibold text-[#3B5BDB] bg-[#EEF2FF] px-2 py-0.5 rounded-full"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Esta semana
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
