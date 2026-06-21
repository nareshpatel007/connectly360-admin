"use client";

import { useEffect, useState } from "react";
import { Receipt, Loader2, Landmark, Coins, TrendingDown, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface CreditLog {
    id: number;
    action: string;
    description: string;
    created_at: string;
}

export default function CreditHistoryPage() {
    const { token } = useAuth();
    const [history, setHistory] = useState<CreditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/reports/credit-history", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const result = await res.json();
                if (result.status) {
                    setHistory(result.data);
                }
            } catch (err) {
                console.error("Failed to load credit history", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchHistory();
        }
    }, [token]);

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <Receipt size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Credit History</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Track all credit increments (purchases, subscription setup) and decrements (message logs).</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="animate-spin text-[#378179] h-7 w-7" />
                    <p className="text-xs text-slate-400 font-medium font-sans">Loading credit ledger...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 shadow-xs">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Receipt size={18} />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-800">No transactions recorded</h3>
                        <p className="text-xs text-slate-400 mt-0.5 max-w-xs leading-normal">Your credit balance usage, recharges, and plan tokens will appear in this ledger.</p>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-slate-150 bg-slate-50/60 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <span className="col-span-2">Type</span>
                        <span className="col-span-3">Event Action</span>
                        <span className="col-span-4">Transaction Details</span>
                        <span className="col-span-3">Date & Time</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {history.map((log) => {
                            const isAddition = log.action === "credit_purchase" || log.action === "select_plan" || log.action === "subscription_purchase";

                            return (
                                <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/30 transition-colors">
                                    <div className="col-span-2 flex items-center gap-1.5 text-xs font-bold">
                                        {isAddition ? (
                                            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg text-[10px]">
                                                <TrendingUp size={11} />
                                                Credit In
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg text-[10px]">
                                                <TrendingDown size={11} />
                                                Credit Out
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-3">
                                        <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
                                            {log.action.replace("_", " ")}
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
    );
}
