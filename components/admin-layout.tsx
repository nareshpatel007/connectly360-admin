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
import { resolveActiveNavigation } from "@/lib/navigation-matcher";

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    // Centralized active navigation resolution (guarantees exactly 1 active leaf item)
    const activeNav = React.useMemo(
        () => resolveActiveNavigation(pathname, ADMIN_NAV_SECTIONS),
        [pathname]
    );

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
            {/* SIDEBAR APPLICATION PANEL */}
            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 bg-white border-r border-[#E5E9EE] flex flex-col z-50 transition-all duration-300 ease-in-out shrink-0 ${mobileOpen
                    ? "translate-x-0 w-64 shadow-xl"
                    : "-translate-x-full lg:translate-x-0 " + (collapsed ? "w-[72px]" : "w-64")
                    }`}
            >
                {/* Brand Header */}
                <div
                    className={`h-14 lg:h-16 px-4 flex items-center border-b border-[#E5E9EE] bg-white shrink-0 ${collapsed ? "justify-center" : "justify-between"
                        }`}
                >
                    <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
                        <img
                            src="/images/logo.png"
                            alt="Connectly360 Admin"
                            className="h-7 w-auto object-contain shrink-0"
                        />
                    </Link>

                    {!collapsed && (
                        <button
                            onClick={toggleCollapse}
                            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Collapse Sidebar"
                        >
                            <PanelLeftClose size={17} />
                        </button>
                    )}

                    <button
                        className="lg:hidden text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-4 font-sans sidebar-scroll">
                    {ADMIN_NAV_SECTIONS.map((section, sIdx) => {
                        const filteredItems = section.items.filter(isAllowed);
                        if (!filteredItems.length) return null;

                        return (
                            <div key={sIdx} className="space-y-1">
                                {!collapsed ? (
                                    <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8A95A3] uppercase tracking-wider truncate">
                                        {section.section}
                                    </div>
                                ) : (
                                    <div className="h-px bg-slate-100 my-2" />
                                )}

                                {filteredItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeNav.activeLeafId === (item.id || item.href);

                                    const navLink = (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-3"
                                                } py-2 rounded-lg text-[13px] transition-colors duration-150 ${isActive
                                                    ? "bg-[#EAF7F4] text-[#24796F] font-semibold"
                                                    : "text-[#536174] hover:bg-[#F2FAF8] hover:text-[#2F8F83] font-medium"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <Icon size={17} className={isActive ? "text-[#24796F]" : "text-[#536174]"} />
                                                {!collapsed && <span className="truncate">{item.label}</span>}
                                            </div>
                                            {!collapsed && isActive && (
                                                <ChevronRight size={13} className="text-[#24796F]/70 shrink-0" />
                                            )}
                                        </Link>
                                    );

                                    if (collapsed) {
                                        return (
                                            <Tooltip key={item.href} delayDuration={100}>
                                                <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                                                <TooltipContent
                                                    side="right"
                                                    className="bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded-md shadow-md"
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
                <div className="p-3 border-t border-[#E5E9EE] bg-white">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={`w-full flex items-center ${collapsed ? "justify-center p-2" : "gap-2.5 p-2"
                                    } rounded-lg hover:bg-slate-50 border border-[#E5E9EE] transition-colors text-left focus:outline-none cursor-pointer`}
                            >
                                <div className="h-8 w-8 rounded-lg bg-[#E8F6F3] text-[#2F8F83] border border-[#BFE4DD] font-semibold text-xs flex items-center justify-center shrink-0">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                </div>
                                {!collapsed && (
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-[#172033] truncate">
                                            {user?.name || "System Administrator"}
                                        </p>
                                        <p className="text-[11px] text-[#5F6B7A] truncate">
                                            Platform Super Admin
                                        </p>
                                    </div>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start" className="w-56 p-1 font-sans shadow-lg rounded-lg border-[#E5E9EE]">
                            <DropdownMenuLabel className="text-xs font-semibold text-[#172033]">Admin Session</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/administrators" className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                                    <ShieldCheck size={14} className="text-slate-500" /> Manage Admins
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/roles" className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                                    <UserCheck size={14} className="text-slate-500" /> System Roles
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={logout}
                                className="flex items-center gap-2 text-xs font-medium text-rose-600 focus:text-rose-600 cursor-pointer"
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
                <header className="h-14 lg:h-16 border-b border-[#E5E9EE] bg-white px-4 lg:px-6 flex items-center justify-between gap-4 shrink-0 z-30">
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <Menu size={19} />
                        </button>

                        {collapsed && (
                            <button
                                onClick={toggleCollapse}
                                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Expand Sidebar"
                            >
                                <PanelLeftOpen size={17} />
                            </button>
                        )}

                        <button
                            onClick={() => setCommandOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F7F9FA] hover:bg-slate-100/80 border border-[#E5E9EE] rounded-lg text-xs font-normal text-[#5F6B7A] transition-all cursor-pointer w-72 md:w-80 lg:w-96 justify-between group focus:ring-2 focus:ring-[#2F8F83]/20 h-9"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Search size={14} className="text-[#8A95A3] shrink-0" />
                                <span className="whitespace-nowrap truncate">Search tenants, logs, settings...</span>
                            </div>
                            <kbd className="shrink-0 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-[#E5E9EE] rounded shadow-2xs">
                                Ctrl+K
                            </kbd>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5">
                        {/* Quick Create Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-9 flex items-center gap-1.5 px-3 bg-white hover:bg-slate-50 text-[#172033] border border-[#E5E9EE] font-medium text-xs rounded-lg shadow-2xs transition-all cursor-pointer">
                                    <Plus size={15} className="text-[#2F8F83]" />
                                    <span className="hidden sm:inline">Quick Create</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 p-1 font-sans shadow-lg rounded-lg border-[#E5E9EE]">
                                <DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    New Platform Item
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/users?action=new")} className="text-xs font-medium cursor-pointer">
                                    <Users size={14} className="text-[#2F8F83] mr-2" /> New Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/workspaces?action=new")} className="text-xs font-medium cursor-pointer">
                                    <Building2 size={14} className="text-[#2F8F83] mr-2" /> New Workspace
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/administrators?action=new")} className="text-xs font-medium cursor-pointer">
                                    <ShieldCheck size={14} className="text-[#2F8F83] mr-2" /> New Administrator
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/credits/packages?action=new")} className="text-xs font-medium cursor-pointer">
                                    <Package size={14} className="text-[#2F8F83] mr-2" /> New Credit Package
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF8F2] text-[#268263] border border-[#BFE4DD]/60 rounded-full text-[11px] font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2E9B72]" />
                            <span>All Systems Operational</span>
                        </div>

                        <AdminNotifications />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[#F7F9FA] p-4 sm:p-6 md:p-8">{children}</main>
            </div>
        </div>
    );
}
