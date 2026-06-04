'use client'
import { useInstagram } from '@/hooks/useInstagram'
import { useIngresos }  from '@/hooks/useIngresos'

export function IphoneSectionStats() {
  const { snapshot } = useInstagram()
  const { balance }  = useIngresos()

  return (
    <div className="flex flex-col gap-3 p-4">
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Instagram
        </div>
        {!snapshot ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin datos Instagram</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{snapshot.seguidores}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Seguidores</div>
            </div>
            {snapshot.publicaciones != null && (
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{snapshot.publicaciones}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Publicaciones</div>
              </div>
            )}
            {snapshot.alcancePromedio != null && (
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{snapshot.alcancePromedio}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Alcance prom.</div>
              </div>
            )}
            {snapshot.crecimientoSemanal != null && (
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: snapshot.crecimientoSemanal >= 0 ? '#4ade80' : '#f87171' }}>
                  {snapshot.crecimientoSemanal >= 0 ? '+' : ''}{snapshot.crecimientoSemanal}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Esta semana</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Balance del mes
        </div>
        {!balance ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin datos de balance</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#4ade80' }}>${balance.ingresos.toLocaleString('es')}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Ingresos</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f87171' }}>${balance.egresos.toLocaleString('es')}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Egresos</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>${balance.balance.toLocaleString('es')}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Neto</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
