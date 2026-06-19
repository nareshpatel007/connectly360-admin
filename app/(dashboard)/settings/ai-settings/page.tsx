import { BrainCircuit, Save } from "lucide-react";

const AI_MODELS = ["GPT-4o", "GPT-4o Mini", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"];

export default function AISettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <BrainCircuit size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">AI Settings</h1>
                    <p className="text-sm text-slate-500">Configure your AI assistant behaviour and models</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-2xl flex flex-col gap-6">
                <div>
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Model Configuration</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600">AI Model</label>
                            <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all">
                                {AI_MODELS.map((m) => (
                                    <option key={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600">Response Language</label>
                            <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all">
                                <option>Auto-detect</option>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Gujarati</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600">AI Persona / System Prompt</label>
                            <textarea
                                rows={4}
                                placeholder="You are a helpful customer support assistant for Connectly360. Be polite, concise, and helpful..."
                                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">AI Behaviour</h2>
                    <div className="space-y-3">
                        {[
                            { label: "Auto-suggest replies", desc: "AI suggests reply options for agents" },
                            { label: "Auto-respond to FAQs", desc: "Automatically answer common questions from knowledge base" },
                            { label: "Sentiment analysis", desc: "Detect customer sentiment in conversations" },
                            { label: "Escalation detection", desc: "Automatically flag urgent or frustrated conversations" },
                        ].map((toggle, i) => (
                            <div key={toggle.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{toggle.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{toggle.desc}</p>
                                </div>
                                <div className={`h-6 w-11 rounded-full ${i < 2 ? "bg-[#378179]" : "bg-slate-200"} relative cursor-pointer shrink-0 transition-colors`}>
                                    <div className={`h-5 w-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-all ${i < 2 ? "right-0.5" : "left-0.5"}`} />
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
