"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetWhatsappStatus, useExchangeMetaToken, useDisconnectWhatsapp, getGetWhatsappStatusQueryKey, useListAutomations, useCreateAutomation, useDeleteAutomation } from "@workspace/api-client-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Clock, Wifi, WifiOff, RefreshCcw, PhoneCall, Building2, Hash, Plus, Trash2, Key, Loader2 } from "lucide-react";

declare global {
    interface Window {
        FB?: {
            init: (params: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
            login: (
                callback: (response: { authResponse?: { code?: string }; status?: string }) => void,
                params: {
                    config_id: string;
                    response_type: string;
                    override_default_response_type: boolean;
                    extras?: Record<string, unknown>;
                }
            ) => void;
        };
    }
}

const STATUS_CONFIG = {
    connected: { label: "Connected", icon: CheckCircle2, color: "text-green-600", badge: "bg-green-100 text-green-800" },
    pending: { label: "Pending", icon: Clock, color: "text-yellow-600", badge: "bg-yellow-100 text-yellow-800" },
    failed: { label: "Failed", icon: XCircle, color: "text-red-600", badge: "bg-red-100 text-red-800" },
    disconnected: { label: "Disconnected", icon: WifiOff, color: "text-muted-foreground", badge: "bg-muted text-muted-foreground" },
};

function useMetaConfig() {
    return useQuery<{ appId: string | null; configId: string | null; verifyToken: string | null }>({
        queryKey: ["metaConfig"],
        queryFn: async () => {
            const res = await fetch("/api/meta/config");
            return res.json();
        },
        staleTime: Infinity,
    });
}

function useFacebookSdk(appId: string | null | undefined) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !appId) return;
        if (window.FB) { setLoaded(true); return; }

        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            window.FB?.init({ appId, cookie: true, xfbml: true, version: "v19.0" });
            setLoaded(true);
        };
        document.body.appendChild(script);
    }, [appId]);

    return loaded;
}

export default function WhatsAppIntegrationPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isConnecting, setIsConnecting] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    const { data: metaConfig, isLoading: isLoadingConfig } = useMetaConfig();
    const sdkLoaded = useFacebookSdk(metaConfig?.appId);

    const { data: account, isLoading } = useGetWhatsappStatus({
        query: { queryKey: getGetWhatsappStatusQueryKey() },
    });
    const exchangeToken = useExchangeMetaToken();
    const disconnect = useDisconnectWhatsapp();

    const refreshStatus = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: getGetWhatsappStatusQueryKey() });
    }, [queryClient]);

    function launchEmbeddedSignup() {
        if (!window.FB) {
            toast({ title: "Facebook SDK not loaded", description: "Please wait a moment and try again.", variant: "destructive" });
            return;
        }

        if (!metaConfig?.appId || !metaConfig?.configId) {
            toast({
                title: "Configuration missing",
                description: "META_APP_ID and META_CONFIG_ID are not set in server environment.",
                variant: "destructive",
            });
            return;
        }

        setIsConnecting(true);

        window.FB.login(
            (response) => {
                if (response.authResponse?.code) {
                    exchangeToken.mutate(
                        { data: { code: response.authResponse.code } },
                        {
                            onSuccess: () => {
                                refreshStatus();
                                toast({ title: "WhatsApp connected", description: "Your WhatsApp Business account has been connected successfully." });
                                setIsConnecting(false);
                            },
                            onError: (err) => {
                                toast({ title: "Connection failed", description: String(err), variant: "destructive" });
                                setIsConnecting(false);
                            },
                        }
                    );
                } else {
                    toast({ title: "Signup cancelled", description: "WhatsApp connection was not completed.", variant: "destructive" });
                    setIsConnecting(false);
                }
            },
            {
                config_id: metaConfig.configId,
                response_type: "code",
                override_default_response_type: true,
                extras: { setup: {}, featureType: "", sessionInfoVersion: "3" },
            }
        );
    }

    function handleDisconnect() {
        disconnect.mutate(undefined, {
            onSuccess: () => {
                refreshStatus();
                toast({ title: "Disconnected", description: "WhatsApp account has been disconnected." });
            },
        });
    }

    const statusKey = (account?.status ?? "disconnected") as keyof typeof STATUS_CONFIG;
    const statusCfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.disconnected;
    const StatusIcon = statusCfg.icon;
    const isConnected = account?.status === "connected";
    const configReady = !!metaConfig?.appId && !!metaConfig?.configId;

    return (
        <div className="space-y-6 w-full">
            {/* Top Header Greetings */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">WhatsApp Integration</h1>
                    <p className="text-sm text-gray-500">Connect and manage your WhatsApp Business account via Meta Embedded Signup.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 items-start">

                {/* Left Column: Connection Setup & Status */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Connection Status Card */}
                    <Card className="bg-white border border-[#EAE6DF] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b border-[#FAF8F5] pb-3.5">
                            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                {isConnected
                                    ? <Wifi className="text-[#35877D]" size={18} />
                                    : <WifiOff className="text-gray-400" size={18} />}
                                Connection Status
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500">Your WhatsApp Business account connection details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {isLoading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-36" />
                                    <Skeleton className="h-5 w-64" />
                                    <Skeleton className="h-5 w-48" />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <StatusIcon size={18} className={statusCfg.color} />
                                        <Badge className={`text-xs font-bold px-2.5 py-0.5 border-none uppercase ${statusKey === "connected" ? "bg-emerald-50 text-[#35877D]" :
                                            statusKey === "pending" ? "bg-amber-50 text-amber-800" :
                                                statusKey === "failed" ? "bg-red-50 text-red-800" : "bg-[#FAF8F5] text-gray-500"
                                            }`}>
                                            {statusCfg.label}
                                        </Badge>
                                    </div>

                                    {account && account.status !== "disconnected" && (
                                        <div className="border border-[#FAF8F5] rounded-xl p-1 bg-white divide-y divide-[#FAF8F5] mt-2">
                                            {account.displayName && <InfoRow icon={Building2} label="Business Name" value={account.displayName} />}
                                            {account.phoneNumber && <InfoRow icon={PhoneCall} label="Phone Number" value={account.phoneNumber} />}
                                            {account.wabaId && <InfoRow icon={Hash} label="WABA ID" value={account.wabaId} />}
                                            {account.businessId && <InfoRow icon={Building2} label="Business ID" value={account.businessId} />}
                                            {account.connectedAt && (
                                                <InfoRow icon={CheckCircle2} label="Connected On" value={new Date(account.connectedAt).toLocaleString("en-IN")} />
                                            )}
                                        </div>
                                    )}

                                    {!account && (
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            No WhatsApp account connected. Click the button below to connect your WhatsApp Business account.
                                        </p>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Connect / Manage Card */}
                    <Card className="bg-white border border-[#EAE6DF] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b border-[#FAF8F5] pb-3.5">
                            <CardTitle className="text-base font-bold text-gray-900 cursor-pointer">{isConnected ? "Manage Connection" : "Connect WhatsApp Business"}</CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                                {isConnected
                                    ? "Reconnect to update credentials or disconnect to remove this account."
                                    : "Use Meta Embedded Signup to securely connect your WhatsApp Business account. No manual token entry required."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {!isLoadingConfig && !configReady && (
                                <div className="rounded-xl border border-amber-200 bg-[#FFFDF9] p-4 text-xs text-amber-800 flex gap-3">
                                    <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="font-bold text-[#785110]">Configuration Setup Required:</strong>
                                        <p className="text-[#694B1B] mt-0.5 leading-relaxed">
                                            The server is missing <code className="font-mono bg-[#FAF1D6] px-1.5 py-0.5 rounded text-[11px]">META_APP_ID</code> and <code className="font-mono bg-[#FAF1D6] px-1.5 py-0.5 rounded text-[11px]">META_CONFIG_ID</code> environment variables. Please add them to your environment configurations to enable Meta signup connectivity.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    onClick={launchEmbeddedSignup}
                                    disabled={!sdkLoaded || isConnecting || exchangeToken.isPending || !configReady || isLoadingConfig}
                                    className="bg-[#35877D] hover:bg-[#2c6f66] text-white font-semibold text-xs h-10 px-5 rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 border-0 cursor-pointer"
                                >
                                    <Wifi size={14} />
                                    {isConnecting || exchangeToken.isPending
                                        ? "Connecting..."
                                        : isConnected
                                            ? "Reconnect WhatsApp"
                                            : "Connect WhatsApp"}
                                </Button>

                                {isConnected && (
                                    <Button
                                        variant="outline"
                                        onClick={handleDisconnect}
                                        disabled={disconnect.isPending}
                                        className="border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs h-10 px-5 rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0"
                                    >
                                        <WifiOff size={14} />
                                        {disconnect.isPending ? "Disconnecting..." : "Disconnect"}
                                    </Button>
                                )}

                                <Button variant="ghost" size="icon" onClick={refreshStatus} title="Refresh status" className="h-10 w-10 text-gray-500 rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <RefreshCcw size={15} />
                                </Button>
                            </div>

                            {configReady && !sdkLoaded && (
                                <p className="text-[11px] text-gray-400">Loading Facebook SDK...</p>
                            )}
                        </CardContent>
                    </Card>


                </div>

                {/* Right Column: Webhook Setup & Help */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="bg-white border border-[#EAE6DF] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b border-[#FAF8F5] pb-3.5">
                            <CardTitle className="text-base font-bold text-gray-900">How It Works</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="relative border-l border-emerald-100 ml-3 pl-6 space-y-6 py-1">
                                {[
                                    "Click the 'Connect WhatsApp' button to start the setup.",
                                    "Log in to the Facebook account that is linked to your business.",
                                    "Select the WhatsApp phone number you want to use for your business.",
                                    "Give permission to link your account so we can send and receive messages.",
                                    "Done! You are now ready to send automated messages and chat with customers.",
                                ].map((step, i) => (
                                    <div key={i} className="relative flex items-start">
                                        {/* Timeline circle indicator */}
                                        <span className="absolute left-[-34px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#35877D] text-white text-[10px] font-bold border-2 border-white shadow-sm">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium leading-relaxed">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between border-b border-[#FAF8F5] py-3.5 px-4 last:border-none last:pb-3.5 text-xs">
            <div className="flex items-center gap-2.5 text-gray-500 font-medium">
                <Icon size={14} className="text-gray-400 shrink-0" />
                <span>{label}</span>
            </div>
            <code className="font-mono text-xs text-[#0B2E1E] bg-[#FAF8F5] border border-[#EAE6DF] px-2.5 py-1 rounded-lg break-all select-all font-semibold">
                {value}
            </code>
        </div>
    );
}
