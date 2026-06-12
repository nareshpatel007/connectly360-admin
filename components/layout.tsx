"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { LayoutDashboard, MessageSquare, Users, Package, TrendingUp, Settings, BarChart3, Droplet, Plug, ArrowRight, Sparkles, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
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
                    <SidebarHeader className="p-4 flex flex-row items-center gap-2.5 border-b border-[#EAE6DF]">
                        <img src="/images/logo.png" alt="Connectly360 Logo" className="h-12 w-auto object-contain" />
                    </SidebarHeader>

                    {/* Sidebar Navigation */}
                    <SidebarContent className="p-2 space-y-4">
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
                                                ? "!bg-[#35877D] !text-white hover:!bg-[#2c6f66] hover:!text-white font-semibold rounded-xl shadow-sm transition-all"
                                                : "text-gray-600 hover:bg-[#FAF8F5] hover:text-[#35877D] rounded-xl transition-all"}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3">
                                                <item.icon size={18} />
                                                <span className="text-sm">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarContent>

                    {/* Sidebar Footer */}
                    <SidebarFooter className="p-3 border-t border-[#EAE6DF] space-y-4 bg-white">

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

                        {/* Profile Section */}
                        <div className="flex items-center gap-2.5 px-1 pt-1">
                            <div className="h-9 w-9 shrink-0 rounded-full bg-[#35877D] text-white flex items-center justify-center font-bold text-sm border border-emerald-800/20">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate leading-tight">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-[9px] text-gray-400 truncate leading-tight">
                                    {user?.email || ""}
                                </p>
                                <button
                                    onClick={logout}
                                    className="text-[9.5px] font-bold text-red-600 hover:underline mt-0.5 inline-block text-left"
                                >
                                    Sign out
                                </button>
                            </div>
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

                    <div className="flex-1 overflow-auto p-4 md:p-8">
                        <div className="mx-auto max-w-6xl">
                            {children}
                        </div>
                    </div>
                </main>

            </div>
        </SidebarProvider>
    );
}
