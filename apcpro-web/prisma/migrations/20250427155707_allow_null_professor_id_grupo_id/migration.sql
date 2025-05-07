/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `Grupo` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Grupo` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Grupo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Grupo" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm",
DROP COLUMN "descricao";
