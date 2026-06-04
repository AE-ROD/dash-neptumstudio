'use client'
import { IngresosHeroWidget }  from '@/components/widgets/IngresosHeroWidget'
import { PipelineStatWidget }  from '@/components/widgets/PipelineStatWidget'
import { ProyectosStatWidget } from '@/components/widgets/ProyectosStatWidget'
import { InstagramStatWidget } from '@/components/widgets/InstagramStatWidget'
import { ProyectosListWidget } from '@/components/widgets/ProyectosListWidget'
import { IdeasWidget }         from '@/components/widgets/IdeasWidget'
import { PendientesWidget }    from '@/components/widgets/PendientesWidget'
import { CalendarioWidget }    from '@/components/widgets/CalendarioWidget'
import { SueltaloWidget }      from '@/components/widgets/SueltaloWidget'

export function IpadHomeGrid() {
  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto">
      <div className="grid grid-cols-4 gap-3">
        <IngresosHeroWidget />
        <PipelineStatWidget />
        <ProyectosStatWidget />
        <InstagramStatWidget />
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <ProyectosListWidget />
        <IdeasWidget />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <PendientesWidget />
        <CalendarioWidget />
        <SueltaloWidget />
      </div>
    </div>
  )
}
