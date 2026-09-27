"use client";

import React from "react";
import { Zap, Activity, CheckCircle2, Clock } from "lucide-react";

export default function AdminAutomationsPage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <Zap className="h-6 w-6 text-[#35877D]" />
                    Automation Workflow Monitor
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    System-wide execution monitor for workspace trigger workflows, delays, and action executions.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Active Workflows</p>
                    <p className="text-xl font-black text-slate-900">84 Active Workflows</p>
                    <p className="text-[10px] text-teal-600 font-bold">12,400 Executions / week</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Success Rate</p>
                    <p className="text-xl font-black text-emerald-600">99.9% Completed</p>
                    <p className="text-[10px] text-slate-400">0 failed queues</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Avg Trigger Delay</p>
                    <p className="text-xl font-black text-slate-900">&lt; 350 ms</p>
                    <p className="text-[10px] text-slate-400">Realtime Redis listener</p>
                </div>
            </div>
        </div>
    );
}
