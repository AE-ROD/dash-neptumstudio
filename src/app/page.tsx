'use client'
import { useState, useEffect } from 'react'
import { useMediaQuery }  from '@/hooks/useMediaQuery'
import { DesktopLayout }  from '@/components/mobile/DesktopLayout'
import { IphoneLayout }   from '@/components/mobile/IphoneLayout'
import { IpadLayout }     from '@/components/mobile/IpadLayout'

export default function PaginaPanel() {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)')

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <DesktopLayout />
  if (isMobile)  return <IphoneLayout />
  if (isTablet)  return <IpadLayout />
  return <DesktopLayout />
}
