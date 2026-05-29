'use client'
import { motion } from 'framer-motion'
import { useProposals } from '@/hooks/useProposals'
import { usePanelContext } from '@/context/PanelContext'
import { BadgeEstado } from '@/components/ui/BadgeEstado'

export function PipelineListWidget() {
  const { propuestas, cargando } = useProposals()
  const { abrirModal } = usePanelContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-black text-[13px] text-[#111] tracking-tight"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          Pipeline
        </span>
        <button className="text-[11px] font-bold text-[#E63B2E]">+ Nuevo →</button>
      </div>

      <div className="flex flex-col">
        {cargando
          ? <span className="text-[#bbb] text-xs py-4 text-center">Cargando...</span>
          : propuestas.map((propuesta, indice) => (
            <motion.button
              key={propuesta.id}
              onClick={() => abrirModal('propuesta', propuesta.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: indice * 0.08 }}
              whileHover={{ x: 2 }}
              className="flex items-center justify-between py-2.5 border-b border-[#F5F5F3] last:border-0 text-left w-full"
            >
              <div>
                <div className="text-[12px] font-bold text-[#111]">{propuesta.nombreCliente}</div>
                <div className="text-[10px] text-[#bbb] mt-0.5">
                  {propuesta.descripcion}
                  {propuesta.monto ? ` · $${propuesta.monto.toLocaleString('es-CL')}` : ''}
                </div>
              </div>
              <BadgeEstado estado={propuesta.estado} />
            </motion.button>
          ))
        }
      </div>
    </motion.div>
  )
}
