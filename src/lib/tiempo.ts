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

/** Gradientes para light mode */
export const GRADIENTES_HEADER: Record<TemaTiempo, string> = {
  manana:  'linear-gradient(120deg, #FEF3C7, #FDE68A)',
  tarde:   'linear-gradient(120deg, #E0F2FE, #BAE6FD)',
  noche:   'linear-gradient(120deg, #F6F4F0, #EDE9E3)',
}

/** Gradientes para dark mode (versiones oscuras del mismo horario) */
export const GRADIENTES_DARK: Record<TemaTiempo, string> = {
  manana: 'linear-gradient(120deg, #1a0f00, #2d1a00)',
  tarde:  'linear-gradient(120deg, #001a2d, #002a40)',
  noche:  'linear-gradient(120deg, #0D1B2A, #1B2B45)',
}

/** Colores de pills/texto para light mode */
export const COLORES_PILL: Record<TemaTiempo, { texto: string; activo: string; activoTexto: string }> = {
  manana: { texto: '#92400E', activo: '#78350F',  activoTexto: '#FFFFFF' },
  tarde:  { texto: '#0C4A6E', activo: '#0369A1',  activoTexto: '#FFFFFF' },
  noche:  { texto: '#0D1B2A', activo: '#1B2B45',  activoTexto: '#FFFFFF' },
}

/** Colores de pills/texto para dark mode */
export const COLORES_DARK: Record<TemaTiempo, { texto: string; activo: string; activoTexto: string }> = {
  manana: { texto: '#FDE68A', activo: '#FEF3C7', activoTexto: '#1a0f00' },
  tarde:  { texto: '#BAE6FD', activo: '#E0F2FE', activoTexto: '#001a2d' },
  noche:  { texto: '#A7ADBA', activo: '#F8FAFC', activoTexto: '#0F172A' },
}

export function getTemaTiempoActual(): TemaTiempo {
  return getTemaTiempo(new Date().getHours())
}
