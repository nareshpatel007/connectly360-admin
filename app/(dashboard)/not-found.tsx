"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    BarChart3,
    ArrowLeft,
    Search,
    Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_LINKS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", desc: "Back to your overview" },
    { icon: MessageSquare, label: "Conversations", href: "/conversations", desc: "View customer messages" },
    { icon: Users, label: "Contacts", href: "/contacts", desc: "Manage your contacts" },
    { icon: BarChart3, label: "Analytics", href: "/analytics", desc: "See your reports" },
];

export default function DashboardNotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 py-16 select-none">

            {/* Decorative background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#35877D]/6 blur-[80px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">

                {/* Icon + 404 number */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-[#35877D]/10 border border-[#35877D]/20 flex items-center justify-center shadow-sm">
                            <Compass size={44} className="text-[#35877D] opacity-80" strokeWidth={1.5} />
                        </div>
                        <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                            404
                        </span>
                    </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                    Page Not Found
                </h1>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-sm">
                    This page doesn&apos;t exist or you may not have permission to access it.
                    Try one of the quick links below.
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="rounded-xl border-slate-200 text-slate-700 hover:border-[#35877D]/30 hover:bg-[#EAF7F2] hover:text-[#35877D] text-xs font-semibold h-9 px-4 gap-2 cursor-pointer bg-white"
                    >
                        <ArrowLeft size={14} />
                        Go Back
                    </Button>
                    <Button
                        asChild
                        className="rounded-xl bg-[#35877D] hover:bg-[#2c6f66] text-white text-xs font-semibold h-9 px-4 gap-2 border-0 shadow-sm cursor-pointer"
                    >
                        <Link href="/dashboard">
                            <LayoutDashboard size={14} />
                            Go to Dashboard
                        </Link>
                    </Button>
                </div>

                {/* Quick navigation cards */}
                <div className="w-full border-t border-slate-100 pt-8">
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-5">
                        Quick Navigation
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {QUICK_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#35877D]/40 hover:bg-[#EAF7F2]/50 hover:shadow-sm transition-all duration-200 text-left"
                            >
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#35877D]/10 flex items-center justify-center transition-colors duration-200">
                                    <link.icon size={15} className="text-slate-400 group-hover:text-[#35877D] transition-colors" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#35877D] transition-colors truncate">
                                        {link.label}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                        {link.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Support line */}
                <p className="mt-8 text-xs text-slate-400">
                    Need help?{" "}
                    <Link href="/contact" className="text-[#35877D] font-semibold hover:underline">
                        Contact support
                    </Link>
                </p>
            </div>
        </div>
    );
}
