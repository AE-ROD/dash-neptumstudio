-- CreateEnum
CREATE TYPE "ProjectEstado" AS ENUM ('ACTIVO', 'PAUSADO', 'COMPLETADO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "ProposalEstado" AS ENUM ('LEAD', 'PROPUESTA', 'ACTIVO', 'CERRADO');

-- CreateEnum
CREATE TYPE "ClientTipo" AS ENUM ('PERSONA', 'EMPRESA');

-- CreateEnum
CREATE TYPE "IdeaEtiqueta" AS ENUM ('IDEA', 'MEJORA', 'OPORTUNIDAD', 'TAREA');

-- CreateEnum
CREATE TYPE "IdeaEstado" AS ENUM ('NUEVA', 'EN_REVISION', 'DESARROLLANDO', 'COMPLETADA', 'DESCARTADA');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "stack" TEXT[],
    "estado" "ProjectEstado" NOT NULL DEFAULT 'ACTIVO',
    "progreso" INTEGER NOT NULL DEFAULT 0,
    "repoUrl" TEXT,
    "rutaLocal" TEXT,
    "ultimaNota" TEXT,
    "proximoPaso" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "clienteId" TEXT,
    "descripcion" TEXT,
    "monto" DOUBLE PRECISION,
    "estado" "ProposalEstado" NOT NULL DEFAULT 'LEAD',
    "ultimoContacto" TIMESTAMP(3),
    "notas" TEXT,
    "proyectoId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "ClientTipo" NOT NULL DEFAULT 'PERSONA',
    "email" TEXT,
    "telefono" TEXT,
    "ciudad" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pending" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "fechaLimite" TIMESTAMP(3),
    "estaSemana" BOOLEAN NOT NULL DEFAULT true,
    "fuente" TEXT NOT NULL DEFAULT 'panel',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "fuente" TEXT NOT NULL DEFAULT 'panel',
    "etiqueta" "IdeaEtiqueta" NOT NULL DEFAULT 'IDEA',
    "estado" "IdeaEstado" NOT NULL DEFAULT 'NUEVA',
    "desarrollo" TEXT,
    "proximoPensamiento" TEXT,
    "proyectoId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramSnapshot" (
    "id" TEXT NOT NULL,
    "seguidores" INTEGER NOT NULL,
    "publicaciones" INTEGER,
    "alcancePromedio" INTEGER,
    "crecimientoSemanal" INTEGER,
    "registradoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstagramSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revenue" (
    "id" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "propuestaId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
