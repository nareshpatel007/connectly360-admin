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
                    <Button size="sm" asChild className="h-9 bg-[#1B633E] hover:bg-[#12452A] text-white gap-1.5 font-medium shadow-sm">
                        <Link href="/integrations/whatsapp">
                            <Plus size={16} />
                            Connect WhatsApp
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Hero Dark Green Banner Card */}
            <div className="relative bg-gradient-to-br from-[#0B2E1E] to-[#123F2A] border border-emerald-950 rounded-2xl p-6 md:p-8 text-[#E2EBE5] overflow-hidden shadow-lg">

                {/* Sparkles Badge */}
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-[#185334] text-[#D99B26] border border-emerald-800 px-3 py-1 rounded-full mb-4">
                    <Sparkles size={12} />
                    Pro Workspace Enabled
                </div>

                <div className="max-w-xl space-y-4 relative z-10">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                        Connect & Manage Customer Conversations with precision.
                    </h2>
                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                        Design custom auto-reply flows, manage message queues, sync leads, and generate bulk WhatsApp notifications in just a few clicks.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        <Button size="sm" asChild className="bg-[#1B633E] hover:bg-[#12452A] text-white text-xs h-9 font-semibold px-4">
                            <Link href="/integrations/whatsapp">Get Started</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild className="border-gray-500/50 hover:bg-emerald-900/10 text-white text-xs h-9 font-semibold px-4">
                            <Link href="/settings">View Tutorials</Link>
                        </Button>
                    </div>
                </div>

                {/* Banner Right tilted layout cards vector design */}
                <div className="absolute right-[-2%] bottom-[-10%] w-[280px] h-[160px] bg-[#14532D] border border-emerald-800 rounded-2xl rotate-[-10deg] shadow-2xl opacity-20 p-4 flex flex-col justify-between hidden md:flex">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 p-1 flex items-center justify-center">
                        <img src="/images/logo.png" alt="Logo" className="h-full w-auto object-contain brightness-0 invert" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="w-3/4 h-2 bg-[#0C321B] rounded-full" />
                        <div className="w-1/2 h-2 bg-[#0C321B] rounded-full" />
                    </div>
                </div>
                <div className="absolute right-[10%] bottom-[-5%] w-[260px] h-[170px] bg-[#1B633E] border border-emerald-700 rounded-2xl rotate-[8deg] shadow-2xl opacity-40 p-4 flex flex-col justify-between hidden md:flex">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center">
                                <Users size={12} className="text-white" />
                            </div>
                            <span className="text-[10px] text-white font-medium">Customer Synced</span>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <div className="space-y-1">
                        <div className="w-full h-1.5 bg-[#0C321B]/30 rounded-full" />
                        <div className="w-2/3 h-1.5 bg-[#0C321B]/30 rounded-full" />
                    </div>
                    <div className="text-[9px] text-emerald-200">Active Pipeline</div>
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

            {/* Double Column Panels */}
            <div className="grid gap-6 md:grid-cols-2">

                {/* Left Column: Recent Conversations */}
                <Card className="bg-white border border-[#EAE6DF] shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[350px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-[#FAF8F5] pb-3.5">
                        <CardTitle className="text-base font-bold text-gray-900">Recent Conversations</CardTitle>
                        <Link href="/conversations" className="text-xs font-semibold text-[#1B633E] hover:underline flex items-center gap-0.5">
                            View All
                            <ChevronRight size={14} />
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 divide-y divide-[#FAF8F5]">
                        {isLoadingConversations ? (
                            <div className="p-4 space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-14 w-full" />
                                ))}
                            </div>
                        ) : conversations?.length === 0 ? (
                            <div className="text-center py-12 text-sm text-gray-400">No recent activity</div>
                        ) : (
                            conversations?.map((conv) => (
                                <div key={conv.id} className="p-4 hover:bg-emerald-50/10 transition flex gap-3">
                                    <div className="shrink-0 pt-0.5">
                                        <div className="h-9 w-9 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-emerald-800">
                                            <MessageCircle size={16} />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-gray-900 truncate">
                                                {conv.customerName || conv.customerPhone}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(conv.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate leading-relaxed">
                                            {conv.message}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <Badge variant="outline" className={`text-[8.5px] font-bold px-2 py-0 h-4 border-none uppercase ${conv.direction === "inbound" ? "bg-emerald-50 text-emerald-800" : "bg-[#FAF8F5] text-gray-600"
                                                }`}>
                                                {conv.direction}
                                            </Badge>
                                            {conv.intent && (
                                                <Badge variant="outline" className="text-[8.5px] font-medium px-2 py-0 h-4 bg-gray-50 border-none text-gray-600">
                                                    {conv.intent}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Right Column: Active Leads */}
                <Card className="bg-white border border-[#EAE6DF] shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[350px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-[#FAF8F5] pb-3.5">
                        <CardTitle className="text-base font-bold text-gray-900">Recent Leads</CardTitle>
                        <Link href="/leads" className="text-xs font-semibold text-[#1B633E] hover:underline flex items-center gap-0.5">
                            View All
                            <ChevronRight size={14} />
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 divide-y divide-[#FAF8F5]">
                        {isLoadingLeads ? (
                            <div className="p-4 space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-14 w-full" />
                                ))}
                            </div>
                        ) : !leads || leads.length === 0 ? (
                            <div className="text-center py-12 text-sm text-gray-400">No lead data yet</div>
                        ) : (
                            leads.slice(0, 5).map((lead) => (
                                <div key={lead.id} className="p-4 hover:bg-emerald-50/10 transition flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-full bg-amber-50 text-[#D99B26] border border-amber-100 flex items-center justify-center shrink-0">
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">
                                                {lead.customerName || <span className="text-gray-400 italic">Unknown</span>}
                                            </p>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 font-mono">
                                                <Phone size={10} />
                                                {lead.phone}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <Badge variant="outline" className={`text-[8.5px] font-bold px-2.5 py-0.5 uppercase border-none ${lead.status === "new" ? "bg-blue-50 text-blue-700" :
                                            lead.status === "contacted" ? "bg-amber-50 text-amber-700" :
                                                lead.status === "converted" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                            }`}>
                                            {lead.status}
                                        </Badge>
                                        {lead.quantity && (
                                            <span className="text-[9.5px] font-semibold text-gray-600">
                                                Qty: {lead.quantity}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

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
