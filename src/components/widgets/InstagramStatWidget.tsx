'use client'
import { motion } from 'framer-motion'
import { useInstagram } from '@/hooks/useInstagram'

export function InstagramStatWidget() {
  const { snapshot, cargando } = useInstagram()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.24 }}
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-1.5"
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest text-[#bbb]"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        Instagram
      </span>
      <span
        className="text-[30px] font-black text-[#111] leading-none tracking-tight"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        {cargando ? '—' : snapshot?.seguidores.toLocaleString('es-CL')}
      </span>
      <span className="self-start bg-[#111] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
        +{snapshot?.crecimientoSemanal ?? 0} sem.
      </span>
    </motion.div>
  )
}
