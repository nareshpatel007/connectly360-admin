import { Building2, Save } from "lucide-react";

export default function CompanyProfilePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <Building2 size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Company Profile</h1>
                    <p className="text-sm text-slate-500">Manage your company information and branding</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-2xl">
                <h2 className="text-sm font-semibold text-slate-700 mb-5">Company Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: "Company Name", placeholder: "Connectly360", type: "text" },
                        { label: "Industry", placeholder: "SaaS / Technology", type: "text" },
                        { label: "Website", placeholder: "https://connectly360.com", type: "url" },
                        { label: "Phone", placeholder: "+91 98765 43210", type: "tel" },
                    ].map((field) => (
                        <div key={field.label} className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600">{field.label}</label>
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all"
                            />
                        </div>
                    ))}
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600">Address</label>
                        <textarea
                            rows={3}
                            placeholder="123 Business Park, Mumbai, Maharashtra, India"
                            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all resize-none"
                        />
                    </div>
                </div>
                <div className="mt-5 flex justify-end">
                    <button className="flex items-center gap-2 px-5 py-2 bg-[#378179] hover:bg-[#079E61] text-white text-sm font-semibold rounded-xl transition-colors">
                        <Save size={14} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
