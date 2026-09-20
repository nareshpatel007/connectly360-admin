"use client";

import { useEffect, useState } from "react";
import { 
    History, ArrowUpRight, ArrowDownLeft, Filter, Search, 
    Calendar, RefreshCw, Zap, FileText, CheckCircle2, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

interface CreditTransaction {
    id: number;
    action_type: string;
    description: string;
    credits_amount: number;
    balance_before: number;
    balance_after: number;
    created_at: string;
}

export default function CreditHistoryPage() {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchHistory = async (page = 1, type = filterType) => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: String(page),
                type: type,
                per_page: "15"
            });
            const res = await fetch(`/api/billing/credit-history?${queryParams.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await res.json();
            if (result.status && result.data) {
                setTransactions(result.data.data || []);
                setCurrentPage(result.data.current_page || 1);
                setLastPage(result.data.last_page || 1);
                setTotal(result.data.total || 0);
            }
        } catch (err) {
            console.error("Failed to load credit history", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchHistory(1, filterType);
        }
    }, [token, filterType]);

    const handleFilterChange = (type: "all" | "credit" | "debit") => {
        setFilterType(type);
        setCurrentPage(1);
    };

    const filtered = transactions.filter(t => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            t.description?.toLowerCase().includes(q) ||
            t.action_type?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <History size={24} className="text-[#35877D]" />
                        Credit Transaction History
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Full audit trail of credit purchases, welcome bonuses, and action-by-action usage.
                    </p>
                </div>
                <Button 
                    variant="outline"
                    onClick={() => fetchHistory(currentPage, filterType)}
                    className="h-9 text-xs font-semibold rounded-xl border-slate-200 cursor-pointer self-start sm:self-auto"
                >
                    <RefreshCw size={13} className={`mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Filter Toolbar */}
            <Card className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                        size="sm"
                        variant={filterType === "all" ? "default" : "outline"}
                        onClick={() => handleFilterChange("all")}
                        className={`text-xs font-bold rounded-xl h-8 px-3 cursor-pointer ${filterType === "all" ? "bg-[#00382B] text-white" : ""}`}
                    >
                        All Transactions
                    </Button>
                    <Button 
                        size="sm"
                        variant={filterType === "credit" ? "default" : "outline"}
                        onClick={() => handleFilterChange("credit")}
                        className={`text-xs font-bold rounded-xl h-8 px-3 cursor-pointer ${filterType === "credit" ? "bg-emerald-600 text-white" : ""}`}
                    >
                        Credits Added (+)
                    </Button>
                    <Button 
                        size="sm"
                        variant={filterType === "debit" ? "default" : "outline"}
                        onClick={() => handleFilterChange("debit")}
                        className={`text-xs font-bold rounded-xl h-8 px-3 cursor-pointer ${filterType === "debit" ? "bg-amber-600 text-white" : ""}`}
                    >
                        Credits Used (-)
                    </Button>
                </div>

                <div className="w-full sm:w-64">
                    <Input 
                        placeholder="Search description or action..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8.5 text-xs rounded-xl border-slate-200"
                    />
                </div>
            </Card>

            {/* Transactions Table */}
            <Card className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="px-6 py-3.5">Date &amp; Time</th>
                                <th className="px-6 py-3.5">Action / Type</th>
                                <th className="px-6 py-3.5">Description</th>
                                <th className="px-6 py-3.5 text-right">Amount</th>
                                <th className="px-6 py-3.5 text-right">Balance After</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        No credit transactions found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((tx) => {
                                    const isAddition = tx.credits_amount > 0;
                                    return (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                                {new Date(tx.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                                    isAddition 
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                        : "bg-slate-100 text-slate-700 border border-slate-200"
                                                }`}>
                                                    {isAddition ? (
                                                        <ArrowDownLeft size={12} className="text-emerald-600" />
                                                    ) : (
                                                        <ArrowUpRight size={12} className="text-amber-600" />
                                                    )}
                                                    {tx.action_type?.replace(/_/g, " ").toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                {tx.description}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap font-extrabold">
                                                <span className={isAddition ? "text-emerald-600" : "text-slate-800"}>
                                                    {isAddition ? `+${tx.credits_amount.toLocaleString()}` : tx.credits_amount.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-slate-600">
                                                {tx.balance_after?.toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                {lastPage > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Showing Page {currentPage} of {lastPage} ({total} transactions)</span>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage <= 1 || isLoading}
                                onClick={() => fetchHistory(currentPage - 1)}
                                className="h-8 text-xs rounded-lg cursor-pointer"
                            >
                                <ChevronLeft size={14} className="mr-1" />
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage >= lastPage || isLoading}
                                onClick={() => fetchHistory(currentPage + 1)}
                                className="h-8 text-xs rounded-lg cursor-pointer"
                            >
                                Next
                                <ChevronRight size={14} className="ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
