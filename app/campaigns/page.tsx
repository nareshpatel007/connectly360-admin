"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Megaphone, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";

interface CampaignRecord {
    id: number;
    name: string;
    company_name?: string;
    total_recipients?: number;
    delivered_count?: number;
    status?: string;
    created_at: string;
}

export default function AdminCampaignsPage() {
    const { token } = useAuth();
    const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/campaigns", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setCampaigns(data.data?.data || data.data || []);
            }
        } catch {
            toast.error("Failed to load campaigns monitor.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    return (
        <div className="space-y-6 font-sans">
            {/* Page Header */}
            <AdminPageHeader
                title="Campaign Monitor"
                description="Platform-wide bulk outbound messaging dispatch, target audience sizes, and delivery status logs."
                breadcrumbs={[{ label: "Campaign Monitor" }]}
                badge={`${campaigns.length} Campaigns`}
                actions={
                    <Button
                        onClick={fetchCampaigns}
                        variant="outline"
                        size="sm"
                        className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Reload Campaigns</span>
                    </Button>
                }
            />

            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Campaign Name</th>
                                <th className="p-4">Workspace Brand</th>
                                <th className="p-4">Recipients</th>
                                <th className="p-4">Delivered</th>
                                <th className="p-4">Dispatch Status</th>
                                <th className="p-4">Created Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw size={16} className="animate-spin text-[#35877D]" />
                                            <span>Loading platform campaign statistics...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                                        No campaigns created across tenant workspaces yet.
                                    </td>
                                </tr>
                            ) : (
                                campaigns.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                                            <Megaphone size={14} className="text-[#35877D]" />
                                            <span>{c.name}</span>
                                        </td>
                                        <td className="p-4 font-semibold text-slate-700">
                                            {c.company_name || "Workspace"}
                                        </td>
                                        <td className="p-4 font-mono font-bold text-slate-800">
                                            {(c.total_recipients ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-4 font-mono text-emerald-600 font-bold">
                                            {(c.delivered_count ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20 uppercase">
                                                {c.status || "Completed"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {new Date(c.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
