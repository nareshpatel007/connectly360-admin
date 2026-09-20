"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Zap, Sparkles, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

declare global {
    interface Window {
        Razorpay?: any;
    }
}

interface CreditPack {
    id: number;
    name: string;
    credits: number;
    price: number;
    currency: string;
    bonus_credits?: number;
    total_credits?: number;
    is_popular?: boolean;
}

const DEFAULT_PACKS: CreditPack[] = [
    { id: 1, name: "Starter Pack", credits: 500, price: 99, currency: "INR", bonus_credits: 0, total_credits: 500, is_popular: false },
    { id: 2, name: "Growth Pack", credits: 2000, price: 299, currency: "INR", bonus_credits: 0, total_credits: 2000, is_popular: true },
    { id: 3, name: "Pro Pack", credits: 10000, price: 999, currency: "INR", bonus_credits: 0, total_credits: 10000, is_popular: false },
    { id: 4, name: "Enterprise Pack", credits: 50000, price: 3999, currency: "INR", bonus_credits: 0, total_credits: 50000, is_popular: false },
];

interface BuyCreditsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    highlightCredits?: number;
}

export function BuyCreditsModal({ open, onOpenChange, highlightCredits }: BuyCreditsModalProps) {
    const { token, login } = useAuth();
    const [packs, setPacks] = useState<CreditPack[]>(DEFAULT_PACKS);
    const [selectedPack, setSelectedPack] = useState<CreditPack>(DEFAULT_PACKS[1]);
    const [isLoadingPacks, setIsLoadingPacks] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        if (!document.getElementById("razorpay-sdk")) {
            const script = document.createElement("script");
            script.id = "razorpay-sdk";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // Fetch dynamic packs from backend
    useEffect(() => {
        if (open) {
            const fetchPacks = async () => {
                setIsLoadingPacks(true);
                try {
                    const res = await fetch("/api/billing/credit-packs", {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined
                    });
                    const data = await res.json();
                    if (data.status && Array.isArray(data.data) && data.data.length > 0) {
                        setPacks(data.data);
                        // Pick highlighted or default popular
                        if (highlightCredits) {
                            const found = data.data.find((p: CreditPack) => p.credits >= highlightCredits);
                            if (found) setSelectedPack(found);
                        } else {
                            const pop = data.data.find((p: CreditPack) => p.is_popular);
                            if (pop) setSelectedPack(pop);
                        }
                    }
                } catch {
                    // fallback to DEFAULT_PACKS
                } finally {
                    setIsLoadingPacks(false);
                }
            };
            fetchPacks();
        }
    }, [open, token, highlightCredits]);

    const handleCheckout = async () => {
        if (!selectedPack) return;
        setIsProcessing(true);

        try {
            // 1. Create order server-side
            const res = await fetch("/api/billing/recharge-credits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    pack_id: selectedPack.id,
                    credits: selectedPack.credits
                })
            });

            const result = await res.json();
            if (!result.status) {
                throw new Error(result.message || "Failed to initiate payment.");
            }

            const orderData = result.data;

            // 2. Open Razorpay Checkout or mock payment in local dev
            if (orderData.is_mock || !window.Razorpay) {
                // Mock development flow
                const verifyRes = await fetch("/api/billing/verify-credit-payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        credits: selectedPack.credits,
                        razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(2, 12),
                        razorpay_order_id: orderData.order_id,
                        razorpay_signature: "sig_mock"
                    })
                });
                const verifyData = await verifyRes.json();
                if (verifyData.status) {
                    toast.success(`Successfully recharged ${selectedPack.credits.toLocaleString()} credits!`);
                    if (verifyData.data?.access_token) {
                        login(verifyData.data.access_token);
                    }
                    onOpenChange(false);
                } else {
                    toast.error(verifyData.message || "Payment verification failed.");
                }
                setIsProcessing(false);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Connectly360",
                description: `Purchase ${selectedPack.credits.toLocaleString()} Credits`,
                order_id: orderData.order_id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch("/api/billing/verify-credit-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                credits: selectedPack.credits,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.status) {
                            toast.success(`Payment verified! Added ${selectedPack.credits.toLocaleString()} credits.`);
                            if (verifyData.data?.access_token) {
                                login(verifyData.data.access_token);
                            }
                            onOpenChange(false);
                        } else {
                            toast.error(verifyData.message || "Payment verification failed.");
                        }
                    } catch (err: any) {
                        toast.error(err.message || "Error validating payment.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                },
                theme: {
                    color: "#00382B"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err: any) {
            toast.error(err.message || "Failed to initiate payment.");
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[620px] p-6 rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <DialogHeader className="text-center space-y-1.5 pb-2">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-[#35877D]/10 text-[#00382B] flex items-center justify-center mb-1">
                        <Zap size={24} className="fill-[#35877D] text-[#35877D]" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                        Choose a Credit Pack
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        One-time purchase • No recurring subscriptions • Recharge whenever needed
                    </DialogDescription>
                </DialogHeader>

                {isLoadingPacks ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-[#35877D]" size={32} />
                        <span className="text-xs text-slate-500">Loading credit packs...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-3">
                        {packs.map((pack) => {
                            const isSelected = selectedPack.id === pack.id;
                            const totalCredits = (pack.credits || 0) + (pack.bonus_credits || 0);
                            const perCredit = (pack.price / (pack.credits || 1)).toFixed(2);

                            return (
                                <div
                                    key={pack.id}
                                    onClick={() => setSelectedPack(pack)}
                                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                                        isSelected
                                            ? "border-[#00382B] bg-[#35877D]/5 shadow-sm"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    {pack.is_popular && (
                                        <span className="absolute -top-2.5 right-3 bg-[#35877D] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                                            Most Popular
                                        </span>
                                    )}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-slate-800">{pack.name}</h4>
                                            {isSelected ? (
                                                <CheckCircle2 size={16} className="text-[#00382B]" />
                                            ) : (
                                                <div className="h-4 w-4 rounded-full border border-slate-300" />
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-slate-900">{totalCredits.toLocaleString()}</span>
                                            <span className="text-xs font-semibold text-slate-500">Credits</span>
                                        </div>
                                        {pack.bonus_credits && pack.bonus_credits > 0 ? (
                                            <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                                                +{pack.bonus_credits.toLocaleString()} Bonus Credits Included!
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-base font-extrabold text-slate-900">₹{pack.price.toLocaleString()}</span>
                                        <span className="text-[10px] font-medium text-slate-400">₹{perCredit} / credit</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                    <Button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full h-11 rounded-xl bg-[#00382B] hover:bg-[#00241B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-0"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Processing Payment...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} className="text-emerald-300" />
                                <span>Recharge {selectedPack ? selectedPack.credits.toLocaleString() : ""} Credits (₹{selectedPack ? selectedPack.price.toLocaleString() : ""})</span>
                            </>
                        )}
                    </Button>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Instant delivery • Safe &amp; secure 256-bit encrypted checkout</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
