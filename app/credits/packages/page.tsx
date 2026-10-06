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
import { AdminPageHeader } from "@/components/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
            <AdminPageHeader
                icon={Package}
                title="Credit Packages Management"
                description="Configure wallet top-up packages, pricing, credit ratios, and featured badges."
                breadcrumbs={[
                    { label: "Credits Ledger", href: "/credits" },
                    { label: "Credit Packages" }
                ]}
                actions={
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-[#35877D] hover:bg-[#2c6e66] text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs transition-colors cursor-pointer gap-2"
                    >
                        <Plus size={16} />
                        New Package
                    </Button>
                }
            />

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <Card
                        key={pkg.id}
                        className={`bg-white rounded-2xl p-6 shadow-xs space-y-4 relative flex flex-col justify-between ${
                            pkg.is_featured ? "border-2 border-[#35877D] ring-2 ring-[#35877D]/10" : "border border-slate-200/80"
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
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                        pkg.is_active
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    {pkg.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="text-2xl font-black text-[#35877D] flex items-center gap-2">
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
                    </Card>
                ))}
            </div>

            {/* Create Package Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white border border-slate-200">
                    <DialogHeader className="border-b border-slate-100 pb-3">
                        <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Package size={18} className="text-[#35877D]" />
                            Create Credit Package
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Create a pre-configured credit package available in workspace top-up modals.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreatePack} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Package Name</Label>
                            <Input
                                required
                                placeholder="e.g. Mega Volume Pack"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">Total Credits</Label>
                                <Input
                                    type="number"
                                    required
                                    value={credits}
                                    onChange={(e) => setCredits(Number(e.target.value))}
                                    className="h-10 rounded-xl border-slate-200 text-xs font-semibold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">Price (INR)</Label>
                                <Input
                                    type="number"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="h-10 rounded-xl border-slate-200 text-xs font-semibold"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                className="rounded-xl border-slate-200 text-slate-700 font-bold text-xs h-9"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#35877D] hover:bg-[#2c6e66] text-white font-bold text-xs rounded-xl h-9 px-4 shadow-xs"
                            >
                                Save Package
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
