"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface CreditAdjustment {
    id: number;
    admin_name?: string;
    company_name?: string;
    previous_balance?: number;
    adjustment: number;
    new_balance?: number;
    reason: string;
    created_at: string;
}

export default function AdminCreditsPage() {
    const { token } = useAuth();
    const [adjustments, setAdjustments] = useState<CreditAdjustment[]>([]);
    const [loading, setLoading] = useState(true);

    const [tenantId, setTenantId] = useState("");
    const [amount, setAmount] = useState(500);
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchAdjustments = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/credits/adjustments", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setAdjustments(data.data?.data || data.data || []);
            }
        } catch {
            toast.error("Failed to fetch credit adjustments.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAdjustments();
    }, [fetchAdjustments]);

    const handleManualAdjustment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenantId || !amount || !reason.trim()) {
            toast.error("Tenant ID, adjustment amount, and reason are required.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/credits/adjust", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({ tenant_id: parseInt(tenantId), adjustment: amount, reason })
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message);
                setReason("");
                fetchAdjustments();
            } else {
                toast.error(data.message || "Adjustment failed.");
            }
        } catch {
            toast.error("Adjustment request error.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Credit Ledger &amp; Adjustments
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Platform messaging credit balance controls, manual allocations, and immutable ledger logs.</p>
                </div>
                <Button
                    onClick={fetchAdjustments}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload Ledger</span>
                </Button>
            </div>

            {/* Quick Adjustment Card & Audit Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Manual Adjustment Form Card */}
                <div className="lg:col-span-4">
                    <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                        <div className="space-y-1">
                            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                <PlusCircle size={16} className="text-[#35877D]" />
                                Manual Credit Adjustment
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium">Add or deduct credits from a tenant workspace with required audit trail reason.</p>
                        </div>

                        <form onSubmit={handleManualAdjustment} className="space-y-3.5 pt-2">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-900">Tenant Workspace ID</label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="e.g. 1"
                                    value={tenantId}
                                    onChange={(e) => setTenantId(e.target.value)}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-900">Adjustment (+/- Credits)</label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="e.g. 500 or -200"
                                    value={amount}
                                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-bold rounded-xl focus-visible:ring-[#35877D]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-900">Reason / Reference (Audit Logged)</label>
                                <Input
                                    required
                                    placeholder="e.g. Offline bank transfer / Goodwill"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-10 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer border-0 mt-2 transition-all"
                            >
                                {submitting ? "Processing..." : "Execute Credit Adjustment"}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Audit History Log Table */}
                <div className="lg:col-span-8">
                    <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adjustment Audit History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="p-3.5">Admin Operator</th>
                                        <th className="p-3.5">Workspace</th>
                                        <th className="p-3.5">Previous</th>
                                        <th className="p-3.5">Adjustment</th>
                                        <th className="p-3.5">New Balance</th>
                                        <th className="p-3.5">Reason</th>
                                        <th className="p-3.5">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                                                Loading adjustment log...
                                            </td>
                                        </tr>
                                    ) : adjustments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                                                No manual credit adjustments logged yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        adjustments.map((a) => (
                                            <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="p-3.5 font-bold text-slate-900">
                                                    {a.admin_name || "Admin"}
                                                </td>
                                                <td className="p-3.5 font-medium text-slate-700">
                                                    {a.company_name}
                                                </td>
                                                <td className="p-3.5 text-slate-500 font-mono">
                                                    {(a.previous_balance ?? 0).toLocaleString()}
                                                </td>
                                                <td className={`p-3.5 font-extrabold font-mono ${a.adjustment >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                                    {a.adjustment >= 0 ? `+${a.adjustment}` : a.adjustment}
                                                </td>
                                                <td className="p-3.5 text-slate-900 font-bold font-mono">
                                                    {(a.new_balance ?? 0).toLocaleString()}
                                                </td>
                                                <td className="p-3.5 text-slate-600">
                                                    {a.reason}
                                                </td>
                                                <td className="p-3.5 text-slate-500 font-medium text-[11px]">
                                                    {new Date(a.created_at).toLocaleDateString("en-IN")}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
