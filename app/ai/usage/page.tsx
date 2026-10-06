"use client";

import React from "react";
import { Bot, Sparkles, Cpu, Activity, Zap } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminAiUsagePage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <AdminPageHeader
                icon={Bot}
                title="AI Platform Token & Model Usage"
                description="Monitor AI Assistant response generation volume, OpenAI/Gemini token billing, and agent escalations."
                breadcrumbs={[{ label: "AI Usage" }]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    title="Total Tokens Processed"
                    value="4,280,190"
                    icon={Cpu}
                    change="+18.4%"
                    changeType="positive"
                    subtitle="Tokens in last 30 days"
                />
                <StatCard
                    title="Active AI Agents"
                    value="29"
                    icon={Bot}
                    change="+4 new"
                    changeType="positive"
                    subtitle="Across 22 Workspaces"
                />
                <StatCard
                    title="Automated Resolution Rate"
                    value="95.8%"
                    icon={Sparkles}
                    change="4.2% Handoff"
                    changeType="neutral"
                    subtitle="Autonomous customer replies"
                />
            </div>

            {/* Model Distribution & Quota Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-base font-bold text-slate-900">Supported Model Endpoints</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Active language models provisioned for customer agents</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 divide-y divide-slate-100">
                        <div className="py-3 flex items-center justify-between first:pt-0">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Claude 3.5 Sonnet</p>
                                <p className="text-xs text-slate-400">High-complexity reasoning & CRM lead qualification</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Active (Default)</span>
                        </div>
                        <div className="py-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">GPT-4o Mini</p>
                                <p className="text-xs text-slate-400">Low-latency fast FAQ & quick support responses</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Active</span>
                        </div>
                        <div className="py-3 flex items-center justify-between last:pb-0">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Gemini 1.5 Flash</p>
                                <p className="text-xs text-slate-400">Knowledge Base PDF indexing & vector search</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Active</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-base font-bold text-slate-900">Workspace Token Consumption Policy</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Autonomous credit deduction per AI task</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 divide-y divide-slate-100">
                        <div className="py-3 flex items-center justify-between first:pt-0">
                            <span className="text-xs font-bold text-slate-700">Autonomous Chat Reply</span>
                            <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">1 Credit</span>
                        </div>
                        <div className="py-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Knowledge Document Semantic Search</span>
                            <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">2 Credits</span>
                        </div>
                        <div className="py-3 flex items-center justify-between last:pb-0">
                            <span className="text-xs font-bold text-slate-700">Automated Lead Data Extraction</span>
                            <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">1 Credit</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
