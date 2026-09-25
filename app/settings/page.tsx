"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Globe, Save, Sliders, Bell, Key, CreditCard, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        platformName: "Connectly360",
        supportEmail: "support@connectly360.com",
        supportPhone: "+91 9586557162",
        currency: "INR (₹)",
        trialDays: "14",
        freeTrialCredits: "100",
        requireEmailVerification: true
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success("Platform settings updated successfully.");
        }, 800);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <AdminPageHeader
                title="Platform Settings"
                description="Configure global platform parameters, default trial allocations, currency rules, and administrative security options."
                breadcrumbs={[{ label: "Platform Settings" }]}
                badge="Global Config"
            />

            {/* Payment Gateway Shortcut Banner */}
            <Card className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">Razorpay Payment Gateway Settings</h3>
                        <p className="text-xs text-teal-200/80 font-medium">Manage Test/Live modes, API Key ID, Key Secret, Webhook secrets, and connection status.</p>
                    </div>
                </div>
                <a
                    href="/settings/payment-gateway"
                    className="h-10 px-5 bg-[#35877D] hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
                >
                    <span>Configure Gateway Settings</span>
                </a>
            </Card>

            {/* WhatsApp Engine Settings Banner */}
            <Card className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">WhatsApp Cloud API Engine Settings</h3>
                        <p className="text-xs text-emerald-200/80 font-medium">Manage TEST / LIVE mode, Meta credentials (App ID, Secret, WABA ID, Access Token), and Webhook secrets.</p>
                    </div>
                </div>
                <a
                    href="/settings/whatsapp"
                    className="h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
                >
                    <span>Configure WhatsApp Engine</span>
                </a>
            </Card>

            <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
                {/* General Settings */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                    <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Globe size={18} className="text-[#35877D]" />
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">General Platform Identity &amp; Support</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Platform Brand Name</Label>
                            <Input
                                value={settings.platformName}
                                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Default Currency Symbol</Label>
                            <Input
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Support Desk Email</Label>
                            <Input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Support WhatsApp Number</Label>
                            <Input
                                value={settings.supportPhone}
                                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>
                </Card>

                {/* Security & Workspace Defaults */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                    <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Shield size={18} className="text-purple-600" />
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Tenant Onboarding &amp; Credit Defaults</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Default Free Trial Period (Days)</Label>
                            <Input
                                type="number"
                                value={settings.trialDays}
                                onChange={(e) => setSettings({ ...settings, trialDays: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Default Onboarding Free Credits</Label>
                            <Input
                                type="number"
                                value={settings.freeTrialCredits}
                                onChange={(e) => setSettings({ ...settings, freeTrialCredits: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>
                </Card>

                <Button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-6 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer border-0 transition-all"
                >
                    <Save size={16} />
                    <span>{saving ? "Saving Platform Configurations..." : "Save Global Platform Settings"}</span>
                </Button>
            </form>
        </div>
    );
}
