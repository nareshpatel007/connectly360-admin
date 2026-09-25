"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    Search,
    ArrowRight,
    X,
    UserPlus,
    PlusCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const NAVIGATION_ITEMS = [
    { label: "Platform Overview", icon: LayoutDashboard, href: "/dashboard", group: "Console", desc: "Realtime metrics, KPI grid & system health" },
    { label: "Users & Accounts", icon: Users, href: "/users", group: "Customers", desc: "User registrations, roles & account status" },
    { label: "Workspaces", icon: Building2, href: "/workspaces", group: "Customers", desc: "Tenant management, plan tiers & sub-users" },
    { label: "Billing & Sales", icon: CreditCard, href: "/billing", group: "Finance", desc: "Subscription invoices, payment history & sales logs" },
    { label: "Credits Ledger", icon: Coins, href: "/credits", group: "Finance", desc: "Manual credit adjustments & immutable ledger logs" },
    { label: "WhatsApp WABA", icon: MessageCircle, href: "/whatsapp", group: "Messaging", desc: "WABA accounts, phone numbers & quality ratings" },
    { label: "Campaign Monitor", icon: Megaphone, href: "/campaigns", group: "Messaging", desc: "Outbound campaign status & delivery statistics" },
    { label: "Audit Logs", icon: ShieldAlert, href: "/audit-logs", group: "Security", desc: "Admin activity trail & security event tracking" },
    { label: "System Health", icon: Activity, href: "/system", group: "Infrastructure", desc: "Database, queues, Redis & failed jobs" },
    { label: "Platform Settings", icon: Settings, href: "/settings", group: "Config", desc: "System configuration, OAuth, & gateway keys" },
];

const QUICK_ACTIONS = [
    { label: "Manage User Accounts", icon: UserPlus, href: "/users", desc: "Search or adjust user status" },
    { label: "Inspect Tenant Workspaces", icon: PlusCircle, href: "/workspaces", desc: "Review active tenant workspaces" },
    { label: "Check System Health", icon: Activity, href: "/system", desc: "View database & queue health" },
];

export function AdminCommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                onOpenChange(!open);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    const filteredNav = NAVIGATION_ITEMS.filter(
        (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.desc.toLowerCase().includes(query.toLowerCase()) ||
            item.group.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (href: string) => {
        onOpenChange(false);
        setQuery("");
        router.push(href);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl p-0 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden [&>button]:hidden">
                <DialogTitle className="sr-only">Admin Command Palette Search</DialogTitle>
                <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-50/60">
                    <Search size={18} className="text-[#35877D] shrink-0 mr-3" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search navigation, users, workspaces, billing, audit logs... (Ctrl + K)"
                        className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        autoFocus
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 mr-2">
                            <X size={16} />
                        </button>
                    )}
                    <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs">
                        ESC
                    </kbd>
                </div>

                <div className="max-h-96 overflow-y-auto p-3 space-y-4 font-sans">
                    {!query && (
                        <div className="space-y-1.5">
                            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Quick Admin Shortcuts
                            </div>
                            {QUICK_ACTIONS.map((action, idx) => {
                                const Icon = action.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(action.href)}
                                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#35877D]/10 hover:text-[#35877D] text-left transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-slate-100 group-hover:bg-[#35877D] group-hover:text-white text-slate-600 flex items-center justify-center transition-colors">
                                                <Icon size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 group-hover:text-[#35877D]">{action.label}</p>
                                                <p className="text-[10px] text-slate-500">{action.desc}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-300 group-hover:text-[#35877D] transition-transform group-hover:translate-x-1" />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="space-y-1">
                        <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            {query ? `Search Results (${filteredNav.length})` : "All Console Navigation"}
                        </div>
                        {filteredNav.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400 font-semibold">
                                No matching admin modules or pages found.
                            </div>
                        ) : (
                            filteredNav.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => handleSelect(item.href)}
                                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100/90 text-left transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-[#35877D]/10 text-[#35877D] flex items-center justify-center shrink-0">
                                                <Icon size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#35877D]">{item.label}</span>
                                                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                                        {item.group}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-300 group-hover:text-[#35877D] transition-transform group-hover:translate-x-1" />
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="p-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↓</kbd> to navigate</span>
                    <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">ESC</kbd> to close</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
