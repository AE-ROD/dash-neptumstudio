'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePanelContext }            from '@/context/PanelContext'
import type { SeccionActiva }         from '@/context/PanelContext'
import { PanelHeader }                from '@/components/layout/PanelHeader'
// Widgets de inicio (dashboard)
import { IngresosHeroWidget }         from '@/components/widgets/IngresosHeroWidget'
import { PipelineStatWidget }         from '@/components/widgets/PipelineStatWidget'
import { ProyectosStatWidget }        from '@/components/widgets/ProyectosStatWidget'
import { InstagramStatWidget }        from '@/components/widgets/InstagramStatWidget'
import { ProyectosListWidget }        from '@/components/widgets/ProyectosListWidget'
import { PipelineListWidget }         from '@/components/widgets/PipelineListWidget'
import { PendientesWidget }           from '@/components/widgets/PendientesWidget'
import { CalendarioWidget }           from '@/components/widgets/CalendarioWidget'
import { SueltaloWidget }             from '@/components/widgets/SueltaloWidget'
import { IdeasWidget }                from '@/components/widgets/IdeasWidget'
// Páginas dedicadas por pill
import { ProyectosPageWidget }        from '@/components/widgets/ProyectosPageWidget'
import { PipelinePageWidget }         from '@/components/widgets/PipelinePageWidget'
import { ContactosWidget }            from '@/components/widgets/ContactosWidget'
import { CotizacionesWidget }         from '@/components/widgets/CotizacionesWidget'
import { PendientesPageWidget }       from '@/components/widgets/PendientesPageWidget'
import { IngresosPageWidget }         from '@/components/widgets/IngresosPageWidget'
import { InstagramPageWidget }        from '@/components/widgets/InstagramPageWidget'
// Overlays
import { ProyectoDrawer }             from '@/components/drawers/ProyectoDrawer'
import { PendientesDrawer }           from '@/components/drawers/PendientesDrawer'
import { CalendarioDrawer }           from '@/components/drawers/CalendarioDrawer'
import { PropuestaModal }             from '@/components/modals/PropuestaModal'
import { IdeaModal }                  from '@/components/modals/IdeaModal'
import { CotizacionModal }            from '@/components/modals/CotizacionModal'

// inicio → dashboard completo con todas las filas
// cualquier otro pill → página dedicada full-width
type FilaPagina = 'stats' | 'listas' | 'dia'
  | 'pg-proyectos' | 'pg-pipeline' | 'pg-clientes'
  | 'pg-cotizaciones' | 'pg-contacto'
  | 'pg-pendientes' | 'pg-ingresos' | 'pg-instagram'

const FILAS_POR_SECCION: Record<SeccionActiva, FilaPagina[]> = {
  inicio:       ['stats', 'listas', 'dia'],
  proyectos:    ['pg-proyectos'],
  clientes:     ['pg-clientes'],
  pipeline:     ['pg-pipeline'],
  cotizaciones: ['pg-cotizaciones'],
  contacto:     ['pg-contacto'],
  ingresos:     ['pg-ingresos'],
  pendientes:   ['pg-pendientes'],
  instagram:    ['pg-instagram'],
}

const fade = {
  initial:    { opacity: 0, y: 6 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -6 },
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

          {/* ── INICIO: dashboard con todas las filas ── */}
          {filas.includes('stats') && (
            <motion.div key="stats" {...fade}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3">
              <IngresosHeroWidget />
              <PipelineStatWidget />
              <ProyectosStatWidget />
              <InstagramStatWidget />
            </motion.div>
          )}

          {filas.includes('listas') && (
            <motion.div key="listas" {...fade}
              className="grid grid-cols-[2fr_1fr] gap-3">
              <ProyectosListWidget />
              <PipelineListWidget />
            </motion.div>
          )}

          {filas.includes('dia') && (
            <motion.div key="dia" {...fade}
              className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-3">
              <PendientesWidget />
              <CalendarioWidget />
              <SueltaloWidget />
              <IdeasWidget />
            </motion.div>
          )}

          {/* ── PÁGINAS DEDICADAS ── */}
          {filas.includes('pg-proyectos') && (
            <motion.div key="pg-proyectos" {...fade}>
              <ProyectosPageWidget />
            </motion.div>
          )}

          {filas.includes('pg-pipeline') && (
            <motion.div key="pg-pipeline" {...fade}>
              <PipelinePageWidget />
            </motion.div>
          )}

          {filas.includes('pg-clientes') && (
            <motion.div key="pg-clientes" {...fade}>
              <ContactosWidget />
            </motion.div>
          )}

          {filas.includes('pg-cotizaciones') && (
            <motion.div key="pg-cotizaciones" {...fade}>
              <CotizacionesWidget />
            </motion.div>
          )}

          {filas.includes('pg-contacto') && (
            <motion.div key="pg-contacto" {...fade}>
              <ContactosWidget />
            </motion.div>
          )}

          {filas.includes('pg-pendientes') && (
            <motion.div key="pg-pendientes" {...fade}>
              <PendientesPageWidget />
            </motion.div>
          )}

          {filas.includes('pg-ingresos') && (
            <motion.div key="pg-ingresos" {...fade}>
              <IngresosPageWidget />
            </motion.div>
          )}

          {filas.includes('pg-instagram') && (
            <motion.div key="pg-instagram" {...fade}>
              <InstagramPageWidget />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Overlays */}
      <ProyectoDrawer />
      <PendientesDrawer />
      <CalendarioDrawer />
      <PropuestaModal />
      <IdeaModal />
      <CotizacionModal />
    </div>
  )
}
