"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
    useListConversations,
    useGetCustomerConversations,
    useSendMessage
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    User,
    MessageSquare,
    Settings,
    SlidersHorizontal,
    Plus,
    ChevronDown,
    ChevronRight,
    Phone,
    MoreVertical,
    Send,
    Bot,
    Clock,
    Zap,
    BookOpen,
    Smile,
    Paperclip,
    Mic,
    CheckCheck,
    Loader2
} from "lucide-react";

export default function ConversationsPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("all"); // all, open, unread, pending
    const [activeCustomerId, setActiveCustomerId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    // Fetch conversation messages
    const { data: conversations, isLoading: isLoadingAll } = useListConversations();

    // Grouping all messages by customer to create chat list threads
    const chatThreads = useMemo(() => {
        if (!conversations) return [];

        const groups: Record<number, {
            customerId: number;
            customerName: string;
            customerPhone: string;
            lastMessage: string;
            lastMessageDirection: "inbound" | "outbound";
            lastMessageTime: string;
            intent?: string;
        }> = {};

        // Sort descending to process newest messages first
        const sortedConvs = [...conversations].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        sortedConvs.forEach((conv) => {
            const cid = conv.customerId;
            if (!groups[cid]) {
                groups[cid] = {
                    customerId: cid,
                    customerName: conv.customerName || conv.customerPhone || "WhatsApp User",
                    customerPhone: conv.customerPhone || "",
                    lastMessage: conv.message,
                    lastMessageDirection: conv.direction,
                    lastMessageTime: conv.createdAt,
                    intent: conv.intent,
                };
            }
        });

        return Object.values(groups);
    }, [conversations]);

    // Filtering active chat list threads
    const filteredThreads = useMemo(() => {
        return chatThreads.filter((thread) => {
            const matchesSearch =
                thread.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                thread.customerPhone.includes(searchQuery) ||
                thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (selectedTab === "unread") {
                return thread.lastMessageDirection === "inbound";
            }
            if (selectedTab === "pending") {
                return !!thread.intent;
            }
            return true;
        });
    }, [chatThreads, searchQuery, selectedTab]);

    // Auto-select first thread if nothing active
    useEffect(() => {
        if (activeCustomerId === null && filteredThreads.length > 0) {
            setActiveCustomerId(filteredThreads[0].customerId);
        }
    }, [filteredThreads, activeCustomerId]);

    // Retrieve active customer thread
    const { data: activeConversations, isLoading: isLoadingThread } = useGetCustomerConversations(
        activeCustomerId || 0,
        { query: { queryKey: ["getCustomerConversations", activeCustomerId], enabled: !!activeCustomerId } }
    );

    const activeThread = useMemo(() => {
        return chatThreads.find((t) => t.customerId === activeCustomerId);
    }, [chatThreads, activeCustomerId]);

    // Sort messages in chronological order (oldest at the top, newest at the bottom)
    const sortedConversations = useMemo(() => {
        if (!activeConversations) return [];
        return [...activeConversations].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [activeConversations]);

    // Outbound composer send
    const sendMessage = useSendMessage();
    const isSending = sendMessage.isPending;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [sortedConversations]);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !activeCustomerId || !activeThread) return;

        try {
            await sendMessage.mutateAsync({
                data: {
                    to: activeThread.customerPhone,
                    body: replyText.trim()
                }
            });
            setReplyText("");
            toast({ title: "Reply Sent", description: "Outbound message dispatched successfully." });

            queryClient.invalidateQueries({ queryKey: ["getCustomerConversations", activeCustomerId] });
            queryClient.invalidateQueries({ queryKey: ["listConversations"] });
        } catch (err: any) {
            toast({
                title: "Failed to send",
                description: err.message || "Could not dispatch reply",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="flex h-full w-full bg-white overflow-hidden text-slate-900 font-sans">

            {/* COLUMN 1: LEFT SUB-SIDEBAR (CHANNELS & SECTIONS) */}
            <div className="w-56 shrink-0 border-r border-slate-200 bg-[#F8FAFC] flex flex-col p-4 justify-between select-none">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 tracking-wide">Team Inbox</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-200/50 cursor-pointer">
                            <Settings size={14} />
                        </Button>
                    </div>

                    {/* Channels Section */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Channels</span>
                        <div className="space-y-0.5">
                            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200/50 transition-colors text-left cursor-pointer">
                                <span>All Channels</span>
                            </button>
                            <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold bg-[#EAF7F2] text-[#09B36E] text-left cursor-pointer border border-[#09B36E]/10">
                                <span className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#09B36E]" />
                                    WhatsApp
                                </span>
                                <ChevronRight size={13} className="text-[#09B36E]/70" />
                            </button>
                            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200/50 transition-colors text-left cursor-pointer">
                                <span>Instagram</span>
                            </button>
                            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200/50 transition-colors text-left cursor-pointer">
                                <span>Messenger</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Filters</span>
                        <div className="space-y-0.5">
                            <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold bg-[#EAF7F2]/60 text-[#09B36E] text-left cursor-pointer">
                                <span>Active chats</span>
                            </button>
                            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200/50 transition-colors text-left cursor-pointer">
                                <span>Assigned to me</span>
                            </button>
                            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200/50 transition-colors text-left cursor-pointer">
                                <span>Unassigned</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-400 font-medium px-2.5 pb-1">
                    Wati Style Team Inbox
                </div>
            </div>

            {/* COLUMN 2: MIDDLE PANEL (CHATS LIST) */}
            <div className="w-76 shrink-0 border-r border-slate-200 flex flex-col bg-white">
                {/* Search & Header */}
                <div className="p-3 border-b border-slate-100 space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                            Active chats
                            <ChevronDown size={13} className="text-slate-400" />
                        </button>
                        <div className="flex items-center gap-1.5">
                            <SlidersHorizontal size={13} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                            <Plus size={14} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                        </div>
                    </div>

                    {/* Search Field */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search active..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 text-xs h-8.5 rounded-lg bg-slate-50 border-slate-200 focus:bg-white"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-1 overflow-x-auto pb-0.5 shrink-0 scrollbar-none">
                        {["all", "open", "unread", "pending"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer uppercase tracking-wider shrink-0 ${selectedTab === tab
                                        ? "bg-[#09B36E] text-white border-transparent"
                                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chats Thread List */}
                <div className="flex-1 overflow-auto divide-y divide-slate-100">
                    {isLoadingAll ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="p-4 space-y-2">
                                <div className="flex justify-between"><Skeleton className="h-4.5 w-24 rounded" /><Skeleton className="h-3.5 w-8 rounded" /></div>
                                <Skeleton className="h-3.5 w-full rounded" />
                            </div>
                        ))
                    ) : filteredThreads.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                            <MessageSquare className="mx-auto text-slate-200" size={24} />
                            <p>No active chats found</p>
                        </div>
                    ) : (
                        filteredThreads.map((thread) => {
                            const isSelected = thread.customerId === activeCustomerId;
                            return (
                                <button
                                    key={thread.customerId}
                                    onClick={() => setActiveCustomerId(thread.customerId)}
                                    className={`w-full text-left p-3.5 flex gap-3 transition-colors text-xs border-l-3 cursor-pointer ${isSelected
                                            ? "bg-[#EAF7F2]/45 border-[#09B36E] bg-slate-50"
                                            : "border-transparent hover:bg-slate-50/50 bg-white"
                                        }`}
                                >
                                    {/* User Avatar */}
                                    <div className="shrink-0">
                                        <div className="h-9 w-9 rounded-full bg-[#09B36E]/10 text-[#09B36E] flex items-center justify-center font-bold">
                                            {thread.customerName.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-800 truncate flex items-center gap-1">
                                                {thread.customerName}
                                                {thread.lastMessageDirection === "outbound" && (
                                                    <span title="Bot Auto-reply">
                                                        <Bot size={12} className="text-[#09B36E]/70" />
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-xs text-slate-400 shrink-0 ml-1.5">
                                                {new Date(thread.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <p className="text-slate-500 truncate text-xs leading-relaxed">
                                            {thread.lastMessage}
                                        </p>

                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-xs font-bold text-[#09B36E] bg-[#EAF7F2] px-1.5 py-0.5 rounded border border-[#09B36E]/10">
                                                Open
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#09B36E]" />
                                                WhatsApp
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* COLUMN 3: RIGHT PANEL (CHAT COMPOSER THREAD) */}
            <div className="flex-1 flex flex-col bg-[#F8FAFC]/50">
                {activeThread ? (
                    <>
                        {/* Thread Header */}
                        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                    {activeThread.customerName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-800">{activeThread.customerName}</h3>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                                        <Bot size={11} className="text-[#09B36E]" />
                                        Bot Available
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-400">
                                <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                                    <Clock size={13} />
                                    23:59
                                </span>
                                <Badge className="bg-[#EAF7F2] text-[#09B36E] hover:bg-[#EAF7F2] border border-[#09B36E]/10 font-bold text-xs px-2.5 py-0.5 rounded-lg">
                                    Open
                                </Badge>
                                <div className="h-4 w-px bg-slate-200" />
                                <Phone size={14} className="hover:text-slate-600 cursor-pointer" />
                                <MoreVertical size={14} className="hover:text-slate-600 cursor-pointer" />
                            </div>
                        </div>

                        {/* Thread tabs lists */}
                        <div className="px-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0 overflow-x-auto scrollbar-none">
                            {["Messages", "Conversation Summary", "Inbox Automations", "Call records"].map((tab, idx) => (
                                <button
                                    key={tab}
                                    className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${idx === 0
                                            ? "border-[#09B36E] text-[#09B36E]"
                                            : "border-transparent text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Thread message bubble body scroll */}
                        <div className="flex-1 overflow-auto p-4 space-y-4">
                            {isLoadingThread ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-10 w-1/3 rounded-xl" />
                                    <Skeleton className="h-14 w-1/2 rounded-xl ml-auto bg-[#EAF7F2]/40" />
                                    <Skeleton className="h-10 w-2/5 rounded-xl" />
                                </div>
                            ) : sortedConversations.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                                    No message logs found.
                                </div>
                            ) : (
                                <div className="space-y-4 pb-2">
                                    {/* Mock initialization system log */}
                                    <div className="flex justify-center text-xs text-slate-400 font-semibold py-1">
                                        <span className="bg-slate-100 px-3 py-1 rounded-full shadow-2xs">
                                            The chat has been initialized by contact {activeThread.customerName} ({activeThread.customerPhone})
                                        </span>
                                    </div>

                                    {sortedConversations.map((conv, idx) => {
                                        const isInbound = conv.direction === "inbound";

                                        // Simple date check
                                        const showDate = idx === 0 ||
                                            new Date(conv.createdAt).toDateString() !== new Date(sortedConversations[idx - 1].createdAt).toDateString();

                                        return (
                                            <div key={conv.id} className="space-y-3">
                                                {showDate && (
                                                    <div className="flex justify-center py-2 shrink-0">
                                                        <span className="text-xs font-bold text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                            {new Date(conv.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* System notification log for automations */}
                                                {conv.intent === "automation_reply" && (
                                                    <div className="flex justify-center text-xs text-slate-400 font-semibold py-1">
                                                        <span className="bg-slate-100 px-3 py-1 rounded-full shadow-2xs">
                                                            The ticket status has been set as Open by agent Bot
                                                        </span>
                                                    </div>
                                                )}

                                                <div className={`flex ${isInbound ? "justify-start" : "justify-end"}`}>
                                                    <div className={`flex flex-col max-w-[75%] ${isInbound ? "items-start" : "items-end"}`}>
                                                        {/* Bubble wrapper */}
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-all border ${isInbound
                                                                ? "bg-white text-slate-800 border-slate-200/80 rounded-tl-xs"
                                                                : "bg-[#D9FDD3] text-slate-800 border-[#C2F1B8] rounded-tr-xs shadow-2xs"
                                                            }`}>
                                                            {conv.message}
                                                        </div>

                                                        {/* Footer info inside bubbles */}
                                                        <div className="flex items-center gap-1.5 mt-1.5 px-1 text-xs font-semibold text-slate-400">
                                                            {isInbound && <span className="text-[#09B36E]">{activeThread.customerName}</span>}
                                                            <span>
                                                                {new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {!isInbound && (
                                                                <span className="flex items-center gap-0.5 text-[#09B36E]">
                                                                    Bot
                                                                    <CheckCheck size={11} className="text-[#34b7f1]" />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Shared Number Notice Banner */}
                        <div className="m-3 mx-4 p-3 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-800 flex items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <Zap size={13} className="text-amber-600 shrink-0" />
                                <span className="font-semibold">You're currently using a shared number. Connect channels to unlock priority automation.</span>
                            </div>
                            <Button size="sm" className="bg-[#09B36E] hover:bg-[#079E61] text-white font-bold text-xs h-7 px-3 rounded-lg border-none shadow-xs cursor-pointer">
                                Connect Channel
                            </Button>
                        </div>

                        {/* Composer Chat Input area */}
                        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                            <form onSubmit={handleSendReply} className="space-y-2.5">
                                <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your message here or press '/' key for templates..."
                                    className="min-h-[48px] max-h-[120px] text-sm resize-none py-2.5 px-3 border-transparent focus-visible:ring-0 rounded-lg bg-slate-50 focus:bg-white"
                                    disabled={isSending}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendReply(e);
                                        }
                                    }}
                                />

                                <div className="flex items-center justify-between gap-3 flex-wrap pt-0.5">
                                    {/* Action toolbar buttons */}
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Button type="button" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-7 px-3.5 rounded-lg border-0 shadow-xs flex items-center gap-1 cursor-pointer">
                                            Copilot
                                            <ChevronDown size={11} />
                                        </Button>
                                        <button type="button" className="p-1.5 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"><BookOpen size={14} /></button>
                                        <button type="button" className="p-1.5 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"><Smile size={14} /></button>
                                        <button type="button" className="p-1.5 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"><Paperclip size={14} /></button>
                                        <button type="button" className="p-1.5 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"><Mic size={14} /></button>
                                    </div>

                                    {/* Send Trigger */}
                                    <Button
                                        type="submit"
                                        disabled={isSending || !replyText.trim()}
                                        className="bg-[#09B36E] hover:bg-[#079E61] text-white font-bold text-xs h-8 px-4 rounded-lg flex items-center gap-1.5 shadow-xs border-0 cursor-pointer"
                                    >
                                        {isSending ? (
                                            <Loader2 className="animate-spin" size={13} />
                                        ) : (
                                            <>
                                                <Send size={13} />
                                                Send
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs p-8 text-center space-y-2">
                        <MessageSquare className="text-slate-200" size={32} />
                        <h4 className="font-bold text-slate-700">No chat selected</h4>
                        <p className="max-w-xs leading-normal">Select a contact conversation in the active chats list on the left to start sending messages.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
