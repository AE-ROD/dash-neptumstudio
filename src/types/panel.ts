export type { ProjectEstado, ProposalEstado, IdeaEtiqueta, ClientTipo, IdeaEstado } from '@/app/generated/prisma/client'

import type { ProjectEstado, ProposalEstado, IdeaEtiqueta, IdeaEstado } from '@/app/generated/prisma/client'

export interface Proyecto {
  id: string
  nombre: string
  descripcion: string | null
  stack: string[]
  estado: ProjectEstado
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

export interface IngresosMes {
  total: number
  mes: number
  anio: number
}
