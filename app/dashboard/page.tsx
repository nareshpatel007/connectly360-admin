"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Building2,
    IndianRupee,
    MessageCircle,
    ArrowUpRight,
    TrendingUp,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface DashboardMetrics {
    users?: { total?: number; active?: number; suspended?: number };
    workspaces?: { total?: number; active?: number; suspended?: number };
    revenue?: { total?: number };
    whatsapp?: { connected_accounts?: number; total_accounts?: number; total_messages?: number };
    recent_users?: Array<{ id: number; name: string; email: string; status?: string }>;
    recent_transactions?: Array<{ id: number; user_name?: string; user_email?: string; credits?: number; amount?: number; status?: string }>;
}

export default function AdminDashboardPage() {
    const { token } = useAuth();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMetrics = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/dashboard", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setMetrics(data.data);
            }
        } catch (err) {
            console.error("Failed to load dashboard metrics", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return (
        <div className="space-y-6 font-sans">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Platform Overview <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20">Live Metrics</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Realtime system health, user counts, revenue, and infrastructure logs.</p>
                </div>
                <Button
                    onClick={fetchMetrics}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Refresh Overview</span>
                </Button>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Users Stat Card */}
                <Card className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Platform Users</span>
                        <div className="h-9 w-9 rounded-xl bg-[#35877D]/10 border border-[#35877D]/20 text-[#35877D] flex items-center justify-center">
                            <Users size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-900">{metrics?.users?.total ?? 0}</div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-1">
                            <span className="text-emerald-600 font-bold">{metrics?.users?.active ?? 0} Active</span>
                            <span>•</span>
                            <span className="text-rose-600 font-bold">{metrics?.users?.suspended ?? 0} Suspended</span>
                        </div>
                    </div>
                </Card>

                {/* Workspaces Stat Card */}
                <Card className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Workspaces</span>
                        <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                            <Building2 size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-900">{metrics?.workspaces?.total ?? 0}</div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-1">
                            <span className="text-blue-600 font-bold">{metrics?.workspaces?.active ?? 0} Active</span>
                            <span>•</span>
                            <span className="text-slate-400 font-bold">{metrics?.workspaces?.suspended ?? 0} Offline</span>
                        </div>
                    </div>
                </Card>

                {/* Revenue Stat Card */}
                <Card className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Revenue</span>
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                            <IndianRupee size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-900">
                            ₹{(metrics?.revenue?.total ?? 0).toLocaleString("en-IN")}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 mt-1">
                            <TrendingUp size={12} />
                            <span>Subscriptions &amp; Credits</span>
                        </div>
                    </div>
                </Card>

                {/* WhatsApp Stat Card */}
                <Card className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp WABA Accounts</span>
                        <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                            <MessageCircle size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-900">{metrics?.whatsapp?.connected_accounts ?? 0} / {metrics?.whatsapp?.total_accounts ?? 0}</div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-700 mt-1">
                            <span>{metrics?.whatsapp?.total_messages ?? 0} Messages Sent</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* RECENT REGISTRATIONS & RECENT TRANSACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users Card */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-slate-900">Recent User Registrations</h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-[#35877D] hover:bg-[#35877D]/10">
                            <Link href="/users">View All Users <ArrowUpRight size={14} /></Link>
                        </Button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {metrics?.recent_users?.length === 0 ? (
                            <p className="py-6 text-center text-xs text-slate-400 font-medium">No users registered yet.</p>
                        ) : (
                            metrics?.recent_users?.map((u) => (
                                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-bold text-slate-900">{u.name}</p>
                                        <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.status === "suspended" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                                        {u.status || "active"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Recent Credit Transactions */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-slate-900">Recent Sales &amp; Top-Ups</h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-[#35877D] hover:bg-[#35877D]/10">
                            <Link href="/billing">View Billing Log <ArrowUpRight size={14} /></Link>
                        </Button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {metrics?.recent_transactions?.length === 0 ? (
                            <p className="py-6 text-center text-xs text-slate-400 font-medium">No transactions recorded yet.</p>
                        ) : (
                            metrics?.recent_transactions?.map((t) => (
                                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-bold text-slate-900">{t.user_name || t.user_email}</p>
                                        <p className="text-[11px] text-slate-500 font-medium">Credits: +{t.credits}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-emerald-600">₹{t.amount}</p>
                                        <p className="text-[10px] text-slate-400 font-medium capitalize">{t.status}</p>
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
