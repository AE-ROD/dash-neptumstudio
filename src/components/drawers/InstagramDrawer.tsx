'use client'
import { usePanelContext } from '@/context/PanelContext'
import { useInstagram } from '@/hooks/useInstagram'
import { DrawerBase } from './DrawerBase'
import { BarraProgreso } from '@/components/ui/BarraProgreso'

const META_SEGUIDORES = 1000

export function InstagramDrawer() {
  const { drawerAbierto } = usePanelContext()
  const { snapshot, cargando } = useInstagram()

  const estaAbierto = drawerAbierto === 'instagram'
  const progresoMeta = snapshot
    ? Math.min((snapshot.seguidores / META_SEGUIDORES) * 100, 100)
    : 0

  return (
    <DrawerBase estaAbierto={estaAbierto} titulo="@neptumstudio">
      {cargando ? (
        <span className="text-[#bbb] text-sm">Cargando...</span>
      ) : snapshot ? (
        <div className="flex flex-col gap-6">

          {/* Seguidores grande */}
          <div className="text-center py-4 border-b border-[#F5F5F3]">
            <span
              className="text-[56px] font-black text-[#111] leading-none tracking-tight block"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              {snapshot.seguidores.toLocaleString('es-CL')}
            </span>
            <span className="text-[12px] text-[#bbb] mt-1 block">seguidores</span>
            {snapshot.crecimientoSemanal !== null && (
              <div className="inline-flex items-center gap-2 mt-3 bg-[#FEF2F1] rounded-full px-4 py-1.5">
                <span className="text-[#E63B2E] text-[14px] font-extrabold">
                  {snapshot.crecimientoSemanal >= 0 ? '↑' : '↓'}{' '}
                  {snapshot.crecimientoSemanal >= 0 ? '+' : ''}{snapshot.crecimientoSemanal}
                </span>
                <span className="text-[12px] text-[#bbb]">esta semana</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-3">
            {[
              { etiqueta: 'Publicaciones',    valor: snapshot.publicaciones },
              { etiqueta: 'Alcance promedio', valor: snapshot.alcancePromedio },
            ].map(({ etiqueta, valor }) => (
              <div key={etiqueta} className="flex justify-between items-center">
                <span className="text-[12px] text-[#bbb]">{etiqueta}</span>
                <span
                  className="font-black text-[15px] text-[#111]"
                  style={{ fontFamily: 'var(--font-nunito)' }}
                >
                  {valor ?? '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div>
            <div className="flex justify-between text-[11px] mb-2">
              <span className="font-bold text-[#555] uppercase tracking-widest">
                Meta: {META_SEGUIDORES.toLocaleString('es-CL')} seguidores
              </span>
              <span className="font-black text-[#111]"
                style={{ fontFamily: 'var(--font-nunito)' }}>
                {Math.round(progresoMeta)}%
              </span>
            </div>
            <BarraProgreso porcentaje={progresoMeta} colorBarra="#E63B2E" altura="h-2" />
          </div>

        </div>
      ) : (
        <span className="text-[#bbb] text-sm">No hay datos de Instagram disponibles.</span>
      )}
    </DrawerBase>
  )
}
