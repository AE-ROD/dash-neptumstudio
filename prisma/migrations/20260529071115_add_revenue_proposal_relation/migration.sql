-- CreateIndex
CREATE INDEX "Idea_estado_etiqueta_idx" ON "Idea"("estado", "etiqueta");

-- CreateIndex
CREATE INDEX "Idea_proyectoId_idx" ON "Idea"("proyectoId");

-- CreateIndex
CREATE INDEX "Note_proyectoId_idx" ON "Note"("proyectoId");

-- CreateIndex
CREATE INDEX "Pending_completado_estaSemana_idx" ON "Pending"("completado", "estaSemana");

-- CreateIndex
CREATE INDEX "Proposal_estado_idx" ON "Proposal"("estado");

-- CreateIndex
CREATE INDEX "Proposal_clienteId_idx" ON "Proposal"("clienteId");

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_propuestaId_fkey" FOREIGN KEY ("propuestaId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
