import { MessageCircle, Save } from "lucide-react";

export default function WhatsAppSettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <MessageCircle size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">WhatsApp Settings</h1>
                    <p className="text-sm text-slate-500">Configure your WhatsApp Business account settings</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-2xl flex flex-col gap-6">
                <div>
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Business Profile</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Business Name", placeholder: "Connectly360" },
                            { label: "Phone Number", placeholder: "+91 98765 43210" },
                            { label: "Business Category", placeholder: "Technology" },
                            { label: "Website URL", placeholder: "https://connectly360.com" },
                        ].map((field) => (
                            <div key={field.label} className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-600">{field.label}</label>
                                <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all"
                                />
                            </div>
                        ))}
                        <div className="sm:col-span-2 flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600">Business Description</label>
                            <textarea
                                rows={3}
                                placeholder="Describe your business..."
                                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Messaging Preferences</h2>
                    <div className="space-y-3">
                        {[
                            { label: "Enable read receipts", desc: "Show when messages have been read" },
                            { label: "Auto-reply when offline", desc: "Send automated replies outside business hours" },
                            { label: "Enable typing indicators", desc: "Show typing status to contacts" },
                        ].map((toggle) => (
                            <div key={toggle.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{toggle.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{toggle.desc}</p>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-[#378179] relative cursor-pointer shrink-0">
                                    <div className="h-5 w-5 rounded-full bg-white absolute right-0.5 top-0.5 shadow-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-5 py-2 bg-[#378179] hover:bg-[#079E61] text-white text-sm font-semibold rounded-xl transition-colors">
                        <Save size={14} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
