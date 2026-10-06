"use client";

import React, { useState } from "react";
import { Terminal, Activity, CheckCircle2, Search, RefreshCw, Filter, ArrowUpRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SAMPLE_LOGS = [
    { id: "log_1", workspace: "Apex Logistics", method: "POST", endpoint: "/api/v1/whatsapp/send", status: 200, statusText: "OK", latency: "114 ms", timestamp: "Just now", ip: "157.240.22.35" },
    { id: "log_2", workspace: "Global Retail Co", method: "POST", endpoint: "/api/v1/contacts/sync", status: 201, statusText: "Created", latency: "185 ms", timestamp: "2 mins ago", ip: "103.21.244.0" },
    { id: "log_3", workspace: "Starlight Retail", method: "GET", endpoint: "/api/v1/templates", status: 200, statusText: "OK", latency: "64 ms", timestamp: "4 mins ago", ip: "103.22.200.12" },
    { id: "log_4", workspace: "Horizon Health", method: "POST", endpoint: "/api/v1/automations/trigger", status: 200, statusText: "OK", latency: "92 ms", timestamp: "7 mins ago", ip: "141.101.120.8" },
    { id: "log_5", workspace: "Urban Boutique", method: "POST", endpoint: "/api/v1/whatsapp/send", status: 429, statusText: "Too Many Requests", latency: "28 ms", timestamp: "12 mins ago", ip: "188.114.96.1" },
];

export default function AdminPlatformApiLogsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = SAMPLE_LOGS.filter(l =>
        l.workspace.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <AdminPageHeader
                icon={Terminal}
                title="Platform API Telemetry & Traffic Logs"
                description="System-wide HTTP API logs across all tenant workspaces, rate limits, and latency spikes."
                breadcrumbs={[
                    { label: "Platform" },
                    { label: "API Logs" }
                ]}
                actions={
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer">
                        <RefreshCw size={14} />
                        Refresh Logs
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    title="24H Inbound Requests"
                    value="482,910"
                    icon={Terminal}
                    change="+14.2%"
                    changeType="positive"
                    subtitle="Platform API calls"
                />
                <StatCard
                    title="Average API Latency"
                    value="86 ms"
                    icon={Activity}
                    change="Optimal"
                    changeType="positive"
                    subtitle="99th percentile: 210ms"
                />
                <StatCard
                    title="Error Rate (4xx / 5xx)"
                    value="0.04%"
                    icon={CheckCircle2}
                    change="Low"
                    changeType="positive"
                    subtitle="429 rate limit triggers: 18"
                />
            </div>

            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Recent Platform API Traffic</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Live request stream across REST endpoints</CardDescription>
                    </div>
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Filter by workspace or endpoint..."
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
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workspace</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Method & Endpoint</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Status</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Latency</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Client IP</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {filtered.map((log) => (
                                <TableRow key={log.id} className="hover:bg-slate-50/60 transition-colors">
                                    <TableCell className="font-bold text-slate-900 py-3.5">{log.workspace}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.method === "POST" ? "bg-teal-50 text-[#35877D]" : "bg-blue-50 text-blue-700"}`}>
                                                {log.method}
                                            </span>
                                            <span className="text-slate-800">{log.endpoint}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${log.status < 300 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                                            {log.status} {log.statusText}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{log.latency}</TableCell>
                                    <TableCell className="text-slate-500 font-mono text-[11px]">{log.ip}</TableCell>
                                    <TableCell className="text-slate-500 text-right">{log.timestamp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
