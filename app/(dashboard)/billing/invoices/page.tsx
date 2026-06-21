"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, CreditCard, Award } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface InvoiceItem {
    id: number;
    payment_id: string | null;
    order_id: string | null;
    amount: string;
    currency: string;
    type: string;
    plan: string | null;
    credits: number | null;
    status: string;
    created_at: string;
}

export default function InvoicesPage() {
    const { token } = useAuth();
    const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch("/api/reports/invoices", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const result = await res.json();
                if (result.status) {
                    setInvoices(result.data);
                }
            } catch (err) {
                console.error("Failed to load invoices", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchInvoices();
        }
    }, [token]);

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <FileText size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Billing Invoices</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Track your subscription payments, recharges, and billing history.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="animate-spin text-[#378179] h-7 w-7" />
                    <p className="text-xs text-slate-400 font-medium font-sans">Loading invoices...</p>
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 shadow-xs">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-800">No invoices generated</h3>
                        <p className="text-xs text-slate-400 mt-0.5 max-w-xs leading-normal">Invoices will appear here once you upgrade to a subscription plan or recharge credits.</p>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-slate-150 bg-slate-50/60 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <span className="col-span-2">Invoice ID</span>
                        <span className="col-span-4">Description</span>
                        <span className="col-span-2">Payment ID</span>
                        <span className="col-span-2">Amount</span>
                        <span className="col-span-2">Date</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {invoices.map((inv) => (
                            <div key={inv.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/30 transition-colors">
                                <div className="col-span-2 text-xs font-bold text-slate-900">
                                    INV-{String(inv.id).padStart(4, "0")}
                                </div>
                                <div className="col-span-4 flex items-center gap-2">
                                    {inv.type === "subscription" ? (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                                            <Award size={14} className="text-[#378179]" />
                                            <span>Upgrade: <span className="uppercase text-[#378179] font-bold">{inv.plan}</span></span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                                            <CreditCard size={14} className="text-[#378179]" />
                                            <span>Top-up: <span className="text-[#378179] font-bold">{inv.credits?.toLocaleString()} Credits</span></span>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2 text-[11px] font-mono text-slate-500 font-semibold truncate select-all" title={inv.payment_id || ""}>
                                    {inv.payment_id || "N/A"}
                                </div>
                                <div className="col-span-2 text-xs font-bold text-slate-950">
                                    ₹{Number(inv.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="col-span-2 text-[11px] text-slate-400 font-semibold">
                                    {new Date(inv.created_at).toLocaleDateString("en-IN")}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
