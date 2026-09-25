"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminAuditLogsPage() {
    const { token } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAuditLogs = async () => {
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
        } catch (err) {
            toast.error("Failed to fetch audit logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, [token]);

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                        Platform Audit Logs <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/40">Immutable</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Immutable record of administrative actions, user status changes, credit adjustments, and security events.</p>
                </div>
                <Button
                    onClick={fetchAuditLogs}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload Audit Logs</span>
                </Button>
            </div>

            {/* Audit Logs Table */}
            <Card className="bg-slate-950 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="p-4">Admin Operator</th>
                                <th className="p-4">Action Event</th>
                                <th className="p-4">Entity Target</th>
                                <th className="p-4">Reason / Notes</th>
                                <th className="p-4">IP Address</th>
                                <th className="p-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-xs">
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
                                    <tr key={l.id} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-200">
                                            {l.admin_name || "System Admin"}
                                            <div className="text-[10px] text-slate-500 font-normal">{l.admin_email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-slate-900 text-slate-300 border border-slate-800">
                                                {l.action}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-300">
                                            {l.entity_type ? `${l.entity_type} #${l.entity_id}` : "—"}
                                        </td>
                                        <td className="p-4 text-slate-300 font-medium">
                                            {l.reason || "—"}
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-500">
                                            {l.ip_address || "127.0.0.1"}
                                        </td>
                                        <td className="p-4 text-slate-400 font-medium">
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
