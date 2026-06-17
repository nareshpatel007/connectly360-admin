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
    LogOut,
    Bell,
    Rocket
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

    const isInboxPage = pathname === "/conversations" || pathname.startsWith("/customer/inbox");

    return (
        <SidebarProvider>
            <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans dashboard-theme">
                {/* 1. TOP TRIAL WARNING BANNER */}
                <div className="bg-[#1E293B] text-white py-2.5 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm font-semibold select-none shrink-0 z-50 shadow-sm border-b border-slate-800">
                    <div className="flex-1 text-center sm:text-left leading-normal">
                        You have <span className="font-extrabold text-[#09B36E]">2 days</span> to explore this <span className="font-bold">Trial account</span>. Connect your preferred channel to unlock all features.
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" asChild className="bg-[#09B36E] hover:bg-[#079E61] text-white text-[11px] font-bold h-7.5 px-3 rounded-lg border-0 shadow-xs cursor-pointer">
                            <Link href="/integrations/whatsapp">Connect Channel</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild className="text-white hover:text-white border-white/20 hover:bg-white/10 text-[11px] font-bold h-7.5 px-3 rounded-lg bg-transparent cursor-pointer">
                            <Link href="/settings">Buy Now</Link>
                        </Button>
                    </div>
                </div>

                {/* 2. TOP HEADER BAR */}
                <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-5 shrink-0 z-40 select-none shadow-xs">
                    {/* Left side: Logo */}
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="md:hidden mr-1" />
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <img src="/images/logo.png" alt="Connectly360 Logo" className="h-9 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Right side: Widgets and Actions */}
                    <div className="flex items-center gap-4">
                        {/* Quick start progress */}
                        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span>Quick start</span>
                            <div className="relative h-6 w-6 flex items-center justify-center">
                                <svg className="absolute w-full h-full transform -rotate-90">
                                    <circle cx="12" cy="12" r="10" stroke="#E2E8F0" strokeWidth="2.5" fill="transparent" />
                                    <circle cx="12" cy="12" r="10" stroke="#09B36E" strokeWidth="2.5" fill="transparent" strokeDasharray="62.8" strokeDashoffset="47.1" />
                                </svg>
                                <span className="text-[9px] font-extrabold text-slate-800">1/4</span>
                            </div>
                        </div>

                        {/* Book a demo */}
                        <Button variant="outline" asChild className="hidden sm:inline-flex border-[#09B36E] text-[#09B36E] hover:bg-[#EAF7F2] text-xs font-extrabold h-8 px-3.5 rounded-lg bg-transparent cursor-pointer">
                            <Link href="https://connectly360.com" target="_blank">Book a demo</Link>
                        </Button>

                        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                        {/* Notifications (Bell Icon) */}
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg cursor-pointer">
                            <Bell size={18} />
                        </Button>

                        {/* Warning/Rocket Badge with 5 alerts */}
                        <div className="relative">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg cursor-pointer">
                                <Rocket size={18} />
                            </Button>
                            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white font-extrabold text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white shadow-xs">
                                5
                            </span>
                        </div>

                        <div className="h-4 w-px bg-slate-200" />

                        {/* User Profile dropdown menu (moved from sidebar footer) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 border border-transparent transition-all focus:outline-none cursor-pointer group">
                                    <div className="h-8 w-8 rounded-full bg-[#09B36E] text-white flex items-center justify-center font-extrabold text-xs shadow-xs transition-transform duration-200 group-hover:scale-102">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <span className="hidden md:inline-block text-xs font-bold text-slate-800 group-hover:text-slate-900 truncate max-w-[100px]">
                                        {user?.name || "User"}
                                    </span>
                                    <svg className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 p-1.5 border border-slate-200 bg-white rounded-xl shadow-lg animate-in fade-in-50 slide-in-from-top-2 z-50"
                                side="bottom"
                                align="end"
                                sideOffset={8}
                            >
                                <DropdownMenuLabel className="px-2 py-1.5">
                                    <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Logged in as</p>
                                    <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{user?.name || "User"}</p>
                                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{user?.email || ""}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 cursor-pointer transition-colors">
                                        <Link href="/settings" className="flex items-center gap-2 w-full">
                                            <Settings size={14} />
                                            <span>Account Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 cursor-pointer transition-colors">
                                        <Link href="/integrations/whatsapp" className="flex items-center gap-2 w-full">
                                            <Plug size={14} />
                                            <span>WhatsApp Integration</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="rounded-lg px-2 py-1.5 text-xs text-red-600 focus:bg-red-50 focus:text-red-600 hover:bg-red-50 hover:text-red-600 cursor-pointer font-bold transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* 3. SIDEBAR AND CONTENT LAYER */}
                <div className="flex flex-grow w-full overflow-hidden relative">
                    <Sidebar className="border-r border-slate-200 bg-white shrink-0 h-full z-30">
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
                                                    ? "!bg-[#09B36E]/10 !text-[#09B36E] hover:!bg-[#09B36E]/15 hover:!text-[#09B36E] font-bold rounded-xl transition-all duration-200 group"
                                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold rounded-xl transition-all duration-200 group"}
                                            >
                                                <Link href={item.href} className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={18} className={isActive ? "text-[#09B36E]" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
                                                        <span className="text-xs font-bold">{item.label}</span>
                                                    </div>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarContent>

                        <SidebarFooter className="p-4 border-t border-slate-100 bg-white shrink-0">
                            {/* Upgrade to Pro Card */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-xs relative overflow-hidden">
                                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                                    <Sparkles size={14} className="text-[#09B36E] fill-[#09B36E]/20 animate-pulse" />
                                    Upgrade to Pro
                                </div>
                                <p className="text-[11px] text-slate-500 leading-normal font-bold">
                                    Get premium features & priority support.
                                </p>
                                <Button size="sm" asChild className="w-full bg-[#09B36E] hover:bg-[#079E61] text-white font-bold text-[11px] h-7.5 gap-1 shadow-xs mt-1.5 justify-between border-0 cursor-pointer">
                                    <Link href="/settings">
                                        Upgrade Plan
                                        <ArrowRight size={10} />
                                    </Link>
                                </Button>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    {/* Main Content Area */}
                    <main className="flex-grow flex flex-col min-w-0 overflow-hidden bg-slate-50">
                        {/* We dynamically apply padding so Inbox pages get 100% width/height without any spacing, while other pages have standard padding */}
                        <div className={`flex-1 w-full h-full overflow-auto ${isInboxPage ? "p-0" : "p-6 md:p-10"}`}>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
