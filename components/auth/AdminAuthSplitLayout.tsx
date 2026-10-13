"use client";

import React from "react";
import Link from "next/link";
import { Building2, MessageSquare, CreditCard, ShieldCheck, Sparkles, Shield } from "lucide-react";

interface AdminAuthSplitLayoutProps {
    children: React.ReactNode;
}

export function AdminAuthSplitLayout({ children }: AdminAuthSplitLayoutProps) {
    const adminPillars = [
        {
            icon: Building2,
            title: "Tenant Governance",
            description: "Manage accounts, workspace lifecycles, and memberships.",
        },
        {
            icon: MessageSquare,
            title: "WhatsApp & WABA Health",
            description: "Monitor cloud API phone numbers, throughput, and webhooks.",
        },
        {
            icon: CreditCard,
            title: "Billing & Credits Ledger",
            description: "Supervise automated top-ups, transactions, and credit rules.",
        },
        {
            icon: ShieldCheck,
            title: "Security & Audit Logging",
            description: "Enforce RBAC policies with tamper-evident operational logs.",
        },
    ];

    return (
        <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-slate-50 flex flex-col lg:flex-row antialiased selection:bg-[#35877D]/15 selection:text-[#35877D]">
            {/* ============================================================== */}
            {/* LEFT COLUMN: Admin Platform Showcase (50% on Desktop)         */}
            {/* ============================================================== */}
            <aside className="hidden lg:flex lg:w-1/2 h-full relative bg-gradient-to-br from-teal-50/70 via-slate-50/90 to-emerald-50/50 border-r border-slate-200/80 px-8 lg:px-10 xl:px-14 2xl:px-16 py-6 xl:py-8 flex-col justify-between overflow-hidden shrink-0 select-none">
                {/* Decorative Subtle Ambient Geometry */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-[#35877D]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 -right-20 w-80 h-80 bg-gradient-to-tl from-emerald-200/25 to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-20 left-1/4 w-88 h-88 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

                {/* Subtle Grid Texture */}
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(#172033 1px, transparent 1px)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Top: Connectly360 Brand Header */}
                <div className="relative z-10 flex items-center justify-between w-full max-w-[620px] 2xl:max-w-[660px] mx-auto shrink-0">
                    <div className="inline-flex flex-col items-start">
                        <img
                            src="/images/logo.png"
                            alt="Connectly360 Admin"
                            className="h-8 xl:h-8.5 w-auto object-contain"
                        />
                        <span className="text-[9px] font-bold text-[#35877D] tracking-widest uppercase mt-0.5">
                            PLATFORM ADMINISTRATION CONSOLE
                        </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 border border-slate-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs backdrop-blur-xs">
                        <Shield size={12} className="text-[#35877D]" />
                        <span>Restricted Access</span>
                    </div>
                </div>

                {/* Center Content: Headline, Highlights, & Capabilities */}
                <div className="relative z-10 my-auto py-4 space-y-4 xl:space-y-5 w-full max-w-[620px] 2xl:max-w-[660px] mx-auto">
                    {/* Value Proposition Headline & Subtitle */}
                    <div className="space-y-1.5">
                        <h1 className="text-2xl xl:text-[30px] 2xl:text-[34px] font-extrabold tracking-tight text-slate-900 leading-[1.2]">
                            Connectly360 Mission Control. <br />
                            <span className="bg-gradient-to-r from-[#205C55] via-[#35877D] to-[#2B7068] bg-clip-text text-transparent">
                                Platform Infrastructure & Governance.
                            </span>
                        </h1>
                        <p className="text-xs xl:text-[13px] text-slate-600 font-normal leading-relaxed max-w-xl">
                            Unified console for platform administrators to oversee tenants, monitor Meta Cloud API operations, manage ledger balances, and enforce system security.
                        </p>
                    </div>

                    {/* Feature Highlights Grid */}
                    <div className="grid grid-cols-2 gap-2.5 xl:gap-3">
                        {adminPillars.map((pillar, idx) => {
                            const IconComponent = pillar.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white/85 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3 shadow-2xs transition-all hover:bg-white hover:border-[#35877D]/30"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-[#35877D]/10 text-[#35877D] flex items-center justify-center mb-2">
                                        <IconComponent size={14} />
                                    </div>
                                    <h2 className="text-xs font-bold text-slate-900 mb-0.5 leading-tight">
                                        {pillar.title}
                                    </h2>
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                        {pillar.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Footer Note */}
                <div className="relative z-10 w-full max-w-[620px] 2xl:max-w-[660px] mx-auto pt-2 shrink-0 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>© {new Date().getFullYear()} Connectly360 Platform Ops</span>
                    <span className="font-semibold text-slate-500">Security Guard Active</span>
                </div>
            </aside>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: Form Card (50% on Desktop, 100% on Mobile)       */}
            {/* ============================================================== */}
            <main className="w-full lg:w-1/2 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-14 overflow-y-auto">
                {/* Mobile Brand Header */}
                <div className="lg:hidden mb-6 text-center space-y-1">
                    <img
                        src="/images/logo.png"
                        alt="Connectly360 Admin"
                        className="h-8 w-auto mx-auto object-contain"
                    />
                    <p className="text-[10px] font-bold text-[#35877D] uppercase tracking-wider">
                        Platform Administration Console
                    </p>
                </div>

                {/* Form Card Container */}
                <div className="w-full max-w-md mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
