"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap, Loader2, Coins, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { CreditBalance } from "@/components/credit-balance";

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

const DEFAULT_PACKAGES: CreditPack[] = [
    { id: 1, name: "Starter Pack", credits: 500, price: 99, currency: "INR", bonus_credits: 0, total_credits: 500, is_popular: false },
    { id: 2, name: "Growth Pack", credits: 2000, price: 299, currency: "INR", bonus_credits: 0, total_credits: 2000, is_popular: true },
    { id: 3, name: "Pro Pack", credits: 10000, price: 999, currency: "INR", bonus_credits: 0, total_credits: 10000, is_popular: false },
    { id: 4, name: "Enterprise Pack", credits: 50000, price: 3999, currency: "INR", bonus_credits: 0, total_credits: 50000, is_popular: false },
];

export default function RechargeCreditsPage() {
    const { user, token, login } = useAuth();
    const { toast } = useToast();
    const [packs, setPacks] = useState<CreditPack[]>(DEFAULT_PACKAGES);
    const [loadingPack, setLoadingPack] = useState<number | null>(null);

    // Dynamically inject Razorpay Checkout CDN script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Load live packs from server
    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const res = await fetch("/api/billing/credit-packs", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const result = await res.json();
                if (result.status && Array.isArray(result.data) && result.data.length > 0) {
                    setPacks(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch packs from server", err);
            }
        };

        if (token) {
            fetchPacks();
        }
    }, [token]);

    const handlePurchase = async (pkg: CreditPack) => {
        setLoadingPack(pkg.id);

        try {
            // 1. Create order on backend with pack_id
            const res = await fetch("/api/billing/create-credit-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ pack_id: pkg.id })
            });

            const result = await res.json();

            if (!result.status) {
                throw new Error(result.message || "Failed to initiate payment.");
            }

            const orderData = result.data;

            // 2. Open Razorpay checkout interface
            if (!window.Razorpay) {
                toast({
                    title: "Razorpay unavailable",
                    description: "Failed to load payment gateway client. Please refresh and try again.",
                    variant: "destructive"
                });
                setLoadingPack(null);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Connectly360",
                description: `Purchase ${pkg.name} (${(pkg.total_credits || pkg.credits).toLocaleString()} Credits)`,
                order_id: orderData.order_id,
                handler: async function (response: any) {
                    setLoadingPack(pkg.id);
                    try {
                        // 3. Verify Razorpay payment signature
                        const verifyRes = await fetch("/api/billing/verify-credit-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                order_id: orderData.order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature || ""
                            })
                        });

                        const verifyResult = await verifyRes.json();

                        if (verifyResult.status) {
                            toast({
                                title: "Payment Successful!",
                                description: `Added ${(pkg.total_credits || pkg.credits).toLocaleString()} credits to your wallet.`,
                            });
                            if (verifyResult.data?.access_token) {
                                login(verifyResult.data.access_token);
                            }
                        } else {
                            toast({
                                title: "Verification failed",
                                description: verifyResult.message || "Signature check failed.",
                                variant: "destructive"
                            });
                        }
                    } catch (err: any) {
                        toast({
                            title: "Connection error",
                            description: err.message || "Could not reach verification server.",
                            variant: "destructive"
                        });
                    } finally {
                        setLoadingPack(null);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#00382B"
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPack(null);
                    }
                }
            };

            // Developer Mock Mode Checkout Popup
            if (orderData.is_mock) {
                toast({
                    title: "Mock Mode Active",
                    description: "Simulating Razorpay payment gateway approval...",
                });

                setTimeout(async () => {
                    options.handler({
                        razorpay_payment_id: `pay_mock_${bin2Hex(12)}`,
                        razorpay_order_id: orderData.order_id,
                        razorpay_signature: "signature_mock"
                    });
                }, 1000);
            } else {
                const rzp = new window.Razorpay(options);
                rzp.open();
            }

        } catch (err: any) {
            toast({
                title: "Purchase failed",
                description: err.message || "Payment process aborted.",
                variant: "destructive"
            });
            setLoadingPack(null);
        }
    };

    function bin2Hex(length: number) {
        let result = "";
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-4 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#35877D]/10 flex items-center justify-center">
                        <Zap size={20} className="text-[#35877D]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Buy Credit Packs</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Pay-as-you-go credit packages. Never expire. No monthly recurring fee.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-[#35877D]/5 border border-[#35877D]/10 px-4 py-2 rounded-xl text-xs font-bold text-[#35877D] shadow-xs">
                    <Coins size={14} className="fill-[#35877D]/10" />
                    <span>Current Wallet Balance: {user?.credits !== undefined ? Number(user.credits).toLocaleString() : 0} Credits</span>
                </div>
            </div>

            {/* Packages grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
                {packs.map((pkg) => {
                    const isLoading = loadingPack === pkg.id;
                    const totalCredits = pkg.total_credits || (pkg.credits + (pkg.bonus_credits || 0));
                    const perCredit = (pkg.price / totalCredits).toFixed(2);

                    return (
                        <div
                            key={pkg.id}
                            className={`rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-300 bg-white relative overflow-hidden ${pkg.is_popular
                                    ? "border-[#00382B] shadow-md ring-2 ring-[#00382B]/10 scale-102"
                                    : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
                                }`}
                        >
                            {pkg.is_popular && (
                                <div className="absolute top-0 right-0 bg-[#00382B] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1">
                                    <Zap size={9} className="fill-white" /> Most Popular
                                </div>
                            )}

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{pkg.name}</span>
                                <p className="text-3xl font-black text-slate-950 mt-1">{totalCredits.toLocaleString()}</p>
                                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Credits</p>
                            </div>

                            <div className="flex flex-col gap-0.5 py-1 border-b border-slate-100">
                                <span className="text-2xl font-bold text-[#00382B]">₹{pkg.price.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">₹{perCredit} / credit</span>
                            </div>

                            <div className="text-xs text-slate-500 leading-relaxed font-medium flex-grow space-y-1.5">
                                <div className="flex items-center gap-1.5 text-slate-700">
                                    <CheckCircle2 size={13} className="text-emerald-555 shrink-0" />
                                    <span>Instant Wallet Crediting</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-700">
                                    <CheckCircle2 size={13} className="text-emerald-555 shrink-0" />
                                    <span>Credits Never Expire</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-700">
                                    <CheckCircle2 size={13} className="text-emerald-555 shrink-0" />
                                    <span>Valid for AI, Broadcasts &amp; CRM</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePurchase(pkg)}
                                disabled={!!loadingPack}
                                className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-0 ${pkg.is_popular
                                        ? "bg-[#00382B] hover:bg-[#35877D] text-white shadow-xs"
                                        : "bg-slate-950 hover:bg-slate-800 text-white shadow-xs"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-3.5 w-3.5" />
                                        Processing...
                                    </>
                                ) : (
                                    `Buy for ₹${pkg.price.toLocaleString()}`
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Security Guarantee */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#35877D]" />
                    <span className="font-semibold">Razorpay Verified 256-bit Encrypted Checkout</span>
                </div>
                <span>Official GST invoice generated automatically after purchase.</span>
            </div>
        </div>
    );
}
