'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePanelContext }            from '@/context/PanelContext'
import type { SeccionActiva }         from '@/context/PanelContext'
import { PanelHeader }                from '@/components/layout/PanelHeader'
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
import { ProyectosPageWidget }        from '@/components/widgets/ProyectosPageWidget'
import { PipelinePageWidget }         from '@/components/widgets/PipelinePageWidget'
import { ContactosWidget }            from '@/components/widgets/ContactosWidget'
import { CotizacionesWidget }         from '@/components/widgets/CotizacionesWidget'
import { PendientesPageWidget }       from '@/components/widgets/PendientesPageWidget'
import { BalancePageWidget }          from '@/components/widgets/BalancePageWidget'
import { InstagramPageWidget }        from '@/components/widgets/InstagramPageWidget'
import { ProyectoDrawer }             from '@/components/drawers/ProyectoDrawer'
import { CalendarioDrawer }           from '@/components/drawers/CalendarioDrawer'
import { PropuestaModal }             from '@/components/modals/PropuestaModal'
import { IdeaModal }                  from '@/components/modals/IdeaModal'
import { CotizacionModal }            from '@/components/modals/CotizacionModal'

type FilaPagina =
  | 'inicio'
  | 'pg-proyectos' | 'pg-pipeline' | 'pg-clientes'
  | 'pg-cotizaciones' | 'pg-contacto'
  | 'pg-pendientes' | 'pg-balance' | 'pg-instagram'

const FILAS_POR_SECCION: Record<SeccionActiva, FilaPagina[]> = {
  inicio:       ['inicio'],
  proyectos:    ['pg-proyectos'],
  clientes:     ['pg-clientes'],
  pipeline:     ['pg-pipeline'],
  cotizaciones: ['pg-cotizaciones'],
  contacto:     ['pg-contacto'],
  balance:      ['pg-balance'],
  pendientes:   ['pg-pendientes'],
  instagram:    ['pg-instagram'],
}

const fade = {
  initial:    { opacity: 0, y: 6 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -6 },
  transition: { duration: 0.22 },
}

const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
const itemFade = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function DesktopLayout() {
  const { seccionActiva } = usePanelContext()
  const filas = FILAS_POR_SECCION[seccionActiva]

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <PanelHeader />
      <main id="panel-main" className="flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-4 lg:px-9 lg:py-5 flex flex-col gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filas.includes('inicio') && (
            <motion.div key="inicio" {...fade}
              className="flex flex-col xl:grid xl:grid-cols-[1fr_260px] gap-3 items-start">
              <div className="flex flex-col gap-3">
                <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" variants={stagger} initial="initial" animate="animate">
                  <motion.div variants={itemFade}><IngresosHeroWidget /></motion.div>
                  <motion.div variants={itemFade}><PipelineStatWidget /></motion.div>
                  <motion.div variants={itemFade}><ProyectosStatWidget /></motion.div>
                  <motion.div variants={itemFade}><InstagramStatWidget /></motion.div>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
                  <ProyectosListWidget />
                  <PipelineListWidget />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <PendientesWidget />
                  <CalendarioWidget />
                  <SueltaloWidget />
                </div>
              </div>
              <div className="sticky top-0"><IdeasWidget /></div>
            </motion.div>
          )}
          {filas.includes('pg-proyectos') && (
            <motion.div key="pg-proyectos" {...fade}><ProyectosPageWidget /></motion.div>
          )}
          {filas.includes('pg-pipeline') && (
            <motion.div key="pg-pipeline" {...fade}><PipelinePageWidget /></motion.div>
          )}
          {filas.includes('pg-clientes') && (
            <motion.div key="pg-clientes" {...fade}><ContactosWidget /></motion.div>
          )}
          {filas.includes('pg-cotizaciones') && (
            <motion.div key="pg-cotizaciones" {...fade}><CotizacionesWidget /></motion.div>
          )}
          {filas.includes('pg-contacto') && (
            <motion.div key="pg-contacto" {...fade}><ContactosWidget /></motion.div>
          )}
          {filas.includes('pg-pendientes') && (
            <motion.div key="pg-pendientes" {...fade}><PendientesPageWidget /></motion.div>
          )}
          {filas.includes('pg-balance') && (
            <motion.div key="pg-balance" {...fade}><BalancePageWidget /></motion.div>
          )}
          {filas.includes('pg-instagram') && (
            <motion.div key="pg-instagram" {...fade}><InstagramPageWidget /></motion.div>
          )}
        </AnimatePresence>
      </main>
      <ProyectoDrawer />
      <CalendarioDrawer />
      <PropuestaModal />
      <IdeaModal />
      <CotizacionModal />
    </div>
  )
}
