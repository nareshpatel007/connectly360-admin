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
    Search,
    Menu,
    X,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
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

    const isAuthPage =
        pathname === "/login" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/register" ||
        pathname === "/verify";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-[#35877D] selection:text-white">
            {/* Mobile Drawer Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ADMIN SIDEBAR */}
            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Brand Logo & Platform Admin Badge */}
                <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 bg-white">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <img
                            src="/images/logo.png"
                            alt="Connectly360 Admin"
                            className="h-8 w-auto object-contain"
                        />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20">
                            Admin
                        </span>
                    </Link>
                    <button
                        className="lg:hidden text-slate-400 hover:text-slate-700"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Platform Console
                    </div>
                    {ADMIN_NAV.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                                    isActive
                                        ? "bg-[#35877D] text-white shadow-xs font-bold"
                                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={16} className={isActive ? "text-white" : "text-slate-500"} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={14} className="text-white/80" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer Account Status */}
                <div className="p-3.5 border-t border-slate-200 bg-slate-50/60">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <div className="h-8 w-8 rounded-full bg-[#35877D] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Admin User"}</p>
                            <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Super Admin
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/60">
                {/* Top Header */}
                <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-5 flex items-center justify-between shrink-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 w-64 md:w-80 focus-within:border-[#35877D] focus-within:bg-white transition-all">
                            <Search size={14} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search users, workspaces, transactions..."
                                className="bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none w-full text-xs font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        {/* System status pill */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            <span>System Operational</span>
                        </div>

                        {/* Admin Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all focus:outline-none cursor-pointer">
                                    <div className="h-7 w-7 rounded-full bg-[#35877D] text-white flex items-center justify-center font-extrabold text-xs">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                    </div>
                                    <span className="hidden md:inline-block text-xs font-bold text-slate-800">
                                        {user?.name || "Admin"}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 p-1.5 border border-slate-200 bg-white text-slate-800 rounded-xl shadow-lg"
                            >
                                <DropdownMenuLabel className="px-2 py-1.5">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as Admin</p>
                                    <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{user?.name || "Admin"}</p>
                                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer font-semibold">
                                    <Link href="/settings" className="flex items-center gap-2">
                                        <Settings size={14} />
                                        <span>Platform Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer font-semibold">
                                    <Link href="/audit-logs" className="flex items-center gap-2">
                                        <ShieldAlert size={14} />
                                        <span>Audit Logs</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="rounded-lg px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer font-bold flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page View Body */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50/60">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
