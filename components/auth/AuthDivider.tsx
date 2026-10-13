"use client";

import React from "react";

interface AuthDividerProps {
    text?: string;
}

export function AuthDivider({ text = "or" }: AuthDividerProps) {
    return (
        <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {text}
            </div>
        </div>
    );
}
