"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";

interface AuditLogRecord {
    id: number;
    admin_name?: string;
    admin_email?: string;
    action: string;
    entity_type?: string;
    entity_id?: number;
    reason?: string;
    ip_address?: string;
    created_at: string;
}

export default function AdminAuditLogsPage() {
    const { token } = useAuth();
    const [logs, setLogs] = useState<AuditLogRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAuditLogs = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/audit-logs", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setLogs(data.data?.data || data.data || []);
            }
        } catch {
            toast.error("Failed to fetch audit logs.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    return (
        <div className="space-y-6 font-sans">
            {/* Page Header */}
            <AdminPageHeader
                title="Audit Trail Logs"
                description="Immutable record of administrative actions, security setting changes, manual credit adjustments, and user suspensions."
                breadcrumbs={[{ label: "Audit Logs" }]}
                badge="Immutable Audit Trail"
                actions={
                    <Button
                        onClick={fetchAuditLogs}
                        variant="outline"
                        size="sm"
                        className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Reload Audit Trail</span>
                    </Button>
                }
            />

            {/* Audit Logs Table */}
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Admin Operator</th>
                                <th className="p-4">Action Event</th>
                                <th className="p-4">Target Entity</th>
                                <th className="p-4">Audit Reason / Notes</th>
                                <th className="p-4">IP Address</th>
                                <th className="p-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw size={16} className="animate-spin text-[#35877D]" />
                                            <span>Loading security audit trail...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                                        No audit log entries recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((l) => (
                                    <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{l.admin_name || "Super Admin"}</div>
                                            <div className="text-[10px] text-slate-500">{l.admin_email || "admin@connectly360.com"}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                                                {l.action}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-700">
                                            {l.entity_type ? `${l.entity_type} #${l.entity_id}` : "—"}
                                        </td>
                                        <td className="p-4 text-slate-700">
                                            {l.reason || "—"}
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-500">
                                            {l.ip_address || "127.0.0.1"}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {new Date(l.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
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
