'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProyectos } from '@/hooks/useProyectos'
import { usePanelContext } from '@/context/PanelContext'
import { BarraProgreso } from '@/components/ui/BarraProgreso'
import type { ProjectEstado } from '@/types/panel'

const BADGE: Record<ProjectEstado, { bg: string; text: string; label: string; dot: string }> = {
  ACTIVO:     { bg: '#EDFCF2', text: '#1A7F4B', label: 'Activo',     dot: '#1A7F4B' },
  PAUSADO:    { bg: '#FFF8EC', text: '#D97706', label: 'Pausado',    dot: '#D97706' },
  COMPLETADO: { bg: '#EEF2FF', text: '#3B5BDB', label: 'Completado', dot: '#3B5BDB' },
  ARCHIVADO:  { bg: '#F0F2F5', text: '#415466', label: 'Archivado',  dot: '#A7ADBA' },
}

const ESTADOS: ProjectEstado[] = ['ACTIVO', 'PAUSADO', 'COMPLETADO', 'ARCHIVADO']

const inputStyle: React.CSSProperties = {
  background: 'var(--surf)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontFamily: 'var(--font-dm-sans)',
  borderRadius: 8,
  padding: '0.5rem 0.75rem',
  fontSize: 13,
  width: '100%',
  outline: 'none',
}

export function ProyectosPageWidget() {
  const { proyectos, cargando, crearProyecto } = useProyectos()
  const { abrirDrawer } = usePanelContext()

  const [formAbierto, setFormAbierto] = useState(false)
  const [guardando,   setGuardando]   = useState(false)
  const [form, setForm] = useState({
    nombre:      '',
    descripcion: '',
    stack:       '',       // comma-separated → se convierte a array al enviar
    estado:      'ACTIVO' as ProjectEstado,
    repoUrl:     '',
    proximoPaso: '',
  })

  const stats = {
    total:      proyectos.length,
    activos:    proyectos.filter(p => p.estado === 'ACTIVO').length,
    pausados:   proyectos.filter(p => p.estado === 'PAUSADO').length,
    completados:proyectos.filter(p => p.estado === 'COMPLETADO').length,
  }

  function cambiar(campo: keyof typeof form, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim()) return
    setGuardando(true)
    try {
      await crearProyecto({
        nombre:      form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        stack:       form.stack.split(',').map(s => s.trim()).filter(Boolean),
        estado:      form.estado,
        repoUrl:     form.repoUrl.trim() || undefined,
        proximoPaso: form.proximoPaso.trim() || undefined,
      })
      setForm({ nombre: '', descripcion: '', stack: '', estado: 'ACTIVO', repoUrl: '', proximoPaso: '' })
      setFormAbierto(false)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total',      value: stats.total,       color: 'var(--text)'  },
          { label: 'Activos',    value: stats.activos,     color: '#1A7F4B'      },
          { label: 'Pausados',   value: stats.pausados,    color: '#D97706'      },
          { label: 'Completados',value: stats.completados, color: '#3B5BDB'      },
        ].map(stat => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl px-5 py-4"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}>
              {stat.label}
            </div>
            <div className="font-bold text-[28px] leading-none"
              style={{ color: stat.color, fontFamily: 'var(--font-cormorant)' }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lista */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
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
              Proyectos
            </span>
          </div>

          {/* Botón nuevo */}
          <button
            onClick={() => setFormAbierto(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
            style={{
              background: formAbierto ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
              color: '#F6F4F0',
              fontFamily: 'var(--font-dm-sans)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <span className="text-[15px] leading-none">{formAbierto ? '×' : '+'}</span>
            {formAbierto ? 'Cancelar' : 'Nuevo proyecto'}
          </button>
        </div>

        {/* Formulario inline */}
        <AnimatePresence>
          {formAbierto && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden', borderBottom: '1px solid var(--border)' }}
            >
              <div className="px-6 py-5 flex flex-col gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                  Nuevo proyecto
                </p>

                {/* Nombre + Estado */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                      Nombre *
                    </label>
                    <input
                      value={form.nombre}
                      onChange={e => cambiar('nombre', e.target.value)}
                      placeholder="Mi nuevo proyecto"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                      Estado
                    </label>
                    <select
                      value={form.estado}
                      onChange={e => cambiar('estado', e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {ESTADOS.map(e => (
                        <option key={e} value={e}>{BADGE[e].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                    Descripción
                  </label>
                  <input
                    value={form.descripcion}
                    onChange={e => cambiar('descripcion', e.target.value)}
                    placeholder="De qué trata este proyecto…"
                    style={inputStyle}
                  />
                </div>

                {/* Stack + Repo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                      Stack (separado por comas)
                    </label>
                    <input
                      value={form.stack}
                      onChange={e => cambiar('stack', e.target.value)}
                      placeholder="Next.js, Prisma, Tailwind"
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                      Repo URL
                    </label>
                    <input
                      value={form.repoUrl}
                      onChange={e => cambiar('repoUrl', e.target.value)}
                      placeholder="https://github.com/…"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Próximo paso */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                    Próximo paso
                  </label>
                  <input
                    value={form.proximoPaso}
                    onChange={e => cambiar('proximoPaso', e.target.value)}
                    placeholder="¿Qué sigue?"
                    style={inputStyle}
                  />
                </div>

                {/* Botón submit */}
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={guardando || !form.nombre.trim()}
                    className="px-5 py-2 rounded-lg text-[12px] font-semibold transition-opacity disabled:opacity-50"
                    style={{
                      background: '#0D1B2A',
                      color: '#F6F4F0',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                  >
                    {guardando ? 'Guardando…' : 'Crear proyecto'}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Cabecera columnas */}
        {proyectos.length > 0 && (
          <div className="grid grid-cols-[1.5fr_1.2fr_120px_80px_44px] gap-0 px-6 py-2.5"
            style={{ borderBottom: '1px solid var(--border)' }}>
            {['Proyecto', 'Stack', 'Progreso', 'Estado', ''].map(h => (
              <span key={h} className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Filas */}
        {cargando ? (
          <div className="py-16 text-center text-[12px]"
            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}>
            Cargando proyectos…
          </div>
        ) : proyectos.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <p className="text-[13px] font-medium"
              style={{ color: 'var(--text-2)', fontFamily: 'var(--font-cormorant)' }}>
              Sin proyectos todavía
            </p>
            <p className="text-[11px]"
              style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
              Usa el botón "+ Nuevo proyecto" para agregar el primero
            </p>
          </div>
        ) : proyectos.map((p, i) => {
          const badge = BADGE[p.estado]
          return (
            <motion.button key={p.id}
              onClick={() => abrirDrawer('proyecto', p.id)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="w-full grid grid-cols-[1.5fr_1.2fr_120px_80px_44px] gap-0 px-6 py-4 text-left transition-colors group items-center"
              style={{
                borderBottom: i < proyectos.length - 1 ? '1px solid var(--border)' : 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div className="text-[15px] font-semibold"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}>
                  {p.nombre}
                </div>
                {p.descripcion && (
                  <div className="text-[10px] mt-0.5 truncate max-w-xs"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
                    {p.descripcion}
                  </div>
                )}
              </div>
              <div className="flex gap-1 flex-wrap">
                {p.stack.slice(0, 3).map(s => (
                  <span key={s} className="text-[9px] px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--surf)', color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)', border: '1px solid var(--border)' }}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pr-4">
                <BarraProgreso porcentaje={p.progreso} colorBarra={p.estado === 'PAUSADO' ? '#D0D5DD' : '#0D1B2A'} altura="h-1" />
                <span className="text-[10px] font-medium flex-shrink-0"
                  style={{ color: 'var(--text-2)', fontFamily: 'var(--font-outfit)' }}>
                  {p.progreso}%
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: badge.bg, color: badge.text, fontFamily: 'var(--font-dm-sans)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: badge.dot }} />
                  {badge.label}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-[16px] transition-colors"
                  style={{ color: 'var(--text-3)' }}>›</span>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
