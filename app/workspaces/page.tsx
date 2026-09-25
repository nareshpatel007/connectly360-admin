"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Building2,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    UserCheck
} from "lucide-react";
import { toast } from "sonner";

interface WorkspaceRecord {
    id: number;
    company_name?: string;
    company_id?: string;
    owner_name?: string;
    owner_email?: string;
    plan?: string;
    credits?: number;
    created_at: string;
    status: string;
}

interface PaginationMeta {
    current_page: number;
    total: number;
    last_page: number;
}

export default function AdminWorkspacesPage() {
    const { token } = useAuth();
    const [workspaces, setWorkspaces] = useState<WorkspaceRecord[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, total: 0, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("");
    const [page, setPage] = useState(1);

    const fetchWorkspaces = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                per_page: "15",
                ...(search && { search }),
                ...(planFilter && { plan: planFilter }),
            });

            const res = await fetch(`/api/admin/workspaces?${queryParams.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setWorkspaces(data.data || []);
                setMeta(data.meta || { current_page: 1, total: 0, last_page: 1 });
            }
        } catch {
            toast.error("Failed to load workspaces list.");
        } finally {
            setLoading(false);
        }
    }, [token, page, search, planFilter]);

    useEffect(() => {
        fetchWorkspaces();
    }, [fetchWorkspaces]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchWorkspaces();
    };

    const handleToggleStatus = async (workspaceId: number, currentStatus: string) => {
        const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
        if (!confirm(`Are you sure you want to change workspace status to ${nextStatus}?`)) return;

        try {
            const res = await fetch(`/api/admin/workspaces/${workspaceId}/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({ status: nextStatus, reason: `Admin toggled workspace status to ${nextStatus}` })
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message);
                fetchWorkspaces();
            } else {
                toast.error(data.message || "Failed to update workspace status.");
            }
        } catch {
            toast.error("Workspace status update error.");
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Workspaces &amp; Tenant Accounts
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Multi-tenant workspace isolation, subscription tiers, credit balances, and operational status.</p>
                </div>
                <Button
                    onClick={fetchWorkspaces}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload Workspaces</span>
                </Button>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
                    <div className="relative w-full">
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                        <Input
                            placeholder="Search by brand name or owner..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl text-xs font-medium focus-visible:ring-[#35877D]"
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-10 px-4 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold cursor-pointer border-0">
                        Search
                    </Button>
                </form>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter size={14} className="text-slate-400 shrink-0" />
                    <select
                        value={planFilter}
                        onChange={(e) => {
                            setPlanFilter(e.target.value);
                            setPage(1);
                        }}
                        className="h-10 px-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                        <option value="">All Subscription Tiers</option>
                        <option value="growth">Growth Plan</option>
                        <option value="starter">Starter Plan</option>
                        <option value="enterprise">Enterprise Plan</option>
                    </select>
                </div>
            </Card>

            {/* Workspaces Table */}
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Workspace Brand</th>
                                <th className="p-4">Owner Contact</th>
                                <th className="p-4">Subscription Plan</th>
                                <th className="p-4">Credits</th>
                                <th className="p-4">Created Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                                        Loading workspaces...
                                    </td>
                                </tr>
                            ) : workspaces.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                                        No workspaces found.
                                    </td>
                                </tr>
                            ) : (
                                workspaces.map((w) => {
                                    const isSuspended = w.status === "suspended";
                                    return (
                                        <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                                    <Building2 size={15} className="text-[#35877D]" />
                                                    <span>{w.company_name || "Unnamed Workspace"}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {w.company_id || w.id}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                                    <UserCheck size={13} className="text-slate-400" />
                                                    <span>{w.owner_name || "—"}</span>
                                                </div>
                                                <div className="text-[11px] text-slate-500">{w.owner_email || ""}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                                                    {w.plan || "growth"}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-[#35877D]">
                                                {(w.credits ?? 0).toLocaleString()} Credits
                                            </td>
                                            <td className="p-4 text-slate-500 font-medium">
                                                {new Date(w.created_at).toLocaleDateString("en-IN")}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    isSuspended ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                }`}>
                                                    {isSuspended ? <XCircle size={10} /> : <CheckCircle2 size={10} />}
                                                    {isSuspended ? "Suspended" : "Active"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    onClick={() => handleToggleStatus(w.id, w.status)}
                                                    size="sm"
                                                    variant="outline"
                                                    className={`h-8 text-[11px] font-semibold rounded-lg cursor-pointer ${
                                                        isSuspended
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                                    }`}
                                                >
                                                    {isSuspended ? "Activate Workspace" : "Suspend Workspace"}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>Showing Page {meta.current_page} of {meta.last_page} ({meta.total} Workspaces)</span>
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
        </div>
    );
}
