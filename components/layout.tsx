"use client";

/**
 * Connectly360 Admin Layout Re-export
 *
 * Forwards to the centralized, modular AdminLayout implementation in ./admin-layout.tsx
 * which provides:
 * - Centralized navigation configuration (@/lib/admin-navigation-config)
 * - Single active leaf route resolution (@/lib/navigation-matcher)
 * - Role-based navigation guards
 * - Responsive desktop collapsible sidebar & mobile drawer
 * - Command palette (Ctrl+K) & real-time notification integration
 */
export { AdminLayout as default, AdminLayout } from "./admin-layout";
