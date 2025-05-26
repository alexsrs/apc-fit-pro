import React, { createContext, useContext, useState, ReactNode } from "react";

interface AnamneseModalContextProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AnamneseModalContext = createContext<
  AnamneseModalContextProps | undefined
>(undefined);

export function useAnamneseModal() {
  const context = useContext(AnamneseModalContext);
  if (!context)
    throw new Error(
      "useAnamneseModal deve ser usado dentro do AnamneseModalProvider"
    );
  return context;
}

export function AnamneseModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <AnamneseModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </AnamneseModalContext.Provider>
  );
}
