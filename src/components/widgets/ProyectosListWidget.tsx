'use client'
import { motion } from 'framer-motion'
import { useProyectos } from '@/hooks/useProyectos'
import { usePanelContext } from '@/context/PanelContext'
import { BarraProgreso } from '@/components/ui/BarraProgreso'

const COLOR_AVATAR: Record<string, string> = {
  'Eli':           '#111111',
  'iPro':          '#E63B2E',
  'Klin · Anelis': '#2D2D2D',
  'M-Fit':         '#EBEBEA',
}

function getColorAvatar(nombre: string): string {
  return COLOR_AVATAR[nombre] ?? '#111111'
}

export function ProyectosListWidget() {
  const { proyectos, cargando } = useProyectos()
  const { abrirDrawer } = usePanelContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.32 }}
      className="rounded-2xl p-5 shadow-sm"
      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-black text-[13px] tracking-tight"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito)' }}
        >
          Proyectos
        </span>
        <button className="text-[11px] font-bold text-[#E63B2E]">Ver todos →</button>
      </div>

      <div className="flex flex-col">
        {cargando
          ? <span className="text-xs py-4 text-center" style={{ color: 'var(--text-2)' }}>Cargando...</span>
          : proyectos.map((proyecto, indice) => {
            const colorAvatar = getColorAvatar(proyecto.nombre)
            const textoBrillante = colorAvatar === '#EBEBEA'
            return (
              <motion.button
                key={proyecto.id}
                onClick={() => abrirDrawer('proyecto', proyecto.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: indice * 0.08 }}
                whileHover={{ x: 2 }}
                className="flex items-center gap-2.5 py-2 border-b last:border-0 text-left w-full"
                style={{ borderColor: 'var(--border)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colorAvatar }}
                >
                  <span
                    className="font-black text-[12px]"
                    style={{
                      color: textoBrillante ? '#888' : '#fff',
                      fontFamily: 'var(--font-nunito)',
                    }}
                  >
                    {proyecto.nombre[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold truncate" style={{ color: 'var(--text)' }}>{proyecto.nombre}</div>
                  <div className="text-[10px] truncate" style={{ color: 'var(--text-2)' }}>
                    {proyecto.stack.slice(0, 2).join(' · ')}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 w-14">
                  <span
                    className="font-black text-[11px]"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito)' }}
                  >
                    {proyecto.progreso}%
                  </span>
                  <BarraProgreso
                    porcentaje={proyecto.progreso}
                    colorBarra={proyecto.estado === 'PAUSADO' ? '#ddd' : '#111'}
                    delayAnimacion={indice * 0.1}
                    altura="h-[3px]"
                  />
                </div>
              </motion.button>
            )
          })
        }
      </div>
    </motion.div>
  )
}
