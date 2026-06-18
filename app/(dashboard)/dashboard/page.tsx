"use client";

import { useGetAnalyticsSummary, useListConversations, useListLeads } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, MessageSquare, Plus, RefreshCw, Sparkles, MessageCircle, ChevronRight, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { data: summary, isLoading: isLoadingSummary, refetch: refetchSummary } = useGetAnalyticsSummary();
    const { data: conversations, isLoading: isLoadingConversations, refetch: refetchConversations } = useListConversations({ limit: 5 });
    const { data: leads, isLoading: isLoadingLeads, refetch: refetchLeads } = useListLeads();

    const handleRefresh = () => {
        refetchSummary();
        refetchConversations();
        refetchLeads();
    };

    return (
        <div className="space-y-6">

            {/* Top Header Greetings */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome back, Admin 👋</h1>
                    <p className="text-sm text-gray-500">Here is your workspace overview.</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 border-gray-200 text-gray-700 bg-white gap-1.5 font-medium shadow-sm">
                        <RefreshCw size={14} />
                        Refresh
                    </Button>
                    <Button size="sm" asChild className="h-9 bg-[#35877D] hover:bg-[#2c6f66] text-white gap-1.5 font-medium shadow-sm">
                        <Link href="/integrations/whatsapp">
                            <Plus size={16} />
                            Connect WhatsApp
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Hero Dark Green Banner Card */}
            <div className="relative bg-gradient-to-br from-[#35877D] to-[#2c6f66] border border-slate-200 rounded-2xl p-6 md:p-8 text-white overflow-hidden shadow-lg">

                {/* Sparkles Badge */}
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full mb-4">
                    <Sparkles size={12} />
                    Pro Workspace Enabled
                </div>

                <div className="max-w-xl space-y-4 relative z-10">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                        Connect & Manage Customer Conversations with precision.
                    </h2>
                    <p className="text-xs md:text-sm text-slate-100 leading-relaxed">
                        Design custom auto-reply flows, manage message queues, sync leads, and generate bulk WhatsApp notifications in just a few clicks.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        <Button size="sm" asChild className="bg-white hover:bg-gray-100 text-[#35877D] text-xs h-9 font-semibold px-4 shadow-sm border-0">
                            <Link href="/integrations/whatsapp">Get Started</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild className="border-white/40 hover:bg-white/10 text-white text-xs h-9 font-semibold px-4">
                            <Link href="/settings">View Tutorials</Link>
                        </Button>
                    </div>
                </div>

                {/* Banner Right tilted layout cards vector design */}
                <div className="absolute right-[-2%] bottom-[-10%] w-[280px] h-[160px] bg-[#35877D]/30 border border-white/10 rounded-2xl rotate-[-10deg] shadow-2xl opacity-20 p-4 flex flex-col justify-between hidden md:flex">
                    <div className="w-6 h-6 rounded-full bg-white/10 p-1 flex items-center justify-center">
                        <img src="/images/logo.png" alt="Logo" className="h-full w-auto object-contain brightness-0 invert" />
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
                    title="ACTIVE CUSTOMERS"
                    value={summary?.totalCustomers}
                    subtitle={`+${summary?.newCustomersToday || 0} this week`}
                    icon={Users}
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
                    title="TOTAL MESSAGES"
                    value={summary?.totalMessages}
                    subtitle={`${summary?.totalInbound || 0} inbound / ${summary?.totalOutbound || 0} outbound`}
                    icon={MessageSquare}
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
