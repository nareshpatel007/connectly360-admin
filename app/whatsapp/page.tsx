"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminWhatsappPage() {
    const { token } = useAuth();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWhatsapp = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/whatsapp", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setAccounts(data.data || []);
            }
        } catch (err) {
            toast.error("Failed to load WhatsApp accounts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWhatsapp();
    }, [token]);

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                        WhatsApp WABA Accounts
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Platform Meta Cloud API connection registers across all customer workspaces.</p>
                </div>
                <Button
                    onClick={fetchWhatsapp}
                    variant="outline"
                    size="sm"
                    className="h-9 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Reload Accounts</span>
                </Button>
            </div>

            <Card className="bg-slate-950 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="p-4">Workspace</th>
                                <th className="p-4">Phone Number</th>
                                <th className="p-4">WABA Account ID</th>
                                <th className="p-4">Phone Number ID</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Connected Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        Loading WhatsApp registers...
                                    </td>
                                </tr>
                            ) : accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                                        No WhatsApp accounts connected yet.
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((a) => (
                                    <tr key={a.id} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-200">
                                            {a.company_name}
                                        </td>
                                        <td className="p-4 font-mono font-semibold text-emerald-400">
                                            {a.phone_number || "—"}
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-400">
                                            {a.waba_id ? `••••${a.waba_id.slice(-6)}` : "—"}
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-slate-400">
                                            {a.phone_number_id ? `••••${a.phone_number_id.slice(-6)}` : "—"}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                a.status === "connected" ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40" : "bg-amber-950 text-amber-400 border border-amber-800/40"
                                            }`}>
                                                {a.status === "connected" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                {a.status || "Disconnected"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 font-medium">
                                            {new Date(a.created_at).toLocaleDateString("en-IN")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
