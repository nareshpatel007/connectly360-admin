"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, RefreshCw, PlusCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminCreditsPage() {
    const { token } = useAuth();
    const [adjustments, setAdjustments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [tenantId, setTenantId] = useState("");
    const [amount, setAmount] = useState(500);
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchAdjustments = async () => {
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
        } catch (err) {
            toast.error("Failed to fetch credit adjustments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdjustments();
    }, [token]);

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
        } catch (err) {
            toast.error("Adjustment request error.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                        Credit Ledger &amp; Adjustments
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Platform messaging credit balance controls, manual allocations, and immutable ledger logs.</p>
                </div>
                <Button
                    onClick={fetchAdjustments}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload Ledger</span>
                </Button>
            </div>

            {/* Quick Adjustment Card & Audit Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Manual Adjustment Form Card */}
                <div className="lg:col-span-4">
                    <Card className="p-6 bg-slate-950 border-slate-800 rounded-3xl space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                                <PlusCircle size={16} className="text-[#35877D]" />
                                Manual Credit Adjustment
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium">Add or deduct credits from a tenant workspace with required audit trail reason.</p>
                        </div>

                        <form onSubmit={handleManualAdjustment} className="space-y-3 pt-2">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-300">Tenant Workspace ID</label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="e.g. 1"
                                    value={tenantId}
                                    onChange={(e) => setTenantId(e.target.value)}
                                    className="h-10 bg-slate-900 border-slate-800 text-slate-100 text-xs rounded-xl"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-300">Adjustment (+/- Credits)</label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="e.g. 500 or -200"
                                    value={amount}
                                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                    className="h-10 bg-slate-900 border-slate-800 text-slate-100 text-xs font-bold rounded-xl"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-300">Reason / Reference (Audit Logged)</label>
                                <Input
                                    required
                                    placeholder="e.g. Offline bank transfer / System compensation"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="h-10 bg-slate-900 border-slate-800 text-slate-100 text-xs rounded-xl"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-10 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-0 mt-2"
                            >
                                {submitting ? "Processing..." : "Execute Credit Adjustment"}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Audit History Log Table */}
                <div className="lg:col-span-8">
                    <Card className="bg-slate-950 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-4 border-b border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adjustment Audit History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="p-3.5">Admin Operator</th>
                                        <th className="p-3.5">Workspace</th>
                                        <th className="p-3.5">Previous</th>
                                        <th className="p-3.5">Adjustment</th>
                                        <th className="p-3.5">New Balance</th>
                                        <th className="p-3.5">Reason</th>
                                        <th className="p-3.5">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/80 text-xs">
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
                                            <tr key={a.id} className="hover:bg-slate-900/50 transition-colors">
                                                <td className="p-3.5 font-bold text-slate-200">
                                                    {a.admin_name || "Admin"}
                                                </td>
                                                <td className="p-3.5 font-semibold text-slate-300">
                                                    {a.company_name}
                                                </td>
                                                <td className="p-3.5 text-slate-400 font-mono">
                                                    {(a.previous_balance ?? 0).toLocaleString()}
                                                </td>
                                                <td className={`p-3.5 font-extrabold font-mono ${a.adjustment >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                                    {a.adjustment >= 0 ? `+${a.adjustment}` : a.adjustment}
                                                </td>
                                                <td className="p-3.5 text-slate-100 font-bold font-mono">
                                                    {(a.new_balance ?? 0).toLocaleString()}
                                                </td>
                                                <td className="p-3.5 text-slate-300">
                                                    {a.reason}
                                                </td>
                                                <td className="p-3.5 text-slate-400 font-medium text-[11px]">
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
