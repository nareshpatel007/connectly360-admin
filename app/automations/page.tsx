"use client";

import React from "react";
import { Zap, Activity, CheckCircle2, Clock, PlayCircle, AlertCircle, RefreshCw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const SAMPLE_AUTOMATIONS = [
    { id: "wf_1", workspace: "Apex Logistics", name: "WhatsApp Welcome & Lead Capture", trigger: "Message Received", executions: 1240, status: "Active", lastRun: "2 mins ago" },
    { id: "wf_2", workspace: "Global Tech Inc", name: "Post-Sale Review Follow-up", trigger: "Deal Won (CRM)", executions: 582, status: "Active", lastRun: "14 mins ago" },
    { id: "wf_3", workspace: "Starlight Retail", name: "Abandoned Cart WhatsApp Recovery", trigger: "Cart Inactivity (1h)", executions: 890, status: "Active", lastRun: "22 mins ago" },
    { id: "wf_4", workspace: "Horizon Health", name: "Appointment Confirmation & Reminder", trigger: "Booking Created", executions: 341, status: "Active", lastRun: "45 mins ago" },
];

export default function AdminAutomationsPage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <AdminPageHeader
                icon={Zap}
                title="Automation Workflow Monitor"
                description="System-wide execution monitor for workspace trigger workflows, delays, and action executions."
                breadcrumbs={[{ label: "Automation Monitor" }]}
                actions={
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer">
                        <RefreshCw size={14} />
                        Refresh Monitor
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    title="Active Workflows"
                    value="84"
                    icon={Zap}
                    change="+12.4k / wk"
                    changeType="positive"
                    subtitle="Triggered executions"
                />
                <StatCard
                    title="Execution Success Rate"
                    value="99.9%"
                    icon={CheckCircle2}
                    change="0 Dead-letters"
                    changeType="positive"
                    subtitle="Across all workspaces"
                />
                <StatCard
                    title="Average Trigger Latency"
                    value="< 350ms"
                    icon={Clock}
                    change="Healthy"
                    changeType="neutral"
                    subtitle="Realtime Redis queue listener"
                />
            </div>

            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Highest Volume Tenant Workflows</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Real-time status of production automation rules across accounts</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workflow Name</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workspace</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Trigger Event</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Total Runs</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Status</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Last Execution</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {SAMPLE_AUTOMATIONS.map((wf) => (
                                <TableRow key={wf.id} className="hover:bg-slate-50/60 transition-colors">
                                    <TableCell className="font-bold text-slate-900 py-3.5">{wf.name}</TableCell>
                                    <TableCell className="text-slate-600">{wf.workspace}</TableCell>
                                    <TableCell className="text-slate-600 font-mono text-[11px]">{wf.trigger}</TableCell>
                                    <TableCell className="font-black text-slate-800">{wf.executions.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {wf.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-right">{wf.lastRun}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
