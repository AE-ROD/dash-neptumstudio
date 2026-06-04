'use client'
import { useCotizaciones } from '@/hooks/useCotizaciones'
import { useContacts }     from '@/hooks/useContacts'

const ESTADO_COLORS: Record<string, string> = {
  BORRADOR:  '#888',
  ENVIADA:   '#fbbf24',
  APROBADA:  '#4ade80',
  RECHAZADA: '#f87171',
}

export function IphoneSectionClientes() {
  const { cotizaciones } = useCotizaciones()
  const { contactos }    = useContacts()

  const recientes        = cotizaciones.slice(0, 3)
  const ultimosContactos = contactos.slice(0, 3)

  return (
    <div className="flex flex-col gap-3 p-4">
      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Cotizaciones recientes
        </div>
        {recientes.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin cotizaciones aún</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recientes.map(c => (
              <div key={c.id} className="flex justify-between items-center">
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{c.nombreCliente}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>${c.total.toLocaleString('es')}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: ESTADO_COLORS[c.estado] ?? '#888', background: 'var(--surf)', padding: '2px 8px', borderRadius: '4px' }}>
                  {c.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg-2)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Contactos
        </div>
        {ultimosContactos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sin contactos aún</p>
        ) : (
          <div className="flex flex-col gap-2">
            {ultimosContactos.map(c => (
              <div key={c.id} className="flex items-center gap-2">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {c.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{c.nombre}</div>
                  {c.marca && <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{c.marca}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
