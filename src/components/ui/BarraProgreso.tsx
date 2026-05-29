'use client'
import { motion } from 'framer-motion'

interface BarraProgresoProps {
  porcentaje: number       // 0-100
  colorBarra?: string
  delayAnimacion?: number  // segundos
  altura?: string
}

export function BarraProgreso({
  porcentaje,
  colorBarra = '#111111',
  delayAnimacion = 0,
  altura = 'h-[3px]',
}: BarraProgresoProps) {
  return (
    <div className={`w-full ${altura} bg-[#F0F0EE] rounded-full overflow-hidden`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: colorBarra }}
        initial={{ width: 0 }}
        animate={{ width: `${porcentaje}%` }}
        transition={{ duration: 0.8, delay: delayAnimacion, ease: 'easeOut' }}
      />
    </div>
  )
}
