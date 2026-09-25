import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-screen bg-slate-50 text-slate-900 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#35877D] selection:text-white">
            {/* Subtle background decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#35877D]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#35877D]/4 rounded-full blur-2xl pointer-events-none" />
            
            {children}
        </div>
    );
}
