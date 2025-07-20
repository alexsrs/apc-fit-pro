import { createContext, useContext, useState, ReactNode } from "react";

// Tipagem mais restrita para os campos do perfil, evitando o uso de 'any'.
type Profile = {
  nome: string;
  name: string;
  id?: string;
  userId?: string;
  role?: string;
  dataNascimento?: Date | null;
  genero?: "masculino" | "feminino" | null;
  professorId?: string;
  email?: string;
  // ...outros campos do perfil
} | null;

type UserProfileContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  error: string | null;
  setError: (err: string | null) => void;
};

export const UserProfileContext = createContext<UserProfileContextType>({
  profile: null,
  setProfile: () => {},
  error: null,
  setError: () => {},
});

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(null);
  const [error, setError] = useState<string | null>(null);

  function setProfileWithLog(profile: Profile) {
    console.log("[UserProfileContext] setProfile chamado:", profile);
    setProfile(profile);
  }

  return (
    <UserProfileContext.Provider
      value={{ profile, setProfile: setProfileWithLog, error, setError }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
