'use client'
import { useState, useEffect } from 'react'
import { usePanelContext } from '@/context/PanelContext'
import { useProyectos } from '@/hooks/useProyectos'
import { DrawerBase } from './DrawerBase'
import { BarraProgreso } from '@/components/ui/BarraProgreso'
import { ChipStack } from '@/components/ui/ChipStack'

export function ProyectoDrawer() {
  const { drawerAbierto, idSeleccionado } = usePanelContext()
  const { proyectos, actualizarProyecto } = useProyectos()
  const [nuevaNota, setNuevaNota] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [editandoProgreso, setEditandoProgreso] = useState(false)
  const [progresoInput, setProgresoInput] = useState('')

  const proyecto = proyectos.find(p => p.id === idSeleccionado)
  const estaAbierto = drawerAbierto === 'proyecto'

  // Limpiar nota al cambiar de proyecto
  useEffect(() => { setNuevaNota(''); setEditandoProgreso(false) }, [idSeleccionado])

  function iniciarEdicionProgreso() {
    if (!proyecto) return
    setProgresoInput(String(proyecto.progreso))
    setEditandoProgreso(true)
  }

  async function guardarProgreso() {
    if (!proyecto) return
    const valor = Math.min(100, Math.max(0, parseInt(progresoInput) || 0))
    setEditandoProgreso(false)
    if (valor !== proyecto.progreso) {
      await actualizarProyecto(proyecto.id, { progreso: valor })
    }
  }

  function onKeyDownProgreso(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') guardarProgreso()
    if (e.key === 'Escape') setEditandoProgreso(false)
  }

  async function guardarNota() {
    if (!proyecto || !nuevaNota.trim()) return
    setGuardando(true)
    try {
      await actualizarProyecto(proyecto.id, { ultimaNota: nuevaNota })
      setNuevaNota('')
    } catch {
      // Error visible: el botón regresa a "Guardar nota →"; la nota no se borra
    } finally {
      setGuardando(false)
    }
  }

  return (
    <DrawerBase estaAbierto={estaAbierto} titulo={proyecto?.nombre ?? 'Proyecto'}>
      {proyecto && (
        <div className="flex flex-col gap-5">

          {/* Header del proyecto */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center flex-shrink-0">
              <span className="font-black text-white text-[16px]"
                style={{ fontFamily: 'var(--font-nunito)' }}>
                {proyecto.nombre[0]}
              </span>
            </div>
            <div>
              <div className="font-black text-[15px] text-[#111]"
                style={{ fontFamily: 'var(--font-nunito)' }}>
                {proyecto.nombre}
              </div>
              {proyecto.descripcion && (
                <div className="text-[11px] text-[#bbb]">{proyecto.descripcion}</div>
              )}
            </div>
          </div>

          {/* Progreso */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-[#555] uppercase tracking-widest">Progreso</span>
              {editandoProgreso ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={progresoInput}
                    onChange={e => setProgresoInput(e.target.value)}
                    onBlur={guardarProgreso}
                    onKeyDown={onKeyDownProgreso}
                    autoFocus
                    className="w-14 text-right bg-[#FAFAF9] border border-[#111] rounded px-1.5 py-0.5 text-[12px] font-black text-[#111] outline-none"
                    style={{ fontFamily: 'var(--font-nunito)' }}
                  />
                  <span className="font-black text-[#111]" style={{ fontFamily: 'var(--font-nunito)' }}>%</span>
                </div>
              ) : (
                <button
                  onClick={iniciarEdicionProgreso}
                  className="flex items-center gap-1 font-black text-[#111] hover:text-[#E63B2E] transition-colors cursor-pointer group"
                  style={{ fontFamily: 'var(--font-nunito)' }}
                >
                  {proyecto.progreso}%
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 transition-opacity">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              )}
            </div>
            <BarraProgreso porcentaje={proyecto.progreso} altura="h-1.5" />
          </div>

          {/* Último avance */}
          {proyecto.ultimaNota && (
            <div>
              <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-1.5">
                Último avance
              </span>
              <div className="bg-[#F8F8F6] rounded-lg px-3 py-2.5 text-[12px] text-[#555] leading-relaxed">
                {proyecto.ultimaNota}
              </div>
            </div>
          )}

          {/* Próximo paso */}
          {proyecto.proximoPaso && (
            <div>
              <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-1.5">
                Próximo paso
              </span>
              <div className="bg-[#111] rounded-lg px-3 py-2.5 text-[12px] text-[#ccc] leading-relaxed">
                {proyecto.proximoPaso}
              </div>
            </div>
          )}

          {/* Stack */}
          <div>
            <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-2">
              Stack
            </span>
            <ChipStack tecnologias={proyecto.stack} />
          </div>

          {/* Agregar nota */}
          <div>
            <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-1.5">
              Agregar nota
            </span>
            <textarea
              value={nuevaNota}
              onChange={e => setNuevaNota(e.target.value)}
              placeholder="¿Qué avanzaste hoy?"
              className="w-full bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2.5 text-[12px] text-[#111] placeholder-[#ccc] resize-none outline-none focus:border-[#111] transition-colors h-20"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            />
            <button
              onClick={guardarNota}
              disabled={!nuevaNota.trim() || guardando}
              className="mt-2 w-full bg-[#111] text-white rounded-lg py-2 font-black text-[12px] disabled:opacity-40 transition-opacity"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              {guardando ? 'Guardando...' : 'Guardar nota →'}
            </button>
          </div>

          {/* Link repo */}
          {proyecto.repoUrl && (
            <a
              href={proyecto.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-[#E63B2E] hover:underline"
            >
              Ver en GitHub →
            </a>
          )}
        </div>
      )}
    </DrawerBase>
  )
}
