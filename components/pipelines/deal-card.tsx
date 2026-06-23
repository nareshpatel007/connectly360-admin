"use client";

import type { Lead } from "@/lib/api-client-react";
import { Calendar, MapPin, Check, X } from "lucide-react";

interface DealCardProps {
    lead: Lead;
    onEdit: (lead: Lead) => void;
    isOverlay?: boolean;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function initials(name?: string, fallback?: string) {
    const source = (name || fallback || "?").trim();
    if (!source) return "?";
    return source.charAt(0).toUpperCase();
}

const STATUS_COLORS: Record<string, string> = {
    new: "#3b82f6",       // Blue
    contacted: "#eab308", // Yellow
    converted: "#35877D", // Teal
    lost: "#ef4444",      // Red
};

export function DealCard({ lead, onEdit, isOverlay }: DealCardProps) {
    const contactLabel = lead.customerName || lead.phone || "Unnamed Lead";
    const accentColor = STATUS_COLORS[lead.status] || "#94a3b8";

    return (
        <div
            onClick={(e) => {
                if (isOverlay) return;
                e.stopPropagation();
                onEdit(lead);
            }}
            className={`group relative w-full cursor-pointer rounded-xl border border-slate-200 bg-white pl-4 pr-3 py-3.5 text-left shadow-xs transition-all ${
                isOverlay
                    ? "shadow-xl opacity-90 scale-95"
                    : "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            }`}
        >
            {/* Left accent bar using status color */}
            <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
                style={{ backgroundColor: accentColor }}
            />

            <div className="flex items-start justify-between gap-2">
                <h4 className="flex-1 text-sm font-bold leading-snug text-slate-900 break-words">
                    {contactLabel}
                </h4>
                {lead.status === "converted" && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#35877D]/10 px-2 py-0.5 text-[10px] font-bold text-[#35877D]">
                        <Check className="h-2.5 w-2.5" />
                        Converted
                    </span>
                )}
                {lead.status === "lost" && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                        <X className="h-2.5 w-2.5" />
                        Lost
                    </span>
                )}
            </div>

            {/* Phone & Details */}
            <p className="text-xs text-slate-500 mt-1 font-semibold">{lead.phone}</p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-semibold">
                {lead.location && (
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{lead.location}</span>
                    </div>
                )}
            </div>

            {/* Custom attributes rendered dynamically */}
            {lead.custom_attributes && Object.keys(lead.custom_attributes).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-600 font-semibold">
                    {Object.entries(lead.custom_attributes).map(([key, value]) => {
                        if (!value) return null;
                        return (
                            <span key={key} className="bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md truncate max-w-[150px]" title={`${key}: ${value}`}>
                                <strong className="text-slate-500">{key}:</strong> {value}
                            </span>
                        );
                    })}
                </div>
            )}

            <div className="mt-3 border-t border-slate-50 pt-2 flex items-center justify-between text-[10px] text-slate-450 font-medium">
                <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(lead.createdAt)}
                </span>
                <span className="h-5 w-5 rounded-full bg-[#35877D]/10 text-[#35877D] flex items-center justify-center font-bold text-[9px]">
                    {initials(lead.customerName, lead.phone)}
                </span>
            </div>
        </div>
    );
}
