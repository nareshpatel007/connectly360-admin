"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ChevronRight, Loader2, ArrowLeft, Radio, FileText, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListTemplates, useListCustomers, useCreateCampaign, useSendCampaign, MessageTemplate } from "@/lib/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

// ─────────────────────────────────────────────────────────
// Step types
// ─────────────────────────────────────────────────────────

const STEPS = [
    { key: "template", label: "Template",  icon: FileText },
    { key: "audience", label: "Audience",  icon: Users },
    { key: "review",   label: "Review & Send", icon: Send },
] as const;

type AudienceType = "all" | "contacts";

interface WizardState {
    name: string;
    template: MessageTemplate | null;
    audienceType: AudienceType;
}

// ─────────────────────────────────────────────────────────
// Step components
// ─────────────────────────────────────────────────────────

function StepChooseTemplate({
    selected,
    onSelect,
}: {
    selected: MessageTemplate | null;
    onSelect: (t: MessageTemplate) => void;
}) {
    const { data: templates = [], isLoading } = useListTemplates();
    const [search, setSearch] = useState("");

    const filtered = templates.filter(
        (t) =>
            t.status === "approved" &&
            (t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.body_text?.toLowerCase().includes(search.toLowerCase())),
    );

    if (isLoading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#35877D]" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold">Choose a Template</h2>
                <p className="text-sm text-muted-foreground">
                    Select an approved WhatsApp message template.
                </p>
            </div>
            <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#35877D]/50"
                placeholder="Search templates…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {filtered.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground">
                    <Radio className="h-8 w-8" />
                    <p className="text-sm">No approved templates found.</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {filtered.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => onSelect(t)}
                            className={`rounded-xl border p-4 text-left transition-all hover:border-[#35877D]/60 hover:shadow-sm ${
                                selected?.id === t.id
                                    ? "border-[#35877D] bg-[#35877D]/5 ring-1 ring-[#35877D]"
                                    : "border-border bg-card"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-sm">{t.name}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{t.category} · {t.language}</p>
                                </div>
                                {selected?.id === t.id && (
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#35877D]">
                                        <Check className="h-3 w-3 text-white" />
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{t.body_text}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function StepSelectAudience({
    campaignName,
    audienceType,
    onNameChange,
    onAudienceChange,
}: {
    campaignName: string;
    audienceType: AudienceType;
    onNameChange: (v: string) => void;
    onAudienceChange: (v: AudienceType) => void;
}) {
    const { data: customers = [] } = useListCustomers();

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold">Audience & Details</h2>
                <p className="text-sm text-muted-foreground">Name your campaign and choose who to reach.</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name</label>
                <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#35877D]/50"
                    placeholder="e.g. Summer Sale Blast"
                    value={campaignName}
                    onChange={(e) => onNameChange(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <div className="grid gap-3 sm:grid-cols-2">
                    {(
                        [
                            { type: "all" as const, label: "All Contacts", desc: `Send to all ${customers.length} contacts` },
                            { type: "contacts" as const, label: "All Contacts (Same)", desc: "Audience selection coming soon" },
                        ] as const
                    ).map(({ type, label, desc }) => (
                        <button
                            key={type}
                            onClick={() => onAudienceChange(type)}
                            className={`rounded-xl border p-4 text-left transition-all hover:border-[#35877D]/60 ${
                                audienceType === type
                                    ? "border-[#35877D] bg-[#35877D]/5 ring-1 ring-[#35877D]"
                                    : "border-border bg-card"
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-sm">{label}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                                </div>
                                {audienceType === type && (
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#35877D]">
                                        <Check className="h-3 w-3 text-white" />
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StepReview({
    campaignName,
    template,
    audienceType,
    isProcessing,
}: {
    campaignName: string;
    template: MessageTemplate | null;
    audienceType: AudienceType;
    isProcessing: boolean;
}) {
    const { data: customers = [] } = useListCustomers();

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold">Review & Send</h2>
                <p className="text-sm text-muted-foreground">Review your campaign before sending.</p>
            </div>

            <Card>
                <CardContent className="pt-4 space-y-3">
                    <Row label="Campaign Name" value={campaignName || <span className="text-muted-foreground italic">Not set</span>} />
                    <Row label="Template" value={template?.name ?? <span className="text-muted-foreground italic">Not selected</span>} />
                    <Row label="Language" value={template?.language ?? "—"} />
                    <Row label="Category" value={template?.category ?? "—"} />
                    <Row label="Audience" value={audienceType === "all" ? `All ${customers.length} contacts` : "Selected contacts"} />
                </CardContent>
            </Card>

            {template && (
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Message Preview</p>
                        <div className="rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                            {template.body_text}
                        </div>
                    </CardContent>
                </Card>
            )}

            {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-[#35877D]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending messages, please wait…
                </div>
            )}
        </div>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground shrink-0">{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Wizard Page
// ─────────────────────────────────────────────────────────

export default function NewCampaignPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createCampaign = useCreateCampaign();
    const sendCampaign = useSendCampaign();

    const [step, setStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [state, setState] = useState<WizardState>({
        name: "",
        template: null,
        audienceType: "all",
    });

    const canProceed = [
        !!state.template,
        !!state.name.trim(),
        true,
    ][step];

    async function handleSend() {
        if (!state.template || !state.name.trim()) {
            toast.error("Please complete all required fields.");
            return;
        }
        setIsProcessing(true);
        try {
            // 1. Create draft campaign
            const campaign = await createCampaign.mutateAsync({
                data: {
                    name: state.name.trim(),
                    template_name: state.template.name,
                    template_language: state.template.language ?? "en",
                    audience_filter: { type: state.audienceType },
                    status: "draft",
                },
            });

            // 2. Fire it immediately
            const result = await sendCampaign.mutateAsync({ id: campaign.id });
            toast.success(`🎉 Campaign sent! ${result.sent_count} messages delivered.`);
            queryClient.invalidateQueries({ queryKey: ["listCampaigns"] });
            queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
            router.push(`/marketing/campaigns/${campaign.id}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to send campaign");
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleSaveDraft() {
        if (!state.template || !state.name.trim()) {
            toast.error("Please provide a campaign name and template first.");
            return;
        }
        try {
            const campaign = await createCampaign.mutateAsync({
                data: {
                    name: state.name.trim(),
                    template_name: state.template.name,
                    template_language: state.template.language ?? "en",
                    audience_filter: { type: state.audienceType },
                    status: "draft",
                },
            });
            toast.success("Draft saved");
            queryClient.invalidateQueries({ queryKey: ["listCampaigns"] });
            router.push(`/marketing/campaigns/${campaign.id}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save draft");
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push("/marketing/campaigns")}
                    className="border-border"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">New Campaign</h1>
                    <p className="text-sm text-muted-foreground">Create and send a bulk WhatsApp campaign.</p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between">
                {STEPS.map((s, index) => {
                    const isActive = index === step;
                    const isCompleted = index < step;
                    const Icon = s.icon;
                    return (
                        <div key={s.key} className="flex flex-1 items-center">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-all ${
                                        isCompleted
                                            ? "bg-[#35877D] text-white"
                                            : isActive
                                            ? "border-2 border-[#35877D] bg-[#35877D]/10 text-[#35877D]"
                                            : "border border-border bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                                </div>
                                <span
                                    className={`hidden text-sm font-medium sm:block ${
                                        isActive ? "text-foreground" : isCompleted ? "text-[#35877D]" : "text-muted-foreground"
                                    }`}
                                >
                                    {s.label}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`mx-3 h-px flex-1 ${index < step ? "bg-[#35877D]" : "bg-muted"}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step content */}
            <div
                className="transition-all duration-300 ease-in-out"
                style={{ opacity: isProcessing ? 0.6 : 1, pointerEvents: isProcessing ? "none" : "auto" }}
            >
                {step === 0 && (
                    <StepChooseTemplate
                        selected={state.template}
                        onSelect={(t) => setState((s) => ({ ...s, template: t }))}
                    />
                )}
                {step === 1 && (
                    <StepSelectAudience
                        campaignName={state.name}
                        audienceType={state.audienceType}
                        onNameChange={(v) => setState((s) => ({ ...s, name: v }))}
                        onAudienceChange={(v) => setState((s) => ({ ...s, audienceType: v }))}
                    />
                )}
                {step === 2 && (
                    <StepReview
                        campaignName={state.name}
                        template={state.template}
                        audienceType={state.audienceType}
                        isProcessing={isProcessing}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-border pt-4">
                <Button
                    variant="outline"
                    onClick={() => (step === 0 ? router.push("/marketing/campaigns") : setStep((s) => s - 1))}
                    disabled={isProcessing}
                >
                    {step === 0 ? "Cancel" : "Back"}
                </Button>
                <div className="flex items-center gap-2">
                    {step === 2 && (
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={isProcessing}
                        >
                            Save Draft
                        </Button>
                    )}
                    {step < 2 ? (
                        <Button
                            className="bg-[#35877D] hover:bg-[#2c6f66] text-white"
                            disabled={!canProceed}
                            onClick={() => setStep((s) => s + 1)}
                        >
                            Next <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-[#35877D] hover:bg-[#2c6f66] text-white"
                            disabled={isProcessing || !state.template || !state.name.trim()}
                            onClick={handleSend}
                        >
                            {isProcessing ? (
                                <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Sending…</>
                            ) : (
                                <><Send className="mr-1 h-4 w-4" /> Send Campaign</>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
