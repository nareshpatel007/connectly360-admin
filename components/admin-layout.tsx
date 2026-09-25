"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Building2,
    CreditCard,
    Coins,
    MessageCircle,
    Megaphone,
    ShieldAlert,
    Activity,
    Settings,
    LogOut,
    Bell,
    Search,
    ShieldCheck,
    Menu,
    X,
    ChevronRight,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const ADMIN_NAV = [
    { label: "Platform Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Users & Accounts", icon: Users, href: "/users" },
    { label: "Workspaces", icon: Building2, href: "/workspaces" },
    { label: "Billing & Sales", icon: CreditCard, href: "/billing" },
    { label: "Credits Ledger", icon: Coins, href: "/credits" },
    { label: "WhatsApp WABA", icon: MessageCircle, href: "/whatsapp" },
    { label: "Campaign Monitor", icon: Megaphone, href: "/campaigns" },
    { label: "Audit Logs", icon: ShieldAlert, href: "/audit-logs" },
    { label: "System Health", icon: Activity, href: "/system" },
    { label: "Platform Settings", icon: Settings, href: "/settings" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAuthPage = pathname === "/login" || pathname === "/forgot-password" || pathname === "/reset-password";
    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 font-sans selection:bg-[#35877D] selection:text-white">
            {/* Mobile Drawer Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ADMIN SIDEBAR */}
            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Brand Logo & Platform Admin Badge */}
                <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <img src="/images/logo.png" alt="Connectly360 Admin" className="h-8 w-auto object-contain brightness-0 invert" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#35877D]/20 text-[#35877D] border border-[#35877D]/30">
                            Admin
                        </span>
                    </Link>
                    <button
                        className="lg:hidden text-slate-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Platform Console
                    </div>
                    {ADMIN_NAV.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                                    isActive
                                        ? "bg-[#35877D] text-white shadow-md shadow-[#35877D]/20 font-bold"
                                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={14} className="text-white/80" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer Account Status */}
                <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <div className="h-8 w-8 rounded-full bg-[#35877D] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-200 truncate">{user?.name || "Admin User"}</p>
                            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Super Admin
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
                {/* Top Header */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-5 flex items-center justify-between shrink-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 w-64 md:w-80">
                            <Search size={14} className="text-slate-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search users, workspaces, transaction IDs..."
                                className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-full text-xs"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        {/* System status pill */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 size={13} />
                            <span>System Operational</span>
                        </div>

                        {/* Admin Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 border border-transparent transition-all focus:outline-none cursor-pointer">
                                    <div className="h-8 w-8 rounded-full bg-[#35877D] text-white flex items-center justify-center font-extrabold text-xs">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                    </div>
                                    <span className="hidden md:inline-block text-xs font-bold text-slate-200">
                                        {user?.name || "Admin"}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 p-1.5 border border-slate-800 bg-slate-950 text-slate-200 rounded-xl shadow-2xl"
                            >
                                <DropdownMenuLabel className="px-2 py-1.5">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Signed in as Admin</p>
                                    <p className="text-xs font-semibold text-slate-100 truncate mt-0.5">{user?.name || "Admin"}</p>
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-900 hover:text-white cursor-pointer">
                                    <Link href="/settings" className="flex items-center gap-2">
                                        <Settings size={14} />
                                        <span>Platform Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-900 hover:text-white cursor-pointer">
                                    <Link href="/audit-logs" className="flex items-center gap-2">
                                        <ShieldAlert size={14} />
                                        <span>Audit Logs</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="rounded-lg px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 cursor-pointer font-bold flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page View Body */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-900">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
