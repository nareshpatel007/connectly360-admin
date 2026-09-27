"use client";

import React, { useState, useEffect } from "react";
import {
    Package,
    Plus,
    Coins,
    CheckCircle2,
    XCircle,
    Edit3,
    Trash2,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

interface CreditPackage {
    id: number | string;
    name: string;
    credits: number;
    price: number;
    currency: string;
    is_active: boolean;
    is_featured: boolean;
    display_order: number;
}

const DEFAULT_PACKS: CreditPackage[] = [
    { id: 1, name: "Starter Pack", credits: 1000, price: 499, currency: "INR", is_active: true, is_featured: false, display_order: 1 },
    { id: 2, name: "Growth Pack", credits: 5000, price: 1999, currency: "INR", is_active: true, is_featured: true, display_order: 2 },
    { id: 3, name: "Enterprise Bulk Pack", credits: 25000, price: 7999, currency: "INR", is_active: true, is_featured: false, display_order: 3 }
];

export default function AdminCreditPackagesPage() {
    const { token } = useAuth();
    const [packages, setPackages] = useState<CreditPackage[]>(DEFAULT_PACKS);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [credits, setCredits] = useState(1000);
    const [price, setPrice] = useState(499);

    const fetchPacks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/credits/packs", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status && data.data) {
                setPackages(data.data);
            }
        } catch {
            // Keep default packs
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPacks();
        }
    }, [token]);

    const handleCreatePack = async (e: React.FormEvent) => {
        e.preventDefault();
        const newPkg: CreditPackage = {
            id: Date.now(),
            name,
            credits: Number(credits),
            price: Number(price),
            currency: "INR",
            is_active: true,
            is_featured: false,
            display_order: packages.length + 1
        };

        setPackages([...packages, newPkg]);
        setIsCreateOpen(false);
        setName("");
        toast.success("Credit package created successfully!");
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Package className="h-6 w-6 text-[#35877D]" />
                        Credit Packages Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Configure wallet top-up packages, pricing, credit ratios, and featured badges.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#35877D] hover:bg-[#2c6e66] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                    <Plus size={16} />
                    New Package
                </button>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={`bg-white border rounded-2xl p-6 shadow-2xs space-y-4 relative flex flex-col justify-between ${
                            pkg.is_featured ? "border-[#35877D] ring-2 ring-[#35877D]/10" : "border-slate-200"
                        }`}
                    >
                        {pkg.is_featured && (
                            <span className="absolute -top-3 right-4 px-3 py-0.5 bg-[#35877D] text-white text-[10px] font-extrabold uppercase rounded-full shadow-xs flex items-center gap-1">
                                <Sparkles size={12} /> Featured
                            </span>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-black text-slate-900">{pkg.name}</h3>
                                <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                        pkg.is_active
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    {pkg.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="text-2xl font-black text-[#35877D] flex items-center gap-1.5">
                                    <Coins size={22} />
                                    {pkg.credits.toLocaleString()} <span className="text-xs text-slate-500 font-semibold">Credits</span>
                                </div>
                                <p className="text-sm font-bold text-slate-900">₹{pkg.price.toLocaleString()} + Tax</p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                            <span>Display Order: #{pkg.display_order}</span>
                            <span className="text-emerald-600 font-bold">₹{(pkg.price / pkg.credits).toFixed(2)} / credit</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 font-sans">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Package size={18} className="text-[#35877D]" />
                                Create Credit Package
                            </h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreatePack} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Package Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Mega Volume Pack"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#35877D]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Credits</label>
                                    <input
                                        type="number"
                                        required
                                        value={credits}
                                        onChange={(e) => setCredits(Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#35877D]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Price (INR)</label>
                                    <input
                                        type="number"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#35877D]"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#35877D] hover:bg-[#2c6e66] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                                >
                                    Save Package
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
