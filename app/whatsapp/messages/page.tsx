"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    MessageSquare,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    RefreshCw,
    Send,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ArrowDownLeft,
    ArrowUpRight
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface MessageLog {
    id: number;
    tenant_id: number;
    workspace_name: string | null;
    wamid: string | null;
    direction: string;
    source: string | null;
    type: string | null;
    status: string;
    credits_consumed: number | null;
    failure_code: string | null;
    failure_reason: string | null;
    sent_at: string | null;
    delivered_at: string | null;
    read_at: string | null;
    failed_at: string | null;
    created_at: string;
}

interface MessageMetrics {
    volume_24h: number;
    delivery_rate: number;
    avg_latency_ms: number;
    failed_24h: number;
}

export default function AdminMessageMonitorPage() {
    const { token } = useAuth();
    const [messages, setMessages] = useState<MessageLog[]>([]);
    const [metrics, setMetrics] = useState<MessageMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters and pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [directionFilter, setDirectionFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const getAuthToken = () =>
        token || (typeof window !== "undefined" ? localStorage.getItem("admin_auth_token") : null) || "";

    const fetchMessages = useCallback(async (page = 1) => {
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
            if (directionFilter !== "all") params.set("direction", directionFilter);

            const res = await fetch(`/api/admin/whatsapp/logs?${params.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "X-Api-Token": authToken,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to load messages (HTTP ${res.status})`);
            }

            const json = await res.json();
            if (json.status) {
                const paginated = json.data;
                setMessages(Array.isArray(paginated.data) ? paginated.data : []);
                setCurrentPage(paginated.current_page || 1);
                setLastPage(paginated.last_page || 1);
                setTotalRecords(paginated.total || 0);

                if (json.metrics) {
                    setMetrics(json.metrics);
                }
            } else {
                throw new Error(json.message || "Failed to load messages");
            }
        } catch (err: any) {
            console.error("WhatsApp logs load error:", err);
            setError(err.message || "Unable to reach WhatsApp telemetry service");
            toast.error("Failed to load WhatsApp message telemetry");
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, [token, searchQuery, statusFilter, directionFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMessages(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, statusFilter, directionFilter]);

    const formatTimestamp = (ts: string | null) => {
        if (!ts) return "—";
        try {
            const date = new Date(ts);
            return date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return ts;
        }
    };

    const renderStatusBadge = (status: string, reason?: string | null) => {
        const normalized = (status || "").toLowerCase();
        switch (normalized) {
            case "delivered":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Delivered
                    </span>
                );
            case "read":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Read
                    </span>
                );
            case "sent":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 inline-flex items-center gap-1">
                        <Clock size={10} />
                        Sent
                    </span>
                );
            case "received":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 inline-flex items-center gap-1">
                        <ArrowDownLeft size={10} />
                        Received
                    </span>
                );
            case "failed":
                return (
                    <span
                        title={reason || "Message transmission failed"}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1 cursor-help"
                    >
                        <XCircle size={10} />
                        Failed
                    </span>
                );
            case "queued":
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                        <Clock size={10} />
                        Queued
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200 capitalize">
                        {status || "Unknown"}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={MessageSquare}
                title="WhatsApp Message Telemetry & Delivery Logs"
                description="Platform-wide message queue status, delivery receipts, and credit consumption tracking."
                breadcrumbs={[
                    { label: "WhatsApp", href: "/whatsapp" },
                    { label: "Message Monitor" }
                ]}
                actions={
                    <Button
                        onClick={() => fetchMessages(currentPage)}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                        className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer hover:bg-slate-50"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh Live Feed
                    </Button>
                }
            />

            {/* Aggregate Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <StatCard
                    title="24H Message Volume"
                    value={metrics ? metrics.volume_24h.toLocaleString() : (loading ? "..." : "0")}
                    icon={Send}
                    change="24h Window"
                    changeType="neutral"
                    subtitle="Platform inbound & outbound"
                />
                <StatCard
                    title="Meta Delivery Rate"
                    value={metrics ? `${metrics.delivery_rate}%` : (loading ? "..." : "0%")}
                    icon={CheckCircle2}
                    change={metrics && metrics.delivery_rate >= 95 ? "Optimal" : "Attention"}
                    changeType={metrics && metrics.delivery_rate >= 95 ? "positive" : "neutral"}
                    subtitle="Delivered & Read of Outbound"
                />
                <StatCard
                    title="Average Delivery Latency"
                    value={metrics && metrics.avg_latency_ms > 0 ? `${metrics.avg_latency_ms} ms` : (loading ? "..." : "N/A")}
                    icon={Clock}
                    change="Webhook telemetry"
                    changeType="neutral"
                    subtitle="Meta Cloud API roundtrip"
                />
                <StatCard
                    title="Failed Messages (24H)"
                    value={metrics ? metrics.failed_24h.toLocaleString() : (loading ? "..." : "0")}
                    icon={XCircle}
                    change={metrics && metrics.failed_24h > 0 ? "Requires Review" : "Zero Failures"}
                    changeType={metrics && metrics.failed_24h > 0 ? "negative" : "positive"}
                    subtitle="Failed deliveries in last 24h"
                />
            </div>

            {/* Table Card */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Recent WhatsApp Message Telemetry</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Live feed across all tenant WABA phone numbers ({totalRecords} total records)</CardDescription>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                            <Input
                                placeholder="Filter by WAMID, workspace, type..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 pl-9 text-xs rounded-xl border-slate-200"
                            />
                        </div>

                        {/* Status Filters */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                            {["all", "delivered", "read", "sent", "failed", "received"].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                                        statusFilter === st ? "bg-white text-slate-900 font-bold shadow-2xs" : "hover:text-slate-900"
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Message ID (WAMID)</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workspace</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Type & Direction</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Credits</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Delivery Status</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-12 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw size={16} className="animate-spin text-[#35877D]" />
                                            <span>Loading real WhatsApp message telemetry...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-10 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-rose-600">
                                            <AlertCircle size={20} />
                                            <span className="font-semibold text-xs">{error}</span>
                                            <Button
                                                onClick={() => fetchMessages(currentPage)}
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 h-8 text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                                            >
                                                Retry
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : messages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-12 text-center text-slate-400">
                                        No WhatsApp message telemetry found matching your filter criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                messages.map((msg) => (
                                    <TableRow key={msg.id} className="hover:bg-slate-50/60 transition-colors">
                                        <TableCell className="font-mono text-[11px] text-slate-600 py-3.5 truncate max-w-xs">
                                            {msg.wamid || `msg_local_${msg.id}`}
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900">
                                            {msg.workspace_name || `Workspace #${msg.tenant_id}`}
                                        </TableCell>
                                        <TableCell className="text-slate-700">
                                            <div className="flex items-center gap-1 font-semibold">
                                                {msg.direction === "inbound" ? (
                                                    <ArrowDownLeft size={12} className="text-teal-600" />
                                                ) : (
                                                    <ArrowUpRight size={12} className="text-sky-600" />
                                                )}
                                                <span className="capitalize">{msg.direction}</span>
                                                <span className="text-slate-400">({msg.type || msg.source || "text"})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-600">
                                            {msg.credits_consumed ? `${msg.credits_consumed} Credits` : "0 Credits"}
                                        </TableCell>
                                        <TableCell>
                                            {renderStatusBadge(msg.status, msg.failure_reason)}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-right">
                                            {formatTimestamp(msg.created_at || msg.sent_at)}
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
                                    onClick={() => fetchMessages(currentPage - 1)}
                                    disabled={currentPage <= 1 || loading}
                                    className="h-8 px-2.5 rounded-lg border-slate-200 text-xs"
                                >
                                    <ChevronLeft size={14} />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchMessages(currentPage + 1)}
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
