"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Globe, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        platformName: "Connectly360",
        supportEmail: "support@connectly360.com",
        supportPhone: "+91 9586557162",
        currency: "INR",
        trialDays: "14",
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Platform System Settings
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Configure global platform defaults, support channels, and security settings.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
                {/* General Settings */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Globe size={18} className="text-[#35877D]" />
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">General Platform Configuration</h3>
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
                            <Label className="text-xs font-bold text-slate-900">Default Currency</Label>
                            <Input
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Platform Support Email</Label>
                            <Input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Platform WhatsApp Support Phone</Label>
                            <Input
                                value={settings.supportPhone}
                                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>
                </Card>

                {/* Security Defaults */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Shield size={18} className="text-purple-600" />
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Tenant Defaults &amp; Security</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-900">Default Free Trial Duration (Days)</Label>
                            <Input
                                type="number"
                                value={settings.trialDays}
                                onChange={(e) => setSettings({ ...settings, trialDays: e.target.value })}
                                className="h-10 bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium rounded-xl focus-visible:ring-[#35877D]"
                            />
                        </div>
                    </div>
                </Card>

                <Button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-6 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer border-0 transition-all"
                >
                    <Save size={16} />
                    <span>{saving ? "Saving Settings..." : "Save Global Settings"}</span>
                </Button>
            </form>
        </div>
    );
}
