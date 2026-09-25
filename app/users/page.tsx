"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    Filter,
    Shield,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Coins,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [meta, setMeta] = useState<any>({ current_page: 1, total: 0, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);

    // Selected user for credit adjustment modal
    const [creditModalUser, setCreditModalUser] = useState<any>(null);
    const [adjustmentAmount, setAdjustmentAmount] = useState<number>(100);
    const [adjustmentReason, setAdjustmentReason] = useState<string>("");
    const [adjusting, setAdjusting] = useState(false);

    const fetchUsers = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                per_page: "15",
                ...(search && { search }),
                ...(statusFilter && { status: statusFilter }),
            });

            const res = await fetch(`/api/admin/users?${queryParams.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setUsers(data.data || []);
                setMeta(data.meta || { current_page: 1, total: 0, last_page: 1 });
            }
        } catch (err) {
            toast.error("Failed to load users list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token, page, statusFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleToggleStatus = async (userId: number, currentStatus: string) => {
        const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
        if (!confirm(`Are you sure you want to change this user's status to ${nextStatus}?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({ status: nextStatus, reason: `Admin set status to ${nextStatus}` })
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message);
                fetchUsers();
            } else {
                toast.error(data.message || "Failed to update status.");
            }
        } catch (err) {
            toast.error("Status update error.");
        }
    };

    const handleAdjustCredits = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!creditModalUser || !creditModalUser.tenant_id || !adjustmentReason.trim()) {
            toast.error("Please provide a valid reason for adjusting credits.");
            return;
        }

        setAdjusting(true);
        try {
            const res = await fetch("/api/admin/credits/adjust", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({
                    tenant_id: creditModalUser.tenant_id,
                    user_id: creditModalUser.id,
                    adjustment: adjustmentAmount,
                    reason: adjustmentReason
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message);
                setCreditModalUser(null);
                setAdjustmentReason("");
                fetchUsers();
            } else {
                toast.error(data.message || "Credit adjustment failed.");
            }
        } catch (err) {
            toast.error("Credit adjustment error.");
        } finally {
            setAdjusting(false);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                        User Accounts Management
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Platform user register, subscription plans, credit balances, and security suspensions.</p>
                </div>
                <Button
                    onClick={fetchUsers}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload List</span>
                </Button>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 bg-slate-950 border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
                    <div className="relative w-full">
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                        <Input
                            placeholder="Search by name, email, brand..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 bg-slate-900 border-slate-800 text-slate-200 rounded-xl text-xs"
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-10 px-4 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold cursor-pointer border-0">
                        Search
                    </Button>
                </form>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter size={14} className="text-slate-500 shrink-0" />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="h-10 px-3 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active Accounts</option>
                        <option value="suspended">Suspended Accounts</option>
                    </select>
                </div>
            </Card>

            {/* Users Data Table */}
            <Card className="bg-slate-950 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="p-4">User Details</th>
                                <th className="p-4">Company / Brand</th>
                                <th className="p-4">Plan &amp; Credits</th>
                                <th className="p-4">Created Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        Loading platform users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        No matching users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const isSuspended = u.status === "suspended";
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-100 flex items-center gap-2">
                                                    <span>{u.name}</span>
                                                    {u.is_admin == 1 && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#35877D]/20 text-[#35877D]">ADMIN</span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-slate-500">{u.email}</div>
                                            </td>
                                            <td className="p-4 font-medium text-slate-300">
                                                {u.company_name || "—"}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-emerald-400 uppercase text-[11px]">{u.plan || "Growth"}</div>
                                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Coins size={12} className="text-[#35877D]" />
                                                    <span>{(u.credits ?? 0).toLocaleString()} Credits</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-400 font-medium">
                                                {new Date(u.created_at).toLocaleDateString("en-IN")}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    isSuspended ? "bg-rose-950 text-rose-400 border border-rose-800/40" : "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                                                }`}>
                                                    {isSuspended ? <XCircle size={10} /> : <CheckCircle2 size={10} />}
                                                    {isSuspended ? "Suspended" : "Active"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <Button
                                                    onClick={() => setCreditModalUser(u)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-[11px] font-semibold rounded-lg cursor-pointer"
                                                >
                                                    <Coins size={12} className="mr-1 text-[#35877D]" /> Adjust Credits
                                                </Button>

                                                <Button
                                                    onClick={() => handleToggleStatus(u.id, u.status)}
                                                    size="sm"
                                                    variant="outline"
                                                    className={`h-8 border-slate-800 text-[11px] font-semibold rounded-lg cursor-pointer ${
                                                        isSuspended ? "bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900" : "bg-rose-950/60 text-rose-400 hover:bg-rose-900"
                                                    }`}
                                                >
                                                    {isSuspended ? "Activate" : "Suspend"}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Showing Page {meta.current_page} of {meta.last_page} ({meta.total} Users)</span>
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-800 bg-slate-900 text-slate-300 rounded-lg text-xs cursor-pointer"
                        >
                            <ChevronLeft size={14} /> Previous
                        </Button>
                        <Button
                            disabled={page >= meta.last_page}
                            onClick={() => setPage(p => p + 1)}
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-800 bg-slate-900 text-slate-300 rounded-lg text-xs cursor-pointer"
                        >
                            Next <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* MANUAL CREDIT ADJUSTMENT MODAL */}
            {creditModalUser && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md p-6 bg-slate-900 border-slate-800 rounded-3xl space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                                <Coins size={18} className="text-[#35877D]" />
                                Adjust Credit Ledger
                            </h3>
                            <button onClick={() => setCreditModalUser(null)} className="text-slate-500 hover:text-white">
                                ✕
                            </button>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1">
                            <p><span className="text-slate-500 font-semibold">User:</span> <strong className="text-white">{creditModalUser.name}</strong> ({creditModalUser.email})</p>
                            <p><span className="text-slate-500 font-semibold">Current Balance:</span> <strong className="text-emerald-400">{(creditModalUser.credits ?? 0).toLocaleString()} Credits</strong></p>
                        </div>

                        <form onSubmit={handleAdjustCredits} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-300">Adjustment Amount (+ to add, - to deduct)</label>
                                <Input
                                    type="number"
                                    required
                                    value={adjustmentAmount}
                                    onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                                    className="h-10 bg-slate-950 border-slate-800 text-slate-100 text-xs font-bold rounded-xl"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-300">Mandatory Reason (Audit Logged)</label>
                                <Input
                                    required
                                    placeholder="e.g. Promotional goodwill credit / Manual bank transfer top-up"
                                    value={adjustmentReason}
                                    onChange={(e) => setAdjustmentReason(e.target.value)}
                                    className="h-10 bg-slate-950 border-slate-800 text-slate-100 text-xs rounded-xl"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button type="button" onClick={() => setCreditModalUser(null)} variant="ghost" className="h-10 text-xs text-slate-400 hover:bg-slate-800 rounded-xl cursor-pointer">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={adjusting} className="h-10 bg-[#35877D] hover:bg-[#2c6f66] text-white text-xs font-bold rounded-xl cursor-pointer border-0">
                                    {adjusting ? "Logging Adjustment..." : "Commit Adjustment"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
