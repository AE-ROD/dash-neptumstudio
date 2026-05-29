// src/app/page.tsx
import { PanelHeader }          from '@/components/layout/PanelHeader'
import { IngresosHeroWidget }   from '@/components/widgets/IngresosHeroWidget'
import { PipelineStatWidget }   from '@/components/widgets/PipelineStatWidget'
import { ProyectosStatWidget }  from '@/components/widgets/ProyectosStatWidget'
import { InstagramStatWidget }  from '@/components/widgets/InstagramStatWidget'
import { ProyectosListWidget }  from '@/components/widgets/ProyectosListWidget'
import { PipelineListWidget }   from '@/components/widgets/PipelineListWidget'
import { PendientesWidget }     from '@/components/widgets/PendientesWidget'
import { InstagramWidget }      from '@/components/widgets/InstagramWidget'
import { SueltaloWidget }       from '@/components/widgets/SueltaloWidget'
import { ProyectoDrawer }       from '@/components/drawers/ProyectoDrawer'
import { PendientesDrawer }     from '@/components/drawers/PendientesDrawer'
import { InstagramDrawer }      from '@/components/drawers/InstagramDrawer'
import { PropuestaModal }       from '@/components/modals/PropuestaModal'
import { IdeaModal }            from '@/components/modals/IdeaModal'

export default function PaginaPanel() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#EFEFED]">
      <PanelHeader />

      <main id="panel-main" className="flex-1 overflow-y-auto px-9 py-5 flex flex-col gap-3">

        {/* Fila 1: Stats */}
        <div id="seccion-stats" className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3">
          <IngresosHeroWidget />
          <PipelineStatWidget />
          <ProyectosStatWidget />
          <InstagramStatWidget />
        </div>

        {/* Fila 2: Listas principales */}
        <div id="seccion-proyectos" className="grid grid-cols-[2fr_1fr] gap-3">
          <ProyectosListWidget />
          <PipelineListWidget />
        </div>

        {/* Fila 3: Acciones del día */}
        <div id="seccion-dia" className="grid grid-cols-3 gap-3">
          <PendientesWidget />
          <InstagramWidget />
          <SueltaloWidget />
        </div>

      </main>

      {/* Overlays — montados fuera del scroll */}
      <ProyectoDrawer />
      <PendientesDrawer />
      <InstagramDrawer />
      <PropuestaModal />
      <IdeaModal />
    </div>
  )
}
