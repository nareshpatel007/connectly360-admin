"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Coins,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    X,
    UserCheck,
    ShieldAlert,
    UserPlus,
    Building2,
    MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface AdminUserRecord {
    id: number;
    name: string;
    email: string;
    company_name?: string;
    plan?: string;
    credits?: number;
    status: string;
    created_at: string;
    is_admin?: number;
    tenant_id?: number;
}

interface PaginationMeta {
    current_page: number;
    total: number;
    last_page: number;
}

export default function AdminUsersPage() {
    const { token } = useAuth();
    const [users, setUsers] = useState<AdminUserRecord[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, total: 0, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);

    // Selected user for credit adjustment modal
    const [creditModalUser, setCreditModalUser] = useState<AdminUserRecord | null>(null);
    const [adjustmentAmount, setAdjustmentAmount] = useState<number>(100);
    const [adjustmentReason, setAdjustmentReason] = useState<string>("");
    const [adjusting, setAdjusting] = useState(false);

    const fetchUsers = useCallback(async () => {
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
                const userList = Array.isArray(data.data)
                    ? data.data
                    : (Array.isArray(data.data?.data) ? data.data.data : []);

                const metaInfo = {
                    current_page: data.data?.current_page || data.meta?.current_page || 1,
                    total: data.data?.total ?? data.meta?.total ?? userList.length,
                    last_page: data.data?.last_page || data.meta?.last_page || 1,
                };

                setUsers(userList);
                setMeta(metaInfo);
            }
        } catch {
            toast.error("Failed to load users list.");
        } finally {
            setLoading(false);
        }
    }, [token, page, search, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const [pendingStatusUser, setPendingStatusUser] = useState<{ id: number; status: string; nextStatus: string } | null>(null);

    const confirmToggleStatus = async () => {
        if (!pendingStatusUser) return;
        const { id, nextStatus } = pendingStatusUser;

        try {
            const res = await fetch(`/api/admin/users/${id}/status`, {
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
                toast.success(`User status updated to ${nextStatus}`);
                fetchUsers();
                setPendingStatusUser(null);
            } else {
                toast.error(data.message || "Failed to update user status");
            }
        } catch (err) {
            toast.error("Network error while updating user status");
        }
    };

    const handleToggleStatus = (userId: number, currentStatus: string) => {
        const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
        setPendingStatusUser({ id: userId, status: currentStatus, nextStatus });
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
        } catch {
            toast.error("Credit adjustment error.");
        } finally {
            setAdjusting(false);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header Bar */}
            <AdminPageHeader
                title="Users & Accounts"
                description="Manage registered platform user accounts, subscription tier levels, credit ledgers, and security suspensions."
                breadcrumbs={[{ label: "Users & Accounts" }]}
                badge={`${meta.total} Accounts`}
                actions={
                    <Button
                        onClick={fetchUsers}
                        variant="outline"
                        size="sm"
                        className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Reload List</span>
                    </Button>
                }
            />

            {/* Filter Bar */}
            <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-96">
                    <div className="relative w-full">
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                        <Input
                            placeholder="Search by name, email, company brand..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl text-xs font-medium focus-visible:ring-[#35877D]"
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-10 px-4 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold cursor-pointer border-0 shadow-2xs">
                        Search
                    </Button>
                </form>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter size={14} className="text-slate-400 shrink-0" />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="h-10 px-3 bg-slate-50/80 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                        <option value="">All Account Statuses</option>
                        <option value="active">Active Accounts</option>
                        <option value="suspended">Suspended Accounts</option>
                    </select>
                </div>
            </Card>

            {/* Users Data Table */}
            <Card className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">User Identity</th>
                                <th className="p-4">Tenant Workspace</th>
                                <th className="p-4">Plan &amp; Credits</th>
                                <th className="p-4">Joined Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw size={16} className="animate-spin text-[#35877D]" />
                                            <span>Loading platform user directory...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (!Array.isArray(users) || users.length === 0) ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                                        No matching users found for current filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const isSuspended = u.status === "suspended";
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-[#35877D]/10 text-[#35877D] font-extrabold text-xs flex items-center justify-center shrink-0">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{u.name}</span>
                                                    {u.is_admin === 1 && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20">ADMIN</span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-slate-500 ml-9">{u.email}</div>
                                            </td>
                                            <td className="p-4 font-semibold text-slate-700">
                                                {u.company_name ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Building2 size={13} className="text-slate-400" />
                                                        <span>{u.company_name}</span>
                                                    </div>
                                                ) : "—"}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-[#35877D] uppercase text-[11px]">{u.plan || "Growth"}</div>
                                                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                                                    <Coins size={12} className="text-[#35877D]" />
                                                    <span>{(u.credits ?? 0).toLocaleString()} Credits</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {new Date(u.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    isSuspended ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
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
                                                    className="h-8 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-[11px] font-semibold rounded-lg cursor-pointer"
                                                >
                                                    <Coins size={12} className="mr-1 text-[#35877D]" /> Adjust Credits
                                                </Button>

                                                <Button
                                                    onClick={() => handleToggleStatus(u.id, u.status)}
                                                    size="sm"
                                                    variant="outline"
                                                    className={`h-8 text-[11px] font-semibold rounded-lg cursor-pointer ${
                                                        isSuspended
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
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
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/50">
                    <span>Showing Page {meta.current_page} of {meta.last_page} ({meta.total} Users)</span>
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

            {/* MANUAL CREDIT ADJUSTMENT MODAL */}
            {creditModalUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-xl font-sans">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                <Coins size={18} className="text-[#35877D]" />
                                Adjust Credit Ledger
                            </h3>
                            <button onClick={() => setCreditModalUser(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
                            <p><span className="text-slate-400">User:</span> <strong className="text-slate-900">{creditModalUser.name}</strong> ({creditModalUser.email})</p>
                            <p><span className="text-slate-400">Current Balance:</span> <strong className="text-[#35877D]">{(creditModalUser.credits ?? 0).toLocaleString()} Credits</strong></p>
                        </div>

                        <form onSubmit={handleAdjustCredits} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-900">Adjustment Amount (+ to add, - to deduct)</label>
                                <Input
                                    type="number"
                                    required
                                    value={adjustmentAmount}
                                    onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-bold rounded-xl focus-visible:ring-[#35877D]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-900">Mandatory Reason (Audit Logged)</label>
                                <Input
                                    required
                                    placeholder="e.g. Goodwill credit top-up / Invoice reconciliation"
                                    value={adjustmentReason}
                                    onChange={(e) => setAdjustmentReason(e.target.value)}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs rounded-xl focus-visible:ring-[#35877D]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button type="button" onClick={() => setCreditModalUser(null)} variant="ghost" className="h-10 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer font-bold">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={adjusting} className="h-10 bg-[#35877D] hover:bg-[#2c6f66] text-white text-xs font-bold rounded-xl cursor-pointer border-0 shadow-2xs">
                                    {adjusting ? "Logging Adjustment..." : "Commit Adjustment"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            <ConfirmDialog
                open={!!pendingStatusUser}
                onOpenChange={(open) => !open && setPendingStatusUser(null)}
                title={`Change User Status to ${pendingStatusUser?.nextStatus}?`}
                description={`Are you sure you want to change this user's account status from '${pendingStatusUser?.status}' to '${pendingStatusUser?.nextStatus}'?`}
                confirmText={`Set Status to ${pendingStatusUser?.nextStatus}`}
                variant={pendingStatusUser?.nextStatus === "suspended" ? "destructive" : "primary"}
                onConfirm={confirmToggleStatus}
            />
        </div>
    );
}
