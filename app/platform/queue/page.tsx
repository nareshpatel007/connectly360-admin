"use client";

import React from "react";
import { Server, Activity, RefreshCw, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function AdminQueueMonitorPage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <Server className="h-6 w-6 text-[#35877D]" />
                    Background Job Queue Monitor
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Laravel Queue / Horizon status for campaign dispatching, WhatsApp webhooks, and AI workers.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Active Workers</p>
                    <p className="text-xl font-black text-slate-900">12 Processes</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Horizon Active</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Pending Jobs</p>
                    <p className="text-xl font-black text-slate-900">0 Jobs</p>
                    <p className="text-[10px] text-slate-400">Queue clean</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Failed Jobs</p>
                    <p className="text-xl font-black text-slate-900">0 Failed</p>
                    <p className="text-[10px] text-slate-400">0 retries pending</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Throughput</p>
                    <p className="text-xl font-black text-[#35877D]">1,250 jobs/min</p>
                    <p className="text-[10px] text-slate-400">Peak capacity</p>
                </div>
            </div>
        </div>
    );
}
