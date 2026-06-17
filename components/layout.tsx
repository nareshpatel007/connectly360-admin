"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
    SidebarFooter
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Package,
    TrendingUp,
    Settings,
    BarChart3,
    Droplet,
    Plug,
    ArrowRight,
    Sparkles,
    Cpu,
    ChevronUp,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Sparkles, label: "Campaigns", href: "/campaigns" },
    { icon: MessageSquare, label: "Inbox", href: "/conversations" },
    { icon: Users, label: "Contacts", href: "/customers" },
    { icon: Package, label: "Products", href: "/products" },
    { icon: Cpu, label: "Automations", href: "/automations" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Plug, label: "WhatsApp Integration", href: "/integrations/whatsapp" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // If the page is login, register, or forgot-password, we don't render the sidebar layout wrapper!
    const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#FAF8F5] text-[#143d27]">
                <Sidebar className="border-r border-[#EAE6DF] bg-white">
                    {/* Sidebar Header */}
                    <SidebarHeader className="p-5 flex flex-row items-center gap-2.5 border-b border-[#EAE6DF]/60 bg-white">
                        <img src="/images/logo.png" alt="Connectly360 Logo" className="h-11 w-auto object-contain" />
                    </SidebarHeader>

                    {/* Sidebar Navigation */}
                    <SidebarContent className="p-3 space-y-4">
                        <SidebarMenu>
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className={isActive
                                                ? "!bg-[#35877D] !text-white hover:!bg-[#2c6f66] hover:!text-white font-semibold rounded-xl shadow-[0_2px_8px_-1px_rgba(53,135,125,0.25)] transition-all duration-200 group"
                                                : "text-[#0B2E1E]/75 hover:bg-[#35877D]/8 hover:text-[#35877D] rounded-xl transition-all duration-200 group"}
                                        >
                                            <Link href={item.href} className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={18} className={isActive ? "text-[#EAD098]" : "text-[#0B2E1E]/60 group-hover:text-[#35877D] transition-colors"} />
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarContent>

                    {/* Sidebar Footer */}
                    <SidebarFooter className="p-4 border-t border-[#EAE6DF]/60 space-y-4 bg-white">

                        {/* Upgrade to Pro Card */}
                        <div className="bg-gradient-to-br from-[#FCF8EC] to-[#FAF1D6] border border-[#EAD098] rounded-xl p-3.5 space-y-2 shadow-sm relative overflow-hidden">
                            {/* Subtle gold flare background decoration */}
                            <div className="absolute right-[-10%] top-[-10%] w-16 h-16 rounded-full bg-[#D99B26]/10 blur-xl pointer-events-none" />

                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#785110] uppercase tracking-wider">
                                <Sparkles size={14} className="text-[#D99B26] fill-[#D99B26]/20 animate-pulse" />
                                Upgrade to Pro
                            </div>
                            <p className="text-[11px] text-[#694B1B] leading-normal font-medium">
                                Get premium features, custom branding & priority support.
                            </p>
                            <Button size="sm" asChild className="w-full bg-[#35877D] hover:bg-[#2c6f66] text-white font-semibold text-[11px] h-7.5 gap-1 shadow-sm mt-1.5 justify-between border-0">
                                <Link href="/settings">
                                    Upgrade Plan
                                    <ArrowRight size={10} />
                                </Link>
                            </Button>
                        </div>

                        {/* Profile Section with Radix Dropdown */}
                        <div className="pt-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#EAE6DF]/50 transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#35877D]/20 group cursor-pointer">
                                        <div className="h-9 w-9 shrink-0 rounded-full bg-[#35877D] text-white flex items-center justify-center font-bold text-sm border border-emerald-800/10 shadow-sm transition-transform duration-200 group-hover:scale-102">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[#0B2E1E] truncate leading-tight">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                                                {user?.email || ""}
                                            </p>
                                        </div>
                                        <ChevronUp size={15} className="text-slate-400 group-hover:text-[#35877D] transition-colors shrink-0" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56 p-1.5 border border-[#EAE6DF] bg-white rounded-xl shadow-lg animate-in fade-in-50 slide-in-from-bottom-2"
                                    side="top"
                                    align="start"
                                    sideOffset={12}
                                >
                                    <DropdownMenuLabel className="px-2 py-1.5">
                                        <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Logged in as</p>
                                        <p className="text-xs font-bold text-[#0B2E1E] mt-0.5 truncate">{user?.name || "User"}</p>
                                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{user?.email || ""}</p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-1 bg-[#EAE6DF]/60" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-600 focus:bg-[#FAF8F5] focus:text-[#35877D] cursor-pointer transition-colors">
                                            <Link href="/settings" className="flex items-center gap-2 w-full">
                                                <Settings size={14} />
                                                <span>Account Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-600 focus:bg-[#FAF8F5] focus:text-[#35877D] cursor-pointer transition-colors">
                                            <Link href="/integrations/whatsapp" className="flex items-center gap-2 w-full">
                                                <Plug size={14} />
                                                <span>WhatsApp Integration</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="my-1 bg-[#EAE6DF]/60" />
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="rounded-lg px-2 py-1.5 text-xs text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer font-medium transition-colors flex items-center gap-2"
                                    >
                                        <LogOut size={14} />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    </SidebarFooter>

                </Sidebar>

                {/* Main Content Area */}
                <main className="flex-grow flex flex-col min-w-0 overflow-hidden bg-[#FAF8F5]">
                    <header className="h-14 border-b border-[#EAE6DF] bg-white flex items-center px-4 md:hidden">
                        <SidebarTrigger />
                        <div className="flex items-center gap-2 ml-4">
                            <img src="/images/logo.png" alt="Connectly360 Logo" className="h-7 w-auto object-contain" />
                            <span className="font-semibold text-sm">Connectly360</span>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto p-6 md:p-10">
                        <div className="w-full">
                            {children}
                        </div>
                    </div>
                </main>

            </div>
        </SidebarProvider>
    );
}
