import { createContext, useContext, useState, ReactNode } from "react";

type Profile = {
  [x: string]: ReactNode;
  id?: string;
  userId?: string;
  role?: string;
  // ...outros campos do perfil
} | null;

type UserProfileContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  error: string | null;
  setError: (err: string | null) => void;
};

const UserProfileContext = createContext<UserProfileContextType>({
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
