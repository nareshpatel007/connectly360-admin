import { CreditCard, CheckCircle2, Sparkles } from "lucide-react";

export default function SubscriptionPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <CreditCard size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Subscription</h1>
                    <p className="text-sm text-slate-500">Manage your plan and billing</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { name: "Starter", price: "$29", desc: "Perfect for small teams", features: ["1,000 messages/mo", "1 WhatsApp number", "Basic automations", "Email support"] },
                    { name: "Growth", price: "$79", desc: "For growing businesses", features: ["10,000 messages/mo", "3 WhatsApp numbers", "Advanced automations", "Priority support", "Analytics"], highlight: true },
                    { name: "Enterprise", price: "$199", desc: "For large organizations", features: ["Unlimited messages", "10 WhatsApp numbers", "Custom automations", "Dedicated support", "Custom integrations"] },
                ].map((plan) => (
                    <div
                        key={plan.name}
                        className={`rounded-2xl border p-6 flex flex-col gap-4 ${plan.highlight
                            ? "border-[#378179] bg-[#378179]/5 ring-2 ring-[#378179]/20"
                            : "border-slate-200 bg-white"
                            }`}
                    >
                        {plan.highlight && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#378179] bg-[#378179]/10 rounded-full px-2.5 py-1 w-fit">
                                <Sparkles size={10} /> Most Popular
                            </span>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
                            <p className="text-xs text-slate-500 mt-0.5">{plan.desc}</p>
                        </div>
                        <div className="flex items-end gap-1">
                            <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                            <span className="text-sm text-slate-500 pb-1">/month</span>
                        </div>
                        <ul className="space-y-2">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 size={14} className="text-[#378179] shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`mt-auto w-full py-2 rounded-xl text-sm font-semibold transition-all ${plan.highlight
                                ? "bg-[#378179] hover:bg-[#079E61] text-white"
                                : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                        >
                            {plan.highlight ? "Current Plan" : "Upgrade"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
