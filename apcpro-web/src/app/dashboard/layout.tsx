"use client";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { AnamneseModalProvider } from "@/contexts/AnamneseModalContext";
import { DashboardProfileLoader } from "@/components/dashboard-profile-loader";
import DashboardLayout from "@/components/dashboard-layout";

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
        <DashboardLayout>{children}</DashboardLayout>
      </AnamneseModalProvider>
    </UserProfileProvider>
  );
}
