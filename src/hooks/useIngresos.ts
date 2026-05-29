'use client'
import { useState, useEffect } from 'react'
import type { IngresosMes } from '@/types/panel'

export function useIngresos() {
  const [ingresos, setIngresos] = useState<IngresosMes | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('/api/revenue')
      .then(r => r.ok ? r.json() : null)
      .then(setIngresos)
      .finally(() => setCargando(false))
  }, [])

  return { ingresos, cargando }
}
