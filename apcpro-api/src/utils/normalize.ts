import { UserPerfil } from "../models/user-model";

export function normalizeUserPerfil(perfil: Partial<UserPerfil>): UserPerfil {
  return {
    ...perfil,
    telefone: perfil.telefone ?? undefined,
    professorId: perfil.professorId ?? undefined,
    grupoId: perfil.grupoId ?? undefined,
  } as UserPerfil;
}