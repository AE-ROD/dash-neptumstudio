'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export type TipoDrawer     = 'proyecto' | 'pendientes' | 'instagram' | 'calendario' | null
export type TipoModal      = 'propuesta' | 'cliente' | 'idea' | 'cotizacion' | null
export type SeccionActiva  = 'inicio' | 'proyectos' | 'clientes' | 'pipeline' | 'balance' | 'pendientes' | 'instagram' | 'cotizaciones' | 'contacto'

interface PanelContextValue {
  drawerAbierto:  TipoDrawer
  modalAbierto:   TipoModal
  idSeleccionado: string | null
  seccionActiva:  SeccionActiva
  abrirDrawer:    (tipo: TipoDrawer, id?: string) => void
  abrirModal:     (tipo: TipoModal,  id?: string) => void
  cerrarOverlay:  () => void
  cambiarSeccion: (s: SeccionActiva) => void
}

const PanelContext = createContext<PanelContextValue | null>(null)

export function PanelProvider({ children }: { children: ReactNode }) {
  const [drawerAbierto,  setDrawerAbierto]  = useState<TipoDrawer>(null)
  const [modalAbierto,   setModalAbierto]   = useState<TipoModal>(null)
  const [idSeleccionado, setIdSeleccionado] = useState<string | null>(null)
  const [seccionActiva,  setSeccionActiva]  = useState<SeccionActiva>('inicio')

  function abrirDrawer(tipo: TipoDrawer, id?: string) {
    setModalAbierto(null)
    setDrawerAbierto(tipo)
    setIdSeleccionado(id ?? null)
  }

  function abrirModal(tipo: TipoModal, id?: string) {
    setDrawerAbierto(null)
    setModalAbierto(tipo)
    setIdSeleccionado(id ?? null)
  }

  function cerrarOverlay() {
    setDrawerAbierto(null)
    setModalAbierto(null)
    setIdSeleccionado(null)
  }

  function cambiarSeccion(s: SeccionActiva) {
    setSeccionActiva(s)
  }

  return (
    <PanelContext.Provider value={{
      drawerAbierto, modalAbierto, idSeleccionado, seccionActiva,
      abrirDrawer, abrirModal, cerrarOverlay, cambiarSeccion,
    }}>
      {children}
    </PanelContext.Provider>
  )
}

export function usePanelContext() {
  const ctx = useContext(PanelContext)
  if (!ctx) throw new Error('usePanelContext debe usarse dentro de PanelProvider')
  return ctx
}
