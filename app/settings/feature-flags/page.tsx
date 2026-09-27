"use client";

import React, { useState } from "react";
import { ToggleRight, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

interface FeatureFlag {
    key: string;
    name: string;
    description: string;
    enabled: boolean;
}

const INITIAL_FLAGS: FeatureFlag[] = [
    { key: "ai_auto_handoff", name: "AI Smart Handoff Rules", description: "Enable intent-based sentiment escalation for customer chats", enabled: true },
    { key: "auto_recharge", name: "Razorpay Auto-Recharge", description: "Allow tenants to authorize recurring credit topups", enabled: true },
    { key: "whatsapp_template_sync", name: "Realtime Meta Template Sync", description: "Automatically poll and sync template statuses", enabled: true },
    { key: "developer_webhooks", name: "Custom Outbound Webhooks", description: "Allow developer roles to register HTTP callback endpoints", enabled: true }
];

export default function AdminFeatureFlagsPage() {
    const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS);

    const toggleFlag = (key: string) => {
        setFlags((prev) =>
            prev.map((f) => {
                if (f.key === key) {
                    const next = !f.enabled;
                    toast.success(`${f.name} is now ${next ? "ENABLED" : "DISABLED"}`);
                    return { ...f, enabled: next };
                }
                return f;
            })
        );
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <ToggleRight className="h-6 w-6 text-[#35877D]" />
                    Platform Feature Flags & Rollouts
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Control global feature switches, experimental capabilities, and tenant beta rollouts.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
                {flags.map((flag) => (
                    <div key={flag.key} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                {flag.name}
                                <span className="font-mono text-[10px] text-slate-400 font-normal">({flag.key})</span>
                            </h3>
                            <p className="text-xs text-slate-500">{flag.description}</p>
                        </div>
                        <button
                            onClick={() => toggleFlag(flag.key)}
                            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                                flag.enabled ? "bg-[#35877D]" : "bg-slate-300"
                            }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                    flag.enabled ? "translate-x-6" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
