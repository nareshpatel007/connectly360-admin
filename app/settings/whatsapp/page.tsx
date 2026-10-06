"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Save, RefreshCw, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";

export default function AdminWhatsappSettingsPage() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testingConnection, setTestingConnection] = useState(false);
    const [showTokens, setShowTokens] = useState(false);

    const [mode, setMode] = useState<"test" | "live">("test");
    const [appId, setAppId] = useState("");
    const [appSecret, setAppSecret] = useState("");
    const [wabaId, setWabaId] = useState("");
    const [phoneNumberId, setPhoneNumberId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [verifyToken, setVerifyToken] = useState("");
    const [webhookSecret, setWebhookSecret] = useState("");
    const [apiVersion, setApiVersion] = useState("v23.0");
    const [configSource, setConfigSource] = useState("admin");

    const fetchSettings = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/whatsapp/settings", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                const s = data.data;
                setMode(s.whatsapp_mode || "test");
                setAppId(s.meta_app_id || "");
                setAppSecret(s.meta_app_secret || "");
                setWabaId(s.whatsapp_business_account_id || "");
                setPhoneNumberId(s.whatsapp_phone_number_id || "");
                setAccessToken(s.whatsapp_access_token || "");
                setVerifyToken(s.whatsapp_webhook_verify_token || "");
                setWebhookSecret(s.whatsapp_webhook_app_secret || "");
                setApiVersion(s.whatsapp_api_version || "v23.0");
                setConfigSource(s.source || "admin");
            }
        } catch {
            toast.error("Failed to load WhatsApp Cloud API settings.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/whatsapp/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({
                    whatsapp_mode: mode,
                    meta_app_id: appId,
                    meta_app_secret: appSecret,
                    whatsapp_business_account_id: wabaId,
                    whatsapp_phone_number_id: phoneNumberId,
                    whatsapp_access_token: accessToken,
                    whatsapp_webhook_verify_token: verifyToken,
                    whatsapp_webhook_app_secret: webhookSecret,
                    whatsapp_api_version: apiVersion
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("WhatsApp Cloud API settings saved successfully.");
                fetchSettings();
            } else {
                toast.error(data.message || "Failed to save settings.");
            }
        } catch {
            toast.error("An error occurred while saving settings.");
        } finally {
            setSaving(false);
        }
    };

    const handleTestConnection = async () => {
        if (!token) return;
        setTestingConnection(true);
        try {
            const res = await fetch("/api/admin/whatsapp/settings/test", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status && data.data?.connected) {
                toast.success(data.message || "WhatsApp API connection test passed!");
            } else {
                toast.error(data.message || "WhatsApp connection test failed.");
            }
        } catch {
            toast.error("Connection test failed.");
        } finally {
            setTestingConnection(false);
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="WhatsApp Cloud API Engine Settings"
                description="Manage global Meta Cloud API credentials, TEST vs LIVE simulation mode toggle, webhook signature secrets, and graph API versioning."
                breadcrumbs={[{ label: "Platform Settings", href: "/settings" }, { label: "WhatsApp Engine" }]}
                badge={mode === "test" ? "TEST MODE" : "LIVE MODE"}
            />

            {/* Mode Indicator Banner */}
            <Card className={`p-6 border rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
                mode === "test" ? "bg-amber-50/80 border-amber-200 text-amber-900" : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
            }`}>
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl font-black ${
                        mode === "test" ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"
                    }`}>
                        <Zap size={22} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black uppercase tracking-wider">
                                Active Mode: {mode.toUpperCase()}
                            </h3>
                            <Badge className={mode === "test" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}>
                                Source: {configSource.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-xs font-medium mt-0.5">
                            {mode === "test"
                                ? "TEST MODE is active. All WhatsApp messages are internally simulated with zero external Meta API calls."
                                : "LIVE MODE is active. Messages are delivered via the official Meta Graph API."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setMode("test")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            mode === "test" ? "bg-amber-500 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        TEST MODE
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("live")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            mode === "live" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        LIVE MODE
                    </button>
                </div>
            </Card>

            <form onSubmit={handleSave} className="space-y-6">
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={18} className="text-[#35877D]" />
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Meta Business &amp; Phone Credentials</h3>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowTokens(!showTokens)}
                            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 h-8 px-2.5 rounded-lg"
                        >
                            {showTokens ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span>{showTokens ? "Hide Sensitive Tokens" : "Show Full Tokens"}</span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Meta App ID</Label>
                            <Input
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                placeholder="e.g. 109283749201928"
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Meta App Secret</Label>
                            <Input
                                type={showTokens ? "text" : "password"}
                                value={appSecret}
                                onChange={(e) => setAppSecret(e.target.value)}
                                placeholder="e.g. 9a8b7c6d5e4f3a2b1c0d"
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">WhatsApp Business Account ID (WABA ID)</Label>
                            <Input
                                value={wabaId}
                                onChange={(e) => setWabaId(e.target.value)}
                                placeholder="e.g. 102938475610293"
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">WhatsApp Phone Number ID</Label>
                            <Input
                                value={phoneNumberId}
                                onChange={(e) => setPhoneNumberId(e.target.value)}
                                placeholder="e.g. 50493827162534"
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-900">System User Access Token (Bearer Token)</Label>
                        <Input
                            type={showTokens ? "text" : "password"}
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            placeholder="e.g. EAA..."
                            className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Webhook Verify Token</Label>
                            <Input
                                value={verifyToken}
                                onChange={(e) => setVerifyToken(e.target.value)}
                                placeholder="e.g. connectly360_verify_token_secure"
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Webhook App Secret (HMAC SHA256)</Label>
                            <Input
                                type={showTokens ? "text" : "password"}
                                value={webhookSecret}
                                onChange={(e) => setWebhookSecret(e.target.value)}
                                placeholder="Webhook verification secret"
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Meta Graph API Version</Label>
                            <Input
                                value={apiVersion}
                                onChange={(e) => setApiVersion(e.target.value)}
                                placeholder="e.g. v23.0"
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>
                </Card>

                <div className="flex items-center gap-3">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="h-11 px-6 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer border-0 transition-all"
                    >
                        <Save size={16} />
                        <span>{saving ? "Saving Configurations..." : "Save WhatsApp Engine Settings"}</span>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleTestConnection}
                        disabled={testingConnection}
                        className="h-11 px-5 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={15} className={testingConnection ? "animate-spin text-[#35877D]" : ""} />
                        <span>{testingConnection ? "Testing Connection..." : "Test Connection Status"}</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
