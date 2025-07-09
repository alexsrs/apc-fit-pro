"use client";

import { Suspense } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
