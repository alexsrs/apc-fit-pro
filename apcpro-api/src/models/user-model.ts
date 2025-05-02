interface BaseUser {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
}

interface BaseUserPerfil {
  id: string;
  userId: string;
  role: string;
  telefone?: string;
  dataNascimento: Date;
  genero: string;
  professorId?: string; // Permitir null
  grupoId?: string;     // Permitir null
  createdAt?: Date;
  updatedAt?: Date;
}

interface BaseGrupo {
  id: string;
  nome: string;
  descricao?: string;
  criadoPorId: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

// Interfaces completas com relações (usar apenas quando necessário)
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  accounts?: Account[]; // Tipagem específica
  sessions?: Session[]; // Tipagem específica
}

export interface UserPerfil extends BaseUserPerfil {
  user?: User; 
  professor?: UserPerfil; // Self-reference corrigida e opcional
  grupos?: Grupo[]; // Grupos relacionados, agora opcional
  alunos?: UserPerfil[];
  gruposCriados?: Grupo[];
}

export interface Grupo extends BaseGrupo {
  criadoPor?: UserPerfil; // Professor que criou o grupo, agora opcional
  membros?: UserPerfil[]; // Membros do grupo, agora opcional
}

// Interfaces para relações de autenticação (NextAuth)
export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

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


