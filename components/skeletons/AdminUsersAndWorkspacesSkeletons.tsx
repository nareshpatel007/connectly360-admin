import React from "react";
import { DataTableSkeleton, PageHeaderSkeleton } from "@/components/ui/skeleton";

export function AdminUsersSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading users management">
      <PageHeaderSkeleton hasActions={true} />
      <DataTableSkeleton columns={6} rows={7} hasToolbar={true} />
    </div>
  );
}

export function AdminWorkspacesSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading tenant workspaces">
      <PageHeaderSkeleton hasActions={true} />
      <DataTableSkeleton columns={6} rows={7} hasToolbar={true} />
    </div>
  );
}
