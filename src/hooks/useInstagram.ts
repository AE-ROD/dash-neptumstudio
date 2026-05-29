'use client'
import { useState, useEffect } from 'react'
import type { SnapshotIG } from '@/types/panel'

export function useInstagram() {
  const [snapshot, setSnapshot] = useState<SnapshotIG | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('/api/instagram')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(setSnapshot)
      .finally(() => setCargando(false))
  }, [])

  return { snapshot, cargando }
}
