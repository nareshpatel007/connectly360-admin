"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    CreditCard, ShieldCheck, Key, RefreshCw, Eye, EyeOff, AlertTriangle, CheckCircle2, XCircle, Globe, Terminal, Info 
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";
import { useAuth } from "@/lib/auth-context";

export default function AdminPaymentGatewaySettingsPage() {
    const { token } = useAuth();
    const getAuthToken = () => token || (typeof window !== "undefined" ? localStorage.getItem("admin_auth_token") : null) || "";
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingMode, setPendingMode] = useState<"test" | "live" | null>(null);

    const [showTestSecret, setShowTestSecret] = useState(false);
    const [showLiveSecret, setShowLiveSecret] = useState(false);
    const [showTestWebhookSecret, setShowTestWebhookSecret] = useState(false);
    const [showLiveWebhookSecret, setShowLiveWebhookSecret] = useState(false);

    const [config, setConfig] = useState({
        provider: "razorpay",
        active_mode: "test",
        is_live: false,
        is_test: true,
        configured: false,
        source: "env",
        env_fallback_available: true,
        test_key_id_masked: "",
        live_key_id_masked: "",
        test_key_id: "",
        live_key_id: "",
        has_test_secret: false,
        has_live_secret: false,
        has_test_webhook_secret: false,
        has_live_webhook_secret: false,
        last_connection_test_at: null as string | null,
        last_connection_test_status: null as string | null,
        last_connection_test_message: null as string | null,
        webhook_url: "",
        webhook_stats: {
            last_received: null as string | null,
            last_success: null as string | null,
            last_failed: null as string | null,
        }
    });

    const [form, setForm] = useState({
        test_key_id: "",
        test_key_secret: "",
        test_webhook_secret: "",
        live_key_id: "",
        live_key_secret: "",
        live_webhook_secret: "",
    });

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/payment-settings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await res.json();
            if (json.status && json.data) {
                setConfig(json.data);
                setForm({
                    test_key_id: json.data.test_key_id || "",
                    test_key_secret: "",
                    test_webhook_secret: "",
                    live_key_id: json.data.live_key_id || "",
                    live_key_secret: "",
                    live_webhook_secret: "",
                });
            }
        } catch (err: any) {
            toast.error("Failed to load payment gateway settings: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleModeSwitch = (newMode: "test" | "live") => {
        if (newMode === config.active_mode) return;
        if (newMode === "live") {
            setPendingMode("live");
            setShowConfirmModal(true);
        } else {
            saveSettings(newMode);
        }
    };

    const confirmSwitchToLive = () => {
        setShowConfirmModal(false);
        saveSettings("live");
    };

    const saveSettings = async (targetMode?: "test" | "live") => {
        const active_mode = targetMode || config.active_mode;
        setSaving(true);
        try {
            // Key prefix validations
            if (form.test_key_id && !form.test_key_id.startsWith("rzp_test_")) {
                toast.error("Test Key ID must start with rzp_test_");
                setSaving(false);
                return;
            }
            if (form.live_key_id && !form.live_key_id.startsWith("rzp_live_")) {
                toast.error("Live Key ID must start with rzp_live_");
                setSaving(false);
                return;
            }

            const token = getAuthToken();
            const payload: any = {
                active_mode,
                test_key_id: form.test_key_id,
                live_key_id: form.live_key_id,
            };
            if (form.test_key_secret) payload.test_key_secret = form.test_key_secret;
            if (form.test_webhook_secret) payload.test_webhook_secret = form.test_webhook_secret;
            if (form.live_key_secret) payload.live_key_secret = form.live_key_secret;
            if (form.live_webhook_secret) payload.live_webhook_secret = form.live_webhook_secret;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/payment-settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (json.status) {
                toast.success(json.message || "Payment settings saved successfully.");
                fetchSettings();
            } else {
                toast.error(json.message || "Failed to save settings");
            }
        } catch (err: any) {
            toast.error("Error saving settings: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleTestConnection = async () => {
        setTesting(true);
        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/payment-settings/test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ mode: config.active_mode })
            });
            const json = await res.json();
            if (json.status) {
                toast.success(`✓ ${json.data?.message || "Razorpay connection successful!"}`);
            } else {
                toast.error(`✕ ${json.data?.message || json.message || "Connection failed"}`);
            }
            fetchSettings();
        } catch (err: any) {
            toast.error("Connection test failed: " + err.message);
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 font-sans">
                <AdminPageHeader
                    title="Payment Gateway Settings"
                    description="Configure Razorpay mode, credentials, secrets, webhook endpoints, and API connectivity."
                    breadcrumbs={[{ label: "Payment Gateway" }]}
                />
                <div className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans">
            <AdminPageHeader
                title="Razorpay Payment Gateway Settings"
                description="Configure Razorpay payment gateway credentials, active mode, webhook secrets, and monitor webhook health."
                breadcrumbs={[{ label: "Platform Settings", href: "/settings" }, { label: "Payment Gateway" }]}
                badge="Razorpay Integration"
            />

            {/* Test Mode Banner */}
            {config.is_test && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                        <div>
                            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">TEST / SANDBOX PAYMENT MODE ACTIVE</h4>
                            <p className="text-xs text-amber-700 font-medium">All payments are being processed using Razorpay Sandbox test credentials. Real cards/banks will not be charged.</p>
                        </div>
                    </div>
                    <Badge className="bg-amber-600 text-white font-bold text-[10px] px-3 py-1 uppercase rounded-full">Test Mode</Badge>
                </div>
            )}

            {/* Status Overview Card */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#35877D] flex items-center justify-center font-black">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black text-slate-900">Razorpay Gateway Status</h3>
                                {config.configured ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[11px] flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Connected
                                    </Badge>
                                ) : (
                                    <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-bold text-[11px] flex items-center gap-1">
                                        <XCircle size={12} /> Not Configured
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Credential Source: <span className="font-bold text-slate-800 uppercase">{config.source === "admin" ? "Admin Database (Encrypted)" : "Environment Fallback (.env)"}</span>
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleTestConnection}
                        disabled={testing}
                        variant="outline"
                        className="h-10 px-4 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                    >
                        <RefreshCw size={14} className={testing ? "animate-spin" : ""} />
                        <span>{testing ? "Testing Connection..." : "Test Connection"}</span>
                    </Button>
                </div>

                {/* Connection Test Result info */}
                {config.last_connection_test_at && (
                    <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                        config.last_connection_test_status === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}>
                        <div className="flex items-center gap-2">
                            {config.last_connection_test_status === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                            <span className="font-semibold">{config.last_connection_test_message}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">Last Tested: {config.last_connection_test_at}</span>
                    </div>
                )}

                {/* Mode Selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-xs font-black text-slate-900 uppercase tracking-wider">Gateway Operational Mode</Label>
                            <p className="text-xs text-slate-500">Resolved server-side. Live mode processes real customer transactions.</p>
                        </div>
                        <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
                            <button
                                type="button"
                                onClick={() => handleModeSwitch("test")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    config.active_mode === "test" ? "bg-amber-500 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Test Mode
                            </button>
                            <button
                                type="button"
                                onClick={() => handleModeSwitch("live")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    config.active_mode === "live" ? "bg-[#35877D] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Live Mode
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Test Credentials Form Card */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Key size={18} className="text-amber-500" />
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Razorpay Test Credentials (rzp_test_)</h3>
                    </div>
                    {config.test_key_id_masked && (
                        <Badge className="bg-amber-50 text-amber-800 border-amber-200 font-bold text-[10px]">
                            Key: {config.test_key_id_masked}
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-900">Razorpay Test Key ID</Label>
                        <Input
                            placeholder="rzp_test_xxxxxxxxxxxx"
                            value={form.test_key_id}
                            onChange={(e) => setForm({ ...form, test_key_id: e.target.value })}
                            className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono font-medium rounded-xl focus-visible:ring-[#35877D]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-900">
                            Razorpay Test Key Secret {config.has_test_secret ? "(Saved & Encrypted)" : ""}
                        </Label>
                        <div className="relative">
                            <Input
                                type={showTestSecret ? "text" : "password"}
                                placeholder={config.has_test_secret ? "•••••••••••••••• (Leave blank to keep current)" : "Enter Test Secret"}
                                value={form.test_key_secret}
                                onChange={(e) => setForm({ ...form, test_key_secret: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono font-medium rounded-xl pr-10 focus-visible:ring-[#35877D]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowTestSecret(!showTestSecret)}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                {showTestSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Razorpay Test Webhook Secret</Label>
                    <div className="relative">
                        <Input
                            type={showTestWebhookSecret ? "text" : "password"}
                            placeholder={config.has_test_webhook_secret ? "•••••••••••••••• (Leave blank to keep current)" : "Enter Test Webhook Secret"}
                            value={form.test_webhook_secret}
                            onChange={(e) => setForm({ ...form, test_webhook_secret: e.target.value })}
                            className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono font-medium rounded-xl pr-10 focus-visible:ring-[#35877D]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowTestWebhookSecret(!showTestWebhookSecret)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                            {showTestWebhookSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            </Card>

            {/* Live Credentials Form Card */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#35877D]" />
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Razorpay Live Production Credentials (rzp_live_)</h3>
                    </div>
                    {config.live_key_id_masked && (
                        <Badge className="bg-teal-50 text-teal-800 border-teal-200 font-bold text-[10px]">
                            Key: {config.live_key_id_masked}
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-900">Razorpay Live Key ID</Label>
                        <Input
                            placeholder="rzp_live_xxxxxxxxxxxx"
                            value={form.live_key_id}
                            onChange={(e) => setForm({ ...form, live_key_id: e.target.value })}
                            className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono font-medium rounded-xl focus-visible:ring-[#35877D]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-900">
                            Razorpay Live Key Secret {config.has_live_secret ? "(Saved & Encrypted)" : ""}
                        </Label>
                        <div className="relative">
                            <Input
                                type={showLiveSecret ? "text" : "password"}
                                placeholder={config.has_live_secret ? "•••••••••••••••• (Leave blank to keep current)" : "Enter Live Secret"}
                                value={form.live_key_secret}
                                onChange={(e) => setForm({ ...form, live_key_secret: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono font-medium rounded-xl pr-10 focus-visible:ring-[#35877D]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowLiveSecret(!showLiveSecret)}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                {showLiveSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Razorpay Live Webhook Secret</Label>
                    <div className="relative">
                        <Input
                            type={showLiveWebhookSecret ? "text" : "password"}
                            placeholder={config.has_live_webhook_secret ? "•••••••••••••••• (Leave blank to keep current)" : "Enter Live Webhook Secret"}
                            value={form.live_webhook_secret}
                            onChange={(e) => setForm({ ...form, live_webhook_secret: e.target.value })}
                            className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono font-medium rounded-xl pr-10 focus-visible:ring-[#35877D]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowLiveWebhookSecret(!showLiveWebhookSecret)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                            {showLiveWebhookSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            </Card>

            {/* Webhook Configuration & Health Info */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Globe size={18} className="text-blue-600" />
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Razorpay Webhook Endpoint &amp; Telemetry</h3>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-900">Webhook Endpoint URL (Configure in Razorpay Dashboard)</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            readOnly
                            value={config.webhook_url}
                            className="h-10 bg-slate-100 border-slate-200 text-slate-900 text-xs font-mono rounded-xl select-all"
                        />
                        <Button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(config.webhook_url);
                                toast.success("Webhook URL copied to clipboard");
                            }}
                            className="h-10 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                            Copy URL
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Webhook Received</span>
                        <p className="text-xs font-extrabold text-slate-800 mt-1">{config.webhook_stats.last_received || "Never"}</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Last Successful Webhook</span>
                        <p className="text-xs font-extrabold text-emerald-800 mt-1">{config.webhook_stats.last_success || "Never"}</p>
                    </div>
                    <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Last Failed Webhook</span>
                        <p className="text-xs font-extrabold text-rose-800 mt-1">{config.webhook_stats.last_failed || "None"}</p>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end pt-2">
                <Button
                    type="button"
                    onClick={() => saveSettings()}
                    disabled={saving}
                    className="h-12 px-8 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-all"
                >
                    <span>{saving ? "Encrypting & Saving Credentials..." : "Save Gateway Credentials"}</span>
                </Button>
            </div>

            {/* Mode Switch Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                            <AlertTriangle size={24} />
                        </div>

                        <div>
                            <h3 className="text-base font-black text-slate-900">Switch Payment Gateway to LIVE Mode?</h3>
                            <p className="text-xs text-slate-600 mt-1">
                                You are about to switch Connectly360 payment gateway to <span className="font-bold text-red-600 uppercase">LIVE Mode</span>. Real customers will be charged using your live Razorpay merchant credentials.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmModal(false)}
                                className="h-10 px-4 rounded-xl text-xs font-bold"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmSwitchToLive}
                                className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                                Confirm &amp; Switch to Live
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
