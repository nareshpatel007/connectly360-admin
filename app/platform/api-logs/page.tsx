"use client";

import React from "react";
import { Terminal, Activity, CheckCircle2 } from "lucide-react";

export default function AdminPlatformApiLogsPage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <Terminal className="h-6 w-6 text-[#35877D]" />
                    Platform API Telemetry & Traffic Logs
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    System-wide HTTP API logs across all tenant workspaces, rate limits, and latency spikes.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Recent Platform API Traffic</h3>
                    <span className="text-xs text-slate-500">Global Stream</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Tenant Workspace</th>
                                <th className="px-4 py-3">Method & Endpoint</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Latency</th>
                                <th className="px-4 py-3">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            <tr className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-900">Apex Logistics</td>
                                <td className="px-4 py-3 font-mono text-slate-800">POST /api/v1/whatsapp/send</td>
                                <td className="px-4 py-3 text-emerald-600 font-bold">200 OK</td>
                                <td className="px-4 py-3 text-slate-500">114 ms</td>
                                <td className="px-4 py-3 text-slate-400">Just now</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
