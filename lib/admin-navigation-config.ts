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
import type { LeafNavigationItem } from "./navigation-matcher";

export interface AdminNavItem extends LeafNavigationItem {
    icon: React.ElementType;
    subItems?: LeafNavigationItem[];
}

export interface AdminNavSection {
    section: string;
    items: AdminNavItem[];
}

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
    {
        section: "OVERVIEW",
        items: [
            {
                id: "admin-dashboard",
                label: "Platform Overview",
                icon: LayoutDashboard,
                href: "/dashboard",
                exact: true
            }
        ]
    },
    {
        section: "CUSTOMERS",
        items: [
            {
                id: "admin-users",
                label: "Users & Accounts",
                icon: Users,
                href: "/users",
                patterns: ["/users/**"]
            },
            {
                id: "admin-workspaces",
                label: "Workspaces",
                icon: Building2,
                href: "/workspaces",
                patterns: ["/workspaces/**"]
            },
            {
                id: "admin-subscriptions",
                label: "Subscriptions",
                icon: CreditCard,
                href: "/subscriptions",
                patterns: ["/subscriptions/**"]
            }
        ]
    },
    {
        section: "REVENUE & BILLING",
        items: [
            {
                id: "admin-billing",
                label: "Billing & Sales",
                icon: CreditCard,
                href: "/billing",
                exact: true
            },
            {
                id: "admin-credits",
                label: "Credits Ledger",
                icon: Coins,
                href: "/credits",
                exact: true
            },
            {
                id: "admin-credits-packages",
                label: "Credit Packages",
                icon: Package,
                href: "/credits/packages"
            },
            {
                id: "admin-payment-gateway",
                label: "Payment Gateway",
                icon: ShieldCheck,
                href: "/billing/gateway",
                patterns: ["/settings/payment-gateway"]
            }
        ]
    },
    {
        section: "WHATSAPP",
        items: [
            {
                id: "admin-whatsapp",
                label: "WhatsApp Accounts",
                icon: MessageCircle,
                href: "/whatsapp",
                exact: true,
                patterns: ["/settings/whatsapp"]
            },
            {
                id: "admin-whatsapp-waba",
                label: "WABA Monitoring",
                icon: Activity,
                href: "/whatsapp/waba"
            },
            {
                id: "admin-whatsapp-messages",
                label: "Message Monitor",
                icon: MessageSquare,
                href: "/whatsapp/messages"
            },
            {
                id: "admin-campaigns",
                label: "Campaign Monitor",
                icon: Megaphone,
                href: "/campaigns",
                patterns: ["/campaigns/**"]
            }
        ]
    },
    {
        section: "AI & AUTOMATION",
        items: [
            {
                id: "admin-ai-usage",
                label: "AI Usage",
                icon: Bot,
                href: "/ai/usage",
                patterns: ["/ai/**"]
            },
            {
                id: "admin-automations",
                label: "Automation Monitor",
                icon: Zap,
                href: "/automations",
                patterns: ["/automations/**"]
            }
        ]
    },
    {
        section: "ADMINISTRATION",
        items: [
            {
                id: "admin-administrators",
                label: "Administrators",
                icon: ShieldCheck,
                href: "/administrators",
                patterns: ["/administrators/**"]
            },
            {
                id: "admin-roles",
                label: "Roles & Permissions",
                icon: UserCheck,
                href: "/roles",
                patterns: ["/roles/**"]
            }
        ]
    },
    {
        section: "PLATFORM",
        items: [
            {
                id: "admin-audit-logs",
                label: "Audit Logs",
                icon: ShieldAlert,
                href: "/audit-logs",
                patterns: ["/audit-logs/**"]
            },
            {
                id: "admin-system",
                label: "System Health",
                icon: Activity,
                href: "/system",
                exact: true
            },
            {
                id: "admin-queue",
                label: "Queue Monitor",
                icon: Server,
                href: "/platform/queue"
            },
            {
                id: "admin-webhooks",
                label: "Webhook Logs",
                icon: Webhook,
                href: "/platform/webhooks",
                patterns: ["/system/webhooks"]
            },
            {
                id: "admin-api-logs",
                label: "API Logs",
                icon: Terminal,
                href: "/platform/api-logs"
            }
        ]
    },
    {
        section: "CONFIGURATION",
        items: [
            {
                id: "admin-settings",
                label: "Platform Settings",
                icon: Settings,
                href: "/settings",
                exact: true
            },
            {
                id: "admin-feature-flags",
                label: "Feature Flags",
                icon: ToggleRight,
                href: "/settings/feature-flags"
            }
        ]
    }
];
