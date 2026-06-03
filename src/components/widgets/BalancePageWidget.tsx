'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIngresos } from '@/hooks/useIngresos'

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export function BalancePageWidget() {
  const { balance, cargando, registrar, recargar } = useIngresos()

  const [tipo,       setTipo]       = useState<'INGRESO' | 'EGRESO'>('INGRESO')
  const [monto,      setMonto]      = useState('')
  const [desc,       setDesc]       = useState('')
  const [guardando,  setGuardando]  = useState(false)
  const [form,       setForm]       = useState(false)

  const mes  = balance?.mes  ?? new Date().getMonth() + 1
  const anio = balance?.anio ?? new Date().getFullYear()

  const ingresos  = balance?.ingresos  ?? 0
  const egresos   = balance?.egresos   ?? 0
  const neto      = balance?.balance   ?? 0
  const registros = balance?.registros ?? []

  async function guardar() {
    if (!monto) return
    setGuardando(true)
    try {
      await registrar(parseFloat(monto), tipo, desc.trim() || undefined)
      setMonto(''); setDesc(''); setForm(false)
    } finally { setGuardando(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Balance neto', value: `$${neto.toLocaleString('es-CL')}`,      color: neto >= 0 ? '#1A7F4B' : '#C92A2A', isText: true },
          { label: 'Ingresos',     value: `$${ingresos.toLocaleString('es-CL')}`,  color: '#0D1B2A', isText: true },
          { label: 'Egresos',      value: `$${egresos.toLocaleString('es-CL')}`,   color: egresos > 0 ? '#C92A2A' : '#A7ADBA', isText: true },
          { label: 'Movimientos',  value: registros.length,                         color: '#415466', isText: false },
        ].map(s => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl px-5 py-4 shadow-sm"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-semibold text-[#A7ADBA] uppercase tracking-widest mb-1"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>{s.label}</div>
            <div className={s.isText ? 'font-medium text-[20px] leading-none' : 'font-bold text-[28px] leading-none'}
              style={{ color: s.color, fontFamily: s.isText ? 'var(--font-outfit)' : 'var(--font-cormorant)' }}>
              {s.isText ? s.value as string : s.value as number}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabla */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl shadow-sm overflow-hidden"
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>

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
              Balance — {MESES[mes-1]} {anio}
            </span>
          </div>
          <button onClick={() => setForm(v => !v)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors text-white text-[11px] font-semibold px-4 py-2 rounded-full"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {form ? '✕ Cancelar' : '+ Registrar movimiento'}
          </button>
        </div>

        {/* Form */}
        <AnimatePresence>
          {form && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="px-6 py-4 flex items-center gap-3">
                {/* Tipo toggle */}
                <div className="flex rounded-xl p-0.5" style={{ background: 'var(--surf)' }}>
                  {(['INGRESO', 'EGRESO'] as const).map(t => (
                    <button key={t} onClick={() => setTipo(t)}
                      className="text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        fontFamily: 'var(--font-dm-sans)',
                        background: tipo === t ? (t === 'INGRESO' ? '#1A7F4B' : '#C92A2A') : 'transparent',
                        color: tipo === t ? 'white' : '#415466',
                      }}>
                      {t === 'INGRESO' ? '↑ Ingreso' : '↓ Egreso'}
                    </button>
                  ))}
                </div>
                <input value={monto} onChange={e => setMonto(e.target.value)}
                  placeholder="Monto en CLP *" type="number"
                  className="w-40 rounded-xl px-3 py-2 text-[12px] placeholder-[#C5CBD6] outline-none transition-colors"
                  style={{ background: 'var(--surf)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }} />
                <input value={desc} onChange={e => setDesc(e.target.value)}
                  placeholder="Descripción"
                  className="flex-1 rounded-xl px-3 py-2 text-[12px] placeholder-[#C5CBD6] outline-none transition-colors"
                  style={{ background: 'var(--surf)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-dm-sans)' }} />
                <button onClick={guardar} disabled={!monto || guardando}
                  className="px-4 py-2 rounded-xl text-[11px] font-semibold text-white disabled:opacity-40"
                  style={{ background: tipo === 'INGRESO' ? '#1A7F4B' : '#C92A2A', fontFamily: 'var(--font-dm-sans)' }}>
                  {guardando ? '…' : 'Guardar →'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Columnas */}
        {registros.length > 0 && (
          <div className="grid grid-cols-[60px_1fr_120px_44px] px-6 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            {['Tipo', 'Descripción', 'Monto', ''].map(h => (
              <span key={h} className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>{h}</span>
            ))}
          </div>
        )}

        {/* Filas */}
        {cargando ? (
          <div className="py-16 text-center text-[#A7ADBA] text-[12px]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>Cargando…</div>
        ) : registros.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-2">
            <div className="font-light text-[48px] text-[#D0D5DD] leading-none"
              style={{ fontFamily: 'var(--font-cormorant)' }}>$0</div>
            <p className="text-[12px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Registra tu primer movimiento para empezar
            </p>
          </div>
        ) : registros.map((r, i) => (
          <motion.div key={r.id} layout
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-[60px_1fr_120px_44px] px-6 py-3.5 border-b last:border-0 items-center"
            style={{ borderColor: 'var(--border)' }}>
            <div>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: r.tipo === 'INGRESO' ? '#EDFCF2' : '#FFF1F0',
                  color:      r.tipo === 'INGRESO' ? '#1A7F4B' : '#C92A2A',
                  fontFamily: 'var(--font-dm-sans)',
                }}>
                {r.tipo === 'INGRESO' ? '↑' : '↓'} {r.tipo === 'INGRESO' ? 'Ing.' : 'Egr.'}
              </span>
            </div>
            <span className="text-[12px]" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
              {r.descripcion ?? '—'}
            </span>
            <span className="text-[13px] font-medium text-right"
              style={{ fontFamily: 'var(--font-outfit)', color: r.tipo === 'INGRESO' ? '#1A7F4B' : '#C92A2A' }}>
              {r.tipo === 'INGRESO' ? '+' : '−'}${r.monto.toLocaleString('es-CL')}
            </span>
            <div />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
