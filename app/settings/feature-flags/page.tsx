"use client";

import React, { useState } from "react";
import { ToggleRight, ShieldCheck, Zap, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface FeatureFlag {
    key: string;
    name: string;
    description: string;
    category: string;
    enabled: boolean;
}

const INITIAL_FLAGS: FeatureFlag[] = [
    { key: "ai_auto_handoff", name: "AI Smart Handoff Rules", category: "AI & Automation", description: "Enable intent-based sentiment escalation for customer chats", enabled: true },
    { key: "auto_recharge", name: "Razorpay Auto-Recharge", category: "Billing", description: "Allow tenants to authorize recurring credit topups via Razorpay UPI & Cards", enabled: true },
    { key: "whatsapp_template_sync", name: "Realtime Meta Template Sync", category: "WhatsApp", description: "Automatically poll and sync template approvals and message sample variables", enabled: true },
    { key: "developer_webhooks", name: "Custom Outbound Webhooks", category: "Developer", description: "Allow developer roles to register HTTP callback endpoints and signature verification", enabled: true },
    { key: "knowledge_base_rag", name: "Vector Search RAG Pipeline", category: "AI & Automation", description: "Semantic vector search across uploaded customer PDFs and documentation", enabled: true },
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
        <div className="space-y-6">
            <AdminPageHeader
                icon={ToggleRight}
                title="Platform Feature Flags & Rollouts"
                description="Control global feature switches, experimental capabilities, and tenant beta rollouts."
                breadcrumbs={[
                    { label: "Configuration", href: "/settings" },
                    { label: "Feature Flags" }
                ]}
            />

            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-base font-bold text-slate-900">Production Feature Switches</CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                        Toggle system-level capability rollouts instantly across the Connectly360 platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-slate-100">
                    {flags.map((flag) => (
                        <div key={flag.key} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2.5">
                                    <h3 className="text-sm font-bold text-slate-900">{flag.name}</h3>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                                        {flag.category}
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-400">({flag.key})</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{flag.description}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-xs font-bold ${flag.enabled ? "text-emerald-600" : "text-slate-400"}`}>
                                    {flag.enabled ? "Enabled" : "Disabled"}
                                </span>
                                <Switch
                                    checked={flag.enabled}
                                    onCheckedChange={() => toggleFlag(flag.key)}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
