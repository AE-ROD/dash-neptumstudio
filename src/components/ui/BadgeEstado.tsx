import type { ProposalEstado } from '@/types/panel'

const ESTILOS_ESTADO: Record<ProposalEstado, string> = {
  LEAD:      'border border-[#ddd] text-[#aaa]',
  PROPUESTA: 'bg-[#111] text-white',
  ACTIVO:    'bg-[#E63B2E] text-white',
  CERRADO:   'bg-[#F0F0EE] text-[#888]',
}

const ETIQUETAS_ESTADO: Record<ProposalEstado, string> = {
  LEAD:      'Lead',
  PROPUESTA: 'Propuesta',
  ACTIVO:    'Activo',
  CERRADO:   'Cerrado',
}

export function BadgeEstado({ estado }: { estado: ProposalEstado }) {
  return (
    <span
      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${ESTILOS_ESTADO[estado]}`}
    >
      {ETIQUETAS_ESTADO[estado]}
    </span>
  )
}
