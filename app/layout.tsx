import type { Metadata } from "next";
import { Inter, Jost, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { AuthProvider } from "@/lib/auth-context";
import { AdminLayout } from "@/components/admin-layout";

const jost = Jost({
    variable: "--font-jost",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const viewport = {
    themeColor: "#35877D",
};

export const metadata: Metadata = {
    title: {
        default: "Connectly360 Platform Admin Console",
        template: "%s | Connectly360 Admin",
    },
    description: "Platform management, user accounts, workspace monitoring, billing, and credit ledger administration for Connectly360.",
    icons: {
        icon: "/images/favicon.png",
        shortcut: "/favicon.ico",
        apple: "/images/icon.png",
    },
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${jost.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#35877D] selection:text-white">
                <Providers>
                    <AuthProvider>
                        <AdminLayout>
                            {children}
                        </AdminLayout>
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}
