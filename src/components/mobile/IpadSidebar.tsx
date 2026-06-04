'use client'
import { usePanelContext }    from '@/context/PanelContext'
import type { SeccionActiva } from '@/context/PanelContext'

const NAV_ITEMS: { id: SeccionActiva; label: string; icon: string }[] = [
  { id: 'inicio',       label: 'Inicio',       icon: '⚡' },
  { id: 'proyectos',    label: 'Proyectos',    icon: '📁' },
  { id: 'pipeline',     label: 'Pipeline',     icon: '💼' },
  { id: 'clientes',     label: 'Clientes',     icon: '👥' },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: '📄' },
  { id: 'balance',      label: 'Balance',      icon: '📊' },
  { id: 'pendientes',   label: 'Pendientes',   icon: '✓'  },
  { id: 'instagram',    label: 'Instagram',    icon: '📸' },
]

export function IpadSidebar() {
  const { seccionActiva, cambiarSeccion } = usePanelContext()

  return (
    <aside
      style={{
        width: '120px',
        flexShrink: 0,
        background: 'var(--bg-2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '16px 12px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.3px' }}>
          neptumstudio
        </div>
      </div>

      <nav style={{ padding: '6px 0', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const isActive = seccionActiva === item.id
          return (
            <button
              key={item.id}
              onClick={() => cambiarSeccion(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                border: 'none',
                borderLeft: isActive ? '2px solid var(--acc)' : '2px solid transparent',
                background: isActive ? `rgba(var(--acc-rgb), 0.08)` : 'transparent',
                color: isActive ? 'var(--acc)' : 'var(--text-2)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <span style={{ fontSize: '15px', flexShrink: 0, width: '18px', textAlign: 'center' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
