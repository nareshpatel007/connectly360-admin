"use client";

import { useEffect, useState } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    contactNumber: z.string().optional(),
    deliveryInformation: z.string().optional(),
    businessHours: z.string().optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { data: settings, isLoading } = useGetSettings();
    const updateSettings = useUpdateSettings();
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    const form = useForm<SettingsForm>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            companyName: "",
            contactNumber: "",
            deliveryInformation: "",
            businessHours: "",
        },
    });

    useEffect(() => {
        if (settings) {
            form.reset({
                companyName: settings.companyName ?? "",
                contactNumber: settings.contactNumber ?? "",
                deliveryInformation: settings.deliveryInformation ?? "",
                businessHours: settings.businessHours ?? "",
            });
        }
    }, [settings, form]);

    function onSubmit(data: SettingsForm) {
        updateSettings.mutate(
            { data },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
                    toast({ title: "Settings saved", description: "Your business settings have been updated." });
                },
                onError: () => {
                    toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
                },
            }
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Configure your business profile and auto-reply information.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Business Profile</CardTitle>
                    <CardDescription>
                        This information is used by the AI assistant when responding to customer queries.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} data-testid="input-company-name" placeholder="e.g. Connectly360" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} data-testid="input-contact-number" placeholder="+91 9586557162" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="deliveryInformation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Delivery Information</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    data-testid="textarea-delivery-info"
                                                    placeholder="We deliver across India..."
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="businessHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Hours</FormLabel>
                                            <FormControl>
                                                <Input {...field} data-testid="input-business-hours" placeholder="Mon-Sat: 9:00 AM - 7:00 PM IST" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={updateSettings.isPending}
                                    data-testid="button-save-settings"
                                >
                                    {updateSettings.isPending ? "Saving..." : "Save Settings"}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>WhatsApp Webhook</CardTitle>
                    <CardDescription>Configure the webhook URL in your Meta Developer Console.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">Callback URL</p>
                        <code className="block bg-muted rounded px-3 py-2 text-sm font-mono break-all">
                            {origin}/api/webhooks/whatsapp
                        </code>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">Verify Token</p>
                        <code className="block bg-muted rounded px-3 py-2 text-sm font-mono">
                            Use the WHATSAPP_VERIFY_TOKEN you set in server environment config
                        </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Set these in Meta Developer Console under WhatsApp &rarr; Configuration &rarr; Webhook.
                        Subscribe to the <strong>messages</strong> field.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
