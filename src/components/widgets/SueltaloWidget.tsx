'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [tipoSugerido,     setTipoSugerido]     = useState<TipoCaptura | null>(null)
  const [clasificando,     setClasificando]     = useState(false)
  const [guardando,        setGuardando]        = useState(false)
  const [feedback,         setFeedback]         = useState<{ tipo: TipoCaptura; emoji: string } | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-clasificar mientras el usuario escribe (debounce 600ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (texto.trim().length < 5 || tipoSeleccionado !== null) {
      setTipoSugerido(null)
      setClasificando(false)
      return
    }

    setClasificando(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texto }),
        })
        const { tipo } = await res.json()
        setTipoSugerido(tipo ?? null)
      } catch {
        setTipoSugerido(null)
      } finally {
        setClasificando(false)
      }
    }, 600)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [texto, tipoSeleccionado])

  async function guardar() {
    if (!texto.trim()) return
    setGuardando(true)
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, tipoForzado: tipoSeleccionado }),
      })
      if (!res.ok) throw new Error()
      const { tipo } = await res.json()
      const chip = CHIPS.find(c => c.tipo === tipo)
      setTexto('')
      setTipoSeleccionado(null)
      setTipoSugerido(null)
      setFeedback(chip ? { tipo: chip.tipo, emoji: chip.emoji } : null)
      setTimeout(() => setFeedback(null), 2500)
      window.dispatchEvent(new Event('captura-guardada'))
    } catch {
      // silently fail — usuario puede reintentar
    } finally {
      setGuardando(false)
    }
  }

  // Tipo activo: seleccionado por el usuario > sugerido por Groq
  const tipoActivo = tipoSeleccionado ?? tipoSugerido

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.64 }}
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="font-black text-[13px] text-[#111] tracking-tight"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          Suéltalo
        </span>

        {/* Indicador de clasificación */}
        <AnimatePresence mode="wait">
          {clasificando && (
            <motion.span
              key="clasificando"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-[#aaa]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              detectando…
            </motion.span>
          )}
          {!clasificando && tipoSugerido && !tipoSeleccionado && (
            <motion.span
              key="sugerido"
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-[#999]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Groq detectó ↓
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Textarea */}
      <textarea
        value={texto}
        onChange={e => setTexto(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && e.metaKey && guardar()}
        placeholder="Una idea, tarea, cliente nuevo..."
        className="bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2.5 text-[12px] text-[#111] placeholder-[#ccc] resize-none outline-none focus:border-[#111] transition-colors"
        style={{ fontFamily: 'var(--font-dm-sans)', minHeight: texto ? '72px' : '48px' }}
      />

      {/* Chips */}
      <div className="flex gap-1.5 flex-wrap">
        {CHIPS.map(({ tipo, etiqueta, emoji }) => {
          const esSeleccionado = tipoSeleccionado === tipo
          const esSugerido     = !tipoSeleccionado && tipoSugerido === tipo

          return (
            <button
              key={tipo}
              onClick={() => setTipoSeleccionado(prev => prev === tipo ? null : tipo)}
              className={`
                text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all duration-150
                ${esSeleccionado
                  ? 'border-[#111] bg-[#111] text-white'
                  : esSugerido
                    ? 'border-[#111] border-dashed text-[#555] bg-[#F5F5F3]'
                    : 'border-[#ddd] text-[#888] hover:border-[#111] hover:text-[#111]'
                }
              `}
            >
              {emoji} {etiqueta}
              {esSugerido && <span className="ml-1 opacity-50">·IA</span>}
            </button>
          )
        })}
      </div>

      {/* Botón */}
      <motion.button
        onClick={guardar}
        disabled={!texto.trim() || guardando}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-[#111] text-white rounded-lg py-2.5 font-black text-[12px] disabled:opacity-40 transition-opacity"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        <AnimatePresence mode="wait">
          {feedback ? (
            <motion.span
              key="feedback"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {feedback.emoji} {feedback.tipo.charAt(0) + feedback.tipo.slice(1).toLowerCase()} guardada ✓
            </motion.span>
          ) : guardando ? (
            <motion.span key="guardando" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {tipoActivo ? `Guardando ${CHIPS.find(c => c.tipo === tipoActivo)?.emoji}…` : 'Guardando…'}
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {tipoActivo
                ? `Guardar como ${CHIPS.find(c => c.tipo === tipoActivo)?.emoji} ${tipoActivo.charAt(0) + tipoActivo.slice(1).toLowerCase()} →`
                : 'Guardar →'
              }
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
