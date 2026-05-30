'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Balance } from '@/types/panel'

export function useIngresos() {
  const [balance,  setBalance]  = useState<Balance | null>(null)
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/revenue')
      const data = res.ok ? await res.json() : null
      setBalance(data)
    } finally { setCargando(false) }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function registrar(monto: number, tipo: 'INGRESO' | 'EGRESO', descripcion?: string) {
    await fetch('/api/revenue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto, tipo, descripcion }),
    })
    await cargar()
  }

  // Alias legacy: expone `ingresos` para componentes que no migré aún
  return { balance, ingresos: balance, cargando, registrar, recargar: cargar }
}
