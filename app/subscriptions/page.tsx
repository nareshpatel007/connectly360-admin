"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    CreditCard,
    TrendingUp,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    RefreshCw,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Building2,
    ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface SubscriptionRecord {
    id: string;
    workspace_id: number;
    workspace_name: string;
    owner_email: string;
    owner_name: string;
    plan: string;
    raw_plan: string | null;
    amount: string;
    amount_value: number;
    status: "active" | "canceled" | "past_due" | "trialing" | "paused";
    renewal_date: string | null;
    customer_type: string;
    created_at: string;
}

interface SubscriptionMetrics {
    mrr: number;
    mrr_formatted: string;
    active_count: number;
    trial_count: number;
    past_due_count: number;
}

export default function AdminSubscriptionsPage() {
    const { token } = useAuth();
    const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
    const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters and pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const getAuthToken = () =>
        token || (typeof window !== "undefined" ? localStorage.getItem("admin_auth_token") : null) || "";

    const fetchSubscriptions = useCallback(async (page = 1) => {
        const authToken = getAuthToken();
        if (!authToken) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("per_page", "15");
            if (searchQuery.trim()) params.set("search", searchQuery.trim());
            if (statusFilter !== "all") params.set("status", statusFilter);

            const res = await fetch(`/api/admin/subscriptions?${params.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "X-Api-Token": authToken,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to load subscriptions (HTTP ${res.status})`);
            }

            const json = await res.json();
            if (json.status) {
                const paginated = json.data;
                setSubscriptions(Array.isArray(paginated.data) ? paginated.data : []);
                setCurrentPage(paginated.current_page || 1);
                setLastPage(paginated.last_page || 1);
                setTotalRecords(paginated.total || 0);

                if (json.metrics) {
                    setMetrics(json.metrics);
                }
            } else {
                throw new Error(json.message || "Failed to load subscriptions");
            }
        } catch (err: any) {
            console.error("Subscriptions load error:", err);
            setError(err.message || "Unable to reach subscriptions service");
            toast.error("Failed to load subscription records");
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    }, [token, searchQuery, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSubscriptions(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, statusFilter]);

    const renderStatusBadge = (status: string) => {
        const normalized = (status || "").toLowerCase();
        switch (normalized) {
            case "active":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                    </span>
                );
            case "trialing":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-50 text-teal-700 border border-teal-200">
                        Trialing
                    </span>
                );
            case "past_due":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                        Past Due
                    </span>
                );
            case "paused":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                        Paused
                    </span>
                );
            case "canceled":
            case "suspended":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        Canceled
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        {status}
                    </span>
                );
        }
    };

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
                actions={
                    <Button
                        onClick={() => fetchSubscriptions(currentPage)}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                        className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer hover:bg-slate-50"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh Subscriptions
                    </Button>
                }
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <StatCard
                    title="Monthly Recurring Revenue"
                    value={metrics?.mrr_formatted || (loading ? "..." : "₹0")}
                    icon={TrendingUp}
                    change="Platform MRR"
                    changeType="positive"
                    subtitle="Active recurring subscriptions"
                />
                <StatCard
                    title="Active Subscriptions"
                    value={metrics ? metrics.active_count.toLocaleString() : (loading ? "..." : "0")}
                    icon={CheckCircle2}
                    change="Paying Accounts"
                    changeType="positive"
                    subtitle="Subscribed customer workspaces"
                />
                <StatCard
                    title="Trial Workspaces"
                    value={metrics ? metrics.trial_count.toLocaleString() : (loading ? "..." : "0")}
                    icon={Clock}
                    change="Active Trials"
                    changeType="neutral"
                    subtitle="Workspaces within trial window"
                />
                <StatCard
                    title="Past Due Accounts"
                    value={metrics ? metrics.past_due_count.toLocaleString() : (loading ? "..." : "0")}
                    icon={XCircle}
                    change={metrics && metrics.past_due_count > 0 ? "Requires Review" : "Healthy"}
                    changeType={metrics && metrics.past_due_count > 0 ? "negative" : "positive"}
                    subtitle="Pending invoice payment retries"
                />
            </div>

            {/* Filter Bar & Table Card */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Tenant Subscription Accounts</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Live directory of customer workspaces and billing tiers ({totalRecords} total)</CardDescription>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                            <Input
                                placeholder="Search workspace, email, plan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 pl-9 text-xs rounded-xl border-slate-200"
                            />
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                            {["all", "active", "trialing", "past_due", "canceled"].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                                        statusFilter === st ? "bg-white text-slate-900 font-bold shadow-2xs" : "hover:text-slate-900"
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
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Renewal / Expiry</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw size={16} className="animate-spin text-[#35877D]" />
                                            <span>Loading real tenant subscriptions...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-rose-600">
                                            <AlertCircle size={20} />
                                            <span className="font-semibold text-xs">{error}</span>
                                            <Button
                                                onClick={() => fetchSubscriptions(currentPage)}
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 h-8 text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                                            >
                                                Retry
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : subscriptions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-slate-400">
                                        No subscription accounts found matching your query.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subscriptions.map((sub) => (
                                    <TableRow key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                                        <TableCell className="py-3.5">
                                            <div className="font-bold text-slate-900">{sub.workspace_name}</div>
                                            <div className="text-[11px] text-slate-500 font-normal">{sub.owner_email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-800">{sub.plan}</span>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900">{sub.amount}</TableCell>
                                        <TableCell>
                                            {renderStatusBadge(sub.status)}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-right">
                                            {sub.renewal_date || "—"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {!loading && totalRecords > 0 && (
                        <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
                            <div>
                                Page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
                                <span className="font-bold text-slate-800">{lastPage}</span> ({totalRecords} records)
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchSubscriptions(currentPage - 1)}
                                    disabled={currentPage <= 1 || loading}
                                    className="h-8 px-2.5 rounded-lg border-slate-200 text-xs"
                                >
                                    <ChevronLeft size={14} />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchSubscriptions(currentPage + 1)}
                                    disabled={currentPage >= lastPage || loading}
                                    className="h-8 px-2.5 rounded-lg border-slate-200 text-xs"
                                >
                                    Next
                                    <ChevronRight size={14} />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
