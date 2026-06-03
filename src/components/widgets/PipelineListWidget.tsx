'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProposals } from '@/hooks/useProposals'
import { usePanelContext } from '@/context/PanelContext'
import { BadgeEstado } from '@/components/ui/BadgeEstado'
export function PipelineListWidget() {
  const { propuestas, cargando, recargar } = useProposals()
  const { abrirModal } = usePanelContext()

  const [creando,     setCreando]     = useState(false)
  const [nombre,      setNombre]      = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [monto,       setMonto]       = useState('')
  const [guardandoNueva, setGuardandoNueva] = useState(false)

  async function crearPropuesta() {
    if (!nombre.trim()) return
    setGuardandoNueva(true)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCliente: nombre.trim(),
          descripcion:   descripcion.trim() || null,
          monto:         monto ? parseInt(monto) : null,
          estado:        'LEAD',
        }),
      })
      if (!res.ok) throw new Error()
      setNombre('')
      setDescripcion('')
      setMonto('')
      setCreando(false)
      await recargar()
    } catch {
      // silently fail
    } finally {
      setGuardandoNueva(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl p-5 shadow-sm flex flex-col"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-black text-[13px] tracking-tight"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito)' }}
        >
          Pipeline
        </span>
        <button
          onClick={() => setCreando(v => !v)}
          className="text-[11px] font-bold text-[#E63B2E] hover:opacity-70 transition-opacity"
        >
          {creando ? '✕ Cancelar' : '+ Nuevo →'}
        </button>
      </div>

      {/* Formulario nuevo lead */}
      <AnimatePresence>
        {creando && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 mb-3 p-3 rounded-xl border" style={{ background: 'var(--surf)', borderColor: 'var(--border)' }}>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Nombre del cliente *"
                className="rounded-lg px-3 py-2 text-[12px] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-dm-sans)' }}
              />
              <input
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Descripción del proyecto"
                className="rounded-lg px-3 py-2 text-[12px] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-dm-sans)' }}
              />
              <div className="flex gap-2">
                <input
                  value={monto}
                  onChange={e => setMonto(e.target.value.replace(/\D/g, ''))}
                  placeholder="Monto estimado"
                  className="flex-1 rounded-lg px-3 py-2 text-[12px] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-dm-sans)' }}
                />
                <button
                  onClick={crearPropuesta}
                  disabled={!nombre.trim() || guardandoNueva}
                  className="bg-[#111] text-white text-[11px] font-black px-4 py-2 rounded-lg disabled:opacity-40 transition-opacity whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-nunito)' }}
                >
                  {guardandoNueva ? '...' : 'Agregar →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista */}
      <div className="flex flex-col">
        {cargando ? (
          <span className="text-xs py-4 text-center" style={{ color: 'var(--text-2)' }}>Cargando...</span>
        ) : propuestas.length === 0 ? (
          <span className="text-[11px] py-4 text-center" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-dm-sans)' }}>
            Sin leads activos — agrega el primero
          </span>
        ) : (
          propuestas.map((propuesta, indice) => (
            <motion.button
              key={propuesta.id}
              onClick={() => abrirModal('propuesta', propuesta.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: indice * 0.08 }}
              whileHover={{ x: 2 }}
              className="flex items-center justify-between py-2.5 border-b last:border-0 text-left w-full group"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold truncate" style={{ color: 'var(--text)' }}>{propuesta.nombreCliente}</div>
                <div className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-2)' }}>
                  {propuesta.descripcion ?? 'Sin descripción'}
                  {propuesta.monto ? ` · $${propuesta.monto.toLocaleString('es-CL')}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <BadgeEstado estado={propuesta.estado} />
                <span className="text-[#ddd] group-hover:text-[#999] text-[11px] transition-colors">›</span>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  )
}
