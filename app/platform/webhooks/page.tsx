"use client";

import React, { useState } from "react";
import { Webhook, Activity, CheckCircle2, Search, RefreshCw, RotateCcw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WEBHOOK_LOGS = [
    { id: "wh_1", event: "payment.captured", provider: "Razorpay", responseCode: 200, status: "Delivered", timestamp: "3 mins ago", attempts: 1 },
    { id: "wh_2", event: "messages.received", provider: "Meta Cloud API", responseCode: 200, status: "Delivered", timestamp: "5 mins ago", attempts: 1 },
    { id: "wh_3", event: "messages.status (read)", provider: "Meta Cloud API", responseCode: 200, status: "Delivered", timestamp: "9 mins ago", attempts: 1 },
    { id: "wh_4", event: "whatsapp.account_update", provider: "Meta Cloud API", responseCode: 200, status: "Delivered", timestamp: "18 mins ago", attempts: 1 },
    { id: "wh_5", event: "order.paid", provider: "Razorpay", responseCode: 200, status: "Delivered", timestamp: "25 mins ago", attempts: 1 },
];

export default function AdminPlatformWebhooksPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = WEBHOOK_LOGS.filter(w =>
        w.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <AdminPageHeader
                icon={Webhook}
                title="Platform Webhook Logs & Delivery Retry"
                description="Meta, Razorpay, and outbound tenant webhook event delivery logs and retry mechanisms."
                breadcrumbs={[
                    { label: "Platform" },
                    { label: "Webhook Logs" }
                ]}
                actions={
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer">
                        <RefreshCw size={14} />
                        Refresh Feed
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    title="Delivered Webhooks (24h)"
                    value="98,420"
                    icon={Webhook}
                    change="+22.1%"
                    changeType="positive"
                    subtitle="Inbound & Outbound events"
                />
                <StatCard
                    title="Delivery Success Rate"
                    value="100.0%"
                    icon={CheckCircle2}
                    change="0 Failed"
                    changeType="positive"
                    subtitle="Meta & Razorpay webhooks"
                />
                <StatCard
                    title="Average Ingestion Latency"
                    value="42 ms"
                    icon={Activity}
                    change="Optimal"
                    changeType="positive"
                    subtitle="Instant async queue dispatch"
                />
            </div>

            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Platform Webhook Ingestion Feed</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Live webhook event deliveries and verification responses</CardDescription>
                    </div>
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Filter by event or provider..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9 text-xs rounded-xl border-slate-200"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Event Type</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Provider</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Response Code</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Attempts</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Status</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {filtered.map((wh) => (
                                <TableRow key={wh.id} className="hover:bg-slate-50/60 transition-colors">
                                    <TableCell className="font-mono font-bold text-slate-900 py-3.5">{wh.event}</TableCell>
                                    <TableCell className="font-bold text-slate-700">{wh.provider}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {wh.responseCode} OK
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{wh.attempts} attempt</TableCell>
                                    <TableCell>
                                        <span className="text-emerald-700 font-semibold">{wh.status}</span>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-right">{wh.timestamp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
