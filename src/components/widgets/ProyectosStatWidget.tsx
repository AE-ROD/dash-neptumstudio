'use client'
import { motion } from 'framer-motion'
import { useProyectos } from '@/hooks/useProyectos'

export function ProyectosStatWidget() {
  const { proyectos, cargando } = useProyectos()
  const activos = proyectos.filter(p => p.estado === 'ACTIVO').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.16 }}
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-1.5"
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest text-[#bbb]"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        Proyectos
      </span>
      <span
        className="text-[30px] font-black text-[#111] leading-none tracking-tight"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        {cargando ? '—' : proyectos.length}
      </span>
      <span className="self-start bg-[#111] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
        {activos} activos
      </span>
    </motion.div>
  )
}
