"use client";

import { TabsProfile } from "@/components/ui/tabs-profile";

export default function SetupProfilePage() {
  return (
    <div className="container mx-auto p-4 flex justify-center items-start min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center"></h1>
        <TabsProfile />
      </div>
    </div>
  );
}