'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useIngresos } from '@/hooks/useIngresos'
import { Sparkline } from '@/components/ui/Sparkline'

const PUNTOS_DEMO = [2800, 3100, 2900, 3800, 3500, 4200]

function useContadorAnimado(objetivo: number, duracion = 1000) {
  const [valor, setValor] = useState(0)
  useEffect(() => {
    if (!objetivo) return
    const inicio    = performance.now()
    const animar    = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1)
      const ease     = 1 - Math.pow(1 - progreso, 3) // ease-out cubic
      setValor(Math.floor(ease * objetivo))
      if (progreso < 1) requestAnimationFrame(animar)
    }
    requestAnimationFrame(animar)
  }, [objetivo, duracion])
  return valor
}

export function IngresosHeroWidget() {
  const { ingresos, cargando } = useIngresos()
  const totalAnimado = useContadorAnimado(ingresos?.total ?? 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#111] rounded-2xl p-5 flex flex-col shadow-sm"
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest text-[#555]"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        Ingresos del mes
      </span>

      <span
        className="text-[34px] font-black text-white leading-none tracking-tight mt-2"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        {cargando ? '—' : `$${totalAnimado.toLocaleString('es-CL')}`}
      </span>

      <span className="mt-1.5 self-start bg-[#E63B2E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
        ↑ 12% este mes
      </span>

      <div className="mt-auto pt-3">
        <Sparkline puntos={PUNTOS_DEMO} />
      </div>
    </motion.div>
  )
}
