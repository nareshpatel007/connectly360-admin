"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Building2,
    IndianRupee,
    Coins,
    MessageCircle,
    ArrowUpRight,
    ShieldAlert,
    TrendingUp,
    RefreshCw,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    const { token } = useAuth();
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchMetrics = async () => {
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
    };

    useEffect(() => {
        fetchMetrics();
    }, [token]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                        Platform Overview <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#35877D]/20 text-[#35877D] border border-[#35877D]/30">Live Metrics</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Realtime system health, user counts, revenue, and infrastructure logs.</p>
                </div>
                <Button
                    onClick={fetchMetrics}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Refresh Overview</span>
                </Button>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Users Stat Card */}
                <Card className="p-5 bg-slate-950 border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Platform Users</span>
                        <div className="h-9 w-9 rounded-xl bg-[#35877D]/10 border border-[#35877D]/20 text-[#35877D] flex items-center justify-center">
                            <Users size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-100">{metrics?.users?.total ?? 0}</div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mt-1">
                            <span className="text-emerald-400 font-bold">{metrics?.users?.active ?? 0} Active</span>
                            <span>•</span>
                            <span className="text-rose-400 font-bold">{metrics?.users?.suspended ?? 0} Suspended</span>
                        </div>
                    </div>
                </Card>

                {/* Workspaces Stat Card */}
                <Card className="p-5 bg-slate-950 border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Workspaces</span>
                        <div className="h-9 w-9 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center">
                            <Building2 size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-100">{metrics?.workspaces?.total ?? 0}</div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mt-1">
                            <span className="text-blue-400 font-bold">{metrics?.workspaces?.active ?? 0} Active</span>
                            <span>•</span>
                            <span className="text-slate-500 font-bold">{metrics?.workspaces?.suspended ?? 0} Offline</span>
                        </div>
                    </div>
                </Card>

                {/* Revenue Stat Card */}
                <Card className="p-5 bg-slate-950 border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</span>
                        <div className="h-9 w-9 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
                            <IndianRupee size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-100">
                            ₹{(metrics?.revenue?.total ?? 0).toLocaleString("en-IN")}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mt-1">
                            <TrendingUp size={12} />
                            <span>Subscriptions &amp; Credits</span>
                        </div>
                    </div>
                </Card>

                {/* WhatsApp Stat Card */}
                <Card className="p-5 bg-slate-950 border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp WABA Accounts</span>
                        <div className="h-9 w-9 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center">
                            <MessageCircle size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold text-slate-100">{metrics?.whatsapp?.connected_accounts ?? 0} / {metrics?.whatsapp?.total_accounts ?? 0}</div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-300 mt-1">
                            <span>{metrics?.whatsapp?.total_messages ?? 0} Messages Sent</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* RECENT REGISTRATIONS & RECENT TRANSACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users Card */}
                <Card className="p-6 bg-slate-950 border-slate-800 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-100">Recent User Registrations</h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-[#35877D] hover:bg-[#35877D]/10">
                            <Link href="/users">View All Users <ArrowUpRight size={14} /></Link>
                        </Button>
                    </div>

                    <div className="divide-y divide-slate-800/80">
                        {metrics?.recent_users?.length === 0 ? (
                            <p className="py-6 text-center text-xs text-slate-500">No users registered yet.</p>
                        ) : (
                            metrics?.recent_users?.map((u: any) => (
                                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-bold text-slate-200">{u.name}</p>
                                        <p className="text-[11px] text-slate-500">{u.email}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === "suspended" ? "bg-rose-950 text-rose-400" : "bg-emerald-950 text-emerald-400"}`}>
                                        {u.status || "active"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Recent Credit Transactions */}
                <Card className="p-6 bg-slate-950 border-slate-800 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-100">Recent Sales &amp; Top-Ups</h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-[#35877D] hover:bg-[#35877D]/10">
                            <Link href="/billing">View Billing Log <ArrowUpRight size={14} /></Link>
                        </Button>
                    </div>

                    <div className="divide-y divide-slate-800/80">
                        {metrics?.recent_transactions?.length === 0 ? (
                            <p className="py-6 text-center text-xs text-slate-500">No transactions recorded yet.</p>
                        ) : (
                            metrics?.recent_transactions?.map((t: any) => (
                                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-bold text-slate-200">{t.user_name || t.user_email}</p>
                                        <p className="text-[11px] text-slate-500">Credits: +{t.credits}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-400">₹{t.amount}</p>
                                        <p className="text-[10px] text-slate-500">{t.status}</p>
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
