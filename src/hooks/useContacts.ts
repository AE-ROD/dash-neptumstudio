'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Contacto } from '@/types/panel'

export function useContacts() {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [cargando,  setCargando]  = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    const res = await fetch('/api/contacts')
    if (res.ok) setContactos(await res.json())
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function crearContacto(datos: Partial<Contacto>) {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    if (!res.ok) throw new Error('Error al crear contacto')
    await cargar()
    return res.json()
  }

  async function eliminarContacto(id: string) {
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al eliminar contacto')
    await cargar()
  }

  return { contactos, cargando, crearContacto, eliminarContacto, recargar: cargar }
}
