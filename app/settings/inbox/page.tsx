"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { AdminPageHeader } from "@/components/admin-page-header";
import { toast } from "sonner";
import {
    MessageSquare,
    Sliders,
    Sparkles,
    Zap,
    Save,
    RotateCcw,
    CheckCircle2,
    Plus,
    Trash2,
    Loader2,
    Clock,
    FileText,
    Smile,
    Paperclip,
    Mic,
    Shield,
} from "lucide-react";

export default function AdminInboxSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Settings state
    const [settings, setSettings] = useState({
        default_status: "open",
        allow_pending: true,
        allow_resolved: true,
        auto_reopen_on_customer_reply: true,
        auto_reopen_pending: true,
        auto_close_enabled: false,
        auto_close_after: "never",
        composer: {
            ai_copilot: true,
            templates: true,
            emoji: true,
            attachments: true,
            image: true,
            video: true,
            document: true,
            audio: false,
            quick_replies: true,
        },
        copilot: {
            enabled: true,
            suggest_reply: true,
            rewrite: true,
            shorten: true,
            professional: true,
            friendly: true,
            translate: true,
            summarize: true,
        },
    });

    // Quick Replies state
    const [quickReplies, setQuickReplies] = useState<any[]>([]);
    const [isAddQROpen, setIsAddQROpen] = useState(false);
    const [newQRTitle, setNewQRTitle] = useState("");
    const [newQRShortcut, setNewQRShortcut] = useState("");
    const [newQRContent, setNewQRContent] = useState("");
    const [savingQR, setSavingQR] = useState(false);

    // Fetch Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
                const res = await fetch("/api/admin/inbox-settings", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.status && data.data) {
                        setSettings(data.data);
                    }
                }

                // Fetch global quick replies
                const qrRes = await fetch("/api/admin/quick-replies", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                if (qrRes.ok) {
                    const qrData = await qrRes.json();
                    if (qrData.status && Array.isArray(qrData.data)) {
                        setQuickReplies(qrData.data);
                    }
                }
            } catch (err) {
                console.error("Failed to load inbox settings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Save Settings
    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
            const res = await fetch("/api/admin/inbox-settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success("Inbox and Conversation configuration saved successfully.");
            } else {
                throw new Error("Failed to save settings");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to update inbox settings.");
        } finally {
            setSaving(false);
        }
    };

    // Save Quick Reply
    const handleAddQuickReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQRTitle.trim() || !newQRShortcut.trim() || !newQRContent.trim()) {
            toast.error("Please fill all required quick reply fields.");
            return;
        }

        setSavingQR(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
            const res = await fetch("/api/admin/quick-replies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    title: newQRTitle.trim(),
                    shortcut: newQRShortcut.trim(),
                    content: newQRContent.trim(),
                    is_active: true,
                }),
            });

            if (res.ok) {
                toast.success("Quick reply created successfully.");
                setIsAddQROpen(false);
                setNewQRTitle("");
                setNewQRShortcut("");
                setNewQRContent("");

                // Refresh
                const qrRes = await fetch("/api/admin/quick-replies", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const qrData = await qrRes.json();
                if (qrData.status) setQuickReplies(qrData.data);
            } else {
                throw new Error("Failed to create quick reply");
            }
        } catch (err: any) {
            toast.error(err.message || "Could not save quick reply.");
        } finally {
            setSavingQR(false);
        }
    };

    // Delete Quick Reply
    const handleDeleteQuickReply = async (id: number) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
            const res = await fetch(`/api/admin/quick-replies/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setQuickReplies((prev) => prev.filter((r) => r.id !== id));
                toast.success("Quick reply removed.");
            }
        } catch {
            toast.error("Failed to delete quick reply.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 size={24} className="animate-spin text-[#35877D]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans pb-12">
            <AdminPageHeader
                title="Inbox & Conversations Configuration"
                description="Configure multi-tenant conversation behavior, automatic reopen rules, message composer toolbar capabilities, and AI Copilot actions."
                breadcrumbs={[
                    { label: "Settings", href: "/settings" },
                    { label: "Inbox & Conversations" },
                ]}
                badge="Platform Engine"
            />

            <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* SECTION 1: CONVERSATION STATUS & AUTOMATION RULES */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-xs">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sliders size={18} className="text-[#35877D]" />
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                Conversation Status Rules &amp; Automation
                            </h3>
                        </div>
                        <Badge className="bg-[#35877D]/10 text-[#35877D] border-[#35877D]/20 text-[10px]">
                            Core Engine
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Auto-Reopen Resolved */}
                        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-slate-900">
                                    Auto-Reopen Resolved Conversations
                                </Label>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    When a customer sends a new inbound message to a Resolved chat, automatically move it back to Open.
                                </p>
                            </div>
                            <Switch
                                checked={settings.auto_reopen_on_customer_reply}
                                onCheckedChange={(val) =>
                                    setSettings({ ...settings, auto_reopen_on_customer_reply: val })
                                }
                            />
                        </div>

                        {/* Auto-Reopen Pending */}
                        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-slate-900">
                                    Auto-Reopen Pending Conversations
                                </Label>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    When a customer replies to a conversation in Pending status, automatically transition status back to Open.
                                </p>
                            </div>
                            <Switch
                                checked={settings.auto_reopen_pending}
                                onCheckedChange={(val) =>
                                    setSettings({ ...settings, auto_reopen_pending: val })
                                }
                            />
                        </div>

                        {/* Allow Pending Status */}
                        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-slate-900">
                                    Allow Pending Status
                                </Label>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Enable the "Pending" status in the agent status dropdown and inbox filter tabs.
                                </p>
                            </div>
                            <Switch
                                checked={settings.allow_pending}
                                onCheckedChange={(val) =>
                                    setSettings({ ...settings, allow_pending: val })
                                }
                            />
                        </div>

                        {/* Allow Resolved Status */}
                        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-slate-900">
                                    Allow Resolved Status
                                </Label>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Enable the "Resolved" status so agents can mark completed customer tickets.
                                </p>
                            </div>
                            <Switch
                                checked={settings.allow_resolved}
                                onCheckedChange={(val) =>
                                    setSettings({ ...settings, allow_resolved: val })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Default Conversation Status</Label>
                            <select
                                value={settings.default_status}
                                onChange={(e) => setSettings({ ...settings, default_status: e.target.value })}
                                className="h-10 w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl px-3"
                            >
                                <option value="open">Open (Requires active agent attention)</option>
                                <option value="pending">Pending (Awaiting customer or external follow-up)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Auto-Close Inactive Chats</Label>
                            <select
                                value={settings.auto_close_after}
                                onChange={(e) => setSettings({ ...settings, auto_close_after: e.target.value })}
                                className="h-10 w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl px-3"
                            >
                                <option value="never">Never (Manual agent resolution only)</option>
                                <option value="24h">After 24 hours of inactivity</option>
                                <option value="48h">After 48 hours of inactivity</option>
                                <option value="3d">After 3 days of inactivity</option>
                                <option value="7d">After 7 days of inactivity</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* SECTION 2: COMPOSER ACTIONS CONFIGURATION */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-xs">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={18} className="text-[#35877D]" />
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                Client Composer Toolbar Capabilities
                            </h3>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                            Controls visible action buttons in bottom composer
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { key: "ai_copilot", label: "AI Copilot Button", icon: Sparkles, desc: "Show Copilot menu in composer" },
                            { key: "templates", label: "WhatsApp Templates", icon: FileText, desc: "Template picker dialog" },
                            { key: "quick_replies", label: "Quick Replies", icon: Zap, desc: "Shortcut '/...' canned responses" },
                            { key: "emoji", label: "Emoji Selector", icon: Smile, desc: "Quick emoji picker" },
                            { key: "attachments", label: "File Attachments", icon: Paperclip, desc: "Allow media and doc uploads" },
                            { key: "audio", label: "Voice / Audio Notes", icon: Mic, desc: "Audio recording & upload" },
                        ].map((item) => {
                            const IconComponent = item.icon;
                            const isChecked = (settings.composer as any)[item.key] ?? true;

                            return (
                                <div
                                    key={item.key}
                                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="h-8 w-8 rounded-xl bg-white text-[#35877D] flex items-center justify-center border border-slate-200/60 shadow-2xs shrink-0">
                                            <IconComponent size={14} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{item.label}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={isChecked}
                                        onCheckedChange={(val) =>
                                            setSettings({
                                                ...settings,
                                                composer: { ...settings.composer, [item.key]: val },
                                            })
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* SECTION 3: AI COPILOT CAPABILITIES */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-xs">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-teal-600" />
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                AI Copilot Features &amp; Actions
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-600">Copilot Master:</span>
                            <Switch
                                checked={settings.copilot.enabled}
                                onCheckedChange={(val) =>
                                    setSettings({
                                        ...settings,
                                        copilot: { ...settings.copilot, enabled: val },
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { key: "suggest_reply", label: "Suggest Reply", desc: "Context-aware reply suggestions" },
                            { key: "rewrite", label: "Rewrite & Improve", desc: "Polishes phrasing and readability" },
                            { key: "shorten", label: "Shorten Message", desc: "Condenses draft for fast chat" },
                            { key: "professional", label: "Make Professional", desc: "Polite, business-grade tone" },
                            { key: "friendly", label: "Make Friendly", desc: "Warm, empathetic customer tone" },
                            { key: "translate", label: "Translate Support", desc: "Language translation capability" },
                            { key: "summarize", label: "Summarize Chat", desc: "Extracts key discussion points" },
                        ].map((copItem) => {
                            const isChecked = (settings.copilot as any)[copItem.key] ?? true;

                            return (
                                <div
                                    key={copItem.key}
                                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{copItem.label}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{copItem.desc}</p>
                                    </div>
                                    <Switch
                                        disabled={!settings.copilot.enabled}
                                        checked={isChecked}
                                        onCheckedChange={(val) =>
                                            setSettings({
                                                ...settings,
                                                copilot: { ...settings.copilot, [copItem.key]: val },
                                            })
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* SAVE BUTTON */}
                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="h-10 px-6 bg-[#35877D] hover:bg-[#2b6e66] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Saving Configuration...</span>
                            </>
                        ) : (
                            <>
                                <Save size={14} />
                                <span>Save Inbox Settings</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* SECTION 4: GLOBAL QUICK REPLIES MANAGEMENT */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-xs">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap size={18} className="text-[#35877D]" />
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Global Platform Quick Replies
                        </h3>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setIsAddQROpen(true)}
                        className="bg-[#35877D] hover:bg-[#2b6e66] text-white font-bold text-xs rounded-xl h-8 px-3 flex items-center gap-1.5"
                    >
                        <Plus size={13} />
                        <span>Add Quick Reply</span>
                    </Button>
                </div>

                <div className="divide-y divide-slate-100">
                    {quickReplies.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                            No global quick replies registered.
                        </div>
                    ) : (
                        quickReplies.map((qr) => (
                            <div key={qr.id} className="py-3 flex items-center justify-between gap-4">
                                <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-800">{qr.title}</span>
                                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                                            {qr.shortcut}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                                        {qr.content}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteQuickReply(qr.id)}
                                    className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 h-8 w-8 p-0 rounded-lg"
                                >
                                    <Trash2 size={13} />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Modal: Add Global Quick Reply */}
            <Dialog open={isAddQROpen} onOpenChange={setIsAddQROpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                            <Zap size={16} className="text-[#35877D]" />
                            Create Quick Reply
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Add a canned response shortcut accessible across all tenant workspaces.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddQuickReply} className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-slate-700">Title*</Label>
                            <Input
                                placeholder="e.g. Greeting Message"
                                value={newQRTitle}
                                onChange={(e) => setNewQRTitle(e.target.value)}
                                className="text-xs h-9 rounded-xl bg-slate-50 border-slate-200"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-slate-700">Shortcut* (e.g. /welcome)</Label>
                            <Input
                                placeholder="/hello"
                                value={newQRShortcut}
                                onChange={(e) => setNewQRShortcut(e.target.value)}
                                className="text-xs h-9 rounded-xl bg-slate-50 border-slate-200 font-mono"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-slate-700">Message Content*</Label>
                            <Textarea
                                rows={3}
                                placeholder="Message to insert when shortcut is typed..."
                                value={newQRContent}
                                onChange={(e) => setNewQRContent(e.target.value)}
                                className="text-xs rounded-xl bg-slate-50 border-slate-200 resize-none"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddQROpen(false)}
                                className="text-xs rounded-xl h-8.5 px-4"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={savingQR}
                                className="bg-[#35877D] hover:bg-[#2b6e66] text-white font-bold text-xs rounded-xl h-8.5 px-4"
                            >
                                {savingQR ? <Loader2 size={13} className="animate-spin" /> : "Save Quick Reply"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
