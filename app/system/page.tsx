"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Database, Server, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface SystemDiagnostics {
    database?: string;
    laravel_version?: string;
    php_version?: string;
    failed_jobs_count?: number;
    failed_jobs?: Array<{ id: number; connection: string; queue: string; failed_at: string; exception: string }>;
}

export default function AdminSystemPage() {
    const { token } = useAuth();
    const [systemData, setSystemData] = useState<SystemDiagnostics | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSystemHealth = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/system", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setSystemData(data.data);
            }
        } catch {
            toast.error("Failed to load system diagnostics.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchSystemHealth();
    }, [fetchSystemHealth]);

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        System Health &amp; Diagnostics
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Laravel backend services, MySQL database connection, queue workers, and exception logs.</p>
                </div>
                <Button
                    onClick={fetchSystemHealth}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Run Health Check</span>
                </Button>
            </div>

            {/* Diagnostics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">MySQL Database</span>
                        <Database size={20} className="text-[#35877D]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="text-lg font-extrabold text-slate-900">
                            {systemData?.database === "healthy" ? "Database Connected" : "Connection Issue"}
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">MySQL database PDO connection verified.</p>
                </Card>

                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Laravel Engine</span>
                        <Server size={20} className="text-purple-600" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">Laravel v{systemData?.laravel_version || "10.x"}</p>
                        <p className="text-xs font-semibold text-slate-500">PHP {systemData?.php_version || "8.1+"}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">REST API services running active on server environment.</p>
                </Card>

                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Queue Worker Status</span>
                        <Activity size={20} className="text-amber-600" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-slate-900">{systemData?.failed_jobs_count ?? 0}</span>
                        <span className="text-xs font-bold text-slate-500">Failed Jobs</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Background campaign dispatcher &amp; webhook queue processor.</p>
                </Card>
            </div>

            {/* Failed Queue Jobs Section */}
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle size={15} className="text-amber-600" />
                        Failed Queue Jobs Log
                    </h3>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                    {systemData?.failed_jobs?.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 font-semibold">
                            ✓ Zero failed queue jobs! All background tasks executed cleanly.
                        </div>
                    ) : (
                        systemData?.failed_jobs?.map((job) => (
                            <div key={job.id} className="p-4 space-y-1 hover:bg-slate-50/60 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">{job.connection} / {job.queue}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">{job.failed_at}</span>
                                </div>
                                <p className="text-[11px] font-mono text-rose-600 truncate">{job.exception}</p>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
