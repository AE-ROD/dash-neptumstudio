'use client'
import { motion } from 'framer-motion'
import { useInstagram } from '@/hooks/useInstagram'
import { usePanelContext } from '@/context/PanelContext'

export function InstagramWidget() {
  const { snapshot, cargando } = useInstagram()
  const { abrirDrawer } = usePanelContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.56 }}
      className="bg-white rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-black text-[13px] text-[#111] tracking-tight"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          @neptumstudio
        </span>
        <button
          onClick={() => abrirDrawer('instagram')}
          className="text-[11px] font-bold text-[#E63B2E]"
        >
          Ver más →
        </button>
      </div>

      <div className="text-center py-2">
        <span
          className="text-[40px] font-black text-[#111] leading-none tracking-tight block"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          {cargando ? '—' : snapshot?.seguidores.toLocaleString('es-CL')}
        </span>
        <span className="text-[11px] text-[#bbb] mt-1 block">seguidores</span>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-[#FEF2F1] rounded-full px-3 py-1">
          <span className="text-[#E63B2E] text-[12px] font-extrabold">
            ↑ +{snapshot?.crecimientoSemanal ?? 0}
          </span>
          <span className="text-[11px] text-[#bbb]">esta semana</span>
        </div>
      </div>

      <div className="mt-2 border-t border-[#F5F5F3] pt-2 flex flex-col gap-1">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#bbb]">Posts totales</span>
          <span
            className="font-black text-[#111]"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            {snapshot?.publicaciones ?? '—'}
          </span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-[#bbb]">Alcance promedio</span>
          <span
            className="font-black text-[#111]"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            {snapshot?.alcancePromedio ?? '—'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
