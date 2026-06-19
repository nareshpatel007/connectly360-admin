import { Activity } from "lucide-react";
import { UpgradeGuard } from "@/components/upgrade-guard";

const LOGS = [
    { user: "Naresh Patel", action: "Created a new campaign", time: "2 min ago", type: "campaign" },
    { user: "Priya Shah", action: "Invited Ravi Kumar to workspace", time: "1 hour ago", type: "team" },
    { user: "Ravi Kumar", action: "Replied to conversation #1042", time: "3 hours ago", type: "conversation" },
    { user: "Naresh Patel", action: "Updated WhatsApp integration settings", time: "Yesterday", type: "settings" },
    { user: "Priya Shah", action: "Exported analytics report", time: "2 days ago", type: "report" },
];

const TYPE_COLORS: Record<string, string> = {
    campaign: "bg-purple-100 text-purple-700",
    team: "bg-blue-100 text-blue-700",
    conversation: "bg-green-100 text-green-700",
    settings: "bg-orange-100 text-orange-700",
    report: "bg-slate-100 text-slate-600",
};

export default function ActivityLogsPage() {
    return (
        <UpgradeGuard
            allowedPlans={["enterprise"]}
            featureName="Activity Logs"
            description="Track all workspace activity, changes, and configuration updates across your team."
        >
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                        <Activity size={20} className="text-[#378179]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Activity Logs</h1>
                        <p className="text-sm text-slate-500">Track all workspace activity and changes</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <span>User</span>
                        <span className="col-span-2">Action</span>
                        <span>Time</span>
                    </div>
                    {LOGS.map((log, i) => (
                        <div key={i} className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-slate-100 last:border-0 items-center">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-[#378179] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                    {log.user.charAt(0)}
                                </div>
                                <span className="text-xs font-semibold text-slate-800 truncate">{log.user.split(" ")[0]}</span>
                            </div>
                            <span className="text-sm text-slate-600 col-span-2">{log.action}</span>
                            <span className="text-xs text-slate-400">{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </UpgradeGuard>
    );
}
