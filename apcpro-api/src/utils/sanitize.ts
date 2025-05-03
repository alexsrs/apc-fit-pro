import { UserPerfil } from "../models/user-model";

export function sanitizeUserPerfil(perfil: Partial<UserPerfil>): Partial<UserPerfil> {
    return {
      ...perfil,
      professorId: perfil.professorId ?? undefined,
      grupoId: perfil.grupoId ?? undefined,
      telefone: perfil.telefone ?? undefined,
    };
  }