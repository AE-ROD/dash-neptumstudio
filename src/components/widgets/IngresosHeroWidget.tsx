'use client'
import { useEffect, useState } from 'react'
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
    <div
      className="rounded-2xl p-5 flex flex-col shadow-sm"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}
      >
        Balance del mes
      </span>
      <span
        className="text-[34px] font-light leading-none mt-2"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-cormorant)' }}
      >
        {cargando ? '—' : `$${balanceAnimado.toLocaleString('es-CL')}`}
      </span>
      <div className="flex items-center gap-2 mt-2">
        {balance && balance.ingresos > 0 && (
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: '#1A7F4B', background: '#EDFCF2', fontFamily: 'var(--font-dm-sans)' }}>
            +${balance.ingresos.toLocaleString('es-CL')} ing.
          </span>
        )}
        {balance && balance.egresos > 0 && (
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: '#C92A2A', background: '#FFF1F0', fontFamily: 'var(--font-dm-sans)' }}>
            −${balance.egresos.toLocaleString('es-CL')} egr.
          </span>
        )}
        {(!balance || (balance.ingresos === 0 && balance.egresos === 0)) && (
          <span className="text-[9px]"
            style={{ color: 'var(--text-3)', fontFamily: 'var(--font-dm-sans)' }}>
            Recién empezando
          </span>
        )}
      </div>
    </div>
  )
}
