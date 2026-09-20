"use client";

import React from "react";

interface UpgradeGuardProps {
    allowedPlans?: string[];
    featureName?: string;
    description?: string;
    children: React.ReactNode;
}

/**
 * In Connectly360's credit-based model, all features are unlocked for all users.
 * Feature usage is governed strictly by available credit balance.
 */
export function UpgradeGuard({ children }: UpgradeGuardProps) {
    return <>{children}</>;
}
