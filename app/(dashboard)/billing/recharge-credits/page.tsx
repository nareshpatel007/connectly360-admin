import { Sparkles, Zap } from "lucide-react";

const CREDIT_PACKAGES = [
    { credits: "1,000", price: "$10", perCredit: "$0.01", popular: false },
    { credits: "5,000", price: "$45", perCredit: "$0.009", popular: true },
    { credits: "10,000", price: "$80", perCredit: "$0.008", popular: false },
    { credits: "50,000", price: "$350", perCredit: "$0.007", popular: false },
];

export default function RechargeCreditsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Recharge Credits</h1>
                    <p className="text-sm text-slate-500">Top up your credits to continue sending messages</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {CREDIT_PACKAGES.map((pkg) => (
                    <div
                        key={pkg.credits}
                        className={`rounded-2xl border p-5 flex flex-col gap-3 cursor-pointer transition-all hover:shadow-md ${pkg.popular
                            ? "border-[#378179] bg-[#378179]/5 ring-2 ring-[#378179]/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                    >
                        {pkg.popular && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#378179] bg-[#378179]/10 rounded-full px-2 py-0.5 w-fit">
                                <Zap size={9} /> Best Value
                            </span>
                        )}
                        <div>
                            <p className="text-2xl font-extrabold text-slate-900">{pkg.credits}</p>
                            <p className="text-xs text-slate-500">credits</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[#378179]">{pkg.price}</p>
                            <p className="text-[10px] text-slate-400">{pkg.perCredit} per credit</p>
                        </div>
                        <button
                            className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${pkg.popular
                                ? "bg-[#378179] hover:bg-[#079E61] text-white"
                                : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                        >
                            Purchase
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
