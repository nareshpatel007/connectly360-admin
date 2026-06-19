"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Users, Megaphone, Calendar, Percent, Plus } from "lucide-react";
import { UpgradeGuard } from "@/components/upgrade-guard";

export default function CampaignsPage() {
    const campaignsMock = [
        { id: 1, name: "Summer Discount Promo", status: "Sent", sentTo: 145, date: "June 10, 2026", successRate: "98%" },
        { id: 2, name: "Re-engagement Broadcast", status: "Draft", sentTo: 0, date: "Scheduled for June 15, 2026", successRate: "-" },
        { id: 3, name: "New Product Launch Announcement", status: "Sent", sentTo: 350, date: "May 28, 2026", successRate: "95%" }
    ];

    return (
        <UpgradeGuard 
            allowedPlans={["business", "enterprise"]} 
            featureName="Bulk Campaigns" 
            description="Send broadcast campaigns, target user segments, and schedule bulk notifications to your lists."
        >
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                        <p className="text-muted-foreground">Design, target, and launch WhatsApp bulk broadcast campaigns.</p>
                    </div>
                    <Button className="bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl shadow-sm flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Campaign
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Broadcasts</CardTitle>
                            <Megaphone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">Outbound broadcast operations</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                            <Send className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,824</div>
                            <p className="text-xs text-muted-foreground">+240 from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Delivery Success</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">96.8%</div>
                            <p className="text-xs text-muted-foreground">High response & deliverability</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Campaigns list mockup */}
                <Card>
                    <CardHeader>
                        <CardTitle>Broadcast History</CardTitle>
                        <CardDescription>View status and analytics for previous broadcast campaigns.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-border">
                            {campaignsMock.map((campaign) => (
                                <div key={campaign.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{campaign.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>{campaign.date}</span>
                                            <span>•</span>
                                            <Users className="h-3 w-3" />
                                            <span>{campaign.sentTo} recipients</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xs font-semibold">Success Rate</p>
                                            <p className="text-xs text-muted-foreground">{campaign.successRate}</p>
                                        </div>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${campaign.status === "Sent" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-50 text-zinc-600 border border-zinc-200"
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UpgradeGuard>
    );
}
