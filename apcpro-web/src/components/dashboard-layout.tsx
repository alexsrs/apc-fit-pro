"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Loading from "@/components/ui/Loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/"); // Redireciona para a página inicial se não estiver autenticado
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4">{children}</main>
    </SidebarProvider>
  );
}
