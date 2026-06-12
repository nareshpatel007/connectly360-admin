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
import { ChevronDown, ChevronRight, Plus, Search, Trash2, Edit2, Play, ToggleLeft, ToggleRight, Sparkles, Sliders, MessageSquare, Bot, Route as RouteIcon, FileText, Loader2, HelpCircle } from "lucide-react";

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

    // Dialog Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

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

    const handleDeleteRule = async (id: number) => {
        if (!confirm("Are you sure you want to delete this automation rule?")) return;
        try {
            await deleteMutation.mutateAsync({ id });
            toast.success("Rule deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["listAutomations"] });
        } catch (err: any) {
            toast.error(err.message || "Failed to delete rule");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
                    <p className="text-muted-foreground">Setup rules, reply materials, chatbots and dynamic WhatsApp triggers.</p>
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
                                className="w-full flex items-center justify-between p-2 text-xs font-bold text-gray-700 hover:bg-[#FAF8F5] rounded-lg transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Sliders size={14} className="text-[#35877D]" />
                                    TRIGGERS
                                </span>
                                {isTriggersExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {isTriggersExpanded && (
                                <div className="pl-4 space-y-0.5">
                                    <button
                                        onClick={() => setActiveSubTab("rules")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-semibold rounded-lg text-left transition-colors ${activeSubTab === "rules" ? "bg-[#35877D]/10 text-[#2c6f66] font-bold" : "text-gray-600 hover:bg-[#FAF8F5]"
                                            }`}
                                    >
                                        <span>Rules</span>
                                        {activeSubTab === "rules" && <span className="h-1.5 w-1.5 rounded-full bg-[#35877D]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab("recommended")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-semibold rounded-lg text-left transition-colors ${activeSubTab === "recommended" ? "bg-[#35877D]/10 text-[#2c6f66] font-bold" : "text-gray-600 hover:bg-[#FAF8F5]"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1">
                                            Recommended
                                            <Sparkles size={11} className="text-[#D99B26] fill-[#D99B26]/10" />
                                        </span>
                                        {activeSubTab === "recommended" && <span className="h-1.5 w-1.5 rounded-full bg-[#35877D]" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        <hr className="my-2 border-[#EAE6DF]" />

                        {/* Actions Library Group */}
                        <div className="space-y-1">
                            <button
                                onClick={() => setIsActionsExpanded(!isActionsExpanded)}
                                className="w-full flex items-center justify-between p-2 text-xs font-bold text-gray-700 hover:bg-[#FAF8F5] rounded-lg transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Bot size={14} className="text-[#35877D]" />
                                    ACTIONS LIBRARY
                                </span>
                                {isActionsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {isActionsExpanded && (
                                <div className="pl-4 space-y-0.5">
                                    <button
                                        onClick={() => setActiveSubTab("chatbots")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-semibold rounded-lg text-left transition-colors ${activeSubTab === "chatbots" ? "bg-[#35877D]/10 text-[#2c6f66] font-bold" : "text-gray-600 hover:bg-[#FAF8F5]"
                                            }`}
                                    >
                                        <span>Chatbots</span>
                                        {activeSubTab === "chatbots" && <span className="h-1.5 w-1.5 rounded-full bg-[#35877D]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab("routing")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-semibold rounded-lg text-left transition-colors ${activeSubTab === "routing" ? "bg-[#35877D]/10 text-[#2c6f66] font-bold" : "text-gray-600 hover:bg-[#FAF8F5]"
                                            }`}
                                    >
                                        <span>Routing</span>
                                        {activeSubTab === "routing" && <span className="h-1.5 w-1.5 rounded-full bg-[#35877D]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab("reply-material")}
                                        className={`w-full flex items-center justify-between p-2 text-xs font-semibold rounded-lg text-left transition-colors ${activeSubTab === "reply-material" ? "bg-[#35877D]/10 text-[#2c6f66] font-bold" : "text-gray-600 hover:bg-[#FAF8F5]"
                                            }`}
                                    >
                                        <span>Reply Material</span>
                                        {activeSubTab === "reply-material" && <span className="h-1.5 w-1.5 rounded-full bg-[#35877D]" />}
                                    </button>
                                </div>
                            )}
                        </div>

                    </Card>
                </div>

                {/* Right Side Dashboard Area */}
                <div className="md:col-span-9 space-y-6">

                    {activeSubTab === "rules" && (
                        <Card className="border border-[#EAE6DF] bg-white shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="border-b border-[#FAF8F5] pb-4 flex flex-row items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">Rules</CardTitle>
                                    <CardDescription className="text-xs text-gray-500 mt-1">
                                        Create Rules to trigger automated messages, chat assignments, chatbots and more.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="relative w-48 sm:w-64">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search..."
                                            className="pl-9 bg-card h-9"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={openCreateDialog}
                                        className="bg-[#35877D] hover:bg-[#2c6f66] text-white font-semibold text-xs h-9 px-4 rounded-xl flex items-center gap-1 border-0"
                                    >
                                        <Plus size={14} />
                                        Create Rules
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rule Name</TableHead>
                                            <TableHead>Trigger Type</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Executed</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            [...Array(3)].map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-5 w-8 ml-auto" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                                    <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredRules?.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                    No automation rules found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredRules?.map((rule) => (
                                                <TableRow key={rule.id} className="hover:bg-[#FAF8F5]/30">
                                                    <TableCell className="font-semibold text-gray-900">
                                                        <div>{rule.name || "WhatsApp Rule"}</div>
                                                        <span className="text-[9.5px] bg-[#FAF8F5] text-gray-400 border border-gray-100 px-1 py-0.5 rounded italic">
                                                            Keyword: {rule.keyword}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 text-xs">
                                                        <span className="flex items-center gap-1">
                                                            <Play size={10} className="text-[#35877D]" />
                                                            {rule.trigger_type || "New WhatsApp message is received"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 text-xs font-medium">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            {rule.action_type || "Send message"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Switch
                                                                checked={!!rule.status}
                                                                onCheckedChange={() => handleToggleStatus(rule)}
                                                                className="scale-90"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-gray-700">
                                                        {rule.executed_count ?? 0}
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 text-xs">
                                                        {rule.updated_at ? new Date(rule.updated_at).toLocaleDateString("en-IN") : "-"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditDialog(rule)}
                                                                className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                            >
                                                                <Edit2 size={13} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteRule(rule.id)}
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
                            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">Features Coming Soon</h3>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                                The {activeSubTab.replace("-", " ")} automation module is scheduled for development in our next release cycle.
                            </p>
                        </Card>
                    )}

                </div>

            </div>

            {/* CREATE RULE DIALOG MODAL */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Create Rule</DialogTitle>
                        <DialogDescription>
                            Set up triggers and responses to automate messages without code scripts.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateRule} className="space-y-4 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="createRuleName">Rule Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="createRuleName"
                                value={ruleName}
                                onChange={(e) => setRuleName(e.target.value)}
                                placeholder="e.g. Welcome auto reply"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="createTrigger">Trigger Type</Label>
                            <select
                                id="createTrigger"
                                value={triggerType}
                                onChange={(e) => setTriggerType(e.target.value)}
                                className="w-full h-10 px-3 border border-[#EAE6DF] bg-white rounded-lg text-xs"
                            >
                                <option value="New WhatsApp message is received">New WhatsApp message is received</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="createAction">Action Type</Label>
                            <select
                                id="createAction"
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                                className="w-full h-10 px-3 border border-[#EAE6DF] bg-white rounded-lg text-xs"
                            >
                                <option value="Send message">Send message</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="createKeyword">Keyword Trigger <span className="text-red-500">*</span></Label>
                            <Input
                                id="createKeyword"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="e.g. hello"
                                required
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Matches case-insensitively when customer message contains this keyword.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="createReply">Automatic Reply Message <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="createReply"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type the message to send automatically..."
                                className="min-h-[100px]"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl">
                            <div className="space-y-0.5">
                                <Label htmlFor="createStatus" className="text-xs font-bold text-gray-800">Rule Active</Label>
                                <p className="text-[10px] text-muted-foreground">Turn rule on to enable trigger instantly.</p>
                            </div>
                            <Switch
                                id="createStatus"
                                checked={status}
                                onCheckedChange={setStatus}
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                disabled={createMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#35877D] hover:bg-[#2c6f66] text-white"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Rule"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT RULE DIALOG MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Edit Rule</DialogTitle>
                        <DialogDescription>
                            Modify trigger rules and automatic responses.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateRule} className="space-y-4 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="editRuleName">Rule Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="editRuleName"
                                value={ruleName}
                                onChange={(e) => setRuleName(e.target.value)}
                                placeholder="e.g. Welcome auto reply"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="editTrigger">Trigger Type</Label>
                            <select
                                id="editTrigger"
                                value={triggerType}
                                onChange={(e) => setTriggerType(e.target.value)}
                                className="w-full h-10 px-3 border border-[#EAE6DF] bg-white rounded-lg text-xs"
                            >
                                <option value="New WhatsApp message is received">New WhatsApp message is received</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="editAction">Action Type</Label>
                            <select
                                id="editAction"
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                                className="w-full h-10 px-3 border border-[#EAE6DF] bg-white rounded-lg text-xs"
                            >
                                <option value="Send message">Send message</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="editKeyword">Keyword Trigger <span className="text-red-500">*</span></Label>
                            <Input
                                id="editKeyword"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="e.g. hello"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="editReply">Automatic Reply Message <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="editReply"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type the message to send automatically..."
                                className="min-h-[100px]"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl">
                            <div className="space-y-0.5">
                                <Label htmlFor="editStatus" className="text-xs font-bold text-gray-800">Rule Active</Label>
                                <p className="text-[10px] text-muted-foreground">Turn rule on to enable trigger instantly.</p>
                            </div>
                            <Switch
                                id="editStatus"
                                checked={status}
                                onCheckedChange={setStatus}
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditOpen(false);
                                    setSelectedRule(null);
                                }}
                                disabled={updateMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#35877D] hover:bg-[#2c6f66] text-white"
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
