import React from "react";
import {
    LayoutDashboard,
    Users,
    Building2,
    CreditCard,
    Coins,
    Package,
    ShieldCheck,
    MessageCircle,
    Activity,
    MessageSquare,
    Megaphone,
    Bot,
    Zap,
    UserCheck,
    ShieldAlert,
    Server,
    Webhook,
    Terminal,
    Settings,
    ToggleRight
} from "lucide-react";

export interface AdminNavItem {
    label: string;
    icon: React.ElementType;
    href: string;
    roles?: string[];
    badgeKey?: string;
}

export interface AdminNavSection {
    section: string;
    items: AdminNavItem[];
}

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
    {
        section: "OVERVIEW",
        items: [
            { label: "Platform Overview", icon: LayoutDashboard, href: "/dashboard" }
        ]
    },
    {
        section: "CUSTOMERS",
        items: [
            { label: "Users & Accounts", icon: Users, href: "/users" },
            { label: "Workspaces", icon: Building2, href: "/workspaces" },
            { label: "Subscriptions", icon: CreditCard, href: "/subscriptions" }
        ]
    },
    {
        section: "REVENUE & BILLING",
        items: [
            { label: "Billing & Sales", icon: CreditCard, href: "/billing" },
            { label: "Credits Ledger", icon: Coins, href: "/credits" },
            { label: "Credit Packages", icon: Package, href: "/credits/packages" },
            { label: "Payment Gateway", icon: ShieldCheck, href: "/billing/gateway" }
        ]
    },
    {
        section: "WHATSAPP",
        items: [
            { label: "WhatsApp Accounts", icon: MessageCircle, href: "/whatsapp" },
            { label: "WABA Monitoring", icon: Activity, href: "/whatsapp/waba" },
            { label: "Message Monitor", icon: MessageSquare, href: "/whatsapp/messages" },
            { label: "Campaign Monitor", icon: Megaphone, href: "/campaigns" }
        ]
    },
    {
        section: "AI & AUTOMATION",
        items: [
            { label: "AI Usage", icon: Bot, href: "/ai/usage" },
            { label: "Automation Monitor", icon: Zap, href: "/automations" }
        ]
    },
    {
        section: "ADMINISTRATION",
        items: [
            { label: "Administrators", icon: ShieldCheck, href: "/administrators" },
            { label: "Roles & Permissions", icon: UserCheck, href: "/roles" }
        ]
    },
    {
        section: "PLATFORM",
        items: [
            { label: "Audit Logs", icon: ShieldAlert, href: "/audit-logs" },
            { label: "System Health", icon: Activity, href: "/system" },
            { label: "Queue Monitor", icon: Server, href: "/platform/queue" },
            { label: "Webhook Logs", icon: Webhook, href: "/platform/webhooks" },
            { label: "API Logs", icon: Terminal, href: "/platform/api-logs" }
        ]
    },
    {
        section: "CONFIGURATION",
        items: [
            { label: "Platform Settings", icon: Settings, href: "/settings" },
            { label: "Feature Flags", icon: ToggleRight, href: "/settings/feature-flags" }
        ]
    }
];
