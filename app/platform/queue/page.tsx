"use client";

import React from "react";
import { Server, Activity, RefreshCw, CheckCircle2, Clock, AlertTriangle, Layers } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const QUEUES = [
    { name: "whatsapp-broadcasts", pending: 0, processing: 3, failed: 0, throughput: "450/min", status: "Healthy" },
    { name: "webhook-ingestion", pending: 0, processing: 4, failed: 0, throughput: "520/min", status: "Healthy" },
    { name: "ai-resolution-workers", pending: 0, processing: 2, failed: 0, throughput: "180/min", status: "Healthy" },
    { name: "lead-crm-sync", pending: 0, processing: 1, failed: 0, throughput: "85/min", status: "Healthy" },
    { name: "auto-recharge-billing", pending: 0, processing: 2, failed: 0, throughput: "15/min", status: "Healthy" },
];

export default function AdminQueueMonitorPage() {
    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={Server}
                title="Background Job Queue Monitor"
                description="Laravel Queue / Horizon status for campaign dispatching, WhatsApp webhooks, and AI workers."
                breadcrumbs={[
                    { label: "Platform" },
                    { label: "Queue Monitor" }
                ]}
                actions={
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer">
                        <RefreshCw size={14} />
                        Refresh Horizon
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <StatCard
                    title="Active Workers"
                    value="12"
                    icon={Server}
                    change="ACTIVE"
                    changeType="positive"
                    subtitle="Horizon Daemon processes"
                />
                <StatCard
                    title="Pending Jobs"
                    value="0"
                    icon={Layers}
                    change="CLEAN"
                    changeType="positive"
                    subtitle="Zero backlog"
                />
                <StatCard
                    title="Failed Jobs"
                    value="0"
                    icon={CheckCircle2}
                    change="0 Retries"
                    changeType="positive"
                    subtitle="Last 24 hours"
                />
                <StatCard
                    title="Queue Throughput"
                    value="1,250/m"
                    icon={Clock}
                    change="+8.4%"
                    changeType="positive"
                    subtitle="Peak jobs processed"
                />
            </div>

            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-base font-bold text-slate-900">Redis Queue Pipelines</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Real-time status of asynchronous queue workers and consumers</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Queue Name</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Pending</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Processing</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Failed</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Throughput</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Health Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {QUEUES.map((q) => (
                                <TableRow key={q.name} className="hover:bg-slate-50/60 transition-colors">
                                    <TableCell className="font-bold font-mono text-slate-900 py-3.5">{q.name}</TableCell>
                                    <TableCell className="text-slate-600 font-bold">{q.pending}</TableCell>
                                    <TableCell className="text-[#35877D] font-bold">{q.processing}</TableCell>
                                    <TableCell className="text-slate-500">{q.failed}</TableCell>
                                    <TableCell className="text-slate-700 font-semibold">{q.throughput}</TableCell>
                                    <TableCell className="text-right">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {q.status}
                                        </span>
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
