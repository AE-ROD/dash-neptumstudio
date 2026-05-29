'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePanelContext }          from '@/context/PanelContext'
import type { SeccionActiva }       from '@/context/PanelContext'
import { PanelHeader }              from '@/components/layout/PanelHeader'
import { IngresosHeroWidget }       from '@/components/widgets/IngresosHeroWidget'
import { PipelineStatWidget }       from '@/components/widgets/PipelineStatWidget'
import { ProyectosStatWidget }      from '@/components/widgets/ProyectosStatWidget'
import { InstagramStatWidget }      from '@/components/widgets/InstagramStatWidget'
import { ProyectosListWidget }      from '@/components/widgets/ProyectosListWidget'
import { PipelineListWidget }       from '@/components/widgets/PipelineListWidget'
import { PendientesWidget }         from '@/components/widgets/PendientesWidget'
import { InstagramWidget }          from '@/components/widgets/InstagramWidget'
import { SueltaloWidget }           from '@/components/widgets/SueltaloWidget'
import { ProyectoDrawer }           from '@/components/drawers/ProyectoDrawer'
import { PendientesDrawer }         from '@/components/drawers/PendientesDrawer'
import { InstagramDrawer }          from '@/components/drawers/InstagramDrawer'
import { PropuestaModal }           from '@/components/modals/PropuestaModal'
import { IdeaModal }                from '@/components/modals/IdeaModal'

// Qué filas se muestran según la sección activa
type FilaPagina = 'stats' | 'listas' | 'dia'
const FILAS_POR_SECCION: Record<SeccionActiva, FilaPagina[]> = {
  inicio:     ['stats', 'listas', 'dia'],
  ingresos:   ['stats'],
  proyectos:  ['stats', 'listas'],
  clientes:   ['stats', 'listas'],
  pipeline:   ['stats', 'listas'],
  pendientes: ['stats', 'listas', 'dia'],
  instagram:  ['stats', 'listas', 'dia'],
}

const fade = {
  initial:  { opacity: 0, y: 6 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -6 },
  transition: { duration: 0.22 },
}

export default function PaginaPanel() {
  const { seccionActiva } = usePanelContext()
  const filas = FILAS_POR_SECCION[seccionActiva]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#EFEFED]">
      <PanelHeader />

      <main id="panel-main" className="flex-1 overflow-y-auto px-9 py-5 flex flex-col gap-3">
        <AnimatePresence mode="popLayout" initial={false}>

          {filas.includes('stats') && (
            <motion.div key="stats" {...fade}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3"
            >
              <IngresosHeroWidget />
              <PipelineStatWidget />
              <ProyectosStatWidget />
              <InstagramStatWidget />
            </motion.div>
          )}

          {filas.includes('listas') && (
            <motion.div key="listas" {...fade}
              className="grid grid-cols-[2fr_1fr] gap-3"
            >
              <ProyectosListWidget />
              <PipelineListWidget />
            </motion.div>
          )}

          {filas.includes('dia') && (
            <motion.div key="dia" {...fade}
              className="grid grid-cols-3 gap-3"
            >
              <PendientesWidget />
              <InstagramWidget />
              <SueltaloWidget />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Overlays */}
      <ProyectoDrawer />
      <PendientesDrawer />
      <InstagramDrawer />
      <PropuestaModal />
      <IdeaModal />
    </div>
  )
}
