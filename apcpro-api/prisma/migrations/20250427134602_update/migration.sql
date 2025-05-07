-- DropForeignKey
ALTER TABLE "Grupo" DROP CONSTRAINT "Grupo_criadoPorId_fkey";

-- AlterTable
ALTER TABLE "Grupo" ALTER COLUMN "criadoPorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "UserPerfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
