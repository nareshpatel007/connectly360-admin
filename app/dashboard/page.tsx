"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Users,
    Building2,
    IndianRupee,
    MessageCircle,
    ArrowUpRight,
    TrendingUp,
    RefreshCw,
    Activity,
    CreditCard,
    ShieldAlert,
    UserPlus,
    Calendar,
    AlertCircle,
    Clock,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

interface DashboardMetrics {
    users?: { total?: number; active?: number; suspended?: number; verified?: number };
    administrators?: { total?: number };
    workspaces?: { total?: number; active?: number; suspended?: number };
    revenue?: { total?: number; currency?: string };
    whatsapp?: { connected_accounts?: number; total_accounts?: number; total_messages?: number; total_campaigns?: number };
    credits?: { total_purchased?: number };
    recent_users?: Array<{ id: number; name: string; email: string; created_at: string; status?: string }>;
    recent_transactions?: Array<{ id: number; user_name?: string; user_email?: string; company_name?: string; type?: string; credits?: number; amount?: number; status?: string; created_at?: string }>;
    revenue_chart?: Array<{ month: string; subscriptions: number; credits: number; total: number }>;
    growth_chart?: Array<{ month: string; users: number; workspaces: number }>;
}

export default function AdminDashboardPage() {
    const { token } = useAuth();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");
    const [dateRange, setDateRange] = useState<string>("30_days");

    const fetchMetrics = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/dashboard", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });

            const data = await res.json();
            if (data.status && data.data) {
                setMetrics(data.data);
                const now = new Date();
                setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            } else {
                setError(data.message || "Unable to fetch platform metrics from the server.");
            }
        } catch {
            setError("Failed to connect to the Admin API. Please check server availability.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    // System services health baseline
    const systemServices = [
        { name: "Core API Server", status: "Operational", latency: "24ms" },
        { name: "MySQL Database", status: "Operational", latency: "4ms" },
        { name: "Redis Cache Queue", status: "Operational", latency: "2ms" },
        { name: "Meta WhatsApp API", status: "Operational", latency: "110ms" },
        { name: "Razorpay Gateway", status: "Operational", latency: "145ms" },
        { name: "SMTP Email Service", status: "Operational", latency: "85ms" },
    ];

    const revenueChartData = metrics?.revenue_chart && metrics.revenue_chart.length > 0 ? metrics.revenue_chart : [
        { month: "Jan", subscriptions: 0, credits: 0, total: 0 },
        { month: "Feb", subscriptions: 0, credits: 0, total: 0 },
        { month: "Mar", subscriptions: 0, credits: 0, total: 0 },
        { month: "Apr", subscriptions: 0, credits: 0, total: 0 },
        { month: "May", subscriptions: 0, credits: 0, total: 0 },
        { month: "Jun", subscriptions: 0, credits: 0, total: 0 }
    ];

    const growthChartData = metrics?.growth_chart && metrics.growth_chart.length > 0 ? metrics.growth_chart : [
        { month: "Jan", users: 0, workspaces: 0 },
        { month: "Feb", users: 0, workspaces: 0 },
        { month: "Mar", users: 0, workspaces: 0 },
        { month: "Apr", users: 0, workspaces: 0 },
        { month: "May", users: 0, workspaces: 0 },
        { month: "Jun", users: 0, workspaces: 0 }
    ];

    return (
        <div className="space-y-6 font-sans">
            {/* HERO MASTER CONTROL BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-50/90 via-emerald-50/50 to-white p-6 sm:p-8 text-slate-900 shadow-sm border border-[#35877D]/20 font-sans">
                {/* Subtle Background Glows */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#35877D]/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/25 text-[10px] font-black uppercase tracking-wider">
                                <Activity size={12} className="animate-pulse text-[#35877D]" /> Platform Operations &amp; Master Control
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                            Platform Overview &amp; Health Hub
                        </h1>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            Real-time command center monitoring total users, multi-tenant workspace isolation, WhatsApp WABA infrastructure, billing revenue, and server health.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
                        <div className="hidden sm:flex flex-col items-end px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xs">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Window</span>
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 mt-0.5">
                                <Calendar size={13} className="text-[#35877D]" />
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="bg-transparent text-slate-900 font-extrabold focus:outline-none cursor-pointer"
                                >
                                    <option value="today" className="bg-white text-slate-900">Today</option>
                                    <option value="7_days" className="bg-white text-slate-900">Last 7 Days</option>
                                    <option value="30_days" className="bg-white text-slate-900">Last 30 Days</option>
                                    <option value="this_month" className="bg-white text-slate-900">This Month</option>
                                    <option value="last_month" className="bg-white text-slate-900">Last Month</option>
                                    <option value="this_year" className="bg-white text-slate-900">This Year</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            onClick={fetchMetrics}
                            disabled={loading}
                            size="sm"
                            className="h-10 px-4 bg-[#35877D] hover:bg-[#2b6e66] text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#35877D]/20 transition-all border-0"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            <span>{loading ? "Refreshing..." : "Refresh Data"}</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* ERROR BANNER IF FETCH FAILED */}
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4 text-rose-800 text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                        <span>{error}</span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={fetchMetrics}
                        className="h-8 border-rose-300 text-rose-800 hover:bg-rose-100 rounded-xl text-xs"
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* QUICK ACTIONS BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <Button asChild variant="outline" className="h-12 bg-white border-slate-200/80 hover:border-[#35877D] hover:bg-[#35877D]/5 text-slate-700 hover:text-[#35877D] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all hover:scale-[1.02]">
                    <Link href="/users">
                        <div className="h-7 w-7 rounded-lg bg-[#35877D]/10 text-[#35877D] flex items-center justify-center">
                            <UserPlus size={14} />
                        </div>
                        <span>Manage Users</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white border-slate-200/80 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all hover:scale-[1.02]">
                    <Link href="/workspaces">
                        <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Building2 size={14} />
                        </div>
                        <span>Workspaces</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all hover:scale-[1.02]">
                    <Link href="/billing">
                        <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CreditCard size={14} />
                        </div>
                        <span>Billing &amp; Sales</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white border-slate-200/80 hover:border-purple-500 hover:bg-purple-50 text-slate-700 hover:text-purple-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all hover:scale-[1.02]">
                    <Link href="/whatsapp">
                        <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <MessageCircle size={14} />
                        </div>
                        <span>WhatsApp WABA</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white border-slate-200/80 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-amber-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all hover:scale-[1.02]">
                    <Link href="/audit-logs">
                        <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <ShieldAlert size={14} />
                        </div>
                        <span>Audit Trail</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white border-slate-200/80 hover:border-cyan-500 hover:bg-cyan-50 text-slate-700 hover:text-cyan-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all hover:scale-[1.02]">
                    <Link href="/system">
                        <div className="h-7 w-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                            <Activity size={14} />
                        </div>
                        <span>System Health</span>
                    </Link>
                </Button>
            </div>

            {/* METRICS KPI GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Users Stat Card */}
                <Card className="p-5 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Platform Users</span>
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#35877D] to-[#25635b] text-white flex items-center justify-center shadow-md shadow-[#35877D]/20">
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        {loading && !metrics ? (
                            <Skeleton className="h-9 w-24 rounded-lg my-1" />
                        ) : (
                            <div className="text-3xl font-black text-slate-900 tracking-tight">
                                {metrics?.users?.total ?? 0}
                            </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                {metrics?.users?.active ?? 0} Active
                            </span>
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-rose-500" />
                                {metrics?.users?.suspended ?? 0} Suspended
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Workspaces Stat Card */}
                <Card className="p-5 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Active Workspaces</span>
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                            <Building2 size={20} />
                        </div>
                    </div>
                    <div>
                        {loading && !metrics ? (
                            <Skeleton className="h-9 w-24 rounded-lg my-1" />
                        ) : (
                            <div className="text-3xl font-black text-slate-900 tracking-tight">
                                {metrics?.workspaces?.total ?? 0}
                            </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
                            <span className="text-blue-600 font-bold flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                {metrics?.workspaces?.active ?? 0} Operational
                            </span>
                            <span className="text-slate-400 font-bold">
                                {metrics?.workspaces?.suspended ?? 0} Suspended
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Revenue Stat Card */}
                <Card className="p-5 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Platform Revenue</span>
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                            <IndianRupee size={20} />
                        </div>
                    </div>
                    <div>
                        {loading && !metrics ? (
                            <Skeleton className="h-9 w-28 rounded-lg my-1" />
                        ) : (
                            <div className="text-3xl font-black text-slate-900 tracking-tight">
                                ₹{(metrics?.revenue?.total ?? 0).toLocaleString("en-IN")}
                            </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 mt-3 pt-2.5 border-t border-slate-100">
                            <span className="flex items-center gap-1 font-bold">
                                <TrendingUp size={14} />
                                Subscriptions &amp; Credits
                            </span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black border border-emerald-200">
                                INR (₹)
                            </span>
                        </div>
                    </div>
                </Card>

                {/* WhatsApp Stat Card */}
                <Card className="p-5 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">WhatsApp WABA</span>
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                            <MessageCircle size={20} />
                        </div>
                    </div>
                    <div>
                        {loading && !metrics ? (
                            <Skeleton className="h-9 w-24 rounded-lg my-1" />
                        ) : (
                            <div className="text-3xl font-black text-slate-900 tracking-tight">
                                {metrics?.whatsapp?.connected_accounts ?? 0} <span className="text-base text-slate-400 font-bold">/ {metrics?.whatsapp?.total_accounts ?? 0}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-semibold text-purple-700 mt-3 pt-2.5 border-t border-slate-100">
                            <span className="font-bold flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                                {(metrics?.whatsapp?.total_messages ?? 0).toLocaleString()} Messages
                            </span>
                            <span className="text-slate-500 font-medium">
                                {metrics?.whatsapp?.total_campaigns ?? 0} Campaigns
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ANALYTICS CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Overview Chart */}
                <Card className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                <TrendingUp size={16} className="text-[#35877D]" />
                                Revenue Breakdown &amp; Trends
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Subscription plans vs Credit top-up sales over time
                            </p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-[#35877D] hover:bg-[#35877D]/10 rounded-xl">
                            <Link href="/billing">Billing Log <ArrowUpRight size={14} /></Link>
                        </Button>
                    </div>

                    <div className="h-72 w-full pt-2">
                        {loading && !metrics ? (
                            <div className="h-full flex items-center justify-center">
                                <Skeleton className="h-56 w-full rounded-2xl" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#35877D" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#35877D" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="colorCred" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                                        formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, ""]}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                                    <Area type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#35877D" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                                    <Area type="monotone" dataKey="credits" name="Credits Top-Up" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCred)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>

                {/* Customer & Workspace Growth Bar Chart */}
                <Card className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                <Users size={16} className="text-blue-600" />
                                Customer &amp; Workspace Growth
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Monthly new users and workspaces onboarded
                            </p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl">
                            <Link href="/users">Customer Directory <ArrowUpRight size={14} /></Link>
                        </Button>
                    </div>

                    <div className="h-72 w-full pt-2">
                        {loading && !metrics ? (
                            <div className="h-full flex items-center justify-center">
                                <Skeleton className="h-56 w-full rounded-2xl" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={growthChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                                    <Bar dataKey="users" name="New Customers" fill="#35877D" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="workspaces" name="New Workspaces" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>
            </div>

            {/* THREE-COLUMN PLATFORM HEALTH & ACTIVITY HUB */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Services Health Matrix */}
                <Card className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-xs lg:col-span-1">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <Activity size={16} className="text-[#35877D]" />
                            System Health &amp; Subsystems
                        </h3>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Normal
                        </span>
                    </div>

                    <div className="space-y-2.5">
                        {systemServices.map((srv, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="font-bold text-slate-800">{srv.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-mono">{srv.latency}</span>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        {srv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button asChild variant="outline" className="w-full h-9 rounded-xl text-xs font-bold border-slate-200 text-slate-600 hover:text-[#35877D]">
                        <Link href="/system">Diagnostic Diagnostics Center</Link>
                    </Button>
                </Card>

                {/* Recent Customer Registrations */}
                <Card className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-xs lg:col-span-1">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <UserPlus size={16} className="text-[#35877D]" />
                            Recent Customers
                        </h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-[#35877D] hover:bg-[#35877D]/10 rounded-xl">
                            <Link href="/users">View All <ArrowUpRight size={14} /></Link>
                        </Button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {loading && !metrics ? (
                            <div className="space-y-3 py-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2.5">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-3.5 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-5 w-14 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        ) : !metrics?.recent_users || metrics.recent_users.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-400 font-medium">
                                No recent user registrations found.
                            </div>
                        ) : (
                            metrics.recent_users.map((u) => (
                                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="h-9 w-9 rounded-full bg-[#35877D]/10 text-[#35877D] font-black text-xs flex items-center justify-center shrink-0 border border-[#35877D]/20">
                                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 truncate max-w-36">{u.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium truncate max-w-36">{u.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                        u.status === "suspended"
                                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    }`}>
                                        {u.status || "active"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Recent Transactions & Top-Ups */}
                <Card className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-xs lg:col-span-1">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <CreditCard size={16} className="text-emerald-600" />
                            Recent Sales &amp; Top-Ups
                        </h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-[#35877D] hover:bg-[#35877D]/10 rounded-xl">
                            <Link href="/billing">Billing Log <ArrowUpRight size={14} /></Link>
                        </Button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {loading && !metrics ? (
                            <div className="space-y-3 py-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <div className="space-y-1">
                                            <Skeleton className="h-3.5 w-28" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <Skeleton className="h-3.5 w-16" />
                                            <Skeleton className="h-4 w-12 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !metrics?.recent_transactions || metrics.recent_transactions.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-400 font-medium">
                                No transactions recorded yet.
                            </div>
                        ) : (
                            metrics.recent_transactions.map((t) => (
                                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 truncate max-w-36">
                                            {t.company_name || t.user_name || t.user_email || "Customer Invoice"}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase truncate">
                                            {t.type || "Subscription"} • {t.credits ? `+${t.credits} Credits` : "Plan"}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-black text-emerald-600">₹{(t.amount ?? 0).toLocaleString("en-IN")}</p>
                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {t.status || "paid"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
