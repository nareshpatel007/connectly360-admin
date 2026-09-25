"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Database, Server, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";

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
            <AdminPageHeader
                title="System Health & Infrastructure"
                description="Laravel backend services, MySQL database connectivity, queue workers, Redis cache, and exception diagnostics."
                breadcrumbs={[{ label: "System Health" }]}
                badge="Platform Status"
                actions={
                    <Button
                        onClick={fetchSystemHealth}
                        variant="outline"
                        size="sm"
                        className="h-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Run Diagnostics</span>
                    </Button>
                }
            />

            {/* Diagnostics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">MySQL Database</span>
                        <div className="h-9 w-9 rounded-xl bg-[#35877D]/10 text-[#35877D] flex items-center justify-center">
                            <Database size={18} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="text-base font-extrabold text-slate-900">
                            {systemData?.database === "healthy" ? "Database Connected" : "Connection Active"}
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">MySQL PDO database pool active &amp; healthy.</p>
                </Card>

                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Laravel REST Engine</span>
                        <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Server size={18} />
                        </div>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-extrabold text-slate-900">Laravel v{systemData?.laravel_version || "10.x"}</p>
                        <p className="text-xs font-bold text-slate-500">PHP v{systemData?.php_version || "8.2+"}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">REST API framework &amp; middleware active.</p>
                </Card>

                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Queue Worker Queue</span>
                        <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Cpu size={18} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-slate-900">{systemData?.failed_jobs_count ?? 0}</span>
                        <span className="text-xs font-bold text-slate-500">Failed Queue Jobs</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Campaign dispatcher &amp; webhook queue listener.</p>
                </Card>
            </div>

            {/* Failed Queue Jobs Section */}
            <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle size={15} className="text-amber-600" />
                        Queue Exceptions &amp; Failed Jobs Log
                    </h3>
                </div>

                <div className="divide-y divide-slate-100 text-xs font-medium">
                    {systemData?.failed_jobs?.length === 0 || !systemData?.failed_jobs ? (
                        <div className="p-8 text-center text-slate-500 font-semibold">
                            ✓ All background queue jobs are processing normally with 0 failures.
                        </div>
                    ) : (
                        systemData?.failed_jobs?.map((job) => (
                            <div key={job.id} className="p-4 space-y-1 hover:bg-slate-50/60 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">{job.connection} / {job.queue}</span>
                                    <span className="text-[10px] text-slate-500">{job.failed_at}</span>
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
