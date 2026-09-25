import React from "react";
import { Skeleton, StatCardSkeleton, PageHeaderSkeleton, DataTableSkeleton, FormSkeleton } from "@/components/ui/skeleton";

export function AdminWabaSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading WABA accounts">
      <PageHeaderSkeleton hasActions={true} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <DataTableSkeleton columns={6} rows={6} hasToolbar={true} />
    </div>
  );
}

export function AdminCampaignMonitorSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading campaign monitor">
      <PageHeaderSkeleton hasActions={true} />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <DataTableSkeleton columns={6} rows={6} hasToolbar={true} />
    </div>
  );
}

export function AdminAuditLogsSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading audit logs">
      <PageHeaderSkeleton hasActions={false} />
      <DataTableSkeleton columns={5} rows={8} hasToolbar={true} />
    </div>
  );
}

export function AdminSystemHealthSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading system health">
      <PageHeaderSkeleton hasActions={true} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-44" />
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettingsSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading platform settings">
      <PageHeaderSkeleton hasActions={false} />
      <FormSkeleton fields={6} />
    </div>
  );
}
