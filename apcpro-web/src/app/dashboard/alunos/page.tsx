"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";
import { useAvaliacaoValida } from "@/hooks/useAvaliacaoValida";
import { ModalAnamnese } from "@/components/ModalAnamnese";

export default function AlunosDashboard() {
  const { profile } = useUserProfile();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const avaliacaoValida = useAvaliacaoValida(profile?.id ?? "");

  useEffect(() => {
    if (profile && profile.role === "professor") {
      router.replace("/dashboard/professores");
    }
  }, [profile, router]);

  useEffect(() => {
    // Abre o modal se não houver avaliação válida (inclui 404, vencida ou inválida)
    if (avaliacaoValida === false) setModalOpen(true);
  }, [avaliacaoValida]);

  function handleSuccess() {
    window.location.reload();
  }

  if (!profile) return <Loading />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50">
          <h2 className="text-lg font-semibold p-4">Dashboard</h2>
          <p className="text-sm text-muted-foreground pl-4">
            Bem-vindo, {profile.name}! Aqui você pode gerenciar suas avaliações
            e acessar seus dados.
          </p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      <ModalAnamnese
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userPerfilId={profile.id ?? ""}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
