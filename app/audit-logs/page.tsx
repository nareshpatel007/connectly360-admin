"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Platform Audit Logs <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Immutable</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Immutable record of administrative actions, user status changes, credit adjustments, and security events.</p>
                </div>
                <Button
                    onClick={fetchAuditLogs}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload Audit Logs</span>
                </Button>
            </div>

            {/* Audit Logs Table */}
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Admin Operator</th>
                                <th className="p-4">Action Event</th>
                                <th className="p-4">Entity Target</th>
                                <th className="p-4">Reason / Notes</th>
                                <th className="p-4">IP Address</th>
                                <th className="p-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        Loading audit trail...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        No audit log entries recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((l) => (
                                    <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">
                                            {l.admin_name || "System Admin"}
                                            <div className="text-[10px] text-slate-500 font-normal">{l.admin_email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                                {l.action}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-700">
                                            {l.entity_type ? `${l.entity_type} #${l.entity_id}` : "—"}
                                        </td>
                                        <td className="p-4 text-slate-700 font-medium">
                                            {l.reason || "—"}
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-500">
                                            {l.ip_address || "127.0.0.1"}
                                        </td>
                                        <td className="p-4 text-slate-500 font-medium">
                                            {new Date(l.created_at).toLocaleString("en-IN")}
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
