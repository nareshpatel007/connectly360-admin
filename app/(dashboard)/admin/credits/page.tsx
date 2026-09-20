"use client";

import { useEffect, useState } from "react";
import { 
    Coins, Shield, Settings, Plus, Edit2, Save, Trash2, 
    ArrowUpDown, AlertCircle, RefreshCw, CheckCircle2, TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface CreditPack {
    id: number;
    name: string;
    credits: number;
    price: number;
    currency: string;
    bonus_credits: number;
    is_popular: boolean;
    is_active: boolean;
}

interface CreditRule {
    id: number;
    action_type: string;
    description: string;
    credits_cost: number;
    is_active: boolean;
}

interface AnalyticsData {
    total_credits_granted: number;
    total_credits_purchased: number;
    total_credits_consumed: number;
    total_recharge_revenue: number;
    total_active_wallets: number;
}

export default function AdminCreditsPage() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<"packs" | "rules" | "adjust" | "analytics">("packs");
    const [packs, setPacks] = useState<CreditPack[]>([]);
    const [rules, setRules] = useState<CreditRule[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Adjust form state
    const [adjustTenantId, setAdjustTenantId] = useState("");
    const [adjustCredits, setAdjustCredits] = useState("");
    const [adjustReason, setAdjustReason] = useState("");
    const [isAdjusting, setIsAdjusting] = useState(false);

    // Edit pack state
    const [editingPackId, setEditingPackId] = useState<number | null>(null);
    const [editingPack, setEditingPack] = useState<Partial<CreditPack>>({});

    // Edit rule state
    const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
    const [editingRuleCost, setEditingRuleCost] = useState<number>(1);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [packsRes, rulesRes, analyticsRes] = await Promise.all([
                fetch("/api/admin/credits/packs", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/admin/credits/rules", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/admin/credits/analytics", { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const packsData = await packsRes.json();
            const rulesData = await rulesRes.json();
            const analyticsData = await analyticsRes.json();

            if (packsData.status) setPacks(packsData.data || []);
            if (rulesData.status) setRules(rulesData.data || []);
            if (analyticsData.status) setAnalytics(analyticsData.data || null);
        } catch (err) {
            console.error("Failed to fetch admin credit data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleUpdateRule = async (id: number) => {
        try {
            const res = await fetch(`/api/admin/credits/rules/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    credits_cost: editingRuleCost
                })
            });
            const result = await res.json();
            if (result.status) {
                toast.success("Rule cost updated successfully");
                setEditingRuleId(null);
                fetchData();
            } else {
                toast.error(result.message || "Failed to update rule");
            }
        } catch (err: any) {
            toast.error(err.message || "Network error");
        }
    };

    const handleManualAdjust = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adjustTenantId || !adjustCredits || !adjustReason) {
            toast.error("Please fill in tenant ID, credits amount, and audit reason.");
            return;
        }

        setIsAdjusting(true);
        try {
            const res = await fetch("/api/admin/credits/manual-adjust", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    tenant_id: Number(adjustTenantId),
                    credits: Number(adjustCredits),
                    reason: adjustReason
                })
            });
            const result = await res.json();
            if (result.status) {
                toast.success(`Successfully adjusted ${adjustCredits} credits for tenant #${adjustTenantId}`);
                setAdjustTenantId("");
                setAdjustCredits("");
                setAdjustReason("");
                fetchData();
            } else {
                toast.error(result.message || "Failed to adjust credits");
            }
        } catch (err: any) {
            toast.error(err.message || "Network error");
        } finally {
            setIsAdjusting(false);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Shield size={24} className="text-[#35877D]" />
                        Super Admin: Credit Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Manage global credit packs, configure billing rules, perform audited balance adjustments, and monitor platform credit consumption.
                    </p>
                </div>
                <Button 
                    variant="outline"
                    onClick={fetchData}
                    className="h-9 text-xs font-semibold rounded-xl border-slate-200 cursor-pointer self-start sm:self-auto"
                >
                    <RefreshCw size={13} className={`mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh Data
                </Button>
            </div>

            {/* Platform Analytics Cards */}
            {analytics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Wallets</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{analytics.total_active_wallets}</p>
                    </Card>
                    <Card className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credits Granted (Free)</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">{analytics.total_credits_granted?.toLocaleString()}</p>
                    </Card>
                    <Card className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credits Purchased</p>
                        <p className="text-2xl font-black text-[#00382B] mt-1">{analytics.total_credits_purchased?.toLocaleString()}</p>
                    </Card>
                    <Card className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credits Consumed</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">{analytics.total_credits_consumed?.toLocaleString()}</p>
                    </Card>
                    <Card className="p-4 rounded-2xl bg-gradient-to-br from-[#00382B] to-[#35877D] text-white shadow-xs">
                        <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Recharge Revenue</p>
                        <p className="text-2xl font-black mt-1">₹{analytics.total_recharge_revenue?.toLocaleString()}</p>
                    </Card>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                    onClick={() => setActiveTab("packs")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        activeTab === "packs" ? "bg-[#00382B] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    Credit Packs
                </button>
                <button
                    onClick={() => setActiveTab("rules")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        activeTab === "rules" ? "bg-[#00382B] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    Usage Rules
                </button>
                <button
                    onClick={() => setActiveTab("adjust")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        activeTab === "adjust" ? "bg-[#00382B] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    Manual Adjustments
                </button>
            </div>

            {/* TAB 1: Credit Packs */}
            {activeTab === "packs" && (
                <Card className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Active Credit Packs</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Purchasable credit tiers displayed on checkout and pricing pages.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="px-4 py-3">Pack Name</th>
                                    <th className="px-4 py-3">Credits</th>
                                    <th className="px-4 py-3">Bonus</th>
                                    <th className="px-4 py-3">Price (INR)</th>
                                    <th className="px-4 py-3">Per Credit</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {packs.map((pack) => {
                                    const totalCredits = pack.credits + (pack.bonus_credits || 0);
                                    const perCredit = (pack.price / totalCredits).toFixed(2);
                                    return (
                                        <tr key={pack.id} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                                                <span>{pack.name}</span>
                                                {pack.is_popular && (
                                                    <span className="text-[9px] font-extrabold bg-[#00382B] text-white px-2 py-0.5 rounded-full">Popular</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">{pack.credits.toLocaleString()}</td>
                                            <td className="px-4 py-3.5 text-emerald-600">+{pack.bonus_credits || 0}</td>
                                            <td className="px-4 py-3.5 font-bold">₹{pack.price.toLocaleString()}</td>
                                            <td className="px-4 py-3.5 text-slate-500">₹{perCredit}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* TAB 2: Usage Rules */}
            {activeTab === "rules" && (
                <Card className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Credit Consumption Rules</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Define and adjust the exact credit deduction for each platform action.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="px-4 py-3">Action Key</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Cost (Credits)</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {rules.map((rule) => {
                                    const isEditing = editingRuleId === rule.id;
                                    return (
                                        <tr key={rule.id} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3.5 font-bold font-mono text-slate-900">
                                                {rule.action_type}
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-600">
                                                {rule.description}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {isEditing ? (
                                                    <Input 
                                                        type="number"
                                                        value={editingRuleCost}
                                                        onChange={(e) => setEditingRuleCost(Number(e.target.value))}
                                                        className="h-8 w-24 text-xs rounded-lg"
                                                    />
                                                ) : (
                                                    <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                        {rule.credits_cost} Credits
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            size="sm"
                                                            onClick={() => handleUpdateRule(rule.id)}
                                                            className="h-7 text-xs bg-[#00382B] text-white rounded-lg px-2.5"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button 
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setEditingRuleId(null)}
                                                            className="h-7 text-xs rounded-lg px-2"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setEditingRuleId(rule.id);
                                                            setEditingRuleCost(rule.credits_cost);
                                                        }}
                                                        className="h-7 text-xs text-slate-600 hover:text-[#35877D]"
                                                    >
                                                        <Edit2 size={13} className="mr-1" />
                                                        Edit
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* TAB 3: Manual Adjustments */}
            {activeTab === "adjust" && (
                <Card className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 max-w-2xl">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Manual Credit Adjustment</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Credit or debit a customer wallet manually. An audit trail record is strictly enforced with an adjustment reason.
                        </p>
                    </div>

                    <form onSubmit={handleManualAdjust} className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700">Tenant ID</label>
                            <Input 
                                placeholder="e.g. 1"
                                type="number"
                                value={adjustTenantId}
                                onChange={(e) => setAdjustTenantId(e.target.value)}
                                className="h-9 rounded-xl border-slate-200 text-xs"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700">Credits Amount (Positive to add, Negative to deduct)</label>
                            <Input 
                                placeholder="e.g. 500 or -200"
                                type="number"
                                value={adjustCredits}
                                onChange={(e) => setAdjustCredits(e.target.value)}
                                className="h-9 rounded-xl border-slate-200 text-xs"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700">Audit Reason</label>
                            <Input 
                                placeholder="e.g. Compensation for downtime / Test credits grant"
                                value={adjustReason}
                                onChange={(e) => setAdjustReason(e.target.value)}
                                className="h-9 rounded-xl border-slate-200 text-xs"
                                required
                            />
                        </div>

                        <Button 
                            type="submit"
                            disabled={isAdjusting}
                            className="bg-[#00382B] hover:bg-[#35877D] text-white font-bold rounded-xl h-9 text-xs px-5 cursor-pointer"
                        >
                            {isAdjusting ? "Processing Adjustment..." : "Execute Adjustment"}
                        </Button>
                    </form>
                </Card>
            )}
        </div>
    );
}
