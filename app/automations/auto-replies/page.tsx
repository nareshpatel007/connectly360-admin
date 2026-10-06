"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { AdminPageHeader } from "@/components/admin-page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Zap,
    MessageSquare,
    CheckCircle2,
    Clock,
    RefreshCw,
    Search,
    Building2,
    Hash,
    Eye,
    Trash2,
    AlertCircle,
    Send,
    Activity
} from "lucide-react";

interface AdminRuleRecord {
    id: number;
    tenant_id: number;
    workspace_name?: string;
    workspace_id?: number;
    name: string;
    keyword: string;
    reply: string;
    match_type?: string;
    priority?: number;
    status: number;
    executed_count: number;
    last_triggered_at?: string | null;
    created_at: string;
    updated_at: string;
}

interface TriggerRecord {
    id: number;
    rule_id: number;
    matched_keyword: string;
    incoming_message?: string;
    reply_message?: string;
    created_at: string;
}

export default function AdminAutoReplyRulesPage() {
    const { token } = useAuth();
    const [rules, setRules] = useState<AdminRuleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_workflows: 0,
        active_workflows: 0,
        total_executions: 0,
        active_tenants: 0,
    });

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Detail Dialog
    const [inspectingRule, setInspectingRule] = useState<AdminRuleRecord | null>(null);
    const [ruleTriggers, setRuleTriggers] = useState<TriggerRecord[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Delete Confirmation
    const [deletingRule, setDeletingRule] = useState<AdminRuleRecord | null>(null);

    const fetchRules = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search.trim()) params.append("search", search.trim());
            if (statusFilter !== "all") params.append("status", statusFilter);

            const res = await fetch(`/api/admin/automations?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setRules(data.data || []);
                if (data.stats) {
                    setStats(data.stats);
                }
            } else {
                toast.error(data.message || "Failed to load automation rules.");
            }
        } catch {
            toast.error("Network error while loading auto-reply rules.");
        } finally {
            setLoading(false);
        }
    }, [token, search, statusFilter]);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const handleToggleStatus = async (rule: AdminRuleRecord) => {
        const nextStatus = rule.status === 1 ? 0 : 1;
        try {
            const res = await fetch(`/api/admin/automations/${rule.id}/status`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({ status: nextStatus })
            });
            const data = await res.json();
            if (data.status) {
                toast.success(`Rule "${rule.name}" status updated`);
                fetchRules();
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch {
            toast.error("Network error updating rule status.");
        }
    };

    const handleInspectRule = async (rule: AdminRuleRecord) => {
        setInspectingRule(rule);
        setLoadingDetails(true);
        try {
            const res = await fetch(`/api/admin/automations/${rule.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status && data.data) {
                setRuleTriggers(data.data.triggers || []);
            }
        } catch {
            // Keep inspecting rule open without crashing
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleDeleteRule = async () => {
        if (!deletingRule) return;
        try {
            const res = await fetch(`/api/admin/automations/${deletingRule.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Rule deleted permanently");
                setDeletingRule(null);
                fetchRules();
            } else {
                toast.error(data.message || "Failed to delete rule");
            }
        } catch {
            toast.error("Network error deleting rule.");
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <AdminPageHeader
                icon={MessageSquare}
                title="WhatsApp Auto-Reply Rules Monitor"
                description="Cross-workspace monitoring of automated WhatsApp responses, trigger keywords, and execution statistics."
                breadcrumbs={[
                    { label: "AI & Automation" },
                    { label: "Auto-Reply Rules" }
                ]}
                badge={`${stats.total_workflows} Total Rules`}
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchRules}
                        className="rounded-xl border-slate-200 text-slate-700 h-9 font-semibold gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={13} className={loading ? "animate-spin text-[#35877D]" : ""} />
                        Refresh Monitor
                    </Button>
                }
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard
                    title="Configured Rules"
                    value={stats.total_workflows.toString()}
                    icon={MessageSquare}
                    change="Across all tenants"
                    changeType="neutral"
                    subtitle="Keyword triggers"
                />
                <StatCard
                    title="Active Rules"
                    value={stats.active_workflows.toString()}
                    icon={CheckCircle2}
                    change="Live in production"
                    changeType="positive"
                    subtitle="Currently matching"
                />
                <StatCard
                    title="Total Replies Sent"
                    value={stats.total_executions.toLocaleString()}
                    icon={Zap}
                    change="Dispatched webhooks"
                    changeType="positive"
                    subtitle="Outgoing WhatsApp messages"
                />
                <StatCard
                    title="Active Workspaces"
                    value={stats.active_tenants.toString()}
                    icon={Building2}
                    change="Multi-tenant"
                    changeType="neutral"
                    subtitle="Tenants with automations"
                />
            </div>

            {/* Filters */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search by rule name, keyword, or workspace..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-xs rounded-xl border-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-9 text-xs rounded-xl border-slate-200 w-36">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="text-xs rounded-xl">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active Only</SelectItem>
                                <SelectItem value="inactive">Inactive Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Rules Table */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Tenant Auto-Reply Rules</CardTitle>
                        <CardDescription className="text-xs text-slate-500">Live inventory of keyword response rules across all accounts</CardDescription>
                    </div>
                    <Badge className="bg-teal-50 text-[#35877D] font-bold border-0 text-xs rounded-lg px-2.5 py-0.5">
                        {rules.length} Rules Listed
                    </Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 border-b border-slate-200/80">
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Rule &amp; Keywords</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Workspace</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Match Type</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Priority</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Executions</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5">Status</TableHead>
                                <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 text-xs font-medium">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={7} className="py-4">
                                            <Skeleton className="h-6 w-full rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : rules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                                        No auto-reply rules found matching your filter criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rules.map((r) => {
                                    const isActive = r.status === 1;
                                    return (
                                        <TableRow key={r.id} className="hover:bg-slate-50/60 transition-colors">
                                            <TableCell className="py-3.5">
                                                <div className="font-bold text-slate-900">{r.name || "Auto-Reply Rule"}</div>
                                                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Hash size={11} className="text-[#35877D]" />
                                                    <span>{r.keyword}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-700 font-semibold">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 size={13} className="text-slate-400" />
                                                    <span>{r.workspace_name || `Tenant #${r.tenant_id}`}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                    {r.match_type || "CONTAINS"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-mono text-slate-600">
                                                #{r.priority || 1}
                                            </TableCell>
                                            <TableCell className="font-black text-slate-800">
                                                {(r.executed_count || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={isActive}
                                                        onCheckedChange={() => handleToggleStatus(r)}
                                                        className="cursor-pointer data-[state=checked]:bg-[#35877D]"
                                                    />
                                                    <span className={`text-[11px] font-bold ${isActive ? "text-emerald-700" : "text-slate-400"}`}>
                                                        {isActive ? "Active" : "Disabled"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleInspectRule(r)}
                                                        className="h-8 px-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                                                        title="Inspect Rule Details & Audit"
                                                    >
                                                        <Eye size={13} className="mr-1" />
                                                        Details
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDeletingRule(r)}
                                                        className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                                                    >
                                                        <Trash2 size={13} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* INSPECT RULE DIALOG */}
            <Dialog open={!!inspectingRule} onOpenChange={(open) => !open && setInspectingRule(null)}>
                <DialogContent className="sm:max-w-[620px] rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare size={18} className="text-[#35877D]" />
                            Rule Detail &amp; Execution Audit
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Workspace configuration and recent trigger event log
                        </DialogDescription>
                    </DialogHeader>

                    {inspectingRule && (
                        <div className="space-y-4 pt-2 text-xs">
                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                                <div>
                                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Rule Name</span>
                                    <span className="font-bold text-slate-900">{inspectingRule.name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Workspace</span>
                                    <span className="font-bold text-slate-900">{inspectingRule.workspace_name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Keywords</span>
                                    <span className="font-mono text-[#35877D] font-bold">{inspectingRule.keyword}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Match / Priority</span>
                                    <span className="font-bold text-slate-700">{inspectingRule.match_type || "CONTAINS"} (Priority #{inspectingRule.priority || 1})</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-slate-500 font-bold block text-[11px]">Configured Response Text</span>
                                <div className="p-3 bg-white border border-slate-200 rounded-xl whitespace-pre-wrap font-medium text-slate-700">
                                    {inspectingRule.reply}
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="text-slate-700 font-bold block text-xs flex items-center gap-1.5">
                                    <Activity size={13} className="text-[#35877D]" />
                                    Recent Execution Audit Log
                                </span>
                                {loadingDetails ? (
                                    <Skeleton className="h-16 w-full rounded-xl" />
                                ) : ruleTriggers.length === 0 ? (
                                    <p className="text-slate-400 italic py-2">No trigger records logged yet for this rule.</p>
                                ) : (
                                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                                        {ruleTriggers.map((tr) => (
                                            <div key={tr.id} className="p-2.5 rounded-lg border border-slate-200/60 bg-slate-50/50 flex items-start justify-between gap-3">
                                                <div className="space-y-0.5">
                                                    <p className="font-medium text-slate-800">
                                                        Incoming: <span className="italic font-normal">"{tr.incoming_message || 'N/A'}"</span>
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        Matched: <span className="font-bold text-[#35877D]">"{tr.matched_keyword}"</span>
                                                    </p>
                                                </div>
                                                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                                    {new Date(tr.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setInspectingRule(null)}
                            className="rounded-xl border-slate-200 text-xs h-9"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={!!deletingRule} onOpenChange={(open) => !open && setDeletingRule(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-red-600 flex items-center gap-2">
                            <Trash2 size={16} />
                            Delete Rule Across Workspace?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-600 pt-1">
                            This administrative action will permanently delete <span className="font-bold text-slate-800">"{deletingRule?.name}"</span> from workspace <span className="font-bold text-slate-800">{deletingRule?.workspace_name}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeletingRule(null)}
                            className="rounded-xl border-slate-200 text-xs h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteRule}
                            className="rounded-xl text-xs h-9 font-semibold"
                        >
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
