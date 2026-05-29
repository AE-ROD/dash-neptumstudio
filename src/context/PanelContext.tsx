'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type TipoDrawer = 'proyecto' | 'pendientes' | 'instagram' | null
type TipoModal  = 'propuesta' | 'cliente' | 'idea' | null

interface PanelContextValue {
  drawerAbierto: TipoDrawer
  modalAbierto: TipoModal
  idSeleccionado: string | null
  abrirDrawer: (tipo: TipoDrawer, id?: string) => void
  abrirModal:  (tipo: TipoModal,  id?: string) => void
  cerrarOverlay: () => void
}

const PanelContext = createContext<PanelContextValue | null>(null)

export function PanelProvider({ children }: { children: ReactNode }) {
  const [drawerAbierto, setDrawerAbierto] = useState<TipoDrawer>(null)
  const [modalAbierto,  setModalAbierto]  = useState<TipoModal>(null)
  const [idSeleccionado, setIdSeleccionado] = useState<string | null>(null)

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

  return (
    <PanelContext.Provider value={{
      drawerAbierto, modalAbierto, idSeleccionado,
      abrirDrawer, abrirModal, cerrarOverlay,
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
