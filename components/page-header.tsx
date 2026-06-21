import React from "react";

interface PageHeaderProps {
    icon: React.ElementType;
    title: string;
    description: string;
    actions?: React.ReactNode;
}

export function PageHeader({ icon: Icon, title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{description}</p>
                </div>
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
        </div>
    );
}
