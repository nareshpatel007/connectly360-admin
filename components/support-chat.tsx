"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    X,
    Send,
    User,
    Mail,
    Phone,
    Bot,
    Sparkles,
    Loader2,
    CheckCircle2,
    LogOut,
    ArrowRight,
    MessageCircle,
    PlusCircle,
    History
} from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Helper cookie functions
const getCookie = (name: string): string | null => {
    if (typeof window === "undefined") return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof window === "undefined") return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

const deleteCookie = (name: string) => {
    if (typeof window === "undefined") return;
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
};

interface VisitorIdentity {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface Message {
    message: string;
    direction: "inbound" | "outbound";
    createdAt?: string;
}

export function SupportChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Identity states
    const [activeVisitorId, setActiveVisitorId] = useState<number | null>(null);
    const [activeVisitor, setActiveVisitor] = useState<VisitorIdentity | null>(null);
    const [previousVisitors, setPreviousVisitors] = useState<VisitorIdentity[]>([]);

    // Register states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    // Chat states
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [submittingIdentify, setSubmittingIdentify] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [loadingPrevious, setLoadingPrevious] = useState(false);

    const messageEndRef = useRef<HTMLDivElement>(null);

    // Exclude layout from dashboard pages
    const isDashboard = pathname ? (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/analytics") ||
        pathname.startsWith("/conversations") ||
        pathname.startsWith("/contacts") ||
        pathname.startsWith("/leads") ||
        pathname.startsWith("/automations") ||
        pathname.startsWith("/knowledge-base") ||
        pathname.startsWith("/ai-assistant") ||
        pathname.startsWith("/integrations") ||
        pathname.startsWith("/products") ||
        pathname.startsWith("/billing") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/workspace") ||
        pathname.startsWith("/campaigns") ||
        pathname.startsWith("/marketing") ||
        pathname.startsWith("/reports")
    ) : false;

    // Load visitor identities from cookies on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const activeIdStr = getCookie("connectly360_active_visitor_id");
            if (activeIdStr) {
                const activeId = parseInt(activeIdStr);
                if (!isNaN(activeId)) {
                    setActiveVisitorId(activeId);
                }
            }
            loadPreviousVisitors();
        }
    }, []);

    // Load active visitor details & history
    useEffect(() => {
        if (activeVisitorId && isOpen) {
            fetchVisitorAndHistory(activeVisitorId);
        }
    }, [activeVisitorId, isOpen]);

    // Scroll to bottom helper
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages, isOpen, sendingMessage, isConnected]);

    const loadPreviousVisitors = async () => {
        const idsStr = getCookie("connectly360_visitor_ids") || "";
        if (!idsStr) {
            setPreviousVisitors([]);
            return;
        }

        setLoadingPrevious(true);
        try {
            const res = await fetch(`/api/public/support/visitors?ids=${encodeURIComponent(idsStr)}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.visitors)) {
                setPreviousVisitors(data.visitors);
            }
        } catch (error) {
            console.error("Error loading previous support visitors:", error);
        } finally {
            setLoadingPrevious(false);
        }
    };

    const fetchVisitorAndHistory = async (visitorId: number) => {
        setLoadingHistory(true);
        try {
            const res = await fetch(`/api/public/support/history?visitor_id=${visitorId}`);
            const data = await res.json();
            if (data.success) {
                if (data.visitor) {
                    setActiveVisitor({
                        id: data.visitor.id,
                        name: data.visitor.name,
                        email: data.visitor.email,
                        phone: data.visitor.phone
                    });
                }
                if (Array.isArray(data.conversations)) {
                    const mapped: Message[] = data.conversations.map((c: any) => ({
                        message: c.message,
                        direction: c.direction,
                        createdAt: c.createdAt
                    }));
                    setMessages(mapped);
                }
            }
        } catch (error) {
            console.error("Error fetching support history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone) return;

        setSubmittingIdentify(true);
        try {
            const res = await fetch("/api/public/support/identify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone })
            });
            const data = await res.json();
            if (data.success && data.visitor) {
                const vid = data.visitor.id;

                // Set active cookie
                setCookie("connectly360_active_visitor_id", vid.toString());

                // Add to multiple IDs cookie list
                const existingStr = getCookie("connectly360_visitor_ids") || "";
                const ids = existingStr ? existingStr.split(",") : [];
                if (!ids.includes(vid.toString())) {
                    ids.push(vid.toString());
                    setCookie("connectly360_visitor_ids", ids.join(","));
                }

                setActiveVisitorId(vid);
                setActiveVisitor({
                    id: vid,
                    name: data.visitor.name,
                    phone: data.visitor.phone,
                    email: data.visitor.email
                });
                setIsConnected(true);
                setShowRegisterForm(false);
                loadPreviousVisitors();
            }
        } catch (error) {
            console.error("Error identifying support visitor:", error);
        } finally {
            setSubmittingIdentify(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeVisitorId || sendingMessage) return;

        const userMsg = inputValue.trim();
        setInputValue("");

        const userMsgObj: Message = { message: userMsg, direction: "inbound" };
        setMessages(prev => [...prev, userMsgObj]);
        setSendingMessage(true);

        try {
            const res = await fetch("/api/public/support/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitor_id: activeVisitorId,
                    message: userMsg
                })
            });
            const data = await res.json();
            if (data.success && data.reply) {
                const aiMsgObj: Message = { message: data.reply, direction: "outbound" };
                setMessages(prev => [...prev, aiMsgObj]);
            } else {
                const errorMsgObj: Message = {
                    message: "Sorry, I am having trouble connecting to the service right now. Please try again.",
                    direction: "outbound"
                };
                setMessages(prev => [...prev, errorMsgObj]);
            }
        } catch (error) {
            console.error("Error sending message to support AI:", error);
            const errorMsgObj: Message = {
                message: "A connection error occurred. Please verify your internet and try again.",
                direction: "outbound"
            };
            setMessages(prev => [...prev, errorMsgObj]);
        } finally {
            setSendingMessage(false);
        }
    };

    const handleEndChat = async () => {
        if (!activeVisitorId) return;
        const currentId = activeVisitorId;

        try {
            await fetch("/api/public/support/end-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visitor_id: currentId })
            });
        } catch (error) {
            console.error("Error ending chat on backend:", error);
        }

        // 1. Remove ID from active cookie
        deleteCookie("connectly360_active_visitor_id");

        // 2. Remove ID from multiple IDs list cookie
        const existingStr = getCookie("connectly360_visitor_ids") || "";
        let ids = existingStr ? existingStr.split(",") : [];
        ids = ids.filter(x => x !== currentId.toString());

        if (ids.length > 0) {
            setCookie("connectly360_visitor_ids", ids.join(","));
        } else {
            deleteCookie("connectly360_visitor_ids");
        }

        // Reset states
        setActiveVisitorId(null);
        setActiveVisitor(null);
        setMessages([]);
        setIsConnected(false);
        setName("");
        setEmail("");
        setPhone("");

        // Refresh local list of chats
        loadPreviousVisitors();
    };

    const resumeChat = (visitorId: number) => {
        setCookie("connectly360_active_visitor_id", visitorId.toString());
        setActiveVisitorId(visitorId);
        setIsConnected(true);
    };

    if (isDashboard) return null;

    const hasPreviousChats = previousVisitors.length > 0;

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
            {/* Expanded Chat Card */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        className="mb-4 w-[380px] h-[550px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
                    >
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-[#0B2E1E] to-[#1F543C] text-white p-4 flex items-center justify-between relative overflow-hidden">
                            {/* Accent Gradients */}
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-[#35877D]/30 rounded-full blur-xl pointer-events-none"></div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center relative shadow-sm">
                                    <Bot className="w-5 h-5 text-white" />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B2E1E] rounded-full animate-pulse"></span>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                                        Support Assistant
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                                    </h4>
                                    <p className="text-[11px] font-semibold text-emerald-300/95">AI-powered support replies instantly</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer relative z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {activeVisitorId ? (
                            /* 3. Active Chat Window State */
                            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-950/20">
                                {/* Session bar containing Customer info */}
                                <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                                        Linked as: <span className="text-[#35877D] font-extrabold">{activeVisitor ? activeVisitor.name : "..."}</span>
                                    </span>

                                    <div className="flex items-center gap-3">
                                        {hasPreviousChats && !showRegisterForm && (
                                            <button
                                                onClick={() => {
                                                    deleteCookie("connectly360_active_visitor_id");
                                                    setActiveVisitorId(null);
                                                    setActiveVisitor(null);
                                                    setMessages([]);
                                                    setIsConnected(false);
                                                }}
                                                className="text-[10px] font-extrabold text-[#35877D] hover:underline uppercase tracking-wider cursor-pointer"
                                            >
                                                Switch Chat
                                            </button>
                                        )}
                                        <button
                                            onClick={handleEndChat}
                                            className="text-[10px] font-extrabold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                            title="End this session & delete visitor details"
                                        >
                                            <LogOut className="w-3 h-3" />
                                            End Chat
                                        </button>
                                    </div>
                                </div>

                                {/* Message bubble logs thread */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {loadingHistory ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
                                            <Loader2 className="w-5 h-5 text-[#35877D] animate-spin" />
                                            Retrieving conversation history...
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-3">
                                                <Bot className="w-6 h-6 text-[#35877D]" />
                                            </div>
                                            <h6 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Welcome, {activeVisitor ? activeVisitor.name : "Visitor"}!</h6>
                                            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-[220px]">
                                                How can I help you today? Ask me any questions about Connectly360 pricing, plans, or features.
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isUser = msg.direction === "inbound";
                                            return (
                                                <div
                                                    key={index}
                                                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div className={`flex gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                                                        {!isUser && (
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-[#35877D] flex-shrink-0 self-end shadow-xs">
                                                                <Bot className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                        <div
                                                            className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed whitespace-pre-wrap ${isUser
                                                                ? "bg-[#35877D] text-white rounded-tr-none"
                                                                : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/30 dark:border-slate-800/30 rounded-tl-none"
                                                                }`}
                                                        >
                                                            {msg.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    {/* Real-time sending/typing loader */}
                                    {sendingMessage && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-2 items-center max-w-[85%]">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-[#35877D] flex-shrink-0 self-end shadow-xs">
                                                    <Bot className="w-4 h-4" />
                                                </div>
                                                <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/30 dark:border-slate-800/30 rounded-tl-none flex items-center gap-1.5 shadow-xs">
                                                    <span className="w-2 h-2 bg-[#35877D] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                                    <span className="w-2 h-2 bg-[#35877D] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                                    <span className="w-2 h-2 bg-[#35877D] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messageEndRef} />
                                </div>

                                {/* Active connection toggle footer */}
                                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
                                    {!isConnected ? (
                                        <div className="py-2 px-1 text-center space-y-2">
                                            <p className="text-[11px] font-semibold text-slate-500">
                                                Ready to connect you with our AI Support Agent.
                                            </p>
                                            <button
                                                onClick={() => setIsConnected(true)}
                                                className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                                            >
                                                Connect Now
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <input
                                                type="text"
                                                required
                                                disabled={sendingMessage}
                                                placeholder="Type your question..."
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-[#35877D]/20 focus:border-[#35877D] text-xs font-normal text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-500"
                                            />
                                            <button
                                                type="submit"
                                                disabled={sendingMessage || !inputValue.trim()}
                                                className="w-10 h-10 bg-[#35877D] hover:bg-[#2e746b] disabled:opacity-50 disabled:hover:bg-[#35877D] text-white rounded-xl flex items-center justify-center transition-all shadow-sm shadow-[#35877D]/10 cursor-pointer flex-shrink-0"
                                            >
                                                <Send className="w-4.5 h-4.5" />
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        ) : (hasPreviousChats && !showRegisterForm) ? (
                            /* 2. Multiple History Switcher State */
                            <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between bg-slate-50/50 dark:bg-slate-950/20">
                                <div className="space-y-4">
                                    <div className="text-center pb-2">
                                        <History className="w-8 h-8 text-[#35877D] mx-auto mb-2 opacity-70" />
                                        <h5 className="font-bold text-slate-800 dark:text-slate-100 text-base">Your Support Chats</h5>
                                        <p className="text-xs font-semibold text-slate-500 mt-1">Resume an existing discussion or start a new inquiry.</p>
                                    </div>

                                    {loadingPrevious ? (
                                        <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
                                            <Loader2 className="w-5 h-5 text-[#35877D] animate-spin" />
                                            Retrieving past chat details...
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                            {previousVisitors.map((v) => (
                                                <div
                                                    key={v.id}
                                                    onClick={() => resumeChat(v.id)}
                                                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-[#35877D]/50 hover:bg-[#35877D]/5 dark:hover:bg-[#35877D]/10 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate group-hover:text-[#35877D]">{v.name}</p>
                                                        <p className="text-[10px] font-semibold text-slate-400 truncate">{v.email}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#35877D] opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                                                        Resume <ArrowRight className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowRegisterForm(true)}
                                    className="w-full h-11 bg-gradient-to-r from-[#0B2E1E] to-[#1F543C] hover:from-[#134931] hover:to-[#2b6d50] text-white font-bold rounded-xl transition-all shadow-md shadow-[#0B2E1E]/10 flex items-center justify-center gap-2 cursor-pointer mt-4"
                                >
                                    <PlusCircle className="w-4.5 h-4.5" />
                                    Start New Support Inquiry
                                </button>
                            </div>
                        ) : (
                            /* 1. Identification Form State */
                            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20">
                                <div className="space-y-4">
                                    <div className="text-center pb-2">
                                        <h5 className="font-bold text-slate-800 dark:text-slate-100 text-base">Let's get started</h5>
                                        <p className="text-xs font-semibold text-slate-500 mt-1">Please introduce yourself to start a live support conversation.</p>
                                    </div>

                                    <form onSubmit={handleIdentify} className="space-y-3.5">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-[#35877D]" /> Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35877D]/20 focus:border-[#35877D] text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-[#35877D]" /> Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35877D]/20 focus:border-[#35877D] text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        <div className="space-y-1 custom-phone-input">
                                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-[#35877D]" /> WhatsApp Mobile
                                            </label>
                                            <PhoneInput
                                                placeholder="98765 43210"
                                                value={phone}
                                                onChange={(val) => setPhone(val ?? "")}
                                                defaultCountry="IN"
                                                required
                                                numberInputProps={{
                                                    className: "h-11 w-full border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#35877D]/20 focus:border-[#35877D] rounded-xl bg-white dark:bg-slate-900 font-semibold px-3.5 text-sm text-slate-800 dark:text-slate-100 transition-all"
                                                }}
                                                className="flex gap-2 items-center"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingIdentify}
                                            className="w-full mt-2 h-11 bg-gradient-to-r from-[#0B2E1E] to-[#1F543C] hover:from-[#134931] hover:to-[#2b6d50] disabled:opacity-70 text-white font-bold rounded-xl transition-all shadow-md shadow-[#0B2E1E]/10 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {submittingIdentify ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Connecting Support...
                                                </>
                                            ) : (
                                                <>
                                                    Start Support Chat
                                                </>
                                            )}
                                        </button>

                                        {hasPreviousChats && (
                                            <button
                                                type="button"
                                                onClick={() => setShowRegisterForm(false)}
                                                className="w-full h-10 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                                            >
                                                <History className="w-3.5 h-3.5" />
                                                View Previous Chats
                                            </button>
                                        )}
                                    </form>
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium text-center leading-relaxed mt-4">
                                    By starting, you agree to our Terms. Our AI agent compiles answers directly from our official knowledge base.
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Floating Trigger Button */}
            <motion.button
                onClick={() => {
                    setIsOpen(!isOpen);
                    // Reload past sessions whenever widget opens
                    if (!isOpen) {
                        loadPreviousVisitors();
                    }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-gradient-to-br from-[#0B2E1E] to-[#1F543C] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#0B2E1E]/20 hover:shadow-[#0B2E1E]/30 border border-emerald-500/20 transition-all cursor-pointer relative"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                        >
                            <MessageSquare className="w-6 h-6 text-white" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B2E1E]"></span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
