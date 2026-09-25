"use client";

import React, { useState, useEffect } from "react";
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
    CheckCircle2,
    PanelLeftClose,
    PanelLeftOpen,
    User,
    ShieldCheck,
    UserCheck
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminCommandPalette } from "./admin-command-palette";
import { AdminNotifications } from "./admin-notifications";

interface NavItem {
    label: string;
    icon: React.ElementType;
    href: string;
    roles?: string[];
}

interface NavSection {
    section: string;
    items: NavItem[];
}

const ADMIN_NAV_SECTIONS: NavSection[] = [
    {
        section: "OVERVIEW",
        items: [
            { label: "Platform Overview", icon: LayoutDashboard, href: "/dashboard" },
        ]
    },
    {
        section: "CUSTOMER MANAGEMENT",
        items: [
            { label: "Users & Accounts", icon: Users, href: "/users" },
            { label: "Workspaces", icon: Building2, href: "/workspaces" },
        ]
    },
    {
        section: "BILLING & REVENUE",
        items: [
            { label: "Billing & Sales", icon: CreditCard, href: "/billing" },
            { label: "Credits Ledger", icon: Coins, href: "/credits" },
        ]
    },
    {
        section: "WHATSAPP & MARKETING",
        items: [
            { label: "WhatsApp WABA", icon: MessageCircle, href: "/whatsapp" },
            { label: "Campaign Monitor", icon: Megaphone, href: "/campaigns" },
        ]
    },
    {
        section: "ADMINISTRATION",
        items: [
            { label: "Administrators", icon: ShieldCheck, href: "/administrators" },
            { label: "Roles & Permissions", icon: UserCheck, href: "/roles" },
        ]
    },
    {
        section: "PLATFORM MONITORING",
        items: [
            { label: "Audit Logs", icon: ShieldAlert, href: "/audit-logs" },
            { label: "System Health", icon: Activity, href: "/system" },
        ]
    },
    {
        section: "CONFIGURATION",
        items: [
            { label: "Platform Settings", icon: Settings, href: "/settings" },
        ]
    }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Sidebar states: collapsed & mobile drawer
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [commandOpen, setCommandOpen] = useState<boolean>(false);

    // Load initial collapse state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem("connectly360-admin-sidebar-collapsed");
        if (savedState !== null) {
            setCollapsed(savedState === "true");
        }
    }, []);

    const toggleCollapse = () => {
        setCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem("connectly360-admin-sidebar-collapsed", String(next));
            return next;
        });
    };

    const isAuthPage =
        pathname === "/login" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/register" ||
        pathname === "/verify";

    if (isAuthPage) {
        return <>{children}</>;
    }

    // Role check helper
    const isAllowed = (item: NavItem) => {
        if (!item.roles) return true;
        if (!user?.role) return true;
        const normalizedRole = user.role.toLowerCase();
        if (["super_admin", "owner", "admin"].includes(normalizedRole)) return true;
        return item.roles.includes(normalizedRole);
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-[#35877D] selection:text-white">
            {/* Command Palette Component */}
            <AdminCommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* SIDEBAR APPLICATION PANEL */}
            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 ease-in-out shrink-0 ${mobileOpen
                    ? "translate-x-0 w-64"
                    : "-translate-x-full lg:translate-x-0 " + (collapsed ? "w-[72px]" : "w-64")
                    }`}
            >
                {/* Brand Header */}
                <div className={`h-16 px-4 flex items-center border-b border-slate-200 bg-white shrink-0 ${collapsed ? "justify-center" : "justify-between"
                    }`}>
                    <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
                        <img
                            src="/images/logo.png"
                            alt="Connectly360 Admin"
                            className="h-8 w-auto object-contain shrink-0"
                        />
                    </Link>

                    {!collapsed && (
                        <button
                            onClick={toggleCollapse}
                            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Collapse Sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </button>
                    )}

                    <button
                        className="lg:hidden text-slate-400 hover:text-slate-700"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-4 font-sans scrollbar-thin">
                    {ADMIN_NAV_SECTIONS.map((section, sIdx) => {
                        const filteredItems = section.items.filter(isAllowed);
                        if (!filteredItems.length) return null;

                        return (
                            <div key={sIdx} className="space-y-1">
                                {!collapsed ? (
                                    <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
                                        {section.section}
                                    </div>
                                ) : (
                                    <div className="h-px bg-slate-100 my-2" />
                                )}

                                {filteredItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        pathname === item.href ||
                                        (item.href !== "/dashboard" && pathname.startsWith(item.href));

                                    const navLink = (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-3.5"
                                                } py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                                                    ? "bg-[#35877D] text-white shadow-xs font-bold"
                                                    : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
                                                {!collapsed && <span className="truncate">{item.label}</span>}
                                            </div>
                                            {!collapsed && isActive && (
                                                <ChevronRight size={14} className="text-white/80 shrink-0" />
                                            )}
                                        </Link>
                                    );

                                    if (collapsed) {
                                        return (
                                            <Tooltip key={item.href} delayDuration={100}>
                                                <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                                                <TooltipContent side="right" className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                                    {item.label}
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    }

                                    return navLink;
                                })}
                            </div>
                        );
                    })}
                </nav>

                {/* Sidebar Footer User Info */}
                <div className="p-3 border-t border-slate-200 bg-slate-50/70">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={`w-full flex items-center ${collapsed ? "justify-center p-2" : "gap-3 p-2.5"
                                    } rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors text-left focus:outline-none cursor-pointer`}
                            >
                                <div className="h-8 w-8 rounded-full bg-[#35877D] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                </div>
                                {!collapsed && (
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                            {user?.name || "Super Admin"}
                                        </p>
                                        <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Super Admin
                                        </span>
                                    </div>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            side="top"
                            className="w-56 p-1.5 border border-slate-200 bg-white text-slate-800 rounded-2xl shadow-xl font-sans"
                        >
                            <DropdownMenuLabel className="px-2 py-1.5">
                                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                                    Platform Admin Account
                                </p>
                                <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                                    {user?.name || "Admin User"}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                    {user?.email || "admin@connectly360.com"}
                                </p>
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
                                    <ShieldCheck size={14} />
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
            </aside>

            {/* MAIN APPLICATION VIEWPORT CONTENT */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50/60">
                {/* STICKY TOP HEADER */}
                <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={20} />
                        </button>

                        {/* Expand button when collapsed desktop */}
                        {collapsed && (
                            <button
                                onClick={toggleCollapse}
                                className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer mr-1"
                                title="Expand Sidebar"
                            >
                                <PanelLeftOpen size={18} />
                            </button>
                        )}

                        {/* Global Search Bar (opens Command Palette) */}
                        <button
                            onClick={() => setCommandOpen(true)}
                            className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#35877D]/50 text-xs text-slate-500 w-56 sm:w-72 md:w-80 transition-all cursor-pointer shadow-2xs group"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Search size={14} className="text-slate-400 group-hover:text-[#35877D] shrink-0" />
                                <span className="truncate text-slate-500 font-medium text-xs">
                                    Search users, workspaces, billing...
                                </span>
                            </div>
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs shrink-0">
                                ⌘K
                            </kbd>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* System Status Indicator Pill */}
                        <Link href="/system" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100/80 transition-colors">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>System Operational</span>
                        </Link>

                        {/* Notifications Bell */}
                        <AdminNotifications />

                        {/* Admin Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all focus:outline-none cursor-pointer">
                                    <div className="h-7 w-7 rounded-full bg-[#35877D] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                    </div>
                                    <span className="hidden md:inline-block text-xs font-bold text-slate-800 truncate max-w-28">
                                        {user?.name || "Super Admin"}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 p-1.5 border border-slate-200 bg-white text-slate-800 rounded-2xl shadow-xl font-sans"
                            >
                                <DropdownMenuLabel className="px-2 py-1.5">
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                                        Admin Account
                                    </p>
                                    <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                                        {user?.name || "Admin"}
                                    </p>
                                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                        {user?.email || "admin@connectly360.com"}
                                    </p>
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
                                        <ShieldCheck size={14} />
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

                {/* SCROLLABLE FULL-VIEWPORT MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 w-full min-w-0 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
