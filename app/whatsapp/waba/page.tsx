"use client";

import React from "react";
import { MessageCircle, Activity, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminWabaMonitoringPage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <Activity className="h-6 w-6 text-[#35877D]" />
                    WABA Accounts & Meta Cloud API Monitoring
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Operational status of tenant WhatsApp Business Accounts, phone numbers, and Meta webhooks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Connected WABAs</p>
                    <p className="text-xl font-black text-slate-900">38 Numbers</p>
                    <p className="text-[10px] text-emerald-600 font-bold">100% Meta Token Verified</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Quality Rating</p>
                    <p className="text-xl font-black text-emerald-600">HIGH Quality</p>
                    <p className="text-[10px] text-slate-400">0 accounts restricted</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Meta Webhook Latency</p>
                    <p className="text-xl font-black text-slate-900">82 ms</p>
                    <p className="text-[10px] text-slate-400">Realtime delivery active</p>
                </div>
            </div>
        </div>
    );
}
