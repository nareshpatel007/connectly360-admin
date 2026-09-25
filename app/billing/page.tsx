"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CreditCard,
    Search,
    IndianRupee,
    Coins,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

export default function AdminBillingPage() {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [meta, setMeta] = useState<any>({ current_page: 1, total: 0, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const fetchTransactions = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                per_page: "15",
                ...(search && { search }),
            });

            const res = await fetch(`/api/admin/billing/transactions?${queryParams.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setTransactions(data.data || []);
                setMeta(data.meta || { current_page: 1, total: 0, last_page: 1 });
            }
        } catch (err) {
            toast.error("Failed to load billing transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [token, page]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchTransactions();
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                        Billing &amp; Revenue Transactions
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Platform sales transactions, subscription payments, credit top-ups, and Razorpay gateway logs.</p>
                </div>
                <Button
                    onClick={fetchTransactions}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload Transactions</span>
                </Button>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 bg-slate-950 border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-96">
                    <div className="relative w-full">
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                        <Input
                            placeholder="Search by Razorpay ID, email, or user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 bg-slate-900 border-slate-800 text-slate-200 rounded-xl text-xs"
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-10 px-4 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold cursor-pointer border-0">
                        Search
                    </Button>
                </form>
            </Card>

            {/* Billing Table */}
            <Card className="bg-slate-950 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="p-4">Customer Details</th>
                                <th className="p-4">Workspace</th>
                                <th className="p-4">Amount Paid</th>
                                <th className="p-4">Credits Issued</th>
                                <th className="p-4">Razorpay Payment ID</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date &amp; Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                                        Loading sales transactions...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                                        No sales transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-100">{t.user_name}</div>
                                            <div className="text-[11px] text-slate-500">{t.user_email}</div>
                                        </td>
                                        <td className="p-4 font-semibold text-slate-300">
                                            {t.company_name}
                                        </td>
                                        <td className="p-4 font-extrabold text-emerald-400 text-sm">
                                            ₹{(t.amount ?? 0).toLocaleString("en-IN")}
                                        </td>
                                        <td className="p-4 font-bold text-slate-200">
                                            +{(t.credits ?? 0).toLocaleString()} Credits
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-400">
                                            {t.razorpay_payment_id || "—"}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 uppercase">
                                                <CheckCircle2 size={10} />
                                                {t.status || "Completed"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 font-medium">
                                            {new Date(t.created_at).toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Showing Page {meta.current_page} of {meta.last_page} ({meta.total} Transactions)</span>
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-800 bg-slate-900 text-slate-300 rounded-lg text-xs cursor-pointer"
                        >
                            <ChevronLeft size={14} /> Previous
                        </Button>
                        <Button
                            disabled={page >= meta.last_page}
                            onClick={() => setPage(p => p + 1)}
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-800 bg-slate-900 text-slate-300 rounded-lg text-xs cursor-pointer"
                        >
                            Next <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
