"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap, Loader2, Coins } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

declare global {
    interface Window {
        Razorpay?: any;
    }
}

const CREDIT_PACKAGES = [
    { name: "Small Pack", credits: 500, label: "500", price: "₹99", rawPrice: 99, perCredit: "₹0.20", popular: false, custom: false },
    { name: "Medium Pack", credits: 2000, label: "2,000", price: "₹299", rawPrice: 299, perCredit: "₹0.15", popular: true, custom: false },
    { name: "Large Pack", credits: 10000, label: "10,000", price: "₹999", rawPrice: 999, perCredit: "₹0.10", popular: false, custom: false },
    { name: "Enterprise Pack", credits: 50000, label: "50,000+", price: "Custom Pricing", rawPrice: 0, perCredit: "Volume discount", popular: false, custom: true },
];

export default function RechargeCreditsPage() {
    const { user, token, login } = useAuth();
    const { toast } = useToast();
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

    const handlePurchase = async (pkg: typeof CREDIT_PACKAGES[0]) => {
        if (pkg.custom) {
            toast({
                title: "Contact Sales",
                description: "Please email support@connectly360.com for custom volume discount pricing.",
            });
            window.location.href = "mailto:support@connectly360.com?subject=Enterprise Credits Volume Request";
            return;
        }

        setLoadingPack(pkg.credits);

        try {
            // 1. Create order on backend
            const res = await fetch("/api/billing/recharge-credits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ credits: pkg.credits })
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
                description: `Recharge ${pkg.label} Credits`,
                order_id: orderData.order_id,
                handler: async function (response: any) {
                    setLoadingPack(pkg.credits);
                    try {
                        // 3. Verify Razorpay payment signature
                        const verifyRes = await fetch("/api/billing/verify-credit-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                credits: pkg.credits,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature || ""
                            })
                        });

                        const verifyResult = await verifyRes.json();

                        if (verifyResult.status) {
                            toast({
                                title: "Recharge success!",
                                description: `Your account has been recharged with ${pkg.label} credits.`,
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
                        setLoadingPack(null);
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
                        setLoadingPack(null);
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
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                        <Sparkles size={20} className="text-[#378179]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Recharge Credits</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Top up your account balance to keep your auto-replies and automations running.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-[#378179]/5 border border-[#378179]/10 px-4 py-2 rounded-xl text-xs font-bold text-[#378179] shadow-xs">
                    <Coins size={14} className="fill-[#378179]/10" />
                    <span>Current Balance: {user?.credits !== undefined ? Number(user.credits).toLocaleString() : 0} Credits</span>
                </div>
            </div>

            {/* Packages grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
                {CREDIT_PACKAGES.map((pkg) => {
                    const isLoading = loadingPack === pkg.credits;

                    return (
                        <div
                            key={pkg.credits}
                            className={`rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-300 bg-white relative overflow-hidden ${pkg.popular
                                    ? "border-[#378179] shadow-md ring-2 ring-[#378179]/5 scale-102"
                                    : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
                                }`}
                        >
                            {pkg.popular && (
                                <div className="absolute top-0 right-0 bg-[#378179] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1">
                                    <Zap size={9} className="fill-white" /> Best Value
                                </div>
                            )}

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{pkg.name}</span>
                                <p className="text-3xl font-black text-slate-950 mt-1">{pkg.label}</p>
                                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Credits</p>
                            </div>

                            <div className="flex flex-col gap-0.5 py-1 border-b border-slate-100">
                                <span className="text-2xl font-bold text-[#378179]">{pkg.price}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">{pkg.perCredit}</span>
                            </div>

                            <div className="text-xs text-slate-500 leading-relaxed font-medium flex-grow">
                                {pkg.custom
                                    ? "Enterprise grade reliability, dedicated support channels, custom contracts, and high throughput volume delivery."
                                    : `Perfect for sending up to ${pkg.label} WhatsApp outbound templates or auto-replies. Credits never expire.`}
                            </div>

                            <button
                                onClick={() => handlePurchase(pkg)}
                                disabled={!!loadingPack && !pkg.custom}
                                className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-0 ${pkg.popular
                                        ? "bg-[#378179] hover:bg-[#2c6f66] text-white shadow-xs"
                                        : "bg-slate-950 hover:bg-slate-800 text-white shadow-xs"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-3.5 w-3.5" />
                                        Processing...
                                    </>
                                ) : pkg.custom ? (
                                    "Contact Sales"
                                ) : (
                                    `Purchase Pack`
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
