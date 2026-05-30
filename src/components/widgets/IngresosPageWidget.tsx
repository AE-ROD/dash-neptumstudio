'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIngresos } from '@/hooks/useIngresos'

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export function IngresosPageWidget() {
  const { ingresos, cargando } = useIngresos()
  const [editando,  setEditando]  = useState(false)
  const [nuevo,     setNuevo]     = useState('')
  const [descripcion, setDesc]    = useState('')
  const [guardando, setGuardando] = useState(false)

  const mesActual  = ingresos?.mes   ?? new Date().getMonth() + 1
  const anioActual = ingresos?.anio  ?? new Date().getFullYear()
  const total      = ingresos?.balance ?? 0

  async function guardarIngreso() {
    if (!nuevo) return
    setGuardando(true)
    try {
      await fetch('/api/revenue', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto: parseFloat(nuevo), descripcion: descripcion.trim() || null }),
      })
      setNuevo(''); setDesc(''); setEditando(false)
      window.location.reload()
    } finally { setGuardando(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Mes actual',   value: `${MESES[mesActual-1]} ${anioActual}`, color: '#0D1B2A', isText: true },
          { label: 'Ingresos',     value: `$${total.toLocaleString('es-CL')}`,   color: total > 0 ? '#1A7F4B' : '#0D1B2A', isText: true },
          { label: 'Facturado',    value: total > 0 ? '1' : '0',                 color: '#415466' },
          { label: 'Pendiente',    value: '—',                                    color: '#A7ADBA', isText: true },
        ].map(s => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <div className="text-[10px] font-semibold text-[#A7ADBA] uppercase tracking-widest mb-1"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>{s.label}</div>
            <div className={s.isText ? 'font-semibold text-[20px] leading-none' : 'font-bold text-[28px] leading-none'}
              style={{ color: s.color, fontFamily: s.isText ? 'var(--font-outfit)' : 'var(--font-cormorant)' }}>
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detalle */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden">

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
              Ingresos — {MESES[mesActual-1]} {anioActual}
            </span>
          </div>
          <button onClick={() => setEditando(v => !v)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors text-white text-[11px] font-semibold px-4 py-2 rounded-full"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {editando ? '✕ Cancelar' : '+ Registrar ingreso'}
          </button>
        </div>

        {/* Form registrar */}
        {editando && (
          <div className="px-6 py-4 border-b border-[#F0F2F5] flex gap-3">
            <input value={nuevo} onChange={e => setNuevo(e.target.value)}
              placeholder="Monto en CLP *" type="number"
              className="w-40 bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
              style={{ fontFamily: 'var(--font-outfit)' }} />
            <input value={descripcion} onChange={e => setDesc(e.target.value)}
              placeholder="Descripción (opcional)"
              className="flex-1 bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
              style={{ fontFamily: 'var(--font-dm-sans)' }} />
            <button onClick={guardarIngreso} disabled={!nuevo || guardando}
              className="px-4 py-2 rounded-xl text-[11px] font-semibold text-white disabled:opacity-40"
              style={{ background: '#0D1B2A', fontFamily: 'var(--font-dm-sans)' }}>
              {guardando ? '…' : 'Guardar →'}
            </button>
          </div>
        )}

        {/* Contenido */}
        {cargando ? (
          <div className="py-16 text-center text-[#A7ADBA] text-[12px]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>Cargando…</div>
        ) : (
          <div className="px-8 py-10 flex flex-col items-center gap-2">
            <div className="text-[11px] font-bold text-[#A7ADBA] uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Total facturado este mes
            </div>
            <div className="font-light leading-none mt-1"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: '64px', color: total > 0 ? '#0D1B2A' : '#D0D5DD' }}>
              ${total.toLocaleString('es-CL')}
            </div>
            {total === 0 && (
              <p className="text-[11px] text-[#A7ADBA] mt-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Registra tu primer ingreso con el botón de arriba
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
