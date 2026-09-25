import React from "react";
import { Skeleton, StatCardSkeleton, PageHeaderSkeleton, DataTableSkeleton, FormSkeleton } from "@/components/ui/skeleton";

export function AdminBillingSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading platform billing">
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

export function AdminCreditsSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading credits ledger">
      <PageHeaderSkeleton hasActions={true} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <DataTableSkeleton columns={6} rows={6} hasToolbar={true} />
    </div>
  );
}
