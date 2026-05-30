'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProposals } from '@/hooks/useProposals'
import { usePanelContext } from '@/context/PanelContext'
import type { ProposalEstado } from '@/types/panel'

const BADGE: Record<ProposalEstado, { bg: string; text: string; label: string; dot: string }> = {
  LEAD:      { bg: '#F0F2F5', text: '#415466', label: 'Lead',      dot: '#A7ADBA' },
  PROPUESTA: { bg: '#EEF2FF', text: '#3B5BDB', label: 'Propuesta', dot: '#3B5BDB' },
  ACTIVO:    { bg: '#EDFCF2', text: '#1A7F4B', label: 'Activo',    dot: '#1A7F4B' },
  CERRADO:   { bg: '#FFF1F0', text: '#C92A2A', label: 'Cerrado',   dot: '#C92A2A' },
}

export function PipelinePageWidget() {
  const { propuestas, cargando, recargar } = useProposals()
  const { abrirModal } = usePanelContext()

  const [creando,      setCreando]      = useState(false)
  const [nombre,       setNombre]       = useState('')
  const [descripcion,  setDescripcion]  = useState('')
  const [monto,        setMonto]        = useState('')
  const [guardando,    setGuardando]    = useState(false)

  const totalMonto = propuestas.filter(p => p.estado === 'ACTIVO' || p.estado === 'PROPUESTA')
    .reduce((s, p) => s + (p.monto ?? 0), 0)

  const stats = {
    total:     propuestas.length,
    leads:     propuestas.filter(p => p.estado === 'LEAD').length,
    activos:   propuestas.filter(p => p.estado === 'ACTIVO').length,
    cerrados:  propuestas.filter(p => p.estado === 'CERRADO').length,
  }

  async function crearPropuesta() {
    if (!nombre.trim()) return
    setGuardando(true)
    try {
      await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCliente: nombre.trim(), descripcion: descripcion.trim() || null, monto: monto ? parseInt(monto) : null, estado: 'LEAD' }),
      })
      setNombre(''); setDescripcion(''); setMonto(''); setCreando(false)
      await recargar()
    } finally { setGuardando(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',   value: stats.total,    color: '#0D1B2A' },
          { label: 'Leads',   value: stats.leads,    color: '#415466' },
          { label: 'Activos', value: stats.activos,  color: '#1A7F4B' },
          { label: 'Cerrados',value: stats.cerrados, color: '#C92A2A' },
        ].map(stat => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <div className="text-[10px] font-semibold text-[#A7ADBA] uppercase tracking-widest mb-1"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>{stat.label}</div>
            <div className="font-bold text-[28px] leading-none"
              style={{ color: stat.color, fontFamily: 'var(--font-cormorant)' }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Lista */}
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
            <div>
              <span className="font-semibold text-[13px] text-white tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em' }}>
                Pipeline
              </span>
              {totalMonto > 0 && (
                <div className="text-[11px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  ${totalMonto.toLocaleString('es-CL')} en cartera
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setCreando(v => !v)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors text-white text-[11px] font-semibold px-4 py-2 rounded-full"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {creando ? '✕ Cancelar' : '+ Nuevo lead'}
          </button>
        </div>

        {/* Form nuevo */}
        <AnimatePresence>
          {creando && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-b border-[#F0F2F5]">
              <div className="px-6 py-4 flex gap-3">
                <input value={nombre} onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre del cliente *"
                  className="flex-1 bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }} />
                <input value={descripcion} onChange={e => setDescripcion(e.target.value)}
                  placeholder="Descripción"
                  className="flex-1 bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }} />
                <input value={monto} onChange={e => setMonto(e.target.value)}
                  placeholder="Monto $" type="number"
                  className="w-32 bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
                  style={{ fontFamily: 'var(--font-outfit)' }} />
                <button onClick={crearPropuesta} disabled={!nombre.trim() || guardando}
                  className="px-4 py-2 rounded-xl text-[11px] font-semibold text-white disabled:opacity-40 transition-all flex-shrink-0"
                  style={{ fontFamily: 'var(--font-dm-sans)', background: '#0D1B2A' }}>
                  {guardando ? '…' : 'Crear →'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cabecera columnas */}
        {propuestas.length > 0 && (
          <div className="grid grid-cols-[1.5fr_1fr_100px_80px_44px] px-6 py-2.5 border-b border-[#F0F2F5]">
            {['Cliente', 'Descripción', 'Monto', 'Estado', ''].map(h => (
              <span key={h} className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>{h}</span>
            ))}
          </div>
        )}

        {/* Filas */}
        {cargando ? (
          <div className="py-16 text-center text-[#A7ADBA] text-[12px]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>Cargando pipeline…</div>
        ) : propuestas.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[13px] text-[#415466]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Sin leads todavía
            </p>
            <p className="text-[11px] text-[#A7ADBA] mt-0.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Agrega el primer lead con el botón de arriba
            </p>
          </div>
        ) : propuestas.map((p, i) => {
          const badge = BADGE[p.estado]
          return (
            <motion.button key={p.id}
              onClick={() => abrirModal('propuesta', p.id)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ backgroundColor: '#FAFBFC' }}
              className="w-full grid grid-cols-[1.5fr_1fr_100px_80px_44px] px-6 py-4 border-b border-[#F5F7FA] last:border-0 text-left transition-colors group items-center">
              <div>
                <div className="text-[15px] font-semibold text-[#0D1B2A]"
                  style={{ fontFamily: 'var(--font-cormorant)' }}>{p.nombreCliente}</div>
                {p.ultimoContacto && (
                  <div className="text-[10px] text-[#A7ADBA] mt-0.5"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Últ. contacto: {new Date(p.ultimoContacto).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                  </div>
                )}
              </div>
              <div className="text-[11px] text-[#415466] truncate pr-4"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {p.descripcion ?? '—'}
              </div>
              <div className="text-[13px] font-medium text-[#0D1B2A]"
                style={{ fontFamily: 'var(--font-outfit)' }}>
                {p.monto ? `$${p.monto.toLocaleString('es-CL')}` : '—'}
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
