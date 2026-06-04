'use client'
import { useEventos }    from '@/hooks/useEventos'
import { usePendientes } from '@/hooks/usePendientes'

const TIPO_ICON: Record<string, string> = {
  REUNION: '📅', LLAMADA: '📞', ENTREGA: '📦', OTRO: '●',
}

export function IphoneSectionHoy() {
  const { eventos }     = useEventos()
  const { pendientes, toggleCompletado } = usePendientes()

  const hoy = new Date().toDateString()
  const eventosHoy = eventos.filter(e => new Date(e.fecha).toDateString() === hoy)
  const pendientesActivos = pendientes.filter(p => !p.completado).slice(0, 4)

  const fechaLabel = new Date().toLocaleDateString('es', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className="flex flex-col gap-3 p-4" style={{ minHeight: '100%' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', textTransform: 'capitalize' }}>
        {fechaLabel}
      </div>

      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Agenda
        </div>
        {eventosHoy.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin eventos hoy</p>
        ) : (
          <div className="flex flex-col gap-2">
            {eventosHoy.map(e => (
              <div key={e.id} className="flex items-center gap-2">
                <span style={{ fontSize: '14px' }}>{TIPO_ICON[e.tipo] ?? '●'}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{e.titulo}</div>
                  {e.hora && <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{e.hora}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Pendientes
        </div>
        {pendientesActivos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Todo al día ✓</p>
        ) : (
          <div className="flex flex-col gap-2">
            {pendientesActivos.map(p => (
              <label key={p.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.completado}
                  onChange={() => toggleCompletado(p.id, !p.completado)}
                  style={{ marginTop: '2px', accentColor: 'var(--acc)', flexShrink: 0 }}
                />
                <span style={{ fontSize: '13px', color: p.completado ? 'var(--text-3)' : 'var(--text)', textDecoration: p.completado ? 'line-through' : 'none' }}>
                  {p.texto}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
