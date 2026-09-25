import React from "react";
import { Skeleton, StatCardSkeleton, PageHeaderSkeleton, DataTableSkeleton, ChartSkeleton } from "@/components/ui/skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 pb-12 font-sans" aria-busy="true" aria-label="Loading platform dashboard">
      {/* Header Skeleton */}
      <PageHeaderSkeleton hasActions={true} />

      {/* Admin Quick System Banner Skeleton */}
      <div className="bg-gradient-to-r from-[#35877D]/15 via-slate-100 to-slate-50 border border-[#35877D]/20 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* Platform Overview 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Chart & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <ChartSkeleton />
          <DataTableSkeleton columns={5} rows={4} hasToolbar={false} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <Skeleton className="h-4 w-36 border-b border-slate-100 pb-3" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
