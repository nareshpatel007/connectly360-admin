"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ChevronRight,
    ChevronDown,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    PanelLeftClose,
    PanelLeftOpen,
    ShieldCheck,
    UserCheck,
    Building2,
    Users,
    ShieldAlert,
    Plus,
    Package
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AdminCommandPalette } from "./admin-command-palette";
import { AdminNotifications } from "./admin-notifications";
import { ADMIN_NAV_SECTIONS, AdminNavItem } from "@/lib/admin-navigation-config";

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    // Sidebar states: collapsed & mobile drawer
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [commandOpen, setCommandOpen] = useState<boolean>(false);

    // Load collapse state from localStorage
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

    const isAllowed = (item: AdminNavItem) => {
        if (!item.roles) return true;
        if (!user?.role) return true;
        const normalizedRole = user.role.toLowerCase();
        if (["super_admin", "owner", "admin"].includes(normalizedRole)) return true;
        return item.roles.includes(normalizedRole);
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50/70 text-slate-900 font-sans selection:bg-[#35877D] selection:text-white">
            {/* Command Palette Component */}
            <AdminCommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* SIDEBAR APPLICATION PANEL */}
            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 bg-white border-r border-slate-200/80 flex flex-col z-50 transition-all duration-300 ease-in-out shrink-0 shadow-sm ${mobileOpen
                        ? "translate-x-0 w-64"
                        : "-translate-x-full lg:translate-x-0 " + (collapsed ? "w-[76px]" : "w-64")
                    }`}
            >
                {/* Brand Header */}
                <div
                    className={`h-16 px-4 flex items-center border-b border-slate-200/80 bg-white shrink-0 ${collapsed ? "justify-center" : "justify-between"
                        }`}
                >
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
                            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Collapse Sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </button>
                    )}

                    <button
                        className="lg:hidden text-slate-400 hover:text-slate-700 cursor-pointer"
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
                                    <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
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
                                                } py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${isActive
                                                    ? "bg-[#35877D] text-white shadow-md shadow-[#35877D]/20 font-bold"
                                                    : "text-slate-600 hover:bg-teal-50/60 hover:text-[#35877D]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Icon size={18} className={isActive ? "text-white" : "text-slate-500 group-hover:text-[#35877D]"} />
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
                                                <TooltipContent
                                                    side="right"
                                                    className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg"
                                                >
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

                {/* Sidebar Footer Admin User Info */}
                <div className="p-3 border-t border-slate-200/80 bg-slate-50/60">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={`w-full flex items-center ${collapsed ? "justify-center p-2" : "gap-3 p-2.5"
                                    } rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-[#35877D]/40 hover:bg-slate-50 transition-all text-left focus:outline-none cursor-pointer`}
                            >
                                <div className="h-8 w-8 rounded-full bg-slate-900 text-teal-400 font-black text-xs flex items-center justify-center shrink-0 border border-slate-700 shadow-xs">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                </div>
                                {!collapsed && (
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                            {user?.name || "System Administrator"}
                                        </p>
                                        <p className="text-[10px] text-teal-700 font-black uppercase tracking-wider">
                                            Platform Super Admin
                                        </p>
                                    </div>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start" className="w-56 p-1.5 font-sans shadow-xl rounded-xl">
                            <DropdownMenuLabel className="text-xs font-bold text-slate-900">Admin Session</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/administrators" className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                    <ShieldCheck size={14} className="text-slate-500" /> Manage Admins
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/roles" className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                    <UserCheck size={14} className="text-slate-500" /> System Roles
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={logout}
                                className="flex items-center gap-2 text-xs font-bold text-rose-600 focus:text-rose-600 cursor-pointer"
                            >
                                <LogOut size={14} /> Log Out Admin
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Global Header Bar */}
                <header className="h-16 border-b border-slate-200/80 bg-white px-4 lg:px-6 flex items-center justify-between gap-4 shrink-0 z-30 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>

                        {collapsed && (
                            <button
                                onClick={toggleCollapse}
                                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Expand Sidebar"
                            >
                                <PanelLeftOpen size={18} />
                            </button>
                        )}

                        <button
                            onClick={() => setCommandOpen(true)}
                            className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 transition-all cursor-pointer w-64 md:w-80 justify-between group focus:ring-2 focus:ring-[#35877D]/20"
                        >
                            <div className="flex items-center gap-2">
                                <Search size={15} className="text-[#35877D] group-hover:scale-110 transition-transform" />
                                <span>Search platform tenants, logs, settings...</span>
                            </div>
                            <kbd className="px-1.5 py-0.5 text-[10px] font-black text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
                                Ctrl+K
                            </kbd>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Quick Create Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#35877D] hover:bg-[#2b6e66] text-white font-bold text-xs rounded-xl shadow-md shadow-[#35877D]/20 transition-all cursor-pointer border-0">
                                    <Plus size={16} />
                                    <span className="hidden sm:inline">Quick Create</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 p-1.5 font-sans shadow-xl rounded-xl">
                                <DropdownMenuLabel className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                    New Platform Item
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/users?action=new")} className="text-xs font-semibold cursor-pointer">
                                    <Users size={14} className="text-[#35877D] mr-2" /> New Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/workspaces?action=new")} className="text-xs font-semibold cursor-pointer">
                                    <Building2 size={14} className="text-[#35877D] mr-2" /> New Workspace
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/administrators?action=new")} className="text-xs font-semibold cursor-pointer">
                                    <ShieldCheck size={14} className="text-[#35877D] mr-2" /> New Administrator
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/credits/packages?action=new")} className="text-xs font-semibold cursor-pointer">
                                    <Package size={14} className="text-[#35877D] mr-2" /> New Credit Package
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>All Infrastructure Operational</span>
                        </div>

                        <AdminNotifications />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 md:p-8">{children}</main>
            </div>
        </div>
    );
}
