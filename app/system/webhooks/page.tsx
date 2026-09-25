"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    RefreshCw,
    CheckCircle2,
    XCircle,
    Globe,
    RotateCcw,
    Eye,
    ChevronLeft,
    ChevronRight,
    Terminal
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";

export default function AdminWebhooksPage() {
    const { token } = useAuth();
    const [webhooks, setWebhooks] = useState<any[]>([]);
    const [meta, setMeta] = useState({ current_page: 1, total: 0, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [selectedPayload, setSelectedPayload] = useState<any | null>(null);
    const [retryingId, setRetryingId] = useState<number | null>(null);

    const fetchWebhooks = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/payment-webhooks?page=${page}&per_page=15`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.status) {
                setWebhooks(data.data?.data || data.data || []);
                setMeta({
                    current_page: data.data?.current_page || 1,
                    total: data.data?.total || 0,
                    last_page: data.data?.last_page || 1
                });
            }
        } catch {
            toast.error("Failed to load webhook logs");
        } finally {
            setLoading(false);
        }
    }, [token, page]);

    useEffect(() => {
        fetchWebhooks();
    }, [fetchWebhooks]);

    const handleRetry = async (id: number) => {
        setRetryingId(id);
        try {
            const res = await fetch(`/api/admin/payment-webhooks/${id}/retry`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const json = await res.json();
            if (json.status) {
                toast.success(json.message || "Webhook reprocessed successfully");
                fetchWebhooks();
            } else {
                toast.error(json.message || "Retry failed");
            }
        } catch (err: any) {
            toast.error("Retry failed: " + err.message);
        } finally {
            setRetryingId(null);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <AdminPageHeader
                title="Razorpay Webhooks &amp; Event Logs"
                description="Live audit of Razorpay incoming webhooks, signature verification status, event payloads, and manual retry processing."
                breadcrumbs={[{ label: "System", href: "/system" }, { label: "Razorpay Webhooks" }]}
                badge={`${meta.total} Webhook Events`}
                actions={
                    <Button
                        onClick={fetchWebhooks}
                        variant="outline"
                        size="sm"
                        className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Reload Webhooks</span>
                    </Button>
                }
            />

            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Event &amp; Provider</th>
                                <th className="p-4">Event ID</th>
                                <th className="p-4">Signature Status</th>
                                <th className="p-4">Processing State</th>
                                <th className="p-4">Received At</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        Loading webhook event logs...
                                    </td>
                                </tr>
                            ) : webhooks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                                        No Razorpay webhook events received yet.
                                    </td>
                                </tr>
                            ) : (
                                webhooks.map((w) => (
                                    <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <Globe size={14} className="text-[#35877D]" />
                                                <span>{w.event_type}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-500">
                                            {w.event_id || "evt_simulated"}
                                        </td>
                                        <td className="p-4">
                                            {w.signature_verified ? (
                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold flex items-center gap-1 w-max">
                                                    <CheckCircle2 size={10} /> Verified
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold flex items-center gap-1 w-max">
                                                    <XCircle size={10} /> Unverified
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                w.processing_status === "processed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                w.processing_status === "failed" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                                "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}>
                                                {w.processing_status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {new Date(w.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedPayload(w.payload)}
                                                className="h-8 px-2.5 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer"
                                            >
                                                <Eye size={12} className="mr-1" /> View Payload
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRetry(w.id)}
                                                disabled={retryingId === w.id}
                                                className="h-8 px-2.5 text-[#35877D] hover:bg-teal-50 rounded-lg text-xs font-bold cursor-pointer"
                                            >
                                                <RotateCcw size={12} className={`mr-1 ${retryingId === w.id ? "animate-spin" : ""}`} /> Retry
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/50">
                    <span>Page {meta.current_page} of {meta.last_page} ({meta.total} Webhooks)</span>
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

            {/* Payload View Modal */}
            {selectedPayload && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl border border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Terminal size={18} className="text-teal-400" />
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Webhook Event Payload JSON</h3>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedPayload(null)} className="h-8 text-slate-400 hover:text-white">
                                Close
                            </Button>
                        </div>
                        <pre className="p-4 bg-slate-950 rounded-2xl overflow-auto text-xs font-mono max-h-96 text-emerald-400 border border-slate-800">
                            {JSON.stringify(selectedPayload, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
