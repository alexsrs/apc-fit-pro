"use client";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
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
      <DashboardProfileLoader />
      <DashboardLayout>{children}</DashboardLayout>
    </UserProfileProvider>
  );
}
