"use client";

import React from "react";
import { MessageSquare, CheckCircle2, Clock, XCircle, Search } from "lucide-react";

export default function AdminMessageMonitorPage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <MessageSquare className="h-6 w-6 text-[#35877D]" />
                    WhatsApp Message Telemetry & Delivery Logs
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Platform-wide message queue status, failed deliveries, and credit consumption tracking.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Recent Message Telemetry Logs</h3>
                    <span className="text-xs text-slate-500">Live feed</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Message ID</th>
                                <th className="px-4 py-3">Workspace</th>
                                <th className="px-4 py-3">Direction</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            <tr className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3 font-mono text-slate-900">wamid.HBgLMTU1NTAxOTI4Mzc=</td>
                                <td className="px-4 py-3 font-bold text-slate-900">Apex Logistics</td>
                                <td className="px-4 py-3 text-emerald-600 font-bold">Outbound (Template)</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 size={12} /> Delivered
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-400">Just now</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
