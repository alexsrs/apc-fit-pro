/*
  Warnings:

  - Added the required column `atualizadoEm` to the `Grupo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grupo" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
