"use client";

import { useEffect, useState } from "react";
import { Wallet, Loader2, Coins, ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CreditLog {
    id: number;
    action: string;
    credits: number | null;
    description: string;
    created_at: string;
}

interface Summary {
    available: number;
    used: number;
    total: number;
}

export default function CreditsPage() {
    const { token } = useAuth();
    const [history, setHistory] = useState<CreditLog[]>([]);
    const [summary, setSummary] = useState<Summary>({ available: 0, used: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCreditHistory = async () => {
            try {
                const res = await fetch("/api/reports/credit-history", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const result = await res.json();
                if (result.status) {
                    setHistory(result.data || []);
                    if (result.summary) {
                        setSummary(result.summary);
                    }
                }
            } catch (err) {
                console.error("Failed to load credit history", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchCreditHistory();
        }
    }, [token]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                        <Wallet size={20} className="text-[#378179]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Messaging Credits</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Track your credits balance, usage consumption logs, and transaction details.</p>
                    </div>
                </div>
                <Button asChild className="bg-[#378179] hover:bg-[#2c6f66] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer border-0">
                    <Link href="/billing/recharge-credits">Buy Credits Pack</Link>
                </Button>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: "Available Credits",
                        value: summary.available.toLocaleString(),
                        desc: "Ready to use immediately",
                        icon: <Coins className="text-[#378179]" size={16} />,
                        bg: "bg-emerald-50/50 border-emerald-100"
                    },
                    {
                        label: "Used Credits",
                        value: summary.used.toLocaleString(),
                        desc: "Consumed across all actions",
                        icon: <ArrowDownLeft className="text-rose-500" size={16} />,
                        bg: "bg-rose-50/30 border-rose-100"
                    },
                    {
                        label: "Total Credits",
                        value: summary.total.toLocaleString(),
                        desc: "Total allocated & purchased",
                        icon: <ArrowUpRight className="text-blue-500" size={16} />,
                        bg: "bg-blue-50/30 border-blue-100"
                    },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl border bg-white p-6 shadow-xs flex flex-col justify-between relative overflow-hidden ${stat.bg}`}>
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                                <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-100 flex items-center justify-center">
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-950 mt-4 leading-none">{stat.value}</p>
                        </div>
                        <p className="text-xs text-slate-450 font-semibold mt-3">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Consumption History Table */}
            <div>
                <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap size={15} className="text-[#378179]/70" />
                    <span>Credit Consumption History</span>
                </h2>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                        <Loader2 className="animate-spin text-[#378179] h-7 w-7" />
                        <p className="text-xs text-slate-400 font-medium font-sans">Loading credit transactions...</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 shadow-xs">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <Wallet size={18} />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-800">No credit consumption history</h3>
                            <p className="text-xs text-slate-400 mt-0.5 max-w-xs leading-normal">Outbound messages, AI replies, and database actions will log credits usage here.</p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-slate-150 bg-slate-50/60 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            <span className="col-span-3">Action Type</span>
                            <span className="col-span-2 text-center">Amount</span>
                            <span className="col-span-4">Description</span>
                            <span className="col-span-3">Timestamp</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {history.map((log) => {
                                const creditVal = log.credits ?? 0;
                                const isPositive = creditVal > 0;

                                return (
                                    <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/30 transition-colors">
                                        <div className="col-span-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${log.action === "credit_purchase" || log.action === "subscription_purchase"
                                                ? "bg-purple-50 text-purple-700 border-purple-100"
                                                : log.action === "select_plan"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                                }`}>
                                                {log.action.replace("_", " ")}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className={`text-xs font-black px-2 py-0.5 rounded-md ${isPositive
                                                ? "bg-emerald-50 text-emerald-700 font-bold"
                                                : "bg-rose-50/50 text-rose-600 font-bold"
                                                }`}>
                                                {isPositive ? `+${creditVal}` : `${creditVal}`}
                                            </span>
                                        </div>
                                        <div className="col-span-4 text-xs text-slate-700 font-semibold leading-relaxed">
                                            {log.description}
                                        </div>
                                        <div className="col-span-3 text-[11px] text-slate-400 font-semibold">
                                            {new Date(log.created_at).toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
