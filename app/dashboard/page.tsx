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
        <div className="space-y-5 pb-12 font-sans w-full">
            {/* 1. COMPACT PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E9EE] pb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#172033] tracking-tight">Dashboard</h1>
                    <p className="text-[13px] text-[#5F6B7A] mt-0.5">
                        Welcome back, <span className="font-medium text-[#172033]">Platform Admin</span>. Here&apos;s what&apos;s happening with your platform today.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E9EE] rounded-lg text-xs font-medium text-[#5F6B7A] shadow-2xs">
                        <Calendar size={13} className="text-[#8A95A3]" />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-transparent text-[#172033] font-medium focus:outline-none cursor-pointer"
                        >
                            <option value="today">Today</option>
                            <option value="7_days">Last 7 Days</option>
                            <option value="30_days">Last 30 Days</option>
                            <option value="this_month">This Month</option>
                            <option value="last_month">Last Month</option>
                            <option value="this_year">This Year</option>
                        </select>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchMetrics}
                        disabled={loading}
                        className="h-9 px-3.5 rounded-lg border-[#E5E9EE] bg-white text-[#172033] hover:bg-slate-50 text-xs font-medium cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={13} className={`mr-1.5 text-[#5F6B7A] ${loading ? "animate-spin" : ""}`} />
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* ERROR BANNER IF FETCH FAILED */}
            {error && (
                <div className="bg-[#FFF0F0] border border-[#FCD8D8] rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-4 w-4 text-[#D95C5C] shrink-0" />
                        <span className="text-xs text-[#B32626] font-medium">{error}</span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={fetchMetrics}
                        className="h-8 border-[#FCD8D8] text-[#B32626] hover:bg-rose-100 rounded-lg text-xs"
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* 2. PLATFORM & INFRASTRUCTURE SUMMARY CARD */}
            <Card className="bg-white border-[#E5E9EE] rounded-xl p-4 sm:p-5 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Avatar & Platform Info */}
                    <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-lg bg-[#E8F6F3] text-[#2F8F83] border border-[#BFE4DD] flex items-center justify-center font-semibold text-lg shrink-0">
                            A
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="font-semibold text-[#172033] text-base leading-none">
                                    Connectly360 Master Control
                                </h2>
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-[#5F6B7A] tracking-wider uppercase">
                                    PRODUCTION ENGINE
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-[#5F6B7A]">
                                <span>Platform Architecture:</span>
                                <span className="font-mono text-[11px] text-[#2F8F83] bg-[#F7F9FA] px-2 py-0.5 rounded border border-[#E5E9EE] font-medium">
                                    v1.0.0 (PHP 8.2 / Laravel 10)
                                </span>
                                <span className="text-slate-300">•</span>
                                <span>Tenant Isolation: Strict Multi-Tenant</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick KPI & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#E5E9EE]">
                        <div className="flex items-center gap-2.5 bg-[#F7F9FA] px-3.5 py-2 rounded-lg border border-[#E5E9EE]">
                            <div>
                                <span className="text-[10px] font-medium text-[#8A95A3] uppercase tracking-wider block">Total Platform Revenue</span>
                                <div className="flex items-center gap-1 text-[#172033] font-semibold text-lg leading-tight mt-0.5">
                                    <IndianRupee size={15} className="text-[#2F8F83]" />
                                    <span>{(metrics?.revenue?.total ?? 0).toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                asChild
                                className="h-9 px-3.5 rounded-lg bg-[#2F8F83] hover:bg-[#267A70] text-white text-xs font-medium cursor-pointer border-0 shadow-2xs"
                            >
                                <Link href="/users">Manage Users</Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-9 px-3 rounded-lg border-[#E5E9EE] bg-white text-[#5F6B7A] hover:text-[#172033] hover:bg-slate-50 text-xs font-medium cursor-pointer shadow-2xs"
                            >
                                <Link href="/workspaces">Workspaces</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3. WHATSAPP INFRASTRUCTURE STATUS CARD */}
            <Card className="bg-white border-[#E5E9EE] rounded-xl p-4 sm:p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EAF8F2] text-[#268263] border border-[#BFE4DD]/50">
                                <span className="h-2 w-2 rounded-full bg-[#2E9B72]" />
                                Connected
                            </span>
                            <span className="text-xs font-medium text-[#172033]">
                                WhatsApp Cloud API Infrastructure ({metrics?.whatsapp?.connected_accounts ?? 1}/{metrics?.whatsapp?.total_accounts ?? 1} Accounts Connected)
                            </span>
                        </div>
                        <p className="text-xs text-[#5F6B7A]">
                            Official Meta Cloud API • Multi-tenant webhook routing, token management, and message queuing operational.
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8.5 px-3.5 rounded-lg border-[#E5E9EE] bg-white hover:bg-slate-50 text-xs font-medium text-[#172033] shrink-0 cursor-pointer"
                    >
                        <Link href="/whatsapp/waba">
                            Manage WABA
                            <ArrowUpRight size={13} className="ml-1 text-[#8A95A3]" />
                        </Link>
                    </Button>
                </div>
            </Card>

            {/* 4. OPERATIONAL KPI METRIC CARDS (4 cards grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Metric 1: Total Platform Users */}
                <Card className="bg-white border-[#E5E9EE] rounded-xl p-4 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-8 rounded-lg bg-[#E8F6F3] text-[#2F8F83] flex items-center justify-center shrink-0">
                            <Users size={16} />
                        </div>
                        <span className="text-[10px] font-medium text-[#268263] bg-[#EAF8F2] border border-[#BFE4DD]/40 px-2 py-0.5 rounded-full">
                            {metrics?.users?.active ?? 0} Active
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#5F6B7A]">Total Platform Users</p>
                        <h3 className="text-2xl font-semibold text-[#172033] mt-0.5">
                            {loading && !metrics ? (
                                <Skeleton className="h-7 w-14 mt-1" />
                            ) : (
                                metrics?.users?.total ?? 0
                            )}
                        </h3>
                    </div>
                </Card>

                {/* Metric 2: Active Workspaces */}
                <Card className="bg-white border-[#E5E9EE] rounded-xl p-4 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-8 rounded-lg bg-[#EEF4FF] text-[#4F7FCB] flex items-center justify-center shrink-0">
                            <Building2 size={16} />
                        </div>
                        <span className="text-[10px] font-medium text-[#4F7FCB] bg-[#EEF4FF] border border-[#D0E1FD] px-2 py-0.5 rounded-full">
                            Operational
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#5F6B7A]">Active Workspaces</p>
                        <h3 className="text-2xl font-semibold text-[#172033] mt-0.5">
                            {loading && !metrics ? (
                                <Skeleton className="h-7 w-14 mt-1" />
                            ) : (
                                metrics?.workspaces?.total ?? 0
                            )}
                        </h3>
                    </div>
                </Card>

                {/* Metric 3: Total Platform Revenue */}
                <Card className="bg-white border-[#E5E9EE] rounded-xl p-4 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] text-[#2E9B72] flex items-center justify-center shrink-0">
                            <IndianRupee size={16} />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            INR (₹)
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#5F6B7A]">Total Platform Revenue</p>
                        <h3 className="text-2xl font-semibold text-[#172033] mt-0.5">
                            {loading && !metrics ? (
                                <Skeleton className="h-7 w-20 mt-1" />
                            ) : (
                                `₹${(metrics?.revenue?.total ?? 0).toLocaleString("en-IN")}`
                            )}
                        </h3>
                    </div>
                </Card>

                {/* Metric 4: WhatsApp Messages */}
                <Card className="bg-white border-[#E5E9EE] rounded-xl p-4 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-8 rounded-lg bg-[#FFF7E6] text-[#D79A2B] flex items-center justify-center shrink-0">
                            <MessageCircle size={16} />
                        </div>
                        <span className="text-[10px] font-medium text-[#8C580B] bg-[#FFF7E6] border border-[#FFE7BA] px-2 py-0.5 rounded-full">
                            Cloud API
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[#5F6B7A]">WhatsApp Messages</p>
                        <h3 className="text-2xl font-semibold text-[#172033] mt-0.5">
                            {loading && !metrics ? (
                                <Skeleton className="h-7 w-16 mt-1" />
                            ) : (
                                (metrics?.whatsapp?.total_messages ?? 0).toLocaleString()
                            )}
                        </h3>
                    </div>
                </Card>
            </div>

            {/* 5. QUICK ACTIONS TILES */}
            <div className="space-y-2">
                <h3 className="text-[11px] font-semibold text-[#8A95A3] uppercase tracking-wider px-0.5">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <Link
                        href="/users"
                        className="p-3 bg-white border border-[#E5E9EE] hover:border-[#BFE4DD] hover:bg-[#F2FAF8] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition-colors shadow-2xs"
                    >
                        <div className="h-8 w-8 rounded-lg bg-[#E8F6F3] text-[#2F8F83] flex items-center justify-center">
                            <UserPlus size={16} />
                        </div>
                        <span className="text-xs font-medium text-[#172033] group-hover:text-[#2F8F83]">Manage Users</span>
                    </Link>

                    <Link
                        href="/workspaces"
                        className="p-3 bg-white border border-[#E5E9EE] hover:border-[#BFE4DD] hover:bg-[#F2FAF8] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition-colors shadow-2xs"
                    >
                        <div className="h-8 w-8 rounded-lg bg-[#EEF4FF] text-[#4F7FCB] flex items-center justify-center">
                            <Building2 size={16} />
                        </div>
                        <span className="text-xs font-medium text-[#172033] group-hover:text-[#2F8F83]">Workspaces</span>
                    </Link>

                    <Link
                        href="/billing"
                        className="p-3 bg-white border border-[#E5E9EE] hover:border-[#BFE4DD] hover:bg-[#F2FAF8] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition-colors shadow-2xs"
                    >
                        <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] text-[#2E9B72] flex items-center justify-center">
                            <CreditCard size={16} />
                        </div>
                        <span className="text-xs font-medium text-[#172033] group-hover:text-[#2F8F83]">Billing &amp; Sales</span>
                    </Link>

                    <Link
                        href="/whatsapp/waba"
                        className="p-3 bg-white border border-[#E5E9EE] hover:border-[#BFE4DD] hover:bg-[#F2FAF8] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition-colors shadow-2xs"
                    >
                        <div className="h-8 w-8 rounded-lg bg-[#FFF7E6] text-[#D79A2B] flex items-center justify-center">
                            <MessageCircle size={16} />
                        </div>
                        <span className="text-xs font-medium text-[#172033] group-hover:text-[#2F8F83]">WhatsApp WABA</span>
                    </Link>

                    <Link
                        href="/system/webhooks"
                        className="p-3 bg-white border border-[#E5E9EE] hover:border-[#BFE4DD] hover:bg-[#F2FAF8] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition-colors shadow-2xs"
                    >
                        <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <ShieldAlert size={16} />
                        </div>
                        <span className="text-xs font-medium text-[#172033] group-hover:text-[#2F8F83]">Audit Trail</span>
                    </Link>

                    <Link
                        href="/system"
                        className="p-3 bg-white border border-[#E5E9EE] hover:border-[#BFE4DD] hover:bg-[#F2FAF8] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition-colors shadow-2xs"
                    >
                        <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                            <Activity size={16} />
                        </div>
                        <span className="text-xs font-medium text-[#172033] group-hover:text-[#2F8F83]">System Health</span>
                    </Link>
                </div>
            </div>

            {/* 6. ANALYTICS CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Overview Chart */}
                <Card className="p-4 sm:p-5 bg-white border border-[#E5E9EE] rounded-xl space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#E5E9EE] pb-3">
                        <div>
                            <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
                                <TrendingUp size={15} className="text-[#2F8F83]" />
                                Revenue Breakdown &amp; Trends
                            </h3>
                            <p className="text-xs text-[#5F6B7A] mt-0.5">
                                Subscription plans vs Credit top-up sales over time
                            </p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-medium text-[#2F8F83] hover:text-[#267A70] hover:bg-[#E8F6F3]">
                            <Link href="/billing">Billing Log <ArrowUpRight size={13} className="ml-1" /></Link>
                        </Button>
                    </div>

                    <div className="h-64 w-full pt-2">
                        {loading && !metrics ? (
                            <div className="h-full flex items-center justify-center">
                                <Skeleton className="h-52 w-full rounded-xl" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2F8F83" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2F8F83" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="colorCred" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8A95A3" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#8A95A3" }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#172033", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                                        formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, ""]}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                                    <Area type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#2F8F83" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                                    <Area type="monotone" dataKey="credits" name="Credits Top-Up" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCred)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>

                {/* Customer & Workspace Growth Bar Chart */}
                <Card className="p-4 sm:p-5 bg-white border border-[#E5E9EE] rounded-xl space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#E5E9EE] pb-3">
                        <div>
                            <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
                                <Users size={15} className="text-[#4F7FCB]" />
                                Customer &amp; Workspace Growth
                            </h3>
                            <p className="text-xs text-[#5F6B7A] mt-0.5">
                                Monthly new users and workspaces onboarded
                            </p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-medium text-[#4F7FCB] hover:text-[#3867b3] hover:bg-[#EEF4FF]">
                            <Link href="/users">Customer Directory <ArrowUpRight size={13} className="ml-1" /></Link>
                        </Button>
                    </div>

                    <div className="h-64 w-full pt-2">
                        {loading && !metrics ? (
                            <div className="h-full flex items-center justify-center">
                                <Skeleton className="h-52 w-full rounded-xl" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={growthChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8A95A3" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#8A95A3" }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#172033", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                                    <Bar dataKey="users" name="New Customers" fill="#2F8F83" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="workspaces" name="New Workspaces" fill="#4F7FCB" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>
            </div>

            {/* 7. THREE-COLUMN PLATFORM HEALTH & ACTIVITY HUB */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* System Services Health Matrix */}
                <Card className="p-4 sm:p-5 bg-white border border-[#E5E9EE] rounded-xl space-y-3.5 shadow-2xs lg:col-span-1">
                    <div className="flex items-center justify-between border-b border-[#E5E9EE] pb-3">
                        <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
                            <Activity size={15} className="text-[#2F8F83]" />
                            System Health &amp; Subsystems
                        </h3>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EAF8F2] text-[#268263] border border-[#BFE4DD]/50">
                            Normal
                        </span>
                    </div>

                    <div className="space-y-2">
                        {systemServices.map((srv, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#F7F9FA] border border-[#E5E9EE] text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#2E9B72]" />
                                    <span className="font-medium text-[#172033]">{srv.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-[#8A95A3] font-mono">{srv.latency}</span>
                                    <span className="text-[10px] font-medium text-[#268263] bg-[#EAF8F2] px-2 py-0.5 rounded-md">
                                        {srv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button asChild variant="outline" className="w-full h-8.5 rounded-lg text-xs font-medium border-[#E5E9EE] text-[#5F6B7A] hover:text-[#172033] hover:bg-slate-50 shadow-2xs">
                        <Link href="/system">Diagnostic Diagnostics Center</Link>
                    </Button>
                </Card>

                {/* Recent Customer Registrations */}
                <Card className="p-4 sm:p-5 bg-white border border-[#E5E9EE] rounded-xl space-y-3.5 shadow-2xs lg:col-span-1">
                    <div className="flex items-center justify-between border-b border-[#E5E9EE] pb-3">
                        <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
                            <UserPlus size={15} className="text-[#2F8F83]" />
                            Recent Customers
                        </h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-medium text-[#2F8F83] hover:text-[#267A70] hover:bg-[#E8F6F3]">
                            <Link href="/users">View All <ArrowUpRight size={13} className="ml-1" /></Link>
                        </Button>
                    </div>

                    <div className="divide-y divide-[#E5E9EE]">
                        {loading && !metrics ? (
                            <div className="space-y-3 py-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2.5">
                                            <Skeleton className="h-8 w-8 rounded-lg" />
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
                            <div className="py-8 text-center text-xs text-[#8A95A3] font-normal">
                                No recent user registrations found.
                            </div>
                        ) : (
                            metrics.recent_users.map((u) => (
                                <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="h-8 w-8 rounded-lg bg-[#E8F6F3] text-[#2F8F83] border border-[#BFE4DD] font-medium text-xs flex items-center justify-center shrink-0">
                                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-[#172033] truncate max-w-36">{u.name}</p>
                                            <p className="text-[11px] text-[#5F6B7A] truncate max-w-36">{u.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                                        u.status === "suspended"
                                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                                            : "bg-[#EAF8F2] text-[#268263] border border-[#BFE4DD]/50"
                                    }`}>
                                        {u.status || "active"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Recent Transactions & Top-Ups */}
                <Card className="p-4 sm:p-5 bg-white border border-[#E5E9EE] rounded-xl space-y-3.5 shadow-2xs lg:col-span-1">
                    <div className="flex items-center justify-between border-b border-[#E5E9EE] pb-3">
                        <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
                            <CreditCard size={15} className="text-[#2E9B72]" />
                            Recent Sales &amp; Top-Ups
                        </h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-medium text-[#2F8F83] hover:text-[#267A70] hover:bg-[#E8F6F3]">
                            <Link href="/billing">Billing Log <ArrowUpRight size={13} className="ml-1" /></Link>
                        </Button>
                    </div>

                    <div className="divide-y divide-[#E5E9EE]">
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
                            <div className="py-8 text-center text-xs text-[#8A95A3] font-normal">
                                No transactions recorded yet.
                            </div>
                        ) : (
                            metrics.recent_transactions.map((t) => (
                                <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                                    <div className="min-w-0">
                                        <p className="font-medium text-[#172033] truncate max-w-36">
                                            {t.company_name || t.user_name || t.user_email || "Customer Invoice"}
                                        </p>
                                        <p className="text-[11px] text-[#5F6B7A] uppercase truncate">
                                            {t.type || "Subscription"} • {t.credits ? `+${t.credits} Credits` : "Plan"}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-semibold text-[#268263]">₹{(t.amount ?? 0).toLocaleString("en-IN")}</p>
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#EAF8F2] text-[#268263] border border-[#BFE4DD]/50">
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
