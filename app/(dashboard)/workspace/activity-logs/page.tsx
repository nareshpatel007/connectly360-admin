"use client";

import { useEffect, useState } from "react";
import { Activity, Loader2, Info } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface LogItem {
    id: number;
    action: string;
    description: string;
    ip_address: string | null;
    created_at: string;
}

export default function ActivityLogsPage() {
    const { token } = useAuth();
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/reports/activity-logs", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const result = await res.json();
                if (result.status) {
                    setLogs(result.data);
                }
            } catch (err) {
                console.error("Failed to load activity logs", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchLogs();
        }
    }, [token]);

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <Activity size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Activity Logs</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Audit log tracking all login, purchase, and workspace configuration changes.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="animate-spin text-[#378179] h-7 w-7" />
                    <p className="text-xs text-slate-400 font-medium font-sans">Loading activity history...</p>
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 shadow-xs">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Activity size={18} />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-800">No activity logged</h3>
                        <p className="text-xs text-slate-400 mt-0.5 max-w-xs leading-normal">Your actions, login events, and transaction history will appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-slate-150 bg-slate-50/60 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <span className="col-span-3">Event Action</span>
                        <span className="col-span-6">Description</span>
                        <span className="col-span-3">Date & Time</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/30 transition-colors">
                                <div className="col-span-3 flex items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                        log.action === "login" 
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                            : log.action === "subscription_purchase" || log.action === "credit_purchase"
                                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                                            : "bg-blue-50 text-blue-700 border border-blue-100"
                                    }`}>
                                        {log.action.replace("_", " ")}
                                    </span>
                                </div>
                                <div className="col-span-6 text-xs text-slate-700 font-semibold leading-relaxed">
                                    {log.description}
                                    {log.ip_address && (
                                        <span className="block text-[10px] text-slate-400 font-sans mt-0.5">IP Address: {log.ip_address}</span>
                                    )}
                                </div>
                                <div className="col-span-3 text-[11px] text-slate-400 font-semibold">
                                    {new Date(log.created_at).toLocaleString("en-IN")}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
