-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "userPerfilId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "resultado" JSONB,
    "validadeAte" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Avaliacao_userPerfilId_idx" ON "Avaliacao"("userPerfilId");

-- CreateIndex
CREATE INDEX "Avaliacao_tipo_userPerfilId_idx" ON "Avaliacao"("tipo", "userPerfilId");

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_userPerfilId_fkey" FOREIGN KEY ("userPerfilId") REFERENCES "UserPerfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
