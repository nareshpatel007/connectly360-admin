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

interface Subscription {
    id: string;
    workspaceName: string;
    ownerEmail: string;
    plan: "Free Trial" | "Growth" | "Pro Enterprise" | "Custom";
    amount: string;
    status: "active" | "canceled" | "past_due" | "trialing";
    renewalDate: string;
    customerType: "Customer Account"; // Excludes internal admin accounts
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
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <CreditCard className="h-6 w-6 text-[#35877D]" />
                        Tenant Subscriptions Console
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitor active SaaS subscriptions, plan distribution, renewals, and customer MRR.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Customer Accounts Only (Admins Excluded)
                    </span>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Monthly Recurring Revenue</p>
                    <p className="text-xl font-black text-slate-900">₹148,500</p>
                    <p className="text-[10px] text-emerald-600 font-bold">+14.2% from last month</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Active Subscriptions</p>
                    <p className="text-xl font-black text-slate-900">42 Tenants</p>
                    <p className="text-[10px] text-slate-500">Excludes internal admin users</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Trial Conversions</p>
                    <p className="text-xl font-black text-slate-900">68% Rate</p>
                    <p className="text-[10px] text-teal-600 font-bold">18 active trials</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Past Due</p>
                    <p className="text-xl font-black text-rose-600">3 Accounts</p>
                    <p className="text-[10px] text-slate-400">Payment retries scheduled</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by workspace, email or plan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#35877D]"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#35877D]"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="trialing">Trialing</option>
                        <option value="past_due">Past Due</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                        <tr>
                            <th className="px-4 py-3">Workspace</th>
                            <th className="px-4 py-3">Plan</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Next Renewal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {filtered.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-bold text-slate-900">{s.workspaceName}</div>
                                    <div className="text-[11px] text-slate-400">{s.ownerEmail}</div>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900">{s.plan}</td>
                                <td className="px-4 py-3 font-bold text-[#35877D]">{s.amount}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                            s.status === "active"
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : s.status === "trialing"
                                                ? "bg-teal-50 text-teal-700 border border-teal-200"
                                                : "bg-rose-50 text-rose-700 border border-rose-200"
                                        }`}
                                    >
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-500">{s.renewalDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
