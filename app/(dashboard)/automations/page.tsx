"use client";

import { useState } from "react";
import { useListAutomations, useCreateAutomation, useUpdateAutomation, useDeleteAutomation, AutomationRule } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    ChevronDown,
    ChevronRight,
    Plus,
    Search,
    Trash2,
    Edit2,
    Play,
    Sparkles,
    Sliders,
    Bot,
    Loader2,
    Info,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

export default function AutomationsPage() {
    const queryClient = useQueryClient();
    const { data: rules, isLoading } = useListAutomations();
    const createMutation = useCreateAutomation();
    const updateMutation = useUpdateAutomation();
    const deleteMutation = useDeleteAutomation();

    // Navigation states
    const [activeSubTab, setActiveSubTab] = useState<"rules" | "recommended" | "chatbots" | "routing" | "reply-material">("rules");
    const [isTriggersExpanded, setIsTriggersExpanded] = useState(true);
    const [isActionsExpanded, setIsActionsExpanded] = useState(true);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog Modals (Reverted back to popups with premium UI)
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
    const [ruleIdToDelete, setRuleIdToDelete] = useState<number | null>(null);

    // Form States
    const [ruleName, setRuleName] = useState("");
    const [triggerType, setTriggerType] = useState("New WhatsApp message is received");
    const [actionType, setActionType] = useState("Send message");
    const [keyword, setKeyword] = useState("");
    const [reply, setReply] = useState("");
    const [status, setStatus] = useState(true);

    // Filter Rules list
    const filteredRules = rules?.filter(rule =>
        (rule.name || "WhatsApp Rule").toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.reply.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreateDialog = () => {
        setRuleName("");
        setTriggerType("New WhatsApp message is received");
        setActionType("Send message");
        setKeyword("");
        setReply("");
        setStatus(true);
        setIsCreateOpen(true);
    };

    const openEditDialog = (rule: AutomationRule) => {
        setSelectedRule(rule);
        setRuleName(rule.name || "WhatsApp Rule");
        setTriggerType(rule.trigger_type || "New WhatsApp message is received");
        setActionType(rule.action_type || "Send message");
        setKeyword(rule.keyword);
        setReply(rule.reply);
        setStatus(!!rule.status);
        setIsEditOpen(true);
    };

    const handleCreateRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ruleName.trim() || !keyword.trim() || !reply.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            await createMutation.mutateAsync({
                data: {
                    name: ruleName.trim(),
                    trigger_type: triggerType,
                    action_type: actionType,
                    keyword: keyword.trim(),
                    reply: reply.trim(),
                    status: status ? 1 : 0,
                }
            });
            toast.success("Automation rule created successfully");
            queryClient.invalidateQueries({ queryKey: ["listAutomations"] });
            setIsCreateOpen(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to create automation rule");
        }
    };

    const handleUpdateRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRule) return;

        if (!ruleName.trim() || !keyword.trim() || !reply.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            await updateMutation.mutateAsync({
                id: selectedRule.id,
                data: {
                    name: ruleName.trim(),
                    trigger_type: triggerType,
                    action_type: actionType,
                    keyword: keyword.trim(),
                    reply: reply.trim(),
                    status: status ? 1 : 0,
                }
            });
            toast.success("Automation rule updated successfully");
            queryClient.invalidateQueries({ queryKey: ["listAutomations"] });
            setIsEditOpen(false);
            setSelectedRule(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to update automation rule");
        }
    };

    const handleToggleStatus = async (rule: AutomationRule) => {
        const nextStatus = !rule.status;
        try {
            await updateMutation.mutateAsync({
                id: rule.id,
                data: {
                    status: nextStatus ? 1 : 0
                }
            });
            toast.success(`Rule "${rule.name || 'WhatsApp Rule'}" is now turned ${nextStatus ? 'ON' : 'OFF'}`);
            queryClient.invalidateQueries({ queryKey: ["listAutomations"] });
        } catch (err: any) {
            toast.error(err.message || "Failed to update status");
        }
    };

    const confirmDeleteRule = (id: number) => {
        setRuleIdToDelete(id);
        setIsDeleteOpen(true);
    };

    const handleDeleteRule = async () => {
        if (ruleIdToDelete === null) return;
        try {
            await deleteMutation.mutateAsync({ id: ruleIdToDelete });
            toast.success("Rule deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["listAutomations"] });
            setIsDeleteOpen(false);
            setRuleIdToDelete(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete rule");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">Automations</h1>
                    <p className="text-slate-600 text-sm">
                        Setup rules, reply materials, chatbots and dynamic WhatsApp triggers.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12 items-start">

                {/* Left Side Sub-Navigation Panel */}
                <div className="md:col-span-3 space-y-4">
                    <Card className="border border-[#EAE6DF] bg-white shadow-sm rounded-xl overflow-hidden p-2">

                        {/* Triggers Group */}
                        <div className="space-y-1">
                            <button
                                onClick={() => setIsTriggersExpanded(!isTriggersExpanded)}
                                className="w-full flex items-center justify-between p-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                <span className="flex items-center gap-2 tracking-wider">
                                    <Sliders size={14} className="text-[#378179]" />
                                    TRIGGERS
                                </span>
                                {isTriggersExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {isTriggersExpanded && (
                                <div className="pl-2 space-y-0.5 mt-0.5">
                                    <button
                                        onClick={() => setActiveSubTab("rules")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-medium rounded-lg text-left transition-colors ${activeSubTab === "rules"
                                            ? "bg-[#378179]/10 text-[#29605a] font-semibold"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span>Rules</span>
                                        {activeSubTab === "rules" && <span className="h-1.5 w-1.5 rounded-full bg-[#378179]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab("recommended")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-medium rounded-lg text-left transition-colors ${activeSubTab === "recommended"
                                            ? "bg-[#378179]/10 text-[#29605a] font-semibold"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            Recommended
                                            <Sparkles size={11} className="text-[#D99B26] fill-[#D99B26]/10" />
                                        </span>
                                        {activeSubTab === "recommended" && <span className="h-1.5 w-1.5 rounded-full bg-[#378179]" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        <hr className="my-2 border-slate-100" />

                        {/* Actions Library Group */}
                        <div className="space-y-1">
                            <button
                                onClick={() => setIsActionsExpanded(!isActionsExpanded)}
                                className="w-full flex items-center justify-between p-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                <span className="flex items-center gap-2 tracking-wider">
                                    <Bot size={14} className="text-[#378179]" />
                                    ACTIONS LIBRARY
                                </span>
                                {isActionsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {isActionsExpanded && (
                                <div className="pl-2 space-y-0.5 mt-0.5">
                                    <button
                                        onClick={() => setActiveSubTab("chatbots")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-medium rounded-lg text-left transition-colors ${activeSubTab === "chatbots"
                                            ? "bg-[#378179]/10 text-[#29605a] font-semibold"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span>Chatbots</span>
                                        {activeSubTab === "chatbots" && <span className="h-1.5 w-1.5 rounded-full bg-[#378179]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab("routing")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-medium rounded-lg text-left transition-colors ${activeSubTab === "routing"
                                            ? "bg-[#378179]/10 text-[#29605a] font-semibold"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span>Routing</span>
                                        {activeSubTab === "routing" && <span className="h-1.5 w-1.5 rounded-full bg-[#378179]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab("reply-material")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-medium rounded-lg text-left transition-colors ${activeSubTab === "reply-material"
                                            ? "bg-[#378179]/10 text-[#29605a] font-semibold"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span>Reply Material</span>
                                        {activeSubTab === "reply-material" && <span className="h-1.5 w-1.5 rounded-full bg-[#378179]" />}
                                    </button>
                                </div>
                            )}
                        </div>

                    </Card>

                    {/* Left helper card */}
                    <div className="border border-slate-100 border-l-4 border-l-[#378179] bg-slate-50/50 p-4 rounded-r-xl rounded-l-md shadow-sm">
                        <div className="flex gap-2.5">
                            <div className="h-6 w-6 rounded-full bg-[#378179]/10 flex items-center justify-center shrink-0">
                                <Info size={13} className="text-[#378179]" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-semibold text-slate-800">What are rules?</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Rules are keyword triggers that immediately match customer messages to send quick automated replies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Dashboard Area */}
                <div className="md:col-span-9 space-y-6">

                    {activeSubTab === "rules" && (
                        <Card className="border border-[#EAE6DF] bg-white shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="border-b border-[#FAF8F5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <CardTitle className="text-xl font-bold text-slate-800">Rules</CardTitle>
                                    <CardDescription className="text-slate-600 text-xs mt-1">
                                        Create Rules to trigger automated messages, chat assignments, chatbots and more.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="relative w-44 sm:w-56">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="search"
                                            placeholder="Search rules..."
                                            className="pl-9 h-9 text-xs text-slate-600"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={openCreateDialog}
                                        className="bg-[#378179] hover:bg-[#2c6761] text-white text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 border-0 font-medium"
                                    >
                                        <Plus size={14} />
                                        Create Rules
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                            <TableHead className="font-semibold text-slate-700 text-xs pl-6">Rule Details</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-xs">Trigger Type</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-xs">Action</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-xs">Status</TableHead>
                                            <TableHead className="text-right font-semibold text-slate-700 text-xs">Executed</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-xs">Last Updated</TableHead>
                                            <TableHead className="w-[100px] text-right font-semibold text-slate-700 text-xs pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            [...Array(3)].map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="pl-6"><Skeleton className="h-5 w-32 bg-slate-100" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-48 bg-slate-100" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-24 bg-slate-100" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-10 bg-slate-100" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-5 w-8 ml-auto bg-slate-100" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-20 bg-slate-100" /></TableCell>
                                                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-16 ml-auto bg-slate-100" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredRules?.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center text-slate-600 text-xs pl-6 pr-6">
                                                    No automation rules found. Click "Create Rules" to get started.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredRules?.map((rule) => (
                                                <TableRow key={rule.id} className="hover:bg-slate-50/40 text-slate-600">
                                                    <TableCell className="py-3.5 pl-6">
                                                        <div className="font-medium text-slate-800 text-xs">{rule.name || "WhatsApp Rule"}</div>
                                                        <div className="mt-1">
                                                            <span className="text-[9.5px] bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded italic">
                                                                Keyword: {rule.keyword}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600 text-xs py-3.5">
                                                        <span className="flex items-center gap-1.5">
                                                            <Play size={11} className="text-[#378179] fill-[#378179]/10" />
                                                            {rule.trigger_type || "New WhatsApp message is received"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600 text-xs font-medium py-3.5">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="h-2 w-2 rounded-full bg-[#378179]" />
                                                            {rule.action_type || "Send message"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-3.5">
                                                        <Switch
                                                            checked={!!rule.status}
                                                            onCheckedChange={() => handleToggleStatus(rule)}
                                                            className="scale-75 origin-left data-[state=checked]:bg-[#378179]"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-medium text-slate-600 text-xs py-3.5">
                                                        {rule.executed_count ?? 0}
                                                    </TableCell>
                                                    <TableCell className="text-slate-600 text-xs py-3.5">
                                                        {rule.updated_at ? new Date(rule.updated_at).toLocaleDateString("en-IN") : "-"}
                                                    </TableCell>
                                                    <TableCell className="py-3.5 text-right pr-6">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditDialog(rule)}
                                                                className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                                                            >
                                                                <Edit2 size={13} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => confirmDeleteRule(rule.id)}
                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                            >
                                                                <Trash2 size={13} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {activeSubTab !== "rules" && (
                        <Card className="border border-[#EAE6DF] bg-white shadow-sm rounded-xl p-8 text-center">
                            <Sparkles size={36} className="text-[#D99B26] fill-[#D99B26]/10 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Features Coming Soon</h3>
                            <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                                The {activeSubTab.replace("-", " ")} automation module is scheduled for development in our next release cycle.
                            </p>
                        </Card>
                    )}

                </div>

            </div>

            {/* CREATE RULE POPUP DIALOG */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[540px] rounded-2xl overflow-hidden p-0 border border-slate-100 shadow-xl bg-white">
                    <div className="bg-[#378179]/5 border-b border-[#378179]/10 px-6 py-4 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-[#378179]/10 flex items-center justify-center">
                            <Plus size={16} className="text-[#378179]" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-800">Create Automation Rule</DialogTitle>
                            <DialogDescription className="text-slate-600 text-xs mt-0.5">
                                Set up keyword triggers to send automated WhatsApp replies.
                            </DialogDescription>
                        </div>
                    </div>

                    <form onSubmit={handleCreateRule} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Rule Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="createRuleName" className="text-xs font-semibold text-slate-700">
                                    Rule Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="createRuleName"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="e.g. Price Query Auto-Reply"
                                    className="text-xs text-slate-700 h-9"
                                    required
                                />
                            </div>

                            {/* Keyword Trigger */}
                            <div className="space-y-1.5">
                                <Label htmlFor="createKeyword" className="text-xs font-semibold text-slate-700">
                                    Keyword Trigger <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="createKeyword"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="e.g. price"
                                    className="text-xs text-slate-700 h-9"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Trigger Type */}
                            <div className="space-y-1.5">
                                <Label htmlFor="createTrigger" className="text-xs font-semibold text-slate-700">Trigger Type</Label>
                                <select
                                    id="createTrigger"
                                    value={triggerType}
                                    onChange={(e) => setTriggerType(e.target.value)}
                                    className="w-full h-9 px-3 border border-[#EAE6DF] bg-white rounded-lg text-xs text-slate-700"
                                >
                                    <option value="New WhatsApp message is received">New WhatsApp message is received</option>
                                </select>
                            </div>

                            {/* Action Type */}
                            <div className="space-y-1.5">
                                <Label htmlFor="createAction" className="text-xs font-semibold text-slate-700">Action Type</Label>
                                <select
                                    id="createAction"
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value)}
                                    className="w-full h-9 px-3 border border-[#EAE6DF] bg-white rounded-lg text-xs text-slate-700"
                                >
                                    <option value="Send message">Send message</option>
                                </select>
                            </div>
                        </div>

                        {/* Automatic Reply */}
                        <div className="space-y-1.5">
                            <Label htmlFor="createReply" className="text-xs font-semibold text-slate-700">
                                Automatic Reply Message <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="createReply"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type the message that will be sent automatically when the keyword matches..."
                                className="min-h-[100px] text-xs text-slate-700 leading-relaxed resize-y"
                                required
                            />
                        </div>

                        {/* Rule Status Switch Container */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="space-y-0.5">
                                <Label htmlFor="createStatus" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                    Rule Active State
                                </Label>
                                <p className="text-[10px] text-slate-500 leading-normal">
                                    Turn this switch ON to activate the trigger rule instantly.
                                </p>
                            </div>
                            <Switch
                                id="createStatus"
                                checked={status}
                                onCheckedChange={setStatus}
                                className="data-[state=checked]:bg-[#378179]"
                            />
                        </div>

                        {/* Dialog Actions Footer */}
                        <div className="pt-2 flex justify-end gap-2.5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                disabled={createMutation.isPending}
                                className="text-xs rounded-xl h-9 px-4 font-semibold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#378179] hover:bg-[#2c6761] text-white text-xs rounded-xl h-9 px-5 font-semibold border-0"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? (
                                    <span className="flex items-center gap-1.5">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Creating...
                                    </span>
                                ) : (
                                    "Create Rule"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT RULE POPUP DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[540px] rounded-2xl overflow-hidden p-0 border border-slate-100 shadow-xl bg-white">
                    <div className="bg-[#378179]/5 border-b border-[#378179]/10 px-6 py-4 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-[#378179]/10 flex items-center justify-center">
                            <Edit2 size={15} className="text-[#378179]" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-800">Edit Automation Rule</DialogTitle>
                            <DialogDescription className="text-slate-600 text-xs mt-0.5">
                                Modify trigger parameters and save changes instantly.
                            </DialogDescription>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateRule} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Rule Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="editRuleName" className="text-xs font-semibold text-slate-700">
                                    Rule Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="editRuleName"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="e.g. Price Query Auto-Reply"
                                    className="text-xs text-slate-700 h-9"
                                    required
                                />
                            </div>

                            {/* Keyword Trigger */}
                            <div className="space-y-1.5">
                                <Label htmlFor="editKeyword" className="text-xs font-semibold text-slate-700">
                                    Keyword Trigger <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="editKeyword"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="e.g. price"
                                    className="text-xs text-slate-700 h-9"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Trigger Type */}
                            <div className="space-y-1.5">
                                <Label htmlFor="editTrigger" className="text-xs font-semibold text-slate-700">Trigger Type</Label>
                                <select
                                    id="editTrigger"
                                    value={triggerType}
                                    onChange={(e) => setTriggerType(e.target.value)}
                                    className="w-full h-9 px-3 border border-[#EAE6DF] bg-white rounded-lg text-xs text-slate-700"
                                >
                                    <option value="New WhatsApp message is received">New WhatsApp message is received</option>
                                </select>
                            </div>

                            {/* Action Type */}
                            <div className="space-y-1.5">
                                <Label htmlFor="editAction" className="text-xs font-semibold text-slate-700">Action Type</Label>
                                <select
                                    id="editAction"
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value)}
                                    className="w-full h-9 px-3 border border-[#EAE6DF] bg-white rounded-lg text-xs text-slate-700"
                                >
                                    <option value="Send message">Send message</option>
                                </select>
                            </div>
                        </div>

                        {/* Automatic Reply */}
                        <div className="space-y-1.5">
                            <Label htmlFor="editReply" className="text-xs font-semibold text-slate-700">
                                Automatic Reply Message <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="editReply"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type the message that will be sent automatically when the keyword matches..."
                                className="min-h-[100px] text-xs text-slate-700 leading-relaxed resize-y"
                                required
                            />
                        </div>

                        {/* Rule Status Switch Container */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="space-y-0.5">
                                <Label htmlFor="editStatus" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                    Rule Active State
                                </Label>
                                <p className="text-[10px] text-slate-500 leading-normal">
                                    Turn this switch ON to activate the trigger rule instantly.
                                </p>
                            </div>
                            <Switch
                                id="editStatus"
                                checked={status}
                                onCheckedChange={setStatus}
                                className="data-[state=checked]:bg-[#378179]"
                            />
                        </div>

                        {/* Dialog Actions Footer */}
                        <div className="pt-2 flex justify-end gap-2.5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditOpen(false);
                                    setSelectedRule(null);
                                }}
                                disabled={updateMutation.isPending}
                                className="text-xs rounded-xl h-9 px-4 font-semibold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#378179] hover:bg-[#2c6761] text-white text-xs rounded-xl h-9 px-5 font-semibold border-0"
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending ? (
                                    <span className="flex items-center gap-1.5">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Saving...
                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={isDeleteOpen} onOpenChange={(open) => {
                setIsDeleteOpen(open);
                if (!open) setRuleIdToDelete(null);
            }}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl overflow-hidden p-0 border border-slate-100 shadow-xl bg-white">
                    <div className="bg-red-50/50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-800">Delete Automation Rule</DialogTitle>
                            <DialogDescription className="text-slate-500 text-[11px] mt-0.5">
                                This action is permanent and cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="px-6 py-0 space-y-4">
                        <p className="text-sm text-slate-700 leading-relaxed">
                            Are you sure you want to delete this automation rule? Once deleted, this keyword trigger will no longer match customer messages or send automatic replies.
                        </p>

                        <div className="pt-2 mb-4 flex justify-end gap-2.5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsDeleteOpen(false);
                                    setRuleIdToDelete(null);
                                }}
                                disabled={deleteMutation.isPending}
                                className="text-xs rounded-xl h-9 px-4 font-semibold text-slate-600 border-slate-200 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDeleteRule}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl h-9 px-5 font-semibold border-0 cursor-pointer"
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? (
                                    <span className="flex items-center gap-1.5">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Deleting...
                                    </span>
                                ) : (
                                    "Delete Rule"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
