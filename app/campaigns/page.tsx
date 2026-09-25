"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCampaignsPage() {
    const { token } = useAuth();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
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
        } catch (err) {
            toast.error("Failed to load campaigns monitor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [token]);

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                        Campaign Monitoring Console
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Platform-wide bulk campaign dispatch status, audience sizes, and delivery metrics.</p>
                </div>
                <Button
                    onClick={fetchCampaigns}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload Campaigns</span>
                </Button>
            </div>

            <Card className="bg-slate-950 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="p-4">Campaign Name</th>
                                <th className="p-4">Workspace</th>
                                <th className="p-4">Recipients</th>
                                <th className="p-4">Delivered</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Scheduled / Sent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        Loading platform campaigns...
                                    </td>
                                </tr>
                            ) : campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        No campaigns created across platform yet.
                                    </td>
                                </tr>
                            ) : (
                                campaigns.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-100">
                                            {c.name}
                                        </td>
                                        <td className="p-4 font-semibold text-slate-300">
                                            {c.company_name}
                                        </td>
                                        <td className="p-4 font-mono font-bold text-slate-200">
                                            {(c.total_recipients ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-4 font-mono text-emerald-400 font-bold">
                                            {(c.delivered_count ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#35877D]/20 text-[#35877D] border border-[#35877D]/30 uppercase">
                                                {c.status || "Completed"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 font-medium">
                                            {new Date(c.created_at).toLocaleDateString("en-IN")}
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
