"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Activity, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, Smartphone, Hash, Building2, AlertTriangle, Clock, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WabaAccount {
    id: number;
    tenant_id: number;
    workspace_name?: string;
    business_id?: string;
    waba_id?: string;
    phone_number_id?: string;
    display_phone_number?: string;
    verified_name?: string;
    quality_rating?: string;
    messaging_limit_tier?: string;
    code_verification_status?: string;
    registration_status?: string;
    connection_status?: string;
    webhook_status?: string;
    last_webhook_subscription_at?: string;
    last_sync_at?: string;
    last_registration_error?: {
        message?: string;
        code?: number | string;
        fbtrace_id?: string;
        http_status?: number;
    } | null;
    created_at?: string;
}

export default function AdminWabaMonitoringPage() {
    const [accounts, setAccounts] = useState<WabaAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAccounts = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch("/api/admin/whatsapp");
            const json = await res.json();
            if (json.status && Array.isArray(json.data)) {
                setAccounts(json.data);
            }
        } catch (e) {
            console.error("Failed to fetch WhatsApp accounts:", e);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const registeredCount = accounts.filter(a => a.registration_status === "REGISTERED" || a.connection_status === "connected").length;
    const pendingCount = accounts.filter(a => a.registration_status === "REGISTRATION_PENDING" || a.connection_status === "pending_registration").length;
    const failedCount = accounts.filter(a => a.registration_status === "REGISTRATION_FAILED").length;

    const getRegBadge = (status?: string) => {
        switch (status) {
            case "REGISTERED":
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Registered</Badge>;
            case "REGISTRATION_PENDING":
                return <Badge className="bg-amber-50 text-amber-800 border-amber-200">Pending PIN</Badge>;
            case "REGISTERING":
                return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Registering...</Badge>;
            case "REGISTRATION_FAILED":
                return <Badge className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
            default:
                return <Badge className="bg-slate-50 text-slate-600 border-slate-200">Not Registered</Badge>;
        }
    };

    const getConnBadge = (status?: string) => {
        switch (status) {
            case "connected":
                return <Badge className="bg-emerald-50 text-[#35877D] border-emerald-200">Connected</Badge>;
            case "pending_registration":
                return <Badge className="bg-amber-50 text-amber-800 border-amber-200">Pending Reg</Badge>;
            default:
                return <Badge className="bg-slate-50 text-slate-500 border-slate-200">Disconnected</Badge>;
        }
    };

    const getWebhookBadge = (status?: string) => {
        switch (status) {
            case "SUBSCRIBED":
                return <span className="text-emerald-700 font-bold text-xs">Subscribed</span>;
            case "FAILED":
                return <span className="text-red-600 font-bold text-xs">Failed</span>;
            default:
                return <span className="text-slate-400 font-medium text-xs">Not Subscribed</span>;
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={Activity}
                title="WABA Accounts & Meta Cloud API Monitoring"
                description="Operational status of tenant WhatsApp Business Accounts, phone numbers, registration state, and Meta webhooks."
                breadcrumbs={[
                    { label: "WhatsApp", href: "/whatsapp" },
                    { label: "WABA Monitoring" }
                ]}
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchAccounts}
                        disabled={isRefreshing}
                        className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer"
                    >
                        <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#35877D]" : ""} />
                        Refresh Accounts
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard
                    title="Active Numbers"
                    value={`${accounts.length} Numbers`}
                    icon={Smartphone}
                    change={`${registeredCount} Registered`}
                    changeType="positive"
                    subtitle="Discovered via Meta Embedded Signup"
                />
                <StatCard
                    title="Pending Registration"
                    value={`${pendingCount} Pending`}
                    icon={Clock}
                    change={failedCount > 0 ? `${failedCount} Failed` : "0 Failures"}
                    changeType={failedCount > 0 ? "negative" : "positive"}
                    subtitle="Awaiting PIN registration API call"
                />
                <StatCard
                    title="Meta Webhook Subscriptions"
                    value={`${accounts.filter(a => a.webhook_status === "SUBSCRIBED").length} Active`}
                    icon={Activity}
                    change="WABA Event Pipe"
                    changeType="positive"
                    subtitle="Subscribed apps verified"
                />
            </div>

            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-base font-bold text-slate-900">Tenant WhatsApp Business Phone Numbers</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Cloud API connectivity, registration status, and webhook diagnostics per workspace</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workspace</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Phone &amp; Verified Name</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Meta Identifiers</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Registration Status</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Connection</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Webhook</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Last Sync / Error</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                                        Loading WhatsApp accounts...
                                    </TableCell>
                                </TableRow>
                            ) : accounts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                                        No WhatsApp accounts found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                accounts.map((acc) => (
                                    <TableRow key={acc.id} className="hover:bg-slate-50/60 transition-colors">
                                        <TableCell className="font-bold text-slate-900 py-3.5">
                                            {acc.workspace_name || `Workspace #${acc.tenant_id}`}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-slate-800">{acc.verified_name || "Unverified Name"}</div>
                                            <div className="font-mono text-[11px] text-slate-500">{acc.display_phone_number || "No number"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono text-[11px] text-slate-600">WABA: {acc.waba_id || "-"}</div>
                                            <div className="font-mono text-[10px] text-slate-400">Phone ID: {acc.phone_number_id || "-"}</div>
                                        </TableCell>
                                        <TableCell>
                                            {getRegBadge(acc.registration_status)}
                                        </TableCell>
                                        <TableCell>
                                            {getConnBadge(acc.connection_status)}
                                        </TableCell>
                                        <TableCell>
                                            {getWebhookBadge(acc.webhook_status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {acc.last_registration_error ? (
                                                <div className="text-red-600 font-medium text-[11px] max-w-[200px] truncate ml-auto" title={acc.last_registration_error.message}>
                                                    Err {acc.last_registration_error.code || ""}: {acc.last_registration_error.message}
                                                </div>
                                            ) : acc.last_sync_at ? (
                                                <div className="text-slate-500 text-[11px]">
                                                    {new Date(acc.last_sync_at).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <div className="text-slate-400 text-[11px]">-</div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
