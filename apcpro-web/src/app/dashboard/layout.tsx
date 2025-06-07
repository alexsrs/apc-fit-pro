"use client";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { AnamneseModalProvider } from "@/contexts/AnamneseModalContext";
import { DashboardProfileLoader } from "@/components/dashboard-profile-loader";
import DashboardLayout from "@/components/dashboard-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { ReactNode } from "react";

export default function DashboardLayoutRoot({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <UserProfileProvider>
      <AnamneseModalProvider>
        <DashboardProfileLoader />
        <SidebarProvider>
          <AppSidebar />
          <DashboardLayout>{children}</DashboardLayout>
        </SidebarProvider>
      </AnamneseModalProvider>
    </UserProfileProvider>
  );
}
