'use client'

const SECCIONES = ['Hoy', 'Negocio', 'Ideas', 'Clientes', 'Stats']

interface IphoneHeaderProps {
  activeIndex: number
  onDotClick: (index: number) => void
}

export function IphoneHeader({ activeIndex, onDotClick }: IphoneHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 flex-shrink-0"
      style={{
        height: '60px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '16px' }}>⚡</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.3px' }}>
          neptumstudio
        </span>
      </div>

      <div className="flex items-center gap-[6px]">
        {SECCIONES.map((seccion, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            aria-label={seccion}
            style={{
              width: i === activeIndex ? '18px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === activeIndex ? 'var(--acc)' : 'var(--text-3)',
              transition: 'width 0.25s ease, background 0.25s ease',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', minWidth: '48px', textAlign: 'right' }}>
        {SECCIONES[activeIndex]}
      </span>
    </header>
  )
}
