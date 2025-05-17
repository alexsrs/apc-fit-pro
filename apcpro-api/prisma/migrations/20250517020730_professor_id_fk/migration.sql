-- DropForeignKey
ALTER TABLE "UserPerfil" DROP CONSTRAINT "UserPerfil_professorId_fkey";

-- AddForeignKey
ALTER TABLE "UserPerfil" ADD CONSTRAINT "UserPerfil_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
