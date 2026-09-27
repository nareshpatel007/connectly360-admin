"use client";

import React from "react";
import { AdminBreadcrumbs, BreadcrumbItem } from "./admin-breadcrumbs";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    badge?: string;
    actions?: React.ReactNode;
}

export function AdminPageHeader({
    title,
    description,
    breadcrumbs,
    badge,
    actions
}: AdminPageHeaderProps) {
    return (
        <div className="space-y-1.5 border-b border-slate-200/80 pb-5 mb-6">
            {breadcrumbs && <AdminBreadcrumbs items={breadcrumbs} />}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        {title}
                        {badge && (
                            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-gradient-to-r from-[#35877D]/15 to-[#35877D]/5 text-[#35877D] border border-[#35877D]/25 tracking-wider shadow-2xs">
                                {badge}
                            </span>
                        )}
                    </h1>
                    {description && (
                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-3xl">
                            {description}
                        </p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
            </div>
        </div>
    );
}
