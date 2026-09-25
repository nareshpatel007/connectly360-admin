"use client";

import React, { useState } from "react";
import { Bell, Check, ShieldAlert, UserPlus, CreditCard, MessageCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "user" | "payment" | "whatsapp" | "system";
    read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "1",
        title: "New Platform User Registered",
        description: "A new workspace admin has signed up for Connectly360.",
        time: "5 minutes ago",
        type: "user",
        read: false,
    },
    {
        id: "2",
        title: "Credit Top-Up Completed",
        description: "Invoice #INV-2026-8492 for ₹4,999 paid successfully.",
        time: "18 minutes ago",
        type: "payment",
        read: false,
    },
    {
        id: "3",
        title: "WhatsApp Webhook Operational",
        description: "Meta WABA API webhooks responding with < 120ms latency.",
        time: "1 hour ago",
        type: "whatsapp",
        read: false,
    },
    {
        id: "4",
        title: "System Audit Log Recorded",
        description: "Super Admin updated platform security config.",
        time: "3 hours ago",
        type: "system",
        read: true,
    }
];

export function AdminNotifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "user":
                return <UserPlus size={14} className="text-blue-600" />;
            case "payment":
                return <CreditCard size={14} className="text-emerald-600" />;
            case "whatsapp":
                return <MessageCircle size={14} className="text-purple-600" />;
            default:
                return <ShieldAlert size={14} className="text-[#35877D]" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
                    aria-label="View notifications"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-80 sm:w-96 p-0 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden font-sans"
            >
                <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Platform Alerts & Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-[11px] font-bold text-[#35877D] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <Check size={12} /> Mark all read
                        </button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 font-semibold">
                            No active notifications or alerts.
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => markAsRead(item.id)}
                                className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                                    !item.read ? "bg-[#35877D]/5" : ""
                                }`}
                            >
                                <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                    {getIcon(item.type)}
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                                        <span className="text-[10px] text-slate-400 font-medium shrink-0">{item.time}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug">{item.description}</p>
                                </div>
                                {!item.read && (
                                    <span className="h-2 w-2 rounded-full bg-[#35877D] shrink-0 mt-1.5" />
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-slate-200 bg-slate-50/80 text-center">
                    <Link
                        href="/audit-logs"
                        className="text-xs font-bold text-[#35877D] hover:underline inline-flex items-center gap-1"
                    >
                        View Full System Audit Trail <ChevronRight size={12} />
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
