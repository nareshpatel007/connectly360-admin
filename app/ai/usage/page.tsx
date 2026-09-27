"use client";

import React from "react";
import { Bot, Sparkles, Cpu, Activity } from "lucide-react";

export default function AdminAiUsagePage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <Bot className="h-6 w-6 text-[#35877D]" />
                    AI Platform Token & Model Usage
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Monitor AI Assistant response generation volume, OpenAI/Gemini token billing, and agent escalations.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Total Tokens Processed</p>
                    <p className="text-xl font-black text-slate-900">4,280,190 Tokens</p>
                    <p className="text-[10px] text-teal-600 font-bold">Last 30 Days</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Active AI Agents</p>
                    <p className="text-xl font-black text-slate-900">29 Active Agents</p>
                    <p className="text-[10px] text-slate-500">Across 22 Workspaces</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Human Escalation Rate</p>
                    <p className="text-xl font-black text-emerald-600">4.2% Handoff</p>
                    <p className="text-[10px] text-slate-400">95.8% automated resolution</p>
                </div>
            </div>
        </div>
    );
}
