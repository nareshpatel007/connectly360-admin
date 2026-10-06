"use client";

import React, { useState } from "react";
import {
    CreditCard,
    Building2,
    Users,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    ShieldCheck,
    TrendingUp,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Subscription {
    id: string;
    workspaceName: string;
    ownerEmail: string;
    plan: "Free Trial" | "Growth" | "Pro Enterprise" | "Custom";
    amount: string;
    status: "active" | "canceled" | "past_due" | "trialing";
    renewalDate: string;
    customerType: "Customer Account";
}

const SAMPLE_SUBSCRIPTIONS: Subscription[] = [
    { id: "sub_101", workspaceName: "Apex Logistics LLC", ownerEmail: "billing@apexlogistics.com", plan: "Pro Enterprise", amount: "₹4,999/mo", status: "active", renewalDate: "Oct 15, 2026", customerType: "Customer Account" },
    { id: "sub_102", workspaceName: "Global Retail Co", ownerEmail: "admin@globalretail.io", plan: "Growth", amount: "₹1,999/mo", status: "active", renewalDate: "Oct 02, 2026", customerType: "Customer Account" },
    { id: "sub_103", workspaceName: "MedCare Health", ownerEmail: "contact@medcare.org", plan: "Free Trial", amount: "₹0", status: "trialing", renewalDate: "Sep 30, 2026", customerType: "Customer Account" },
    { id: "sub_104", workspaceName: "Urban Style Boutique", ownerEmail: "info@urbanstyle.in", plan: "Growth", amount: "₹1,999/mo", status: "past_due", renewalDate: "Sep 20, 2026", customerType: "Customer Account" }
];

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(SAMPLE_SUBSCRIPTIONS);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = subscriptions.filter((s) => {
        const matchesQuery =
            s.workspaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.plan.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={CreditCard}
                title="Tenant Subscriptions Console"
                description="Manage customer workspace subscription plans, billing renewals, active tiers, and MRR metrics."
                breadcrumbs={[
                    { label: "Customers", href: "/workspaces" },
                    { label: "Subscriptions" }
                ]}
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <StatCard
                    title="Monthly Recurring Revenue"
                    value="₹188,400"
                    icon={TrendingUp}
                    change="+12.5%"
                    changeType="positive"
                    subtitle="Platform active MRR"
                />
                <StatCard
                    title="Active Subscriptions"
                    value="42"
                    icon={CheckCircle2}
                    change="91.3%"
                    changeType="positive"
                    subtitle="Paying workspaces"
                />
                <StatCard
                    title="Trial Workspaces"
                    value="18"
                    icon={Clock}
                    change="Active"
                    changeType="neutral"
                    subtitle="14-day free trial"
                />
                <StatCard
                    title="Past Due Invoices"
                    value="1"
                    icon={XCircle}
                    change="Requires Attention"
                    changeType="negative"
                    subtitle="Razorpay retry pending"
                />
            </div>

            {/* Filter Bar & Table Card */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Tenant Subscription Accounts</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Live directory of paying customer workspaces</CardDescription>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                        <Input
                            placeholder="Search workspace or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-64 text-xs rounded-xl border-slate-200"
                        />
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                            {["all", "active", "trialing", "past_due"].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${statusFilter === st ? "bg-white text-slate-900 font-bold shadow-2xs" : "hover:text-slate-900"
                                        }`}
                                >
                                    {st.replace("_", " ")}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workspace</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Plan Tier</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Amount</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Status</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Renewal Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-slate-400">
                                        No subscription accounts found matching your query.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((sub) => (
                                    <TableRow key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                                        <TableCell className="py-3.5">
                                            <div className="font-bold text-slate-900">{sub.workspaceName}</div>
                                            <div className="text-[11px] text-slate-500 font-normal">{sub.ownerEmail}</div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-800">{sub.plan}</span>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900">{sub.amount}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${sub.status === "active"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : sub.status === "trialing"
                                                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                                                            : "bg-rose-50 text-rose-700 border border-rose-200"
                                                    }`}
                                            >
                                                {sub.status.replace("_", " ")}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-right">{sub.renewalDate}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
