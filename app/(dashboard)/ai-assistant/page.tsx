import { Bot } from "lucide-react";

export default function AIAssistantPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <Bot size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">AI Assistant</h1>
                    <p className="text-sm text-slate-500">Configure and manage your AI assistant</p>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-10 flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
                <Bot size={40} className="text-slate-300" />
                <p className="text-slate-500 text-sm font-medium">AI Assistant</p>
                <p className="text-slate-400 text-xs">Set up your AI assistant to automate responses and workflows.</p>
            </div>
        </div>
    );
}
