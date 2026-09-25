"use client";

import { useState, useEffect } from "react";
import { useGetAnalyticsSummary, useListConversations, useListLeads } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import {
    Users, TrendingUp, MessageSquare, Plus, RefreshCw, Sparkles, Loader2,
    CheckCircle2, Shield, Zap, X, Copy, Check, ChevronDown, ChevronUp,
    ExternalLink, BookOpen, FileText, ArrowRight, MessageCircle, HelpCircle, Mail,
    Bot, Cpu, Brain, History, ToggleRight, AlertTriangle, CreditCard
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { BuyCreditsModal } from "@/components/buy-credits-modal";

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
    const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);

    // UI states
    const [copied, setCopied] = useState(false);

    // Queries
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

    const copyCompanyId = () => {
        const companyId = user?.company_id || "6a40a10a3d471f6bc17f5ffa";
        navigator.clipboard.writeText(companyId);
        setCopied(true);
        toast.success("Company ID copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const credits = Number(user?.credits || 0);
    const isZeroCredits = credits <= 0;
    const isLowCredits = credits > 0 && credits <= 100;

    // Standard Redesigned Dashboard View
    return (
        <div className="space-y-6 pb-12">
            {/* LOW / ZERO CREDIT WARNING ALERT */}
            {isZeroCredits ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-rose-900">Your Credit Balance is 0</h3>
                            <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                                Automated replies, AI resolutions, and WhatsApp campaigns are currently paused. Recharge credits now to continue uninterrupted service.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsBuyCreditsOpen(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl h-9 px-4 shrink-0 shadow-xs cursor-pointer"
                    >
                        <Zap size={14} className="mr-1.5 fill-white" />
                        Recharge Credits
                    </Button>
                </div>
            ) : isLowCredits ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-amber-900">Low Credit Balance: {credits} Credits Remaining</h3>
                            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                                You are running low on credits. Refill your wallet to ensure your AI agents and campaigns continue running without interruption.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsBuyCreditsOpen(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl h-9 px-4 shrink-0 shadow-xs cursor-pointer"
                    >
                        <Zap size={14} className="mr-1.5 fill-white" />
                        Refill Credits
                    </Button>
                </div>
            ) : null}

            {/* SPLIT COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Workspace/Wallet Details Card */}
                    <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#00382B] via-[#35877D] to-emerald-400" />
                        <div className="flex items-center gap-4">
                            {/* Brand Avatar */}
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00382B] to-[#35877D] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                                {user?.name ? user?.name.charAt(0).toUpperCase() : "C"}
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="font-semibold text-slate-800 text-sm leading-none flex items-center gap-2">
                                    {user?.name ? `${user?.name}'s Workspace` : "My Workspace"}
                                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">Pay As You Go</span>
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                    <span>Company ID:</span>
                                    <span className="font-mono text-[11px] text-slate-650 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 select-all font-semibold">
                                        {user?.company_id || "6a40a10a3d471f6bc17f5ffa"}
                                    </span>
                                    <button
                                        onClick={copyCompanyId}
                                        className="hover:text-[#35877D] hover:bg-slate-50 rounded p-1 transition-colors cursor-pointer"
                                        title="Copy Company ID"
                                    >
                                        {copied ? <Check size={12} className="text-emerald-555" /> : <Copy size={12} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Credit Wallet Balance & Quick Actions */}
                        <div className="flex flex-wrap items-center gap-4 self-start md:self-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50 w-full md:w-auto">
                            <div className="flex flex-col items-start md:items-end">
                                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Available Credits</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20 font-extrabold text-base">
                                        <Zap size={14} className="fill-[#35877D]" />
                                        <span>{credits.toLocaleString()}</span>
                                    </div>
                                    <Button
                                        onClick={() => setIsBuyCreditsOpen(true)}
                                        className="text-xs font-bold text-white bg-[#00382B] hover:bg-[#35877D] transition-all px-3 py-1.5 rounded-xl shadow-xs h-9 cursor-pointer"
                                    >
                                        Buy Credits
                                    </Button>
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="text-xs font-semibold text-slate-700 hover:text-[#35877D] border-slate-200 h-9 rounded-xl cursor-pointer"
                                    >
                                        <Link href="/billing">History</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>


                    {/* WhatsApp Business Promo Banner */}
                    <Card className="relative overflow-hidden bg-gradient-to-br from-[#35877D]/10 via-[#35877D]/3 to-[#35877D]/10 border border-[#35877D]/15 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-3.5 max-w-md text-center md:text-left">
                            <h2 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight leading-tight">
                                Complete your WhatsApp API Sandbox setup!
                            </h2>
                            <p className="text-xs text-slate-500 font-normal leading-relaxed">
                                Link your official business phone number and deploy your customized AI agents to production database channels.
                            </p>
                            <div className="pt-1">
                                <Button
                                    asChild
                                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold px-5 h-9 shadow-sm border-0"
                                >
                                    <Link href="/integrations/whatsapp">
                                        Start Setup Wizard
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Onboarding QR */}
                        <div className="flex items-center gap-4 bg-white border border-[#35877D]/20 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 select-none shrink-0 w-full sm:w-auto relative group">
                            <div className="relative flex items-center gap-4 w-full justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-[#35877D]/10 text-[#35877D] flex items-center justify-center shrink-0 shadow-inner">
                                        <MessageCircle size={20} className="fill-[#35877D]/20" />
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-xs font-bold text-slate-800 tracking-tight leading-none">Test Sandbox AI</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Scan to chat on WhatsApp</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
                                            <span className="text-[9.5px] text-emerald-600 font-bold tracking-wide uppercase">Online & Active</span>
                                        </div>
                                    </div>
                                </div>
                                <a 
                                    href="https://wa.me/919586557103?text=Hello" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="ml-auto sm:ml-4 border border-slate-100 rounded-xl p-1 bg-white shadow-xs hover:border-[#35877D]/45 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0"
                                    title="Click to test chat directly"
                                >
                                    <img 
                                        src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://wa.me/919586557103?text=Hello" 
                                        alt="WhatsApp Testing QR Code" 
                                        className="h-14 w-14 object-contain" 
                                    />
                                </a>
                            </div>
                        </div>
                    </Card>

                    {/* AI AUTOMATION METRICS GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* Metric 1 */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2.5 shadow-xs relative overflow-hidden">
                            <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-650 flex items-center justify-center shrink-0">
                                <Users size={15} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Leads</p>
                                <h3 className="text-xl font-semibold text-slate-800 mt-0.5">
                                    {isLoadingLeads ? (
                                        <Skeleton className="h-6 w-12 mt-1" />
                                    ) : (
                                        leads?.length || 0
                                    )}
                                </h3>
                            </div>
                            <span className="absolute bottom-3 right-4 text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">+12% wk</span>
                        </div>

                        {/* Metric 2 */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2.5 shadow-xs relative overflow-hidden">
                            <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0">
                                <Bot size={15} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">AI Resolution</p>
                                <h3 className="text-xl font-semibold text-slate-800 mt-0.5">95.2%</h3>
                            </div>
                            <span className="absolute bottom-3 right-4 text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">Top Tier</span>
                        </div>

                        {/* Metric 3 */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2.5 shadow-xs relative overflow-hidden">
                            <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-650 flex items-center justify-center shrink-0">
                                <MessageSquare size={15} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Chats</p>
                                <h3 className="text-xl font-semibold text-slate-800 mt-0.5">
                                    {isLoadingConversations ? (
                                        <Skeleton className="h-6 w-12 mt-1" />
                                    ) : (
                                        conversations?.length || 0
                                    )}
                                </h3>
                            </div>
                            <span className="absolute bottom-3 right-4 text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">Live Logs</span>
                        </div>

                        {/* Metric 4 */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2.5 shadow-xs relative overflow-hidden">
                            <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-650 flex items-center justify-center shrink-0">
                                <Brain size={15} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Auto Workflows</p>
                                <h3 className="text-xl font-semibold text-slate-800 mt-0.5">3 Active</h3>
                            </div>
                            <span className="absolute bottom-3 right-4 text-[9px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">SaaS AI</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Need Support? Card */}
                    <Card className="bg-white border border-[#EAE6DF] shadow-xs rounded-xl p-5 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-[#35877D]/10 text-[#35877D] flex items-center justify-center shrink-0">
                                    <HelpCircle size={16} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-semibold text-slate-800">Need Support?</h4>
                                    <Link href="/settings" className="text-[10px] text-[#35877D] font-semibold hover:underline">
                                        Go to support center
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs font-normal">
                            <div className="flex items-center justify-between text-slate-500">
                                <span>Email:</span>
                                <span className="text-slate-700 select-all font-semibold">support@connectly360.com</span>
                            </div>
                            <div className="flex items-start justify-between gap-4 text-slate-500">
                                <span>Feedback:</span>
                                <span className="text-slate-700 text-right leading-normal">
                                    Click to submit your requests or suggestions
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                            <Link
                                href="/billing/buy-credits"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#35877D] hover:underline"
                            >
                                Buy Credit Packs
                                <ArrowRight size={12} />
                            </Link>
                        </div>
                    </Card>

                    {/* Resources Card */}
                    <Card className="bg-white border border-[#EAE6DF] shadow-xs rounded-xl p-5 space-y-4">
                        <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Resources</h4>

                        <div className="space-y-4">
                            {/* Resource item 1 */}
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-[#35877D]/10 text-[#35877D] flex items-center justify-center shrink-0 mt-0.5">
                                    <FileText size={15} />
                                </div>
                                <div className="space-y-0.5">
                                    <Link href="/knowledge-base" className="text-[11px] font-semibold text-slate-800 hover:text-[#35877D] transition-colors leading-none block">
                                        Product Docs
                                    </Link>
                                    <p className="text-[12px] text-slate-500 font-normal leading-relaxed">
                                        Access our product documentation to understand features in detail.
                                    </p>
                                </div>
                            </div>

                            {/* Resource item 2 */}
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-[#35877D]/10 text-[#35877D] flex items-center justify-center shrink-0 mt-0.5">
                                    <Zap size={14} />
                                </div>
                                <div className="space-y-0.5">
                                    <Link href="/integrations/api-keys" className="text-[11px] font-semibold text-slate-800 hover:text-[#35877D] transition-colors leading-none block">
                                        API Docs
                                    </Link>
                                    <p className="text-[12px] text-slate-500 font-normal leading-relaxed">
                                        Check out for technical details and integration guidance.
                                    </p>
                                </div>
                            </div>

                            {/* Resource item 3 */}
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-[#35877D]/10 text-[#35877D] flex items-center justify-center shrink-0 mt-0.5">
                                    <BookOpen size={14} />
                                </div>
                                <div className="space-y-0.5">
                                    <Link href="/blog" className="text-[11px] font-semibold text-slate-800 hover:text-[#35877D] transition-colors leading-none block">
                                        Blog
                                    </Link>
                                    <p className="text-[12px] text-slate-500 font-normal leading-relaxed">
                                        Visit our blog for the latest updates, insights, and best practices.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Buy Credits Modal */}
            <BuyCreditsModal
                open={isBuyCreditsOpen}
                onOpenChange={setIsBuyCreditsOpen}
            />
        </div>
    );
}

