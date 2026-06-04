'use client'
import { useState, useRef, useCallback } from 'react'
import { IphoneHeader }     from './IphoneHeader'
import { IphoneSwiper }     from './IphoneSwiper'
import { MobileFAB }        from './MobileFAB'
import { ProyectoDrawer }   from '@/components/drawers/ProyectoDrawer'
import { CalendarioDrawer } from '@/components/drawers/CalendarioDrawer'
import { PropuestaModal }   from '@/components/modals/PropuestaModal'
import { IdeaModal }        from '@/components/modals/IdeaModal'
import { CotizacionModal }  from '@/components/modals/CotizacionModal'

export function IphoneLayout() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scrollToSection = useCallback((index: number) => {
    scrollRef.current?.scrollTo({ left: index * window.innerWidth, behavior: 'smooth' })
  }, [])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}
    >
      <IphoneHeader activeIndex={activeIndex} onDotClick={scrollToSection} />
      <IphoneSwiper onActiveChange={setActiveIndex} scrollRef={scrollRef} />
      <MobileFAB />
      <ProyectoDrawer />
      <CalendarioDrawer />
      <PropuestaModal />
      <IdeaModal />
      <CotizacionModal />
    </div>
  )
}
