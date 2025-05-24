-- DropIndex
DROP INDEX "Avaliacao_tipo_userPerfilId_idx";

-- DropIndex
DROP INDEX "Avaliacao_userPerfilId_idx";

-- AlterTable
ALTER TABLE "Avaliacao" ADD COLUMN     "objetivoClassificado" TEXT;
