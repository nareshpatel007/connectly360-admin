"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface AdminBreadcrumbsProps {
    items?: BreadcrumbItem[];
}

export function AdminBreadcrumbs({ items = [] }: AdminBreadcrumbsProps) {
    if (!items.length) return null;

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <Link
                href="/dashboard"
                className="flex items-center gap-1 text-slate-400 hover:text-[#35877D] transition-colors"
            >
                <Home size={13} />
                <span>Platform</span>
            </Link>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <React.Fragment key={index}>
                        <ChevronRight size={12} className="text-slate-300 shrink-0" />
                        {item.href && !isLast ? (
                            <Link href={item.href} className="text-slate-500 hover:text-[#35877D] transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[#35877D] font-bold">{item.label}</span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
