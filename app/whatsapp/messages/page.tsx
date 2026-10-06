"use client";

import React, { useState } from "react";
import { MessageSquare, CheckCircle2, Clock, XCircle, Search, RefreshCw, Filter, Send } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SAMPLE_MESSAGES = [
    { id: "wamid.HBgLMTU1NTAxOTI4Mzc=", workspace: "Apex Logistics", direction: "Outbound (Template)", status: "Delivered", recipient: "+1 555-0192", credits: "1 Credit", timestamp: "Just now" },
    { id: "wamid.HBgLMTU1NTAxOTI4Mzg=", workspace: "Apex Logistics", direction: "Inbound (Customer)", status: "Received", recipient: "+1 555-0192", credits: "0 Credits (Free)", timestamp: "2 mins ago" },
    { id: "wamid.HBgLMTU1NTAxOTI4Mzk=", workspace: "Global Retail Co", direction: "Outbound (AI Chat)", status: "Read", recipient: "+44 7700 900077", credits: "1 Credit", timestamp: "5 mins ago" },
    { id: "wamid.HBgLMTU1NTAxOTI4NDA=", workspace: "MedCare Health", direction: "Outbound (Broadcast)", status: "Delivered", recipient: "+91 98765 43210", credits: "1 Credit", timestamp: "9 mins ago" },
    { id: "wamid.HBgLMTU1NTAxOTI4NDE=", workspace: "Urban Style Boutique", direction: "Outbound (Media)", status: "Delivered", recipient: "+1 555-0811", credits: "2 Credits", timestamp: "14 mins ago" },
];

export default function AdminMessageMonitorPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = SAMPLE_MESSAGES.filter(m =>
        m.workspace.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.recipient.includes(searchTerm) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            <AdminPageHeader
                icon={MessageSquare}
                title="WhatsApp Message Telemetry & Delivery Logs"
                description="Platform-wide message queue status, delivery receipts, and credit consumption tracking."
                breadcrumbs={[
                    { label: "WhatsApp", href: "/whatsapp" },
                    { label: "Message Monitor" }
                ]}
                actions={
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer">
                        <RefreshCw size={14} />
                        Refresh Live Feed
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <StatCard
                    title="24H Message Volume"
                    value="142,850"
                    icon={Send}
                    change="+18.4%"
                    changeType="positive"
                    subtitle="Inbound & Outbound"
                />
                <StatCard
                    title="Meta Delivery Rate"
                    value="99.4%"
                    icon={CheckCircle2}
                    change="Optimal"
                    changeType="positive"
                    subtitle="Delivered & Read"
                />
                <StatCard
                    title="Average Delivery Latency"
                    value="640 ms"
                    icon={Clock}
                    change="Normal"
                    changeType="neutral"
                    subtitle="Meta Cloud API webhook roundtrip"
                />
                <StatCard
                    title="Failed Messages"
                    value="12"
                    icon={XCircle}
                    change="0.01%"
                    changeType="negative"
                    subtitle="Invalid recipient numbers"
                />
            </div>

            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Recent WhatsApp Message Telemetry</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Live feed across all tenant WABA phone numbers</CardDescription>
                    </div>
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Filter by workspace or number..."
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
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Message ID</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workspace</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Type & Direction</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Credits</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Delivery Status</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {filtered.map((msg) => (
                                <TableRow key={msg.id} className="hover:bg-slate-50/60 transition-colors">
                                    <TableCell className="font-mono text-[11px] text-slate-500 py-3.5 truncate max-w-xs">{msg.id}</TableCell>
                                    <TableCell className="font-bold text-slate-900">{msg.workspace}</TableCell>
                                    <TableCell className="font-semibold text-slate-700">{msg.direction}</TableCell>
                                    <TableCell className="font-semibold text-slate-600">{msg.credits}</TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {msg.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-right">{msg.timestamp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
