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

  const proyecto = proyectos.find(p => p.id === idSeleccionado)
  const estaAbierto = drawerAbierto === 'proyecto'

  // Limpiar nota al cambiar de proyecto
  useEffect(() => { setNuevaNota('') }, [idSeleccionado])

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
            <div className="flex justify-between text-[11px]">
              <span className="font-bold text-[#555] uppercase tracking-widest">Progreso</span>
              <span className="font-black text-[#111]"
                style={{ fontFamily: 'var(--font-nunito)' }}>
                {proyecto.progreso}%
              </span>
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
