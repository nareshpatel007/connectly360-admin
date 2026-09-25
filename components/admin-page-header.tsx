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
        <div className="space-y-1 border-b border-slate-200 pb-5">
            {breadcrumbs && <AdminBreadcrumbs items={breadcrumbs} />}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        {title}
                        {badge && (
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20 tracking-wider">
                                {badge}
                            </span>
                        )}
                    </h1>
                    {description && (
                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
            </div>
        </div>
    );
}
