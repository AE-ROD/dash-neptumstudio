export type TemaTiempo = 'manana' | 'tarde' | 'noche'

export function getTemaTiempo(hora: number): TemaTiempo {
  if (hora >= 6 && hora < 12) return 'manana'
  if (hora >= 12 && hora < 20) return 'tarde'
  return 'noche'
}

export function getSaludo(tema: TemaTiempo): string {
  const saludos: Record<TemaTiempo, string> = {
    manana: 'Buenos días',
    tarde:  'Buenas tardes',
    noche:  'Buenas noches',
  }
  return saludos[tema]
}

export const GRADIENTES_HEADER: Record<TemaTiempo, string> = {
  manana:  'linear-gradient(120deg, #FEF3C7, #FDE68A)',
  tarde:   'linear-gradient(120deg, #E0F2FE, #BAE6FD)',
  noche:   'linear-gradient(120deg, #0F172A, #1E293B)',
}

export const COLORES_PILL: Record<TemaTiempo, { texto: string; activo: string; activoTexto: string }> = {
  manana: { texto: '#92400E', activo: '#78350F',  activoTexto: '#FFFFFF' },
  tarde:  { texto: '#0C4A6E', activo: '#0369A1',  activoTexto: '#FFFFFF' },
  noche:  { texto: '#94A3B8', activo: '#F8FAFC',  activoTexto: '#0F172A' },
}
