'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePendientes } from '@/hooks/usePendientes'
import { useIdeas } from '@/hooks/useIdeas'

const CATEGORIAS = ['IDEA', 'MEJORA', 'OPORTUNIDAD', 'TAREA'] as const
type Categoria = typeof CATEGORIAS[number]

const CHIP_COLORES: Record<Categoria, { bg: string; text: string }> = {
  IDEA:        { bg: '#F0F0EE', text: '#555' },
  MEJORA:      { bg: '#FEF3C7', text: '#92400E' },
  OPORTUNIDAD: { bg: '#DCFCE7', text: '#166534' },
  TAREA:       { bg: '#FEE2E2', text: '#991B1B' },
}

const EMOJI_ETIQUETA: Record<Categoria, string> = {
  IDEA: '💡', MEJORA: '🔧', OPORTUNIDAD: '🌱', TAREA: '✓',
}

function CapturadoPanel() {
  const { ideas, cargando } = useIdeas()

  const porCategoria = CATEGORIAS.reduce<Record<Categoria, typeof ideas>>(
    (acc, cat) => {
      acc[cat] = ideas.filter(i => i.etiqueta === cat)
      return acc
    },
    { IDEA: [], MEJORA: [], OPORTUNIDAD: [], TAREA: [] }
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-0 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span
          className="font-black text-[15px] text-[#111] tracking-tight"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          Capturado
        </span>
        <span className="text-[12px] text-[#bbb] font-bold tabular-nums">
          {ideas.length}
        </span>
      </div>

      {cargando ? (
        <p className="text-[13px] text-[#bbb]">Cargando...</p>
      ) : ideas.length === 0 ? (
        <p className="text-[13px] text-[#bbb]">Nada capturado aún</p>
      ) : (
        <div className="flex flex-col gap-4">
          {CATEGORIAS.map(cat => {
            const items = porCategoria[cat]
            if (items.length === 0) return null
            const chip = CHIP_COLORES[cat]
            return (
              <div key={cat} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    style={{ background: chip.bg, color: chip.text }}
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                  >
                    {EMOJI_ETIQUETA[cat]} {cat}
                  </span>
                  <span className="text-[10px] text-[#bbb] font-bold">{items.length}</span>
                </div>
                <div className="flex flex-col">
                  {items.map(idea => (
                    <div
                      key={idea.id}
                      className="py-1.5 border-b border-[#F5F5F3] last:border-0"
                    >
                      <p className="text-[12px] text-[#333] leading-snug">{idea.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function IconoBasura({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

export function PendientesPageWidget() {
  const { pendientes, cargando, toggleCompletado, agregarPendiente, eliminarPendiente } = usePendientes()
  const [nuevo,      setNuevo]      = useState('')
  const [guardando,  setGuardando]  = useState(false)
  const [filtro,     setFiltro]     = useState<'TODOS' | 'PENDIENTE' | 'DONE'>('PENDIENTE')

  const filtrados = pendientes.filter(p =>
    filtro === 'TODOS'     ? true :
    filtro === 'PENDIENTE' ? !p.completado :
    p.completado
  )
  const stats = {
    total:     pendientes.length,
    pendiente: pendientes.filter(p => !p.completado).length,
    hechos:    pendientes.filter(p =>  p.completado).length,
    semana:    pendientes.filter(p => p.estaSemana && !p.completado).length,
  }

  async function agregar() {
    if (!nuevo.trim()) return
    setGuardando(true)
    try { await agregarPendiente(nuevo.trim()); setNuevo('') }
    finally { setGuardando(false) }
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4 items-start">

      {/* Columna izquierda: pendientes */}
      <div className="flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total',      value: stats.total,     color: '#0D1B2A' },
            { label: 'Esta semana',value: stats.semana,    color: '#3B5BDB' },
            { label: 'Pendientes', value: stats.pendiente, color: '#D97706' },
            { label: 'Completados',value: stats.hechos,    color: '#1A7F4B' },
          ].map(s => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm">
              <div
                className="text-[10px] font-semibold text-[#A7ADBA] uppercase tracking-widest mb-1"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                {s.label}
              </div>
              <div
                className="font-bold text-[28px] leading-none"
                style={{ color: s.color, fontFamily: 'var(--font-cormorant)' }}
              >
                {s.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lista */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
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
              <span
                className="font-semibold text-[13px] text-white tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.12em' }}
              >
                Pendientes
              </span>
            </div>
            <div className="flex bg-white/10 rounded-full p-0.5 gap-0.5">
              {(['PENDIENTE', 'DONE', 'TODOS'] as const).map(f => (
                <button key={f} onClick={() => setFiltro(f)}
                  className="text-[10px] font-semibold px-3 py-1 rounded-full transition-all"
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    background: filtro === f ? '#F6F4F0' : 'transparent',
                    color:      filtro === f ? '#0D1B2A' : '#A7ADBA',
                  }}
                >
                  {f === 'PENDIENTE' ? 'Pendientes' : f === 'DONE' ? 'Completados' : 'Todos'}
                </button>
              ))}
            </div>
          </div>

          {/* Input agregar */}
          <div className="px-6 py-3 border-b border-[#F0F2F5] flex gap-3">
            <input
              value={nuevo}
              onChange={e => setNuevo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && agregar()}
              placeholder="Nuevo pendiente… (Enter para guardar)"
              className="flex-1 bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            />
            <button
              onClick={agregar}
              disabled={!nuevo.trim() || guardando}
              className="px-4 py-2 rounded-xl text-[11px] font-semibold text-white disabled:opacity-40"
              style={{ background: '#0D1B2A', fontFamily: 'var(--font-dm-sans)' }}
            >
              {guardando ? '…' : '+ Agregar'}
            </button>
          </div>

          {/* Lista */}
          {cargando ? (
            <div
              className="py-16 text-center text-[#A7ADBA] text-[12px]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Cargando…
            </div>
          ) : filtrados.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-[#415466]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {filtro === 'DONE' ? 'Nada completado aún' : 'Todo al día'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filtrados.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-[#F5F7FA] last:border-0 group hover:bg-[#FAFBFC] transition-colors"
                >
                  <button
                    onClick={() => toggleCompletado(p.id, !p.completado)}
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all"
                    style={{
                      borderColor: p.completado ? '#1A7F4B' : '#D0D5DD',
                      background:  p.completado ? '#1A7F4B' : 'transparent',
                    }}
                  >
                    {p.completado && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <span
                    className="flex-1 text-[13px]"
                    style={{
                      fontFamily:     'var(--font-dm-sans)',
                      color:          p.completado ? '#A7ADBA' : '#0D1B2A',
                      textDecoration: p.completado ? 'line-through' : 'none',
                    }}
                  >
                    {p.texto}
                  </span>
                  {p.estaSemana && !p.completado && (
                    <span
                      className="text-[9px] font-semibold text-[#3B5BDB] bg-[#EEF2FF] px-2 py-0.5 rounded-full"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                      Esta semana
                    </span>
                  )}
                  <button
                    onClick={() => eliminarPendiente(p.id)}
                    className="text-[#ccc] hover:text-[#E63B2E] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    aria-label="Eliminar"
                  >
                    <IconoBasura />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Columna derecha: Capturado */}
      <CapturadoPanel />
    </div>
  )
}
