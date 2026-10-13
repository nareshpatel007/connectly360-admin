"use client";

import React, { useState } from "react";
import {
    Bell,
    CheckCheck,
    ShieldAlert,
    UserPlus,
    CreditCard,
    MessageCircle,
    ChevronRight,
    CheckCircle2,
    Trash2,
    Sparkles
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

export interface AdminNotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "user" | "payment" | "whatsapp" | "system";
    category: string;
    read: boolean;
    href?: string;
}

const INITIAL_NOTIFICATIONS: AdminNotificationItem[] = [
    {
        id: "1",
        title: "New Platform User Registered",
        description: "A new workspace administrator has signed up for Connectly360.",
        time: "5m ago",
        type: "user",
        category: "Users",
        read: false,
        href: "/users"
    },
    {
        id: "2",
        title: "Credit Top-Up Completed",
        description: "Invoice #INV-2026-8492 for ₹4,999 processed and paid successfully.",
        time: "18m ago",
        type: "payment",
        category: "Billing",
        read: false,
        href: "/billing"
    },
    {
        id: "3",
        title: "WhatsApp Webhook Operational",
        description: "Meta WABA Cloud API webhooks responding with < 120ms latency.",
        time: "1h ago",
        type: "whatsapp",
        category: "WhatsApp",
        read: false,
        href: "/whatsapp"
    },
    {
        id: "4",
        title: "System Audit Log Recorded",
        description: "Super Admin updated platform security configuration parameters.",
        time: "3h ago",
        type: "system",
        category: "Security",
        read: true,
        href: "/audit-logs"
    }
];

export function AdminNotifications() {
    const [notifications, setNotifications] = useState<AdminNotificationItem[]>(INITIAL_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "unread") return !n.read;
        return true;
    });

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getIconConfig = (type: string) => {
        switch (type) {
            case "user":
                return {
                    icon: <UserPlus size={14} className="text-blue-600" />,
                    bg: "bg-blue-50/80 border-blue-100",
                    badge: "bg-blue-50 text-blue-700 border-blue-200/60"
                };
            case "payment":
                return {
                    icon: <CreditCard size={14} className="text-emerald-600" />,
                    bg: "bg-emerald-50/80 border-emerald-100",
                    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                };
            case "whatsapp":
                return {
                    icon: <MessageCircle size={14} className="text-purple-600" />,
                    bg: "bg-purple-50/80 border-purple-100",
                    badge: "bg-purple-50 text-purple-700 border-purple-200/60"
                };
            default:
                return {
                    icon: <ShieldAlert size={14} className="text-[#35877D]" />,
                    bg: "bg-teal-50/80 border-teal-100",
                    badge: "bg-teal-50 text-teal-700 border-teal-200/60"
                };
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
                    aria-label={`Platform notifications (${unreadCount} unread)`}
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-[#35877D] text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-xs animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-88 sm:w-96 p-0 bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden font-sans z-50 text-slate-900 animate-in fade-in-0 zoom-in-95 duration-150"
            >
                {/* Header Row */}
                <div className="p-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate">
                            Notifications
                        </span>
                        {unreadCount > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#35877D] border border-teal-200/60 shrink-0">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="text-[11px] font-semibold text-[#35877D] hover:text-[#25635b] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                        >
                            <CheckCheck size={13} />
                            <span>Mark all read</span>
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center border-b border-slate-100 bg-white px-3 pt-2 gap-4 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`pb-2 px-1 cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
                            activeTab === "all"
                                ? "border-[#35877D] text-[#35877D] font-bold"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <span>All</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {notifications.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("unread")}
                        className={`pb-2 px-1 cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
                            activeTab === "unread"
                                ? "border-[#35877D] text-[#35877D] font-bold"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <span>Unread</span>
                        {unreadCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-50 text-[#35877D] font-bold border border-teal-200/50">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Notification Items List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/90 sidebar-scroll">
                    {filteredNotifications.length === 0 ? (
                        <div className="py-10 px-6 text-center space-y-2">
                            <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/60">
                                <CheckCircle2 size={20} />
                            </div>
                            <p className="text-xs font-bold text-slate-800">
                                {activeTab === "unread" ? "All caught up!" : "No notifications"}
                            </p>
                            <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                                {activeTab === "unread"
                                    ? "There are no unread platform alerts requiring your attention."
                                    : "Platform events and operational updates will appear here."}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((item) => {
                            const iconCfg = getIconConfig(item.type);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => markAsRead(item.id)}
                                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-slate-50/80 ${
                                        !item.read
                                            ? "bg-[#35877D]/[0.03] border-l-2 border-[#35877D]"
                                            : "border-l-2 border-transparent opacity-85"
                                    }`}
                                >
                                    {/* Icon Box */}
                                    <div
                                        className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 shadow-2xs ${iconCfg.bg}`}
                                    >
                                        {iconCfg.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#35877D] transition-colors">
                                                {item.title}
                                            </p>
                                            <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                                {item.time}
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center gap-2 pt-0.5">
                                            <span
                                                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${iconCfg.badge}`}
                                            >
                                                {item.category}
                                            </span>
                                            {!item.read && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#35877D]">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#35877D]" />
                                                    Unread
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Action Bar */}
                <div className="p-2.5 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <Link
                        href="/audit-logs"
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] font-bold text-[#35877D] hover:underline inline-flex items-center gap-1 pl-1"
                    >
                        <span>View System Audit Trail</span>
                        <ChevronRight size={12} />
                    </Link>

                    {notifications.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-[10px] font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer pr-1 transition-colors"
                            title="Clear all alerts"
                        >
                            <Trash2 size={11} />
                            <span>Clear all</span>
                        </button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
