export type { ProjectEstado, ProjectArea, ProposalEstado, IdeaEtiqueta, ClientTipo, IdeaEstado, CotizacionEstado } from '@/app/generated/prisma/client'

import type { ProjectEstado, ProjectArea, ProposalEstado, IdeaEtiqueta, IdeaEstado, CotizacionEstado } from '@/app/generated/prisma/client'

export interface Proyecto {
  id: string
  nombre: string
  descripcion: string | null
  stack: string[]
  estado: ProjectEstado
  area: ProjectArea | null
  progreso: number
  repoUrl: string | null
  ultimaNota: string | null
  proximoPaso: string | null
  actualizadoEn: string
}

export interface Propuesta {
  id: string
  nombreCliente: string
  descripcion: string | null
  monto: number | null
  estado: ProposalEstado
  ultimoContacto: string | null
  notas: string | null
  proyectoId: string | null
}

export interface Idea {
  id: string
  texto: string
  fuente: string
  etiqueta: IdeaEtiqueta
  estado: IdeaEstado
  desarrollo: string | null
  proximoPensamiento: string | null
  proyectoId: string | null
  creadoEn: string
  actualizadoEn: string
}

export interface Pendiente {
  id: string
  texto: string
  completado: boolean
  estaSemana: boolean
  creadoEn: string
}

export interface SnapshotIG {
  id: string
  seguidores: number
  publicaciones: number | null
  alcancePromedio: number | null
  crecimientoSemanal: number | null
  registradoEn: string
}

export interface RegistroBalance {
  id: string
  monto: number
  tipo: 'INGRESO' | 'EGRESO'
  descripcion: string | null
  mes: number
  anio: number
  creadoEn: string
}

export interface Balance {
  ingresos:  number
  egresos:   number
  balance:   number
  mes:       number
  anio:      number
  registros: RegistroBalance[]
}

// Alias legacy para componentes que aún lo usan
export type IngresosMes = Balance

export interface Contacto {
  id: string
  nombre: string
  marca: string | null
  tipo: string
  email: string | null
  telefono: string | null
  ciudad: string | null
  creadoEn: string
  _count?: { propuestas: number; cotizaciones: number }
}

export interface CotizacionItem {
  descripcion: string
  cantidad: number
  precioUnit: number
}

export type EventoTipo = 'REUNION' | 'LLAMADA' | 'ENTREGA' | 'OTRO'

export interface Evento {
  id: string
  titulo: string
  fecha: string   // ISO string
  hora: string | null
  tipo: EventoTipo
  clienteId: string | null
  descripcion: string | null
  creadoEn: string
}

export interface Cotizacion {
  id: string
  nombreCliente: string
  clienteId: string | null
  cliente: Contacto | null
  estado: CotizacionEstado
  items: CotizacionItem[]
  total: number
  notas: string | null
  creadoEn: string
  actualizadoEn: string
}
