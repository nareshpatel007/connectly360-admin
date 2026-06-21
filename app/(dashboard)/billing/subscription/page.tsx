"use client";

import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Sparkles, Loader2, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

declare global {
    interface Window {
        Razorpay?: any;
    }
}

export default function SubscriptionPage() {
    const { user, token, login } = useAuth();
    const { toast } = useToast();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

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

    const handleUpgrade = async (planKey: string) => {
        setLoadingPlan(planKey);

        try {
            // 1. Create order on backend with interval info
            const res = await fetch("/api/billing/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    plan: planKey,
                    billing_interval: billingInterval
                })
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
                setLoadingPlan(null);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Connectly360",
                description: `Upgrade to ${planKey.toUpperCase()} (${billingInterval})`,
                order_id: orderData.order_id,
                handler: async function (response: any) {
                    setLoadingPlan(planKey);
                    try {
                        // 3. Verify Razorpay payment signature
                        const verifyRes = await fetch("/api/billing/verify-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                plan: planKey,
                                billing_interval: billingInterval,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature || ""
                            })
                        });

                        const verifyResult = await verifyRes.json();

                        if (verifyResult.status) {
                            toast({
                                title: "Plan upgraded!",
                                description: `Your account has been upgraded to the ${planKey.toUpperCase()} plan.`,
                            });
                            // Refresh context reactively
                            login(verifyResult.data.access_token);
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
                        setLoadingPlan(null);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#35877D"
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPlan(null);
                    }
                }
            };

            // Developer Mock Mode Checkout Popup
            if (orderData.is_mock) {
                toast({
                    title: "Mock Mode Enabled",
                    description: "Bypassing payment network. Simulating Razorpay checkout...",
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
                title: "Subscription failed",
                description: err.message || "Payment process aborted.",
                variant: "destructive"
            });
            setLoadingPlan(null);
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

    const currentPlan = user?.plan?.toLowerCase() || "free";

    const plans = [
        {
            key: "starter",
            name: "Starter",
            priceMonthly: 499,
            desc: "Ideal for small teams launching messaging channels.",
            features: [
                "1,000 monthly credits included",
                "1 WhatsApp Business channel link",
                "Keyword auto-replies configuration",
                "Shared team inbox (Inbox/Contacts/Leads)",
                "Basic usage & message reports",
                "Standard email support"
            ]
        },
        {
            key: "growth",
            name: "Growth",
            priceMonthly: 999,
            desc: "Unlock AI automation and expand workspace tools.",
            features: [
                "3,000 monthly credits included",
                "1 WhatsApp Business channel link",
                "AI Assistant & Auto replies features",
                "OpenAI integration & system prompts",
                "Knowledge Base training logs (PDF/DOCX/FAQ)",
                "Role management & workspace permissions",
                "Priority support (Live chat & email)"
            ],
            highlight: true,
            bestSeller: true
        },
        {
            key: "business",
            name: "Business",
            priceMonthly: 2499,
            desc: "Run campaigns, scale channels, and deploy custom APIs.",
            features: [
                "10,000 monthly credits included",
                "3 WhatsApp channel links (Up to 10)",
                "WhatsApp Broadcast campaigns system",
                "Campaign metrics & scheduling queues",
                "Webhooks & developer API key access",
                "Internal notes & team assignment logs",
                "Dedicated manager & priority SLA support"
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                        <CreditCard size={20} className="text-[#378179]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Membership Plans</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Select a membership plan below to upgrade your limits instantly.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-100/80 px-3.5 py-1.5 rounded-xl border border-slate-200/50">
                    <Zap size={13} className="text-amber-500 fill-amber-500/20" />
                    <span className="text-xs font-semibold text-slate-600">Current Workspace Plan:</span>
                    <span className="text-xs font-bold text-[#378179] uppercase">{currentPlan}</span>
                </div>
            </div>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="flex justify-center items-center mt-2">
                <div className="bg-slate-100 border border-slate-200/60 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner relative">
                    <button
                        onClick={() => setBillingInterval("monthly")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${billingInterval === "monthly"
                                ? "bg-white text-[#378179] shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingInterval("yearly")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${billingInterval === "yearly"
                                ? "bg-[#378179] text-white shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Yearly
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                            Save 20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Plan selection grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mt-4">
                {plans.map((plan) => {
                    const isCurrent = currentPlan === plan.key;
                    const isLoading = loadingPlan === plan.key;

                    // Calculate pricing values
                    const originalPrice = plan.priceMonthly;
                    const displayPrice =
                        billingInterval === "yearly"
                            ? Math.round(originalPrice * 0.80) // 20% discount monthly equivalent
                            : originalPrice;

                    const yearlyTotal = originalPrice * 12 * 0.80;

                    return (
                        <div
                            key={plan.key}
                            className={`rounded-2xl border p-6 md:p-8 flex flex-col gap-6 transition-all duration-300 relative overflow-hidden bg-white ${plan.highlight
                                    ? "border-[#378179] shadow-lg ring-2 ring-[#378179]/10 scale-102 lg:scale-104"
                                    : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
                                }`}
                        >
                            {plan.bestSeller && (
                                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-sm animate-bounce">
                                    <Sparkles size={11} className="fill-white" /> HIGH SALES
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-slate-950">{plan.name}</h2>
                                    {plan.highlight && !plan.bestSeller && (
                                        <span className="text-[9px] bg-[#378179]/10 text-[#378179] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">{plan.desc}</p>
                            </div>

                            <div className="flex flex-col gap-1 py-1 border-b border-slate-100">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-slate-950">₹{displayPrice}</span>
                                    <span className="text-xs text-slate-400 font-medium">/month</span>
                                </div>
                                {billingInterval === "yearly" && (
                                    <span className="text-[10px] text-[#378179] font-bold">
                                        Billed annually (₹{Math.round(yearlyTotal)}/year)
                                    </span>
                                )}
                            </div>

                            <ul className="space-y-3.5 flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium leading-normal">
                                        <CheckCircle2 size={15} className="text-[#378179] shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !isCurrent && handleUpgrade(plan.key)}
                                disabled={isCurrent || !!loadingPlan}
                                className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-0 ${isCurrent
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed font-semibold"
                                        : plan.highlight
                                            ? "bg-[#378179] hover:bg-[#2c6f66] text-white shadow-xs"
                                            : "bg-slate-950 hover:bg-slate-800 text-white shadow-xs"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-3.5 w-3.5" />
                                        Processing...
                                    </>
                                ) : isCurrent ? (
                                    "Active Workspace Plan"
                                ) : (
                                    `Select ${plan.name}`
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
