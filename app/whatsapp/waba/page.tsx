"use client";

import React from "react";
import { MessageCircle, Activity, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, Smartphone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const WABA_ACCOUNTS = [
    { id: "waba_1", workspace: "Apex Logistics", phoneNumber: "+1 555-0192", displayTitle: "Apex Logistics Support", tier: "Tier 2 (10k msgs/day)", quality: "High", webhook: "Active (200 OK)" },
    { id: "waba_2", workspace: "Global Retail Co", phoneNumber: "+44 7700 900077", displayTitle: "Global Retail Deals", tier: "Tier 3 (100k msgs/day)", quality: "High", webhook: "Active (200 OK)" },
    { id: "waba_3", workspace: "MedCare Health", phoneNumber: "+91 98765 43210", displayTitle: "MedCare Appointments", tier: "Tier 1 (1k msgs/day)", quality: "High", webhook: "Active (200 OK)" },
    { id: "waba_4", workspace: "Urban Style Boutique", phoneNumber: "+1 555-0811", displayTitle: "Urban Boutique VIP", tier: "Tier 1 (1k msgs/day)", quality: "Medium", webhook: "Active (200 OK)" },
];

export default function AdminWabaMonitoringPage() {
    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={Activity}
                title="WABA Accounts & Meta Cloud API Monitoring"
                description="Operational status of tenant WhatsApp Business Accounts, phone numbers, and Meta webhooks."
                breadcrumbs={[
                    { label: "WhatsApp", href: "/whatsapp" },
                    { label: "WABA Monitoring" }
                ]}
                actions={
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer">
                        <RefreshCw size={14} />
                        Verify Meta Graph API
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard
                    title="Connected WABAs"
                    value="38 Numbers"
                    icon={Smartphone}
                    change="100% Verified"
                    changeType="positive"
                    subtitle="Meta System User Tokens valid"
                />
                <StatCard
                    title="Quality Rating"
                    value="HIGH Quality"
                    icon={ShieldCheck}
                    change="0 Restricted"
                    changeType="positive"
                    subtitle="Platform green health score"
                />
                <StatCard
                    title="Meta Webhook Latency"
                    value="82 ms"
                    icon={Activity}
                    change="Realtime"
                    changeType="positive"
                    subtitle="Callback dispatch pipeline"
                />
            </div>

            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-base font-bold text-slate-900">Tenant WhatsApp Business Phone Numbers</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Cloud API connectivity and Meta tier limits per workspace</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workspace</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Display Name & Phone</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Messaging Tier</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Quality Rating</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Webhook Health</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {WABA_ACCOUNTS.map((acc) => (
                                <TableRow key={acc.id} className="hover:bg-slate-50/60 transition-colors">
                                    <TableCell className="font-bold text-slate-900 py-3.5">{acc.workspace}</TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-slate-800">{acc.displayTitle}</div>
                                        <div className="font-mono text-[11px] text-slate-500">{acc.phoneNumber}</div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-slate-700">{acc.tier}</TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {acc.quality}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-emerald-700 font-bold">{acc.webhook}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
