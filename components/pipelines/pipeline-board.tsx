"use client";

import { useMemo, useState } from "react";
import type { Lead } from "@/lib/api-client-react";
import { DealCard } from "./deal-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PipelineBoardProps {
    leads: Lead[];
    onLeadMoved: (leadId: number, newStatus: string) => void;
    onAddLead: (status: string) => void;
    onEditLead: (lead: Lead) => void;
}

interface ColumnDef {
    id: string;
    name: string;
    color: string;
}

const COLUMNS: ColumnDef[] = [
    { id: "new", name: "New Lead", color: "#3b82f6" },       // Blue
    { id: "contacted", name: "Contacted", color: "#eab308" }, // Yellow
    { id: "converted", name: "Converted", color: "#35877D" }, // Teal
    { id: "lost", name: "Lost", color: "#ef4444" },           // Red
];

export function PipelineBoard({
    leads,
    onLeadMoved,
    onAddLead,
    onEditLead,
}: PipelineBoardProps) {
    const [draggingId, setDraggingId] = useState<number | null>(null);

    const leadsByStatus = useMemo(() => {
        const map = new Map<string, Lead[]>();
        for (const col of COLUMNS) map.set(col.id, []);
        for (const lead of leads) {
            const bucket = map.get(lead.status);
            if (bucket) bucket.push(lead);
        }
        return map;
    }, [leads]);

    return (
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:snap-none">
            {COLUMNS.map((col) => {
                const columnLeads = leadsByStatus.get(col.id) ?? [];
                return (
                    <StageColumn
                        key={col.id}
                        column={col}
                        leads={columnLeads}
                        draggingId={draggingId}
                        setDraggingId={setDraggingId}
                        onLeadMoved={onLeadMoved}
                        onAddLead={onAddLead}
                        onEditLead={onEditLead}
                    />
                );
            })}
        </div>
    );
}

function StageColumn({
    column,
    leads,
    draggingId,
    setDraggingId,
    onLeadMoved,
    onAddLead,
    onEditLead,
}: {
    column: ColumnDef;
    leads: Lead[];
    draggingId: number | null;
    setDraggingId: (id: number | null) => void;
    onLeadMoved: (leadId: number, newStatus: string) => void;
    onAddLead: (status: string) => void;
    onEditLead: (lead: Lead) => void;
}) {
    const [isOver, setIsOver] = useState(false);

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        setIsOver(true);
    }

    function handleDragLeave() {
        setIsOver(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsOver(false);
        const idStr = e.dataTransfer.getData("text/plain");
        const leadId = parseInt(idStr, 10);
        if (!isNaN(leadId)) {
            const alreadyInColumn = leads.some((l) => l.id === leadId);
            if (!alreadyInColumn) {
                onLeadMoved(leadId, column.id);
            }
        }
        setDraggingId(null);
    }

    return (
        <div 
            className="flex w-[80vw] min-w-[280px] max-w-[320px] shrink-0 snap-start flex-col rounded-2xl border border-slate-200 bg-slate-100/50 p-4 lg:w-auto lg:max-w-none lg:flex-1 lg:basis-[280px] lg:shrink lg:snap-none"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Top border colored stripe */}
            <div
                className="-mx-4 -mt-4 h-[3px] rounded-t-2xl"
                style={{ backgroundColor: column.color }}
            />

            <div className="flex items-center justify-between pt-3">
                <h3 className="truncate text-sm font-bold text-slate-800">
                    {column.name}
                </h3>
                <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-650">
                    {leads.length}
                </span>
            </div>

            <div
                className={`mt-3 flex flex-1 flex-col gap-3 rounded-xl p-1 transition-all duration-200 ${
                    isOver ? "bg-[#35877D]/5 outline outline-2 outline-dashed outline-[#35877D] outline-offset-2" : ""
                }`}
                style={{ minHeight: "200px" }}
            >
                {leads.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-xs text-slate-400 font-medium bg-white/50">
                        Drag leads here
                    </div>
                ) : (
                    leads.map((lead) => (
                        <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => {
                                setDraggingId(lead.id);
                                e.dataTransfer.setData("text/plain", String(lead.id));
                            }}
                            onDragEnd={() => setDraggingId(null)}
                            className="transition-transform active:scale-95 duration-100"
                        >
                            <DealCard lead={lead} onEdit={onEditLead} />
                        </div>
                    ))
                )}
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddLead(column.id)}
                className="mt-3 w-full justify-start border border-dashed border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-bold rounded-xl h-9 shadow-xs"
            >
                <Plus className="mr-1 h-3 w-3 text-slate-400" />
                Add Lead
            </Button>
        </div>
    );
}
