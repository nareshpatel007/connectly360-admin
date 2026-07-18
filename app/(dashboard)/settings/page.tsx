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
import { Building2, Phone, Truck, Clock, Webhook, Copy, Check } from "lucide-react";

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
    const [copied, setCopied] = useState(false);

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
        <div className="space-y-8 max-w-3xl">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Settings</h1>
                </div>
                <p className="text-muted-foreground text-lg pl-14">Configure your business profile and auto-reply information.</p>
            </div>

            <Card className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-1 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Business Profile</CardTitle>
                    </div>
                    <CardDescription className="text-base pl-10">
                        This information is used by the AI assistant when responding to customer queries.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    {isLoading ? (
                        <div className="space-y-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-blue-500" />
                                                Company Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    data-testid="input-company-name" 
                                                    placeholder="e.g. Connectly360" 
                                                    className="h-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-blue-500/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactNumber"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-green-500" />
                                                Contact Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    data-testid="input-contact-number" 
                                                    placeholder="+91 9586557162" 
                                                    className="h-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-green-500/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="deliveryInformation"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                                                <Truck className="w-4 h-4 text-orange-500" />
                                                Delivery Information
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    data-testid="textarea-delivery-info"
                                                    placeholder="We deliver across India..."
                                                    rows={4}
                                                    className="text-base border-2 focus-visible:ring-2 focus-visible:ring-orange-500/50 resize-none"
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
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-purple-500" />
                                                Business Hours
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    data-testid="input-business-hours" 
                                                    placeholder="Mon-Sat: 9:00 AM - 7:00 PM IST" 
                                                    className="h-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-purple-500/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                                    disabled={updateSettings.isPending}
                                    data-testid="button-save-settings"
                                >
                                    {updateSettings.isPending ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </span>
                                    ) : (
                                        "Save Settings"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
