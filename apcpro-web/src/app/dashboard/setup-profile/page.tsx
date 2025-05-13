"use client";

import DashboardLayout from "@/components/dashboard-layout";
import TabsProfile from "@/components/ui/tabs-profile";

export default function SetupProfile() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-2 flex items-start min-h-screen">
        <div>
          <h1 className="text-2xl font-bold mb-4">Complete seu perfil</h1>
          <h2 className="mb-4 pb-4">
            Isso nos ajuda a personalizar sua experiência na plataforma.
          </h2>
          <TabsProfile />
        </div>
      </div>
    </DashboardLayout>
  );
}
