import { BellRing, Save } from "lucide-react";

const NOTIFICATION_GROUPS = [
    {
        group: "Conversations",
        items: [
            { label: "New message received", desc: "Get notified when a new message arrives", enabled: true },
            { label: "Conversation assigned to me", desc: "Alert when a conversation is assigned to you", enabled: true },
            { label: "Customer replied", desc: "Notify when a customer replies to a thread", enabled: true },
        ],
    },
    {
        group: "Campaigns",
        items: [
            { label: "Campaign launched", desc: "Alert when a campaign starts sending", enabled: false },
            { label: "Campaign completed", desc: "Notify when a campaign finishes", enabled: true },
            { label: "Campaign failed", desc: "Alert on campaign errors or failures", enabled: true },
        ],
    },
    {
        group: "Billing & Credits",
        items: [
            { label: "Low credit balance", desc: "Alert when credits fall below threshold", enabled: true },
            { label: "Invoice generated", desc: "Notify when a new invoice is ready", enabled: false },
            { label: "Payment successful", desc: "Confirm successful billing transactions", enabled: true },
        ],
    },
];

export default function NotificationSettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <BellRing size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Notification Settings</h1>
                    <p className="text-sm text-slate-500">Control what notifications you receive and how</p>
                </div>
            </div>

            <div className="max-w-2xl flex flex-col gap-4">
                {NOTIFICATION_GROUPS.map((group) => (
                    <div key={group.group} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-slate-700 mb-4">{group.group}</h2>
                        <div className="space-y-3">
                            {group.items.map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                    <div className={`h-6 w-11 rounded-full ${item.enabled ? "bg-[#378179]" : "bg-slate-200"} relative cursor-pointer shrink-0 transition-colors`}>
                                        <div className={`h-5 w-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-all ${item.enabled ? "right-0.5" : "left-0.5"}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

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
