'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Evento } from '@/types/panel'

export function useEventos() {
  const [eventos,  setEventos]  = useState<Evento[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/eventos')
      const data = await res.json()
      setEventos(data)
    } finally { setCargando(false) }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function crearEvento(datos: { titulo: string; fecha: string; hora?: string; tipo: string; clienteId?: string; descripcion?: string }) {
    const res = await fetch('/api/eventos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })
    const nuevo = await res.json()
    setEventos(prev => [...prev, nuevo].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()))
    return nuevo
  }

  async function eliminarEvento(id: string) {
    await fetch(`/api/eventos/${id}`, { method: 'DELETE' })
    setEventos(prev => prev.filter(e => e.id !== id))
  }

  return { eventos, cargando, crearEvento, eliminarEvento, recargar: cargar }
}
