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
    ShieldAlert,
    Webhook,
    Settings,
    CheckSquare,
    Key
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
        section: "PLATFORM MANAGEMENT",
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
            },
            {
                id: "admin-billing",
                label: "Billing & Transactions",
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
            }
        ]
    },
    {
        section: "WHATSAPP MANAGEMENT",
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
                id: "admin-whatsapp-messages",
                label: "Messaging Diagnostics",
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
        section: "OPERATIONS",
        items: [
            {
                id: "admin-system",
                label: "System Health",
                icon: Activity,
                href: "/system",
                exact: true
            },
            {
                id: "admin-webhooks",
                label: "Webhook Logs",
                icon: Webhook,
                href: "/platform/webhooks",
                patterns: ["/system/webhooks"]
            },
            {
                id: "admin-audit-logs",
                label: "Audit Logs",
                icon: ShieldAlert,
                href: "/audit-logs",
                patterns: ["/audit-logs/**"]
            },
            {
                id: "admin-tasks",
                label: "Admin Tasks",
                icon: CheckSquare,
                href: "/tasks",
                patterns: ["/tasks/**"]
            },
            {
                id: "admin-api-keys",
                label: "API Keys & Telemetry",
                icon: Key,
                href: "/platform/api-keys"
            }
        ]
    },
    {
        section: "ADMINISTRATION",
        items: [
            {
                id: "admin-administrators",
                label: "Platform Admins",
                icon: ShieldCheck,
                href: "/administrators",
                patterns: ["/administrators/**"]
            },
            {
                id: "admin-roles",
                label: "Roles & Permissions",
                icon: ShieldCheck,
                href: "/roles",
                patterns: ["/roles/**"]
            },
            {
                id: "admin-settings",
                label: "Platform Settings",
                icon: Settings,
                href: "/settings",
                exact: true
            }
        ]
    }
];
