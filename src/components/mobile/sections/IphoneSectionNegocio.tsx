'use client'
import { useIngresos }  from '@/hooks/useIngresos'
import { useProposals } from '@/hooks/useProposals'
import { useProyectos } from '@/hooks/useProyectos'

export function IphoneSectionNegocio() {
  const { balance }    = useIngresos()
  const { propuestas } = useProposals()
  const { proyectos }  = useProyectos()

  const urgentes = propuestas.filter(p => p.estado === 'LEAD').length
  const activos  = proyectos.filter(p => p.estado === 'ACTIVO').slice(0, 4)

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Balance mes</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            ${balance?.balance?.toLocaleString('es') ?? '0'}
          </div>
        </div>
        <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Pipeline</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>{propuestas.length}</div>
          {urgentes > 0 && (
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--acc)', marginTop: '2px' }}>{urgentes} urgentes</div>
          )}
        </div>
      </div>

      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
          Proyectos activos
        </div>
        {activos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin proyectos activos</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activos.map(p => (
              <div key={p.id}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{p.nombre}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{p.progreso}%</span>
                </div>
                <div style={{ height: '4px', background: 'var(--surf)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.progreso}%`, background: 'var(--acc)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
