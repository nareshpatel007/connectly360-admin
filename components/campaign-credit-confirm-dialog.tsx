"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, AlertTriangle, Send, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { BuyCreditsModal } from "./buy-credits-modal";

interface CampaignCreditConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipientCount: number;
    costPerMessage?: number;
    onConfirm: () => void;
    isSending?: boolean;
}

export function CampaignCreditConfirmDialog({
    open,
    onOpenChange,
    recipientCount,
    costPerMessage = 1,
    onConfirm,
    isSending = false
}: CampaignCreditConfirmDialogProps) {
    const { user } = useAuth();
    const [buyModalOpen, setBuyModalOpen] = useState(false);

    const availableCredits = typeof user?.credits === "number" ? user.credits : 0;
    const requiredCredits = recipientCount * costPerMessage;
    const remainingCredits = availableCredits - requiredCredits;
    const isInsufficient = availableCredits < requiredCredits;
    const missingCredits = requiredCredits - availableCredits;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
                    <DialogHeader className="text-center space-y-2 pb-1">
                        <div className={`mx-auto h-12 w-12 rounded-2xl flex items-center justify-center ${isInsufficient ? "bg-red-50 text-red-600" : "bg-[#35877D]/10 text-[#00382B]"}`}>
                            {isInsufficient ? <AlertTriangle size={24} /> : <Zap size={24} className="fill-[#35877D]" />}
                        </div>
                        <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
                            {isInsufficient ? "Insufficient Credits for Campaign" : "Confirm Campaign Dispatch"}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium">
                            {isInsufficient
                                ? `You need additional credits to broadcast to ${recipientCount.toLocaleString()} recipients.`
                                : `Review credit usage before launching your WhatsApp campaign.`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-3 space-y-2.5">
                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 divide-y divide-slate-200/60 text-xs">
                            <div className="flex justify-between items-center pb-2.5">
                                <span className="text-slate-500 font-medium">Total Recipients</span>
                                <span className="font-bold text-slate-800">{recipientCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-slate-500 font-medium">Credit Cost</span>
                                <span className="font-bold text-slate-800">{costPerMessage} credit / recipient</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-slate-500 font-semibold">Estimated Usage</span>
                                <span className="font-black text-[#00382B] text-sm">{requiredCredits.toLocaleString()} Credits</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-slate-500 font-medium">Available Balance</span>
                                <span className="font-bold text-slate-800">{availableCredits.toLocaleString()} Credits</span>
                            </div>
                            <div className="flex justify-between items-center pt-2.5">
                                <span className="text-slate-600 font-semibold">Balance After Campaign</span>
                                <span className={`font-black text-sm ${isInsufficient ? "text-red-600" : "text-emerald-700"}`}>
                                    {isInsufficient ? `-${missingCredits.toLocaleString()} (Short)` : `${remainingCredits.toLocaleString()} Credits`}
                                </span>
                            </div>
                        </div>

                        {isInsufficient && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
                                <span>Missing <strong>{missingCredits.toLocaleString()} credits</strong> to proceed.</span>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        onOpenChange(false);
                                        setBuyModalOpen(true);
                                    }}
                                    className="h-7 px-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg border-0 shadow-xs cursor-pointer"
                                >
                                    Recharge Now
                                </Button>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSending}
                            className="rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-semibold h-10 px-4 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        {isInsufficient ? (
                            <Button
                                onClick={() => {
                                    onOpenChange(false);
                                    setBuyModalOpen(true);
                                }}
                                className="rounded-xl bg-[#00382B] hover:bg-[#00241B] text-white text-xs font-bold h-10 px-5 flex items-center gap-1.5 shadow-sm cursor-pointer border-0"
                            >
                                <Sparkles size={14} className="text-emerald-300" />
                                <span>Buy Credits Pack</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={onConfirm}
                                disabled={isSending}
                                className="rounded-xl bg-[#00382B] hover:bg-[#00241B] text-white text-xs font-bold h-10 px-5 flex items-center gap-1.5 shadow-sm cursor-pointer border-0"
                            >
                                <Send size={14} />
                                <span>{isSending ? "Launching..." : "Start Campaign"}</span>
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <BuyCreditsModal
                open={buyModalOpen}
                onOpenChange={setBuyModalOpen}
                highlightCredits={missingCredits > 0 ? missingCredits : undefined}
            />
        </>
    );
}
