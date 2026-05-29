'use client'
import { useEffect, useRef } from 'react'

interface SparklineProps {
  puntos: number[]   // valores a graficar
  colorLinea?: string
  colorRelleno?: string
}

function normalizarPuntos(puntos: number[], ancho: number, alto: number): string {
  if (puntos.length <= 1) {
    // Un solo punto — línea horizontal centrada
    return `0,${alto / 2} ${ancho},${alto / 2}`
  }
  const min = Math.min(...puntos)
  const max = Math.max(...puntos)
  const rango = max - min || 1
  return puntos
    .map((v, i) => {
      const x = (i / (puntos.length - 1)) * ancho
      const y = alto - ((v - min) / rango) * (alto * 0.8) - alto * 0.1
      return `${x},${y}`
    })
    .join(' ')
}

export function Sparkline({
  puntos,
  colorLinea  = '#E63B2E',
  colorRelleno = 'rgba(230,59,46,0.1)',
}: SparklineProps) {
  const pathRef = useRef<SVGPolylineElement>(null)

  const ANCHO = 200
  const ALTO  = 32
  const coordenadas = normalizarPuntos(puntos, ANCHO, ALTO)
  const coordenadasRelleno = `${coordenadas} ${ANCHO},${ALTO} 0,${ALTO}`

  useEffect(() => {
    if (!pathRef.current) return
    const longitud = pathRef.current.getTotalLength()
    pathRef.current.style.strokeDasharray  = `${longitud}`
    pathRef.current.style.strokeDashoffset = `${longitud}`
    // Doble rAF para garantizar que el navegador commit el estado inicial antes de animar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!pathRef.current) return
        pathRef.current.style.transition = 'stroke-dashoffset 1s ease-out'
        pathRef.current.style.strokeDashoffset = '0'
      })
    })
  }, [])

  return (
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} fill="none" preserveAspectRatio="none" className="w-full h-8">
      <polygon points={coordenadasRelleno} fill={colorRelleno} />
      <polyline
        ref={pathRef}
        points={coordenadas}
        stroke={colorLinea}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}
