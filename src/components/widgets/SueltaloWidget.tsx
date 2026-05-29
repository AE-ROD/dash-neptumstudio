'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TipoCaptura } from '@/lib/groq'

const CHIPS: { tipo: TipoCaptura; etiqueta: string; emoji: string }[] = [
  { tipo: 'IDEA',    etiqueta: 'Idea',    emoji: '💡' },
  { tipo: 'TAREA',   etiqueta: 'Tarea',   emoji: '✓'  },
  { tipo: 'CLIENTE', etiqueta: 'Cliente', emoji: '👤' },
  { tipo: 'MEJORA',  etiqueta: 'Mejora',  emoji: '🔧' },
]

export function SueltaloWidget() {
  const [texto,            setTexto]            = useState('')
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoCaptura | null>(null)
  const [guardando,        setGuardando]        = useState(false)
  const [guardado,         setGuardado]         = useState(false)

  async function guardar() {
    if (!texto.trim()) return
    setGuardando(true)
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, tipoForzado: tipoSeleccionado }),
      })
      if (!res.ok) throw new Error('Error al guardar captura')
      setTexto('')
      setTipoSeleccionado(null)
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2000)
    } catch {
      // Silently fail — usuario puede reintentar
    } finally {
      setGuardando(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.64 }}
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3"
    >
      <span
        className="font-black text-[13px] text-[#111] tracking-tight"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        Suéltalo
      </span>

      <textarea
        value={texto}
        onChange={e => setTexto(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && e.metaKey && guardar()}
        placeholder="Una idea, tarea, cliente nuevo..."
        className="bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2.5 text-[12px] text-[#111] placeholder-[#ccc] resize-none outline-none focus:border-[#111] transition-colors"
        style={{ fontFamily: 'var(--font-dm-sans)', minHeight: texto ? '72px' : '48px' }}
      />

      <div className="flex gap-1.5 flex-wrap">
        {CHIPS.map(({ tipo, etiqueta, emoji }) => (
          <button
            key={tipo}
            onClick={() => setTipoSeleccionado(prev => prev === tipo ? null : tipo)}
            className={`
              text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all duration-150
              ${tipoSeleccionado === tipo
                ? 'border-[#111] bg-[#111] text-white'
                : 'border-[#ddd] text-[#888] hover:border-[#111] hover:text-[#111]'
              }
            `}
          >
            {emoji} {etiqueta}
          </button>
        ))}
      </div>

      <motion.button
        onClick={guardar}
        disabled={!texto.trim() || guardando}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-[#111] text-white rounded-lg py-2.5 font-black text-[12px] disabled:opacity-40 transition-opacity"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        {guardado ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar →'}
      </motion.button>
    </motion.div>
  )
}
