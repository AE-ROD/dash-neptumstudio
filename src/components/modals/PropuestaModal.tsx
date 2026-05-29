'use client'
import { useState, useEffect } from 'react'
import { usePanelContext } from '@/context/PanelContext'
import { useProposals } from '@/hooks/useProposals'
import { ModalBase } from './ModalBase'
import type { ProposalEstado } from '@/types/panel'

const ESTADOS_PIPELINE: ProposalEstado[] = ['LEAD', 'PROPUESTA', 'ACTIVO', 'CERRADO']
const ETIQUETAS_ESTADO: Record<ProposalEstado, string> = {
  LEAD: 'Lead', PROPUESTA: 'Propuesta', ACTIVO: 'Activo', CERRADO: 'Cerrado',
}

export function PropuestaModal() {
  const { modalAbierto, idSeleccionado, cerrarOverlay } = usePanelContext()
  const { propuestas, actualizarPropuesta } = useProposals()

  const propuesta = propuestas.find(p => p.id === idSeleccionado)
  const estaAbierto = modalAbierto === 'propuesta'

  const [estadoLocal, setEstadoLocal] = useState<ProposalEstado>(propuesta?.estado ?? 'LEAD')
  const [notasLocal,  setNotasLocal]  = useState(propuesta?.notas ?? '')
  const [guardando,   setGuardando]   = useState(false)

  useEffect(() => {
    if (propuesta) {
      setEstadoLocal(propuesta.estado)
      setNotasLocal(propuesta.notas ?? '')
    }
  }, [propuesta])

  async function guardarCambios() {
    if (!propuesta) return
    setGuardando(true)
    try {
      await actualizarPropuesta(propuesta.id, { estado: estadoLocal, notas: notasLocal })
      cerrarOverlay()
    } catch {
      // Error silencioso — el usuario ve que el botón regresa a "Guardar cambios"
    } finally {
      setGuardando(false)
    }
  }

  return (
    <ModalBase estaAbierto={estaAbierto}>
      {propuesta && (
        <>
          {/* Header */}
          <div className="bg-[#111] px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E63B2E] flex items-center justify-center flex-shrink-0">
              <span className="font-black text-white text-[14px]"
                style={{ fontFamily: 'var(--font-nunito)' }}>
                {propuesta.nombreCliente[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-black text-[15px] text-white tracking-tight"
                style={{ fontFamily: 'var(--font-nunito)' }}>
                {propuesta.nombreCliente}
              </div>
              {propuesta.monto && (
                <div className="text-[12px] text-[#aaa]">
                  ${propuesta.monto.toLocaleString('es-CL')}
                </div>
              )}
            </div>
            <button
              onClick={cerrarOverlay}
              aria-label="Cerrar"
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors text-[13px]"
            >
              ✕
            </button>
          </div>

          {/* Cuerpo */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

            {/* Estado */}
            <div>
              <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-2">
                Estado
              </span>
              <div className="flex gap-2 flex-wrap">
                {ESTADOS_PIPELINE.map(estado => (
                  <button
                    key={estado}
                    onClick={() => setEstadoLocal(estado)}
                    className={`
                      text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all
                      ${estadoLocal === estado
                        ? 'bg-[#111] text-white border-[#111]'
                        : 'border-[#ddd] text-[#888] hover:border-[#111]'
                      }
                    `}
                  >
                    {ETIQUETAS_ESTADO[estado]}
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            {propuesta.descripcion && (
              <div>
                <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-1.5">
                  Descripción
                </span>
                <p className="text-[12px] text-[#555]">{propuesta.descripcion}</p>
              </div>
            )}

            {/* Notas */}
            <div>
              <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-1.5">
                Notas
              </span>
              <textarea
                value={notasLocal}
                onChange={e => setNotasLocal(e.target.value)}
                placeholder="Notas sobre esta propuesta..."
                className="w-full bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2.5 text-[12px] text-[#111] placeholder-[#ccc] resize-none outline-none focus:border-[#111] transition-colors h-24"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#F5F5F3] flex justify-end gap-2">
            <button
              onClick={cerrarOverlay}
              className="border border-[#ddd] text-[#888] text-[11px] font-bold px-4 py-2 rounded-full hover:border-[#111] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={guardarCambios}
              disabled={guardando}
              className="bg-[#111] text-white text-[11px] font-black px-5 py-2 rounded-full disabled:opacity-40 transition-opacity"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              {guardando ? 'Guardando...' : 'Guardar cambios →'}
            </button>
          </div>
        </>
      )}
    </ModalBase>
  )
}
