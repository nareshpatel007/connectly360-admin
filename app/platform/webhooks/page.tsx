"use client";

import React from "react";
import { Webhook, Activity, CheckCircle2 } from "lucide-react";

export default function AdminPlatformWebhooksPage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <Webhook className="h-6 w-6 text-[#35877D]" />
                    Platform Webhook Logs & Delivery Retry
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Meta, Razorpay, and outbound tenant webhook event delivery logs and retry mechanisms.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Platform Webhook Ingestion Feed</h3>
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Webhook Listeners Online
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Event Type</th>
                                <th className="px-4 py-3">Provider</th>
                                <th className="px-4 py-3">Response Code</th>
                                <th className="px-4 py-3">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            <tr className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3 font-mono text-slate-900">payment.captured</td>
                                <td className="px-4 py-3 font-bold text-slate-900">Razorpay</td>
                                <td className="px-4 py-3 text-emerald-600 font-bold">200 OK</td>
                                <td className="px-4 py-3 text-slate-400">3 mins ago</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3 font-mono text-slate-900">messages.received</td>
                                <td className="px-4 py-3 font-bold text-slate-900">Meta Cloud API</td>
                                <td className="px-4 py-3 text-emerald-600 font-bold">200 OK</td>
                                <td className="px-4 py-3 text-slate-400">5 mins ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
