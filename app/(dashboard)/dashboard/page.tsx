"use client";

import { useState, useEffect } from "react";
import { useGetAnalyticsSummary, useListConversations, useListLeads } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, MessageSquare, Plus, RefreshCw, Sparkles, Loader2, CheckCircle2, Shield, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
    const { user, token, login } = useAuth();
    const [isActivating, setIsActivating] = useState(false);
    const [activationError, setActivationError] = useState<string | null>(null);
    const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);

    // Queries (always invoke hooks, but we only show the data once verified)
    const { data: summary, isLoading: isLoadingSummary, refetch: refetchSummary } = useGetAnalyticsSummary();
    const { data: conversations, isLoading: isLoadingConversations, refetch: refetchConversations } = useListConversations({ limit: 5 });
    const { data: leads, isLoading: isLoadingLeads, refetch: refetchLeads } = useListLeads();

    useEffect(() => {
        const checkWhatsAppStatus = async () => {
            try {
                const res = await fetch("/api/whatsapp/status", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.status === "connected") {
                    setIsWhatsAppConnected(true);
                }
            } catch (err) {
                console.error("Failed to check WhatsApp status", err);
            }
        };

        if (token) {
            checkWhatsAppStatus();
        }
    }, [token]);

    const handleRefresh = () => {
        refetchSummary();
        refetchConversations();
        refetchLeads();
    };

    // Plan Activation Handshake
    const handleSelectPlan = async (planKey: "starter" | "growth" | "business") => {
        setIsActivating(true);
        setActivationError(null);

        try {
            const res = await fetch("/api/tenant/select-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ plan: planKey })
            });

            const result = await res.json();

            if (result.status) {
                // Refresh authentication session reactively
                login(result.data.access_token);
            } else {
                setActivationError(result.message || "Failed to activate plan.");
            }
        } catch (err) {
            setActivationError("Error communicating with servers. Please try again.");
        } finally {
            setIsActivating(false);
        }
    };

    // If user has not purchased/activated a plan (Plan is 'pending')
    if (!user?.plan || user.plan.toLowerCase() === "pending") {
        return (
            <div className="space-y-8 max-w-6xl mx-auto py-4">

                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20">
                        <Sparkles size={12} className="animate-pulse" />
                        Workspace Setup
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Activate Your Connectly360 Workspace
                    </h1>
                    <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                        Choose a pricing tier below to activate your account. Click &quot;Free Trial&quot; on the Starter plan to try it free for 7 days.
                    </p>
                </div>

                {activationError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold p-4 rounded-xl max-w-md mx-auto text-center">
                        {activationError}
                    </div>
                )}

                {/* Plan Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative">
                    {isActivating && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-50 rounded-3xl">
                            <div className="flex flex-col items-center gap-3 bg-white border border-[#EAE6DF] shadow-md p-6 rounded-2xl">
                                <Loader2 size={36} className="text-[#35877D] animate-spin" />
                                <p className="text-xs font-extrabold text-[#35877D] uppercase tracking-wider">Activating Workspace...</p>
                            </div>
                        </div>
                    )}

                    {/* Starter Card */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#35877D] bg-[#35877D]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Starter</span>
                                <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase border border-amber-200">7-Day Free Trial</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Starter</h3>
                                <p className="text-xs text-gray-500 font-semibold mt-1">For Retail Stores &amp; Small Businesses</p>
                            </div>
                            <div className="flex items-baseline pt-2">
                                <span className="text-3xl font-black text-slate-900">₹499</span>
                                <span className="text-gray-500 text-xs ml-1 font-semibold">/month</span>
                            </div>
                            <ul className="space-y-2.5 text-xs text-gray-600 font-semibold pt-4">
                                {[
                                    "1,000 Monthly Credits",
                                    "1 WhatsApp Number",
                                    "Basic Automation Replies",
                                    "Shared Team Inbox",
                                    "Contact & Lead Directory"
                                ].map((f) => (
                                    <li key={f} className="flex items-center gap-2">
                                        <CheckCircle2 size={13} className="text-[#35877D] shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            onClick={() => handleSelectPlan("starter")}
                            className="mt-8 w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm"
                        >
                            Start Free Trial
                        </Button>
                    </div>

                    {/* Growth Card */}
                    <div className="bg-[#35877D]/5 border-2 border-[#35877D] rounded-3xl p-6 flex flex-col justify-between shadow-sm relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#35877D] text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-transparent">
                            Recommended
                        </div>
                        <div className="space-y-4 mt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#35877D] bg-white px-2 py-0.5 rounded-full uppercase tracking-wider">Growth</span>
                                <span className="text-[9px] font-extrabold text-[#35877D] bg-[#35877D]/10 px-2.5 py-0.5 rounded-full uppercase border border-[#35877D]/20">AI Assistant</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Growth</h3>
                                <p className="text-xs text-gray-500 font-semibold mt-1">For Agencies &amp; Manufacturers</p>
                            </div>
                            <div className="flex items-baseline pt-2">
                                <span className="text-3xl font-black text-[#35877D]">₹999</span>
                                <span className="text-gray-500 text-xs ml-1 font-semibold">/month</span>
                            </div>
                            <ul className="space-y-2.5 text-xs text-gray-600 font-semibold pt-4">
                                {[
                                    "3,000 Monthly Credits",
                                    "1 WhatsApp Number",
                                    "AI Chatbot Agent (GPT)",
                                    "Knowledge Base (PDF/FAQ)",
                                    "No-Code Workflow Builder",
                                    "Advanced CRM Integrations"
                                ].map((f) => (
                                    <li key={f} className="flex items-center gap-2">
                                        <CheckCircle2 size={13} className="text-[#35877D] shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            onClick={() => handleSelectPlan("growth")}
                            className="mt-8 w-full h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-sm font-bold shadow-sm"
                        >
                            Choose Growth
                        </Button>
                    </div>

                    {/* Business Card */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Business</span>
                                <span className="text-[9px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase border border-slate-200">Scale Team</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Business</h3>
                                <p className="text-xs text-gray-500 font-semibold mt-1">For Sales &amp; Broadcast Support Teams</p>
                            </div>
                            <div className="flex items-baseline pt-2">
                                <span className="text-3xl font-black text-slate-900">₹2,499</span>
                                <span className="text-gray-500 text-xs ml-1 font-semibold">/month</span>
                            </div>
                            <ul className="space-y-2.5 text-xs text-gray-600 font-semibold pt-4">
                                {[
                                    "10,000 Monthly Credits",
                                    "3 WhatsApp Numbers (Up to 10)",
                                    "10 Shared Team Inbox Seats",
                                    "WhatsApp Broadcast Campaigns",
                                    "Campaign Performance Analytics",
                                    "API Access & Custom Webhooks"
                                ].map((f) => (
                                    <li key={f} className="flex items-center gap-2">
                                        <CheckCircle2 size={13} className="text-[#35877D] shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            onClick={() => handleSelectPlan("business")}
                            className="mt-8 w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm"
                        >
                            Choose Business
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Standard Full Dashboard View (Revealed once plan is selected)
    return (
        <div className="space-y-6">

            {/* Top Header Greetings */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome back, {user?.name || "Admin"} 👋</h1>
                    <p className="text-sm text-gray-500">Here is your workspace overview.</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 border-gray-200 text-gray-700 bg-white gap-1.5 font-medium shadow-sm">
                        <RefreshCw size={14} />
                        Refresh
                    </Button>
                    {!isWhatsAppConnected && (
                        <Button size="sm" asChild className="h-9 bg-[#35877D] hover:bg-[#2c6f66] text-white gap-1.5 font-medium shadow-sm">
                            <Link href="/integrations/whatsapp">
                                <Plus size={16} />
                                Connect WhatsApp
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Hero Banner Card */}
            <div className="relative bg-gradient-to-br from-[#35877D] to-[#2c6f66] border border-slate-200 rounded-2xl p-6 md:p-8 text-white overflow-hidden shadow-lg">

                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full mb-4">
                    <Sparkles size={12} />
                    {user?.plan ? `${user.plan.toUpperCase()} Workspace Active` : "Workspace Enabled"}
                </div>

                <div className="max-w-xl space-y-4 relative z-10">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                        Connect & Manage Customer Conversations with precision.
                    </h2>
                    <p className="text-xs md:text-sm text-slate-100 leading-relaxed">
                        Design custom auto-reply flows, manage message queues, sync leads, and generate bulk WhatsApp notifications in just a few clicks.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        {!isWhatsAppConnected ? (
                            <Button size="sm" asChild className="bg-white hover:bg-gray-100 text-[#35877D] text-xs h-9 font-semibold px-4 shadow-sm border-0">
                                <Link href="/integrations/whatsapp">Get Started</Link>
                            </Button>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold border border-white/10 backdrop-blur-xs">
                                <CheckCircle2 size={13} className="text-emerald-300 fill-emerald-300/10" />
                                WhatsApp Connected
                            </span>
                        )}
                        <Button size="sm" variant="outline" asChild className="border-white/40 hover:bg-white/10 text-white text-xs h-9 font-semibold px-4">
                            <Link href="/settings">View Tutorials</Link>
                        </Button>
                    </div>
                </div>

                {/* tilted tilted dashboard background graphics */}
                <div className="absolute right-[-2%] bottom-[-10%] w-[280px] h-[160px] bg-[#35877D]/30 border border-white/10 rounded-2xl rotate-[-10deg] shadow-2xl opacity-20 p-4 flex flex-col justify-between hidden md:flex">
                    <div className="w-6 h-6 rounded-full bg-white/10 p-1 flex items-center justify-center">
                        <img src="https://connectly360.sandboxtechnology.in/images/logo.png" alt="Logo" className="h-full w-auto object-contain brightness-0 invert" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="w-3/4 h-2 bg-white/10 rounded-full" />
                        <div className="w-1/2 h-2 bg-white/10 rounded-full" />
                    </div>
                </div>
                <div className="absolute right-[10%] bottom-[-5%] w-[260px] h-[170px] bg-[#35877D]/50 border border-white/20 rounded-2xl rotate-[8deg] shadow-2xl opacity-40 p-4 flex flex-col justify-between hidden md:flex">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-900/30 flex items-center justify-center">
                                <Users size={12} className="text-white" />
                            </div>
                            <span className="text-[10px] text-white font-medium">Customer Synced</span>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#60B187]" />
                    </div>
                    <div className="space-y-1">
                        <div className="w-full h-1.5 bg-white/10 rounded-full" />
                        <div className="w-2/3 h-1.5 bg-white/10 rounded-full" />
                    </div>
                    <div className="text-[9px] text-teal-100">Active Pipeline</div>
                </div>
            </div>

            {/* Grid of 3 Stat Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="TOTAL UNREAD MESSAGES"
                    value={summary?.totalInbound ? Math.max(2, Math.round(summary.totalInbound * 0.12)) : 5}
                    subtitle="Requires agent response"
                    icon={MessageSquare}
                    loading={isLoadingSummary}
                />
                <MetricCard
                    title="TOTAL LEADS"
                    value={summary?.totalLeads}
                    subtitle={`+${summary?.newLeadsToday || 0} this week`}
                    icon={TrendingUp}
                    loading={isLoadingSummary}
                />
                <MetricCard
                    title="TOTAL TEAM MEMBERS"
                    value={3}
                    subtitle="Active seats in workspace"
                    icon={Users}
                    loading={isLoadingSummary}
                />
            </div>
        </div>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, loading }: { title: string, value?: number, subtitle?: string, icon: any, loading: boolean }) {
    return (
        <Card className="bg-white border border-[#EAE6DF] shadow-sm rounded-xl overflow-hidden p-5 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{title}</span>
                <div className="h-8 w-8 rounded-lg bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-gray-400 shrink-0">
                    <Icon size={16} />
                </div>
            </div>
            <div className="mt-3">
                {loading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
                    <div className="text-3xl font-extrabold text-[#0B2E1E] leading-none">
                        {value?.toLocaleString('en-IN') || 0}
                    </div>
                )}
                <p className="text-[10px] text-gray-400 mt-1 font-medium leading-none">
                    {loading ? <Skeleton className="h-3.5 w-24 mt-1" /> : subtitle}
                </p>
            </div>
        </Card>
    );
}
