'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useIngresos } from '@/hooks/useIngresos'

function useContadorAnimado(objetivo: number, duracion = 1000) {
  const [valor, setValor] = useState(0)
  useEffect(() => {
    if (!objetivo) return
    const inicio = performance.now()
    const animar = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1)
      const ease     = 1 - Math.pow(1 - progreso, 3)
      setValor(Math.floor(ease * objetivo))
      if (progreso < 1) requestAnimationFrame(animar)
    }
    requestAnimationFrame(animar)
  }, [objetivo, duracion])
  return valor
}

export function IngresosHeroWidget() {
  const { balance, cargando } = useIngresos()
  const balanceAnimado = useContadorAnimado(balance?.balance ?? 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#0D1B2A] rounded-2xl p-5 flex flex-col shadow-sm"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#415466]"
        style={{ fontFamily: 'var(--font-dm-sans)' }}>
        Balance del mes
      </span>

      <span className="text-[34px] font-light text-white leading-none mt-2"
        style={{ fontFamily: 'var(--font-cormorant)' }}>
        {cargando ? '—' : `$${balanceAnimado.toLocaleString('es-CL')}`}
      </span>

      <div className="flex items-center gap-2 mt-2">
        {balance && balance.ingresos > 0 && (
          <span className="text-[9px] font-semibold text-[#1A7F4B] bg-[#EDFCF2] px-2 py-0.5 rounded-full"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            +${balance.ingresos.toLocaleString('es-CL')} ing.
          </span>
        )}
        {balance && balance.egresos > 0 && (
          <span className="text-[9px] font-semibold text-[#C92A2A] bg-[#FFF1F0] px-2 py-0.5 rounded-full"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            −${balance.egresos.toLocaleString('es-CL')} egr.
          </span>
        )}
        {(!balance || (balance.ingresos === 0 && balance.egresos === 0)) && (
          <span className="text-[9px] text-[#415466]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Recién empezando
          </span>
        )}
      </div>
    </motion.div>
  )
}
