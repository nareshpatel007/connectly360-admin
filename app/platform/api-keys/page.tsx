"use client";

import React, { useState, useEffect } from "react";
import {
    Key,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Search,
    RefreshCw,
    Ban,
    Eye,
    AlertTriangle,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AdminApiKeyItem {
    id: number;
    tenant_id: number;
    workspace_name: string;
    name: string;
    environment: "live" | "test";
    status: "active" | "revoked" | "expired";
    key_prefix: string;
    key_masked: string;
    scopes: string[];
    last_used_at: string | null;
    last_used_human: string;
    expires_at: string | null;
    created_at: string;
    created_by: { id: number; name: string } | null;
    revoked_at: string | null;
}

export default function AdminPlatformApiKeysPage() {
    const [keys, setKeys] = useState<AdminApiKeyItem[]>([]);
    const [counts, setCounts] = useState({ total: 0, active: 0, revoked: 0, expired: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [envFilter, setEnvFilter] = useState("all");

    // Revoke modal
    const [selectedKey, setSelectedKey] = useState<AdminApiKeyItem | null>(null);
    const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
    const [revokeReason, setRevokeReason] = useState("");
    const [isRevoking, setIsRevoking] = useState(false);

    const fetchKeys = async (indicator = false) => {
        if (indicator) setIsRefreshing(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.append("status", statusFilter);
            if (envFilter !== "all") params.append("environment", envFilter);
            if (searchQuery.trim()) params.append("search", searchQuery.trim());

            const res = await fetch(`/api/admin/api-keys?${params.toString()}`);
            const json = await res.json();
            if (json.success) {
                setKeys(json.data || []);
                if (json.counts) setCounts(json.counts);
            } else {
                toast.error(json.message || "Failed to load keys");
            }
        } catch {
            toast.error("Network error while fetching platform API keys");
        } finally {
            setIsLoading(false);
            if (indicator) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, [statusFilter, envFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchKeys();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleConfirmRevoke = async () => {
        if (!selectedKey) return;
        setIsRevoking(true);
        try {
            const res = await fetch(`/api/admin/api-keys/${selectedKey.id}/revoke`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: revokeReason.trim() || "Administrative security action" }),
            });
            const json = await res.json();
            if (json.success) {
                toast.success(`API key '${selectedKey.name}' revoked successfully.`);
                setIsRevokeModalOpen(false);
                setSelectedKey(null);
                setRevokeReason("");
                fetchKeys();
            } else {
                toast.error(json.message || "Failed to revoke key");
            }
        } catch {
            toast.error("Network error while revoking API key");
        } finally {
            setIsRevoking(false);
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={Key}
                title="Platform Tenant API Keys Monitoring"
                description="Cross-tenant API credentials monitoring, prefix audit, and emergency platform-level revocation."
                breadcrumbs={[
                    { label: "Platform" },
                    { label: "API Keys" }
                ]}
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchKeys(true)}
                        className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer"
                    >
                        <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#35877D]" : ""} />
                        Refresh Keys
                    </Button>
                }
            />

            {/* Zero-Plaintext Security Banner */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
                <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div className="space-y-0.5">
                    <p className="font-bold">Strict Platform Zero-Plaintext Policy</p>
                    <p className="text-amber-800 leading-relaxed">
                        For cryptographic safety, customer API secret material is never stored in plaintext and cannot be viewed by platform administrators. Only indexed key prefixes, masked representations, and usage telemetry are visible.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard
                    title="Total Tenant Keys"
                    value={counts.total.toString()}
                    icon={Key}
                    change="All Workspaces"
                    changeType="neutral"
                    subtitle="Platform credentials"
                />
                <StatCard
                    title="Active Keys"
                    value={counts.active.toString()}
                    icon={CheckCircle2}
                    change="Authorized"
                    changeType="positive"
                    subtitle="Currently authenticating"
                />
                <StatCard
                    title="Revoked Keys"
                    value={counts.revoked.toString()}
                    icon={Ban}
                    change="Inactive"
                    changeType="negative"
                    subtitle="Decommissioned credentials"
                />
                <StatCard
                    title="Expired Keys"
                    value={counts.expired.toString()}
                    icon={Clock}
                    change="Past TTL"
                    changeType="neutral"
                    subtitle="Reached expiry date"
                />
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search by workspace, key name, or prefix..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 rounded-xl bg-white border-slate-200 text-xs"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                statusFilter === "all" ? "bg-white text-slate-900 shadow-2xs font-bold" : "hover:text-slate-900"
                            }`}
                        >
                            All ({counts.total})
                        </button>
                        <button
                            onClick={() => setStatusFilter("active")}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                statusFilter === "active" ? "bg-white text-emerald-700 shadow-2xs font-bold" : "hover:text-slate-900"
                            }`}
                        >
                            Active ({counts.active})
                        </button>
                        <button
                            onClick={() => setStatusFilter("revoked")}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                statusFilter === "revoked" ? "bg-white text-rose-700 shadow-2xs font-bold" : "hover:text-slate-900"
                            }`}
                        >
                            Revoked ({counts.revoked})
                        </button>
                    </div>

                    <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                        <button
                            onClick={() => setEnvFilter("all")}
                            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                                envFilter === "all" ? "bg-white text-slate-900 shadow-2xs font-bold" : "hover:text-slate-900"
                            }`}
                        >
                            All Envs
                        </button>
                        <button
                            onClick={() => setEnvFilter("live")}
                            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                                envFilter === "live" ? "bg-white text-[#35877D] shadow-2xs font-bold" : "hover:text-slate-900"
                            }`}
                        >
                            Live
                        </button>
                        <button
                            onClick={() => setEnvFilter("test")}
                            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                                envFilter === "test" ? "bg-white text-amber-700 shadow-2xs font-bold" : "hover:text-slate-900"
                            }`}
                        >
                            Test
                        </button>
                    </div>
                </div>
            </div>

            {/* Keys Table */}
            <Card className="border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-100 pb-3">
                    <CardTitle className="text-sm font-bold text-slate-900">Workspace API Credentials</CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                        Overview of tenant-generated REST tokens, environments, and usage timestamps.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50 border-b border-slate-200">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-bold text-[11px] text-slate-500">Workspace</TableHead>
                                    <TableHead className="font-bold text-[11px] text-slate-500">Key Name</TableHead>
                                    <TableHead className="font-bold text-[11px] text-slate-500">Prefix</TableHead>
                                    <TableHead className="font-bold text-[11px] text-slate-500">Environment</TableHead>
                                    <TableHead className="font-bold text-[11px] text-slate-500">Status</TableHead>
                                    <TableHead className="font-bold text-[11px] text-slate-500">Scopes</TableHead>
                                    <TableHead className="font-bold text-[11px] text-slate-500">Last Used</TableHead>
                                    <TableHead className="font-bold text-[11px] text-slate-500 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-100 text-xs">
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-10 text-slate-400">
                                            Loading platform API keys...
                                        </TableCell>
                                    </TableRow>
                                ) : keys.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                                            No API keys found matching filter criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    keys.map((k) => (
                                        <TableRow key={k.id} className="hover:bg-slate-50/70 transition-colors">
                                            <TableCell className="font-bold text-slate-800">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 size={13} className="text-slate-400" />
                                                    {k.workspace_name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-900">{k.name}</TableCell>
                                            <TableCell className="font-mono text-slate-600 font-semibold">{k.key_prefix}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                                                        k.environment === "live"
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                                    }`}
                                                >
                                                    {k.environment}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                        k.status === "active"
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                                    }`}
                                                >
                                                    {k.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {k.scopes?.slice(0, 2).map((s) => (
                                                        <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                                                            {s}
                                                        </span>
                                                    ))}
                                                    {(k.scopes?.length || 0) > 2 && (
                                                        <span className="text-[10px] text-slate-400 font-semibold">
                                                            +{(k.scopes?.length || 0) - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-500">{k.last_used_human}</TableCell>
                                            <TableCell className="text-right">
                                                {k.status === "active" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedKey(k);
                                                            setIsRevokeModalOpen(true);
                                                        }}
                                                        className="h-8 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer text-xs font-semibold"
                                                    >
                                                        <Ban size={13} className="mr-1" />
                                                        Revoke
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Admin Emergency Revoke Modal */}
            <Dialog open={isRevokeModalOpen} onOpenChange={setIsRevokeModalOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl bg-white p-6">
                    <DialogHeader>
                        <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-2">
                            <ShieldAlert className="text-rose-600" size={20} />
                        </div>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Emergency Administrative Revocation
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Revoke key &apos;{selectedKey?.name}&apos; ({selectedKey?.key_prefix}) for workspace &apos;{selectedKey?.workspace_name}&apos;.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2 text-xs">
                        <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-rose-800 leading-relaxed">
                            This platform-level action will immediately invalidate this token across all API edge nodes. All subsequent requests will fail with <strong>401 Unauthorized</strong>.
                        </div>

                        <div className="space-y-1">
                            <label className="font-bold text-slate-800">Reason for Administrative Revocation</label>
                            <Input
                                placeholder="e.g. Compromised credential report, terms violation, tenant request"
                                value={revokeReason}
                                onChange={(e) => setRevokeReason(e.target.value)}
                                className="h-9 rounded-xl text-xs bg-slate-50/50"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-3 border-t border-slate-100">
                        <Button
                            variant="outline"
                            onClick={() => setIsRevokeModalOpen(false)}
                            className="rounded-xl text-xs font-semibold border-slate-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmRevoke}
                            disabled={isRevoking}
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
                        >
                            {isRevoking ? "Revoking..." : "Confirm Revocation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
