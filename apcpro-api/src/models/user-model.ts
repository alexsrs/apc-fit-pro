import { z } from "zod";

// Base para perfis de usuários
interface BaseUserPerfil {
  id: string;
  userId: string;
  role: string;
  telefone?: string | null; // Permitir null e undefined
  dataNascimento: Date;
  genero: string;
  professorId?: string; // Permitir null
  grupoId?: string;     // Permitir null
  createdAt: Date; // Obrigatório
  updatedAt: Date; // Obrigatório
}

// Base para grupos
interface BaseGrupo {
  id: string;
  nome: string;
  criadoPorId: string;
  criadoEm: Date; // Obrigatório
  atualizadoEm: Date; // Obrigatório
}

// Interface completa para usuários
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  accounts?: Account[]; // Relacionamento com contas
  sessions?: Session[]; // Relacionamento com sessões
  telefone?: string | null;   // Propriedade opcional
  perfil?: UserPerfil;  // Relacionamento 1:1 com UserPerfil
}

// Interface completa para perfis de usuários
export interface UserPerfil extends BaseUserPerfil {
  user?: User; // Relacionamento com o usuário
  professor?: UserPerfil; // Relacionamento com o professor
  alunos?: UserPerfil[]; // Relacionamento com os alunos
  grupos?: Grupo[]; // Grupos em que o usuário é membro
  gruposCriados?: Grupo[]; // Grupos criados pelo usuário
}

// Interface completa para grupos
export interface Grupo {
  id: string;
  nome: string;
  criadoPorId: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
  membros?: Array<{
    id: string;
    professorId?: string | null; // Incluído null como valor válido
    grupoId?: string;
    telefone?: string;
  }>;
}

// Interfaces para relações de autenticação (NextAuth)
export type Account = {
  provider: string;
  providerAccountId: string;
  type: string;
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};

export type Session = {
  sessionToken: string;
  userId: string;
  expires: Date;
};

// Utilitários para evitar circularidade
export type SafeUser = Omit<User, "perfil">;
export type SafeUserPerfil = Omit<UserPerfil, "user" | "gruposCriados"> & {
  user?: SafeUser;
  gruposCriados?: BaseGrupo[];
};

// DTOs para respostas de API
export interface UserResponse extends SafeUser {
  perfil?: SafeUserPerfil;
}

export interface GrupoResponse extends BaseGrupo {
  criadoPor: SafeUserPerfil;
  membros: SafeUserPerfil[];
}

// Simplified User type
export type SimplifiedUser = {
  name: string | null;
  id: string;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
};


