'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePanelContext }      from '@/context/PanelContext'
import { IpadSidebar }          from './IpadSidebar'
import { IpadHomeGrid }         from './IpadHomeGrid'
import { ProyectosPageWidget }  from '@/components/widgets/ProyectosPageWidget'
import { PipelinePageWidget }   from '@/components/widgets/PipelinePageWidget'
import { ContactosWidget }      from '@/components/widgets/ContactosWidget'
import { CotizacionesWidget }   from '@/components/widgets/CotizacionesWidget'
import { PendientesPageWidget } from '@/components/widgets/PendientesPageWidget'
import { BalancePageWidget }    from '@/components/widgets/BalancePageWidget'
import { InstagramPageWidget }  from '@/components/widgets/InstagramPageWidget'
import { ProyectoDrawer }       from '@/components/drawers/ProyectoDrawer'
import { CalendarioDrawer }     from '@/components/drawers/CalendarioDrawer'
import { PropuestaModal }       from '@/components/modals/PropuestaModal'
import { IdeaModal }            from '@/components/modals/IdeaModal'
import { CotizacionModal }      from '@/components/modals/CotizacionModal'

const fade = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.18 },
}

export function IpadLayout() {
  const { seccionActiva } = usePanelContext()

  return (
    <div style={{ display: 'flex', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <IpadSidebar />

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {seccionActiva === 'inicio' && (
            <motion.div key="inicio" {...fade} style={{ flex: 1, overflow: 'hidden' }}>
              <IpadHomeGrid />
            </motion.div>
          )}
          {seccionActiva === 'proyectos' && (
            <motion.div key="proyectos" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <ProyectosPageWidget />
            </motion.div>
          )}
          {seccionActiva === 'pipeline' && (
            <motion.div key="pipeline" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <PipelinePageWidget />
            </motion.div>
          )}
          {(seccionActiva === 'clientes' || seccionActiva === 'contacto') && (
            <motion.div key="clientes" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <ContactosWidget />
            </motion.div>
          )}
          {seccionActiva === 'cotizaciones' && (
            <motion.div key="cotizaciones" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <CotizacionesWidget />
            </motion.div>
          )}
          {seccionActiva === 'pendientes' && (
            <motion.div key="pendientes" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <PendientesPageWidget />
            </motion.div>
          )}
          {seccionActiva === 'balance' && (
            <motion.div key="balance" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <BalancePageWidget />
            </motion.div>
          )}
          {seccionActiva === 'instagram' && (
            <motion.div key="instagram" {...fade} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <InstagramPageWidget />
            </motion.div>
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
