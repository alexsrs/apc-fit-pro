-- CreateTable
CREATE TABLE "UserPerfil" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'aluno',
    "telefone" TEXT,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "genero" TEXT NOT NULL,
    "professorId" TEXT,
    "grupoId" TEXT,

    CONSTRAINT "UserPerfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoPorId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MembroGrupo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MembroGrupo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPerfil_userId_key" ON "UserPerfil"("userId");

-- CreateIndex
CREATE INDEX "_MembroGrupo_B_index" ON "_MembroGrupo"("B");

-- AddForeignKey
ALTER TABLE "UserPerfil" ADD CONSTRAINT "UserPerfil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerfil" ADD CONSTRAINT "UserPerfil_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "UserPerfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "UserPerfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembroGrupo" ADD CONSTRAINT "_MembroGrupo_A_fkey" FOREIGN KEY ("A") REFERENCES "Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembroGrupo" ADD CONSTRAINT "_MembroGrupo_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPerfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
