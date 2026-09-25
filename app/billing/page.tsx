"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    CheckCircle2,
    CreditCard,
    RotateCcw,
    AlertTriangle,
    Shield,
    PauseCircle,
    PlayCircle,
    XCircle,
    Eye
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";

interface BillingTransaction {
    id: number;
    workspace_id?: number;
    workspace?: { company_name?: string };
    user?: { name?: string; email?: string };
    user_name?: string;
    user_email?: string;
    company_name?: string;
    amount?: number;
    credits?: number;
    mode?: string;
    transaction_type?: string;
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    status?: string;
    created_at: string;
}

interface PaginationMeta {
    current_page: number;
    total: number;
    last_page: number;
}

export default function AdminBillingPage() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<"transactions" | "recurring">("transactions");
    const [transactions, setTransactions] = useState<BillingTransaction[]>([]);
    const [recurringList, setRecurringList] = useState<any[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, total: 0, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Refund Modal State
    const [selectedTx, setSelectedTx] = useState<BillingTransaction | null>(null);
    const [refundAmount, setRefundAmount] = useState("");
    const [refundReason, setRefundReason] = useState("");
    const [refunding, setRefunding] = useState(false);

    const [autoStats, setAutoStats] = useState<{ active: number; pending: number; failed: number; paused: number; today_revenue: number } | null>(null);

    const fetchTransactions = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                per_page: "15",
                ...(search && { search }),
            });

            const endpoint = activeTab === "transactions" 
                ? `/api/admin/payment-transactions?${queryParams.toString()}`
                : `/api/admin/auto-recharges`;

            const res = await fetch(endpoint, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                if (activeTab === "transactions") {
                    setTransactions(data.data?.data || data.data || []);
                    setMeta({
                        current_page: data.data?.current_page || 1,
                        total: data.data?.total || 0,
                        last_page: data.data?.last_page || 1
                    });
                } else {
                    const list = data.data?.auto_recharges || data.data?.data || [];
                    setRecurringList(list);
                    setAutoStats(data.data?.summary || null);
                    setMeta({
                        current_page: 1,
                        total: list.length,
                        last_page: 1
                    });
                }
            }
        } catch {
            toast.error("Failed to load billing records.");
        } finally {
            setLoading(false);
        }
    }, [token, page, search, activeTab]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleRefundSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTx) return;
        setRefunding(true);
        try {
            const res = await fetch(`/api/admin/payment-transactions/${selectedTx.id}/refund`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(refundAmount || selectedTx.amount?.toString() || "0"),
                    reason: refundReason
                })
            });
            const json = await res.json();
            if (json.status) {
                toast.success(json.message || "Refund processed successfully.");
                setSelectedTx(null);
                fetchTransactions();
            } else {
                toast.error(json.message || "Refund failed");
            }
        } catch (err: any) {
            toast.error("Error processing refund: " + err.message);
        } finally {
            setRefunding(false);
        }
    };

    const handleAutoRechargeAction = async (id: number, action: "pause" | "resume" | "disable" | "retry") => {
        try {
            const res = await fetch(`/api/admin/auto-recharges/${id}/${action}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const json = await res.json();
            if (json.status) {
                toast.success(json.message || `Auto recharge ${action} execution completed.`);
                fetchTransactions();
            } else {
                toast.error(json.message || "Action failed");
            }
        } catch (err: any) {
            toast.error("Error executing action: " + err.message);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <AdminPageHeader
                title="Payment Transactions &amp; Recurring Billing"
                description="Razorpay transaction history, refund processing, recurring payment mandates, and workspace credit top-ups."
                breadcrumbs={[{ label: "Billing Management" }]}
                badge={`${meta.total} Records`}
                actions={
                    <Button
                        onClick={fetchTransactions}
                        variant="outline"
                        size="sm"
                        className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Reload Records</span>
                    </Button>
                }
            />

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                    onClick={() => { setActiveTab("transactions"); setPage(1); }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                        activeTab === "transactions" ? "bg-[#35877D] text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    Payment Transactions ({activeTab === "transactions" ? meta.total : "All"})
                </button>
                <button
                    onClick={() => { setActiveTab("recurring"); setPage(1); }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                        activeTab === "recurring" ? "bg-[#35877D] text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    Recurring Payments / Auto Recharges
                </button>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchTransactions(); }} className="flex items-center gap-2 w-full sm:w-96">
                    <div className="relative w-full">
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                        <Input
                            placeholder="Search by Payment ID, Order ID, workspace..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl text-xs font-medium focus-visible:ring-[#35877D]"
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-10 px-4 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold cursor-pointer border-0 shadow-2xs">
                        Search
                    </Button>
                </form>
            </Card>

            {/* Table */}
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                {activeTab === "transactions" ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4">Customer &amp; Workspace</th>
                                    <th className="p-4">Type &amp; Mode</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Razorpay Order / Payment ID</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                                            <div className="flex items-center justify-center gap-2">
                                                <RefreshCw size={16} className="animate-spin text-[#35877D]" />
                                                <span>Loading payment transactions...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                                            No payment transactions recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900">{t.user?.name || t.user_name || "Workspace Account"}</div>
                                                <div className="text-[11px] text-slate-500">{t.workspace?.company_name || t.company_name || "Workspace #" + t.workspace_id}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800 capitalize">{(t.transaction_type || "credit_purchase").replace(/_/g, " ")}</div>
                                                <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                                    t.mode === "live" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                                }`}>
                                                    {t.mode || "test"} mode
                                                </span>
                                            </td>
                                            <td className="p-4 font-extrabold text-emerald-600 text-sm">
                                                ₹{(t.amount ?? 0).toLocaleString("en-IN")}
                                            </td>
                                            <td className="p-4 font-mono text-[11px] text-slate-500 space-y-0.5">
                                                {t.razorpay_payment_id && <div>Pmt: {t.razorpay_payment_id}</div>}
                                                {t.razorpay_order_id && <div className="text-[10px] text-slate-400">Ord: {t.razorpay_order_id}</div>}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    t.status === "captured" || t.status === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                    t.status === "refunded" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                                                    t.status === "failed" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                                    "bg-amber-50 text-amber-700 border border-amber-200"
                                                }`}>
                                                    {t.status || "created"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {new Date(t.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                            </td>
                                            <td className="p-4 text-right">
                                                {(t.status === "captured" || t.status === "paid") && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => { setSelectedTx(t); setRefundAmount(t.amount?.toString() || ""); }}
                                                        className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 rounded-lg text-xs font-bold cursor-pointer"
                                                    >
                                                        <RotateCcw size={12} className="mr-1" /> Refund
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="space-y-4 p-4">
                        {autoStats && (
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-2">
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Active</p>
                                    <p className="text-xl font-black text-emerald-600">{autoStats.active}</p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Auth</p>
                                    <p className="text-xl font-black text-amber-600">{autoStats.pending}</p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Failed</p>
                                    <p className="text-xl font-black text-rose-600">{autoStats.failed}</p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Paused</p>
                                    <p className="text-xl font-black text-slate-600">{autoStats.paused}</p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Today's Revenue</p>
                                    <p className="text-xl font-black text-[#35877D]">₹{(autoStats.today_revenue || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="p-4">Workspace</th>
                                        <th className="p-4">Balance / Threshold</th>
                                        <th className="p-4">Recharge Amount</th>
                                        <th className="p-4">Payment Source</th>
                                        <th className="p-4">Today's Usage</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-500">Loading auto recharge configurations...</td>
                                        </tr>
                                    ) : recurringList.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-400">No workspace auto recharge configurations found.</td>
                                        </tr>
                                    ) : (
                                        recurringList.map((r) => (
                                            <tr key={r.id} className="hover:bg-slate-50/60">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{r.workspace_name || r.workspace?.company_name || "Workspace #" + r.workspace_id}</div>
                                                    <div className="text-[10px] text-slate-400">ID: #{r.workspace_id}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-extrabold text-slate-900">{r.current_balance ?? 0} Credits</div>
                                                    <div className="text-[10px] text-slate-400">Threshold: {r.threshold_credits}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-extrabold text-emerald-600">₹{r.recharge_amount}</div>
                                                    <div className="text-[10px] text-slate-400">+{r.recharge_credits} credits</div>
                                                </td>
                                                <td className="p-4 text-slate-700 font-semibold">
                                                    {r.payment_source_display || "UPI AutoPay"}
                                                </td>
                                                <td className="p-4 text-slate-600">
                                                    {r.recharges_today ?? 0} / {r.max_recharges_per_day ?? 3}
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={`uppercase text-[10px] font-bold ${
                                                        r.status === "ACTIVE" || r.status === "AUTHORIZED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                        r.status === "PAYMENT_FAILED" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                                        r.status === "PAUSED" ? "bg-slate-100 text-slate-700 border border-slate-200" :
                                                        "bg-amber-50 text-amber-700 border border-amber-200"
                                                    }`}>
                                                        {r.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right space-x-1.5">
                                                    {r.status === "ACTIVE" || r.status === "AUTHORIZED" ? (
                                                        <Button size="sm" variant="outline" onClick={() => handleAutoRechargeAction(r.id, "pause")} className="h-7 text-amber-600 text-xs font-bold">Pause</Button>
                                                    ) : (
                                                        <Button size="sm" variant="outline" onClick={() => handleAutoRechargeAction(r.id, "resume")} className="h-7 text-emerald-600 text-xs font-bold">Resume</Button>
                                                    )}
                                                    {r.status === "PAYMENT_FAILED" && (
                                                        <Button size="sm" variant="outline" onClick={() => handleAutoRechargeAction(r.id, "retry")} className="h-7 text-indigo-600 text-xs font-bold">Retry</Button>
                                                    )}
                                                    <Button size="sm" variant="outline" onClick={() => handleAutoRechargeAction(r.id, "disable")} className="h-7 text-rose-600 text-xs font-bold">Disable</Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/50">
                    <span>Page {meta.current_page} of {meta.last_page} ({meta.total} Total)</span>
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-200 bg-white text-slate-700 rounded-lg text-xs cursor-pointer"
                        >
                            <ChevronLeft size={14} /> Previous
                        </Button>
                        <Button
                            disabled={page >= meta.last_page}
                            onClick={() => setPage(p => p + 1)}
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-200 bg-white text-slate-700 rounded-lg text-xs cursor-pointer"
                        >
                            Next <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Refund Dialog */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleRefundSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                            <RotateCcw size={24} />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900">Process Razorpay Refund</h3>
                            <p className="text-xs text-slate-600 mt-0.5">
                                Transaction ID: #{selectedTx.id} | Amount: ₹{selectedTx.amount}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-900">Refund Amount (INR)</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    className="h-10 bg-slate-50 border-slate-200 text-xs font-bold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-900">Reason for Refund</label>
                                <Input
                                    placeholder="Customer requested cancellation / refund"
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="h-10 bg-slate-50 border-slate-200 text-xs"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => setSelectedTx(null)} className="h-10 px-4 rounded-xl text-xs font-bold">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={refunding} className="h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                                {refunding ? "Processing Refund..." : "Execute Razorpay Refund"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
