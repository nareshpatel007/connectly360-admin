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
    SidebarFooter,
    SidebarGroup,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    BarChart3,
    Plug,
    ArrowRight,
    Sparkles,
    ChevronDown,
    LogOut,
    Bell,
    BookOpen,
    Bot,
    Megaphone,
    FileText,
    Key,
    Webhook,
    PieChart,
    Receipt,
    CreditCard,
    Wallet,
    Shield,
    Activity,
    Building2,
    MessageCircle,
    BrainCircuit,
    BellRing,
    UserPlus,
    Zap,
    Target
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
import React, { useState } from "react";

type SubItem = {
    icon: React.ElementType;
    label: string;
    href: string;
};

type NavGroup = {
    items: {
        icon: React.ElementType;
        label: string;
        href: string;
        subItems?: SubItem[];
    }[];
};

const NAV_STRUCTURE: NavGroup[] = [
    {
        items: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        ],
    },
    {
        items: [
            {
                icon: MessageSquare,
                label: "Conversations",
                href: "/conversations",
                subItems: [
                    { icon: MessageSquare, label: "Inbox", href: "/conversations" },
                    { icon: Users, label: "Contacts", href: "/contacts" },
                    { icon: Target, label: "Leads", href: "/leads" },
                ],
            },
        ],
    },
    {
        items: [
            {
                icon: Bot,
                label: "AI & Automation",
                href: "/ai-assistant",
                subItems: [
                    { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
                    { icon: Zap, label: "Automations", href: "/automations" },
                    { icon: BookOpen, label: "Knowledge Base", href: "/knowledge-base" },
                ],
            },
        ],
    },
    {
        items: [
            {
                icon: Megaphone,
                label: "Marketing",
                href: "/campaigns",
                subItems: [
                    { icon: Megaphone, label: "Campaigns", href: "/campaigns" },
                    { icon: FileText, label: "Templates", href: "/marketing/templates" },
                ],
            },
        ],
    },
    {
        items: [
            {
                icon: Plug,
                label: "Integrations",
                href: "/integrations/whatsapp",
                subItems: [
                    { icon: MessageCircle, label: "WhatsApp", href: "/integrations/whatsapp" },
                    { icon: Key, label: "API Keys", href: "/integrations/api-keys" },
                    { icon: Webhook, label: "Webhooks", href: "/integrations/webhooks" },
                ],
            },
        ],
    },
    {
        items: [
            {
                icon: BarChart3,
                label: "Reports",
                href: "/analytics",
                subItems: [
                    { icon: PieChart, label: "Analytics", href: "/analytics" },
                    { icon: BarChart3, label: "Usage Reports", href: "/reports/usage-reports" },
                    { icon: Receipt, label: "Credit History", href: "/reports/credit-history" },
                ],
            },
        ],
    },
    {
        items: [
            {
                icon: CreditCard,
                label: "Billing",
                href: "/billing/subscription",
                subItems: [
                    { icon: CreditCard, label: "Subscription", href: "/billing/subscription" },
                    { icon: Wallet, label: "Credits", href: "/billing/credits" },
                    { icon: Sparkles, label: "Recharge Credits", href: "/billing/recharge-credits" },
                    { icon: FileText, label: "Invoices", href: "/billing/invoices" },
                ],
            },
        ],
    },
    {
        items: [
            {
                icon: Building2,
                label: "Workspace",
                href: "/workspace/team-members",
                subItems: [
                    { icon: UserPlus, label: "Team Members", href: "/workspace/team-members" },
                    { icon: Shield, label: "Roles & Permissions", href: "/workspace/roles-permissions" },
                    { icon: Activity, label: "Activity Logs", href: "/workspace/activity-logs" },
                ],
            },
        ],
    },
    {
        items: [
            {
                icon: Settings,
                label: "Settings",
                href: "/settings",
                subItems: [
                    { icon: Building2, label: "Company Profile", href: "/settings/company-profile" },
                    { icon: MessageCircle, label: "WhatsApp Settings", href: "/settings/whatsapp-settings" },
                    { icon: BrainCircuit, label: "AI Settings", href: "/settings/ai-settings" },
                    { icon: BellRing, label: "Notification Settings", href: "/settings/notification-settings" },
                ],
            },
        ],
    },
];

function NavGroupSection({
    group,
    pathname,
    openHref,
    setOpenHref,
}: {
    group: NavGroup;
    pathname: string;
    openHref: string | null;
    setOpenHref: (href: string | null) => void;
}) {
    return (
        <SidebarGroup className="py-0 px-2">
            <SidebarMenu>
                {group.items.map((item) => {
                    const hasSubItems = item.subItems && item.subItems.length > 0;

                    if (!hasSubItems) {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.label}
                                    className={isActive
                                        ? "!bg-[#378179]/10 !text-[#378179] hover:!bg-[#378179]/15 hover:!text-[#378179] font-semibold rounded-xl transition-all duration-200 group"
                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium rounded-xl transition-all duration-200 group"}
                                >
                                    <Link href={item.href} className="flex items-center gap-3 w-full">
                                        <item.icon size={17} className={isActive ? "text-[#378179]" : "text-slate-400 group-hover:text-slate-700 transition-colors"} />
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    // Collapsible parent item
                    const isParentActive = item.subItems!.some(
                        sub => pathname === sub.href || (sub.href !== "/dashboard" && pathname.startsWith(sub.href))
                    );

                    return (
                        <CollapsibleNavItem
                            key={item.href}
                            item={item}
                            isParentActive={isParentActive}
                            pathname={pathname}
                            openHref={openHref}
                            setOpenHref={setOpenHref}
                        />
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function CollapsibleNavItem({
    item,
    isParentActive,
    pathname,
    openHref,
    setOpenHref,
}: {
    item: NavGroup["items"][0];
    isParentActive: boolean;
    pathname: string;
    openHref: string | null;
    setOpenHref: (href: string | null) => void;
}) {
    const open = openHref === item.href;
    const setOpen = (next: boolean) => setOpenHref(next ? item.href : null);

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="w-full">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={isParentActive}
                        tooltip={item.label}
                        className={
                            isParentActive
                                ? "!bg-[#378179]/10 !text-[#378179] hover:!bg-[#378179]/15 hover:!text-[#378179] font-semibold rounded-xl transition-all duration-200 group cursor-pointer w-full"
                                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium rounded-xl transition-all duration-200 group cursor-pointer w-full"
                        }
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <item.icon
                                size={17}
                                className={isParentActive ? "text-[#378179] shrink-0" : "text-slate-400 group-hover:text-slate-700 transition-colors shrink-0"}
                            />
                            <span className="text-sm truncate">{item.label}</span>
                        </div>
                        <ChevronDown
                            size={14}
                            className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${isParentActive ? "text-[#378179]" : "text-slate-400"}`}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub className="border-l border-slate-200 ml-4 pl-3 mt-1 gap-0.5">
                        {item.subItems!.map((sub) => {
                            const isSubActive = pathname === sub.href || (sub.href !== "/dashboard" && pathname.startsWith(sub.href));
                            return (
                                <SidebarMenuSubItem key={sub.href}>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubActive}
                                        className={
                                            isSubActive
                                                ? "!text-[#378179] !bg-[#378179]/8 font-semibold rounded-lg"
                                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                        }
                                    >
                                        <Link href={sub.href} className="flex items-center gap-2.5">
                                            <sub.icon
                                                size={14}
                                                className={isSubActive ? "text-[#378179] shrink-0" : "text-slate-400 shrink-0"}
                                            />
                                            <span className="text-xs font-medium">{sub.label}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            );
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

function SidebarNav({ pathname }: { pathname: string }) {
    const { user } = useAuth();
    const plan = (user?.plan || "growth").toLowerCase();

    // Dynamically filter NAV_STRUCTURE based on the user's plan
    const filteredNav = NAV_STRUCTURE.map(group => {
        const filteredItems = group.items.map(item => {
            if (item.subItems) {
                const filteredSubItems = item.subItems.filter(sub => {
                    if (plan === "starter") {
                        if (sub.href === "/ai-assistant") return false;
                        if (sub.href === "/knowledge-base") return false;
                        if (sub.href === "/integrations/api-keys") return false;
                        if (sub.href === "/integrations/webhooks") return false;
                        if (sub.href === "/workspace/roles-permissions") return false;
                        if (sub.href === "/workspace/activity-logs") return false;
                    }
                    if (plan === "growth") {
                        if (sub.href === "/integrations/api-keys") return false;
                        if (sub.href === "/workspace/activity-logs") return false;
                    }
                    if (plan === "business") {
                        if (sub.href === "/workspace/activity-logs") return false;
                    }
                    return true;
                });

                if (filteredSubItems.length === 0) return null;
                return { ...item, subItems: filteredSubItems };
            }

            return item;
        }).filter((item): item is NonNullable<typeof item> => item !== null);

        // Hide Marketing and campaigns entirely for starter/growth
        const hasMarketing = filteredItems.some(item => item.href.startsWith("/campaigns") || (item.subItems && item.subItems.some(s => s.href.startsWith("/campaigns"))));
        if (hasMarketing && (plan === "starter" || plan === "growth")) {
            return null;
        }

        if (filteredItems.length === 0) return null;
        return { items: filteredItems };
    }).filter((group): group is NonNullable<typeof group> => group !== null);

    // Find the initially-active collapsible item so it opens on first render
    const initialOpen = filteredNav.flatMap(g => g.items)
        .find(item => item.subItems?.some(
            sub => pathname === sub.href || (sub.href !== "/dashboard" && pathname.startsWith(sub.href))
        ))?.href ?? null;

    const [openHref, setOpenHref] = useState<string | null>(initialOpen);

    return (
        <>
            {filteredNav.map((group, i) => (
                <NavGroupSection
                    key={i}
                    group={group}
                    pathname={pathname}
                    openHref={openHref}
                    setOpenHref={setOpenHref}
                />
            ))}
        </>
    );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // If the page is login, register, or forgot-password, we don't render the sidebar layout wrapper!
    const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
    if (isAuthPage) {
        return <>{children}</>;
    }

    const isInboxPage = pathname === "/conversations" || pathname.startsWith("/customer/inbox");

    const plan = user?.plan?.toLowerCase();
    const isFree = plan === "free";

    let trialDaysRemaining = 0;
    let isTrialExpired = false;
    let hasTrialEnd = false;

    if (isFree && user?.trial_ends_at) {
        hasTrialEnd = true;
        const trialEnd = new Date(user.trial_ends_at);
        const now = new Date();
        const diffTime = trialEnd.getTime() - now.getTime();
        trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (trialDaysRemaining <= 0) {
            isTrialExpired = true;
        }
    }

    if (isTrialExpired) {
        return (
            <div className="flex flex-col h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 font-sans">
                {/* Header carrying the logo and Logout option */}
                <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-40 select-none shadow-sm">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Connectly360 Logo" className="h-9 w-auto object-contain" />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 rounded-lg px-2.5 py-1">
                            Trial Expired
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className="rounded-xl px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-600 cursor-pointer font-semibold transition-colors flex items-center gap-1.5 bg-transparent border-0"
                        >
                            <LogOut size={14} />
                            <span>Sign out</span>
                        </Button>
                    </div>
                </header>
                {/* Main Content (Subscription Page) */}
                <main className="flex-grow overflow-y-auto overflow-x-hidden p-6 md:p-12 max-w-7xl mx-auto w-full">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-center shadow-xs">
                        <h2 className="text-sm font-bold text-red-800">Your Free Trial Has Expired</h2>
                        <p className="text-sm text-red-700 mt-1 leading-relaxed">
                            To continue using your workspace, templates, custom node auto-replies, and messaging automation features, please choose one of our paid plans below.
                        </p>
                    </div>
                    {children}
                </main>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans dashboard-theme">
                {/* 1. TOP TRIAL WARNING BANNER */}
                {isFree && (
                    <div className="bg-[#1E293B] text-white py-2.5 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm font-normal select-none shrink-0 z-50 shadow-sm border-b border-slate-800">
                        <div className="flex-1 text-center sm:text-left leading-normal">
                            {isTrialExpired ? (
                                <span>Your free trial has <span className="font-semibold text-red-400">expired</span>. Upgrade your plan to restore full workspace access.</span>
                            ) : hasTrialEnd ? (
                                <span>You have <span className="font-medium text-[#378179]">{trialDaysRemaining} {trialDaysRemaining === 1 ? "day" : "days"}</span> to explore this <span className="font-medium">Trial account</span>. Connect your preferred channel to unlock all features.</span>
                            ) : (
                                <span>You are on a <span className="font-medium">Trial account</span>. Connect your preferred channel or upgrade to unlock all features.</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {!isTrialExpired && (
                                <Button size="sm" asChild className="bg-[#378179] hover:bg-[#079E61] text-white text-xs font-medium h-7.5 px-3 rounded-lg border-0 shadow-xs cursor-pointer">
                                    <Link href="/integrations/whatsapp">Connect Channel</Link>
                                </Button>
                            )}
                            <Button size="sm" variant="outline" asChild className="text-white hover:text-white border-white/20 hover:bg-white/10 text-xs font-medium h-7.5 px-3 rounded-lg bg-transparent cursor-pointer">
                                <Link href="/billing/subscription">Upgrade Plan</Link>
                            </Button>
                        </div>
                    </div>
                )}

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
                        {/* Credits Balance display */}
                        <Link href="/billing/recharge-credits" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#378179]/5 border border-[#378179]/10 hover:bg-[#378179]/10 transition-all cursor-pointer text-xs font-bold text-[#378179]">
                            <Zap size={13} className="fill-[#378179]/20 text-[#378179]" />
                            <span>{user?.credits !== undefined ? Number(user.credits).toLocaleString() : 0} Credits</span>
                        </Link>

                        {/* Quick start progress */}
                        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-700">
                            <span>Quick start</span>
                            <div className="relative h-6 w-6 flex items-center justify-center">
                                <svg className="absolute w-full h-full transform -rotate-90">
                                    <circle cx="12" cy="12" r="10" stroke="#E2E8F0" strokeWidth="2.5" fill="transparent" />
                                    <circle cx="12" cy="12" r="10" stroke="#09B36E" strokeWidth="2.5" fill="transparent" strokeDasharray="62.8" strokeDashoffset="47.1" />
                                </svg>
                                <span className="text-[10px] font-semibold text-slate-800">1/4</span>
                            </div>
                        </div>

                        {/* Book a demo */}
                        <Button variant="outline" asChild className="hidden sm:inline-flex border-[#378179] text-[#378179] hover:bg-[#EAF7F2] text-xs font-medium h-8 px-3.5 rounded-lg bg-transparent cursor-pointer">
                            <Link href="/book-demo">Book a demo</Link>
                        </Button>

                        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                        {/* Notifications (Bell Icon) */}
                        <div className="relative">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg cursor-pointer">
                                <Bell size={18} />
                            </Button>
                            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white font-extrabold text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white shadow-xs">
                                5
                            </span>
                        </div>

                        <div className="h-4 w-px bg-slate-200" />

                        {/* User Profile dropdown menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 border border-transparent transition-all focus:outline-none cursor-pointer group">
                                    <div className="h-8 w-8 rounded-full bg-[#378179] text-white flex items-center justify-center font-extrabold text-xs shadow-xs transition-transform duration-200 group-hover:scale-102">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <span className="hidden md:inline-block text-xs font-medium text-slate-800 group-hover:text-slate-900 truncate max-w-[100px]">
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
                                    <p className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">Logged in as</p>
                                    <p className="text-xs font-semibold text-slate-900 mt-0.5 truncate">{user?.name || "User"}</p>
                                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{user?.email || ""}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild className="rounded-lg px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 cursor-pointer transition-colors">
                                        <Link href="/settings/company-profile" className="flex items-center gap-2 w-full">
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
                                    className="rounded-lg px-2 py-1.5 text-xs text-red-600 focus:bg-red-50 focus:text-red-600 hover:bg-red-50 hover:text-red-600 cursor-pointer font-semibold transition-colors flex items-center gap-2"
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
                        <SidebarContent className="py-3 space-y-1 overflow-y-auto">
                            <SidebarNav pathname={pathname} />
                        </SidebarContent>

                        <SidebarFooter className="p-4 border-t border-slate-100 bg-white shrink-0">
                            {/* Upgrade to Pro Card */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-xs relative overflow-hidden">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    <Sparkles size={14} className="text-[#378179] fill-[#378179]/20 animate-pulse" />
                                    Upgrade to Pro
                                </div>
                                <p className="text-xs text-slate-700 leading-normal font-medium">
                                    Get premium features &amp; priority support.
                                </p>
                                <Button size="sm" asChild className="w-full bg-[#378179] hover:bg-[#079E61] text-white font-medium text-xs h-7.5 gap-1 shadow-xs mt-1.5 justify-between border-0 cursor-pointer">
                                    <Link href="/billing/subscription">
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
                        <div className={`flex-1 w-full h-full overflow-auto ${isInboxPage ? "p-0" : "p-4 sm:p-6 lg:p-8 xl:p-10 text-sm xl:text-base"}`}>
                            {isInboxPage ? (
                                children
                            ) : (
                                <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                                    {children}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
