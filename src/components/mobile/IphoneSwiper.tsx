'use client'
import { useRef, useEffect } from 'react'
import { IphoneSectionHoy }       from './sections/IphoneSectionHoy'
import { IphoneSectionNegocio }   from './sections/IphoneSectionNegocio'
import { IphoneSectionIdeas }     from './sections/IphoneSectionIdeas'
import { IphoneSectionClientes }  from './sections/IphoneSectionClientes'
import { IphoneSectionStats }     from './sections/IphoneSectionStats'

const SECTIONS = [
  IphoneSectionHoy,
  IphoneSectionNegocio,
  IphoneSectionIdeas,
  IphoneSectionClientes,
  IphoneSectionStats,
]

interface IphoneSwiperProps {
  onActiveChange: (index: number) => void
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export function IphoneSwiper({ onActiveChange, scrollRef }: IphoneSwiperProps) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const observers = sectionRefs.current.map((ref, i) => {
      if (!ref) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) onActiveChange(i) },
        { root: container, threshold: 0.5 }
      )
      obs.observe(ref)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [onActiveChange, scrollRef])

  return (
    <div
      ref={scrollRef}
      style={{
        display: 'flex',
        overflowX: 'auto',
        flex: 1,
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
      }}
    >
      {SECTIONS.map((Section, i) => (
        <div
          key={i}
          ref={el => { sectionRefs.current[i] = el }}
          style={{
            flexShrink: 0,
            width: '100vw',
            height: '100%',
            scrollSnapAlign: 'start',
            overflowY: 'auto',
          }}
        >
          <Section />
        </div>
      ))}
    </div>
  )
}
