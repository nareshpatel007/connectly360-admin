import test from "node:test";
import assert from "node:assert/strict";

// 1. Navigation Route Matcher Logic
function normalizePathname(pathname) {
    if (!pathname) return "/";
    let clean = pathname.split("?")[0].split("#")[0].trim();
    if (clean.length > 1 && clean.endsWith("/")) {
        clean = clean.slice(0, -1);
    }
    return clean || "/";
}

function matchesPattern(path, pattern) {
    const cleanPattern = normalizePathname(pattern);
    if (cleanPattern.endsWith("/**")) {
        const prefix = cleanPattern.slice(0, -3);
        return path === prefix || path.startsWith(prefix + "/");
    }
    if (cleanPattern.endsWith("/*")) {
        const prefix = cleanPattern.slice(0, -2);
        return path === prefix || path.startsWith(prefix + "/");
    }
    const regexPattern = cleanPattern
        .replace(/:[a-zA-Z0-9_]+/g, "[^/]+")
        .replace(/\*\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
}

function resolveActiveNavigation(currentPath, sections) {
    const normalized = normalizePathname(currentPath);
    const leafItemsWithGroup = [];

    for (const section of sections) {
        for (const item of section.items) {
            if ("subItems" in item && Array.isArray(item.subItems) && item.subItems.length > 0) {
                for (const sub of item.subItems) {
                    leafItemsWithGroup.push({ leaf: sub, group: item });
                }
            } else {
                leafItemsWithGroup.push({ leaf: item, group: null });
            }
        }
    }

    let bestScore = 0;
    let bestMatch = null;

    for (const entry of leafItemsWithGroup) {
        const { leaf } = entry;
        const leafHref = normalizePathname(leaf.href);
        let score = 0;

        // 1. Exact match (Highest Priority)
        if (normalized === leafHref) {
            score = 2000 + leafHref.length;
        } 
        // 2. Explicit patterns match
        else if (leaf.patterns && leaf.patterns.some((pat) => matchesPattern(normalized, pat))) {
            score = 1500 + leafHref.length;
        }
        // 3. Child/Detail path match (only if NOT marked exact)
        else if (!leaf.exact && leafHref !== "/" && normalized.startsWith(leafHref + "/")) {
            score = 1000 + leafHref.length;
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (!bestMatch) {
        return {
            activeLeafId: null,
            activeLeafHref: null,
            expandedGroupId: null,
        };
    }

    return {
        activeLeafId: bestMatch.leaf.id || bestMatch.leaf.href,
        activeLeafHref: bestMatch.leaf.href,
        expandedGroupId: bestMatch.group ? bestMatch.group.id || bestMatch.group.label : null,
    };
}

// Mock Navigation Config
const TEST_NAV_SECTIONS = [
    {
        section: "OVERVIEW",
        items: [
            { id: "admin-dashboard", label: "Dashboard", href: "/dashboard", exact: true }
        ]
    },
    {
        section: "PLATFORM",
        items: [
            { id: "admin-users", label: "Users", href: "/users", patterns: ["/users/**"] },
            { id: "admin-workspaces", label: "Workspaces", href: "/workspaces", patterns: ["/workspaces/**"] }
        ]
    },
    {
        section: "BILLING",
        items: [
            { id: "admin-billing", label: "Billing", href: "/billing", exact: true },
            { id: "admin-billing-gateway", label: "Payment Gateway", href: "/billing/gateway", exact: true }
        ]
    },
    {
        section: "WHATSAPP",
        items: [
            { id: "admin-whatsapp", label: "WhatsApp WABA", href: "/whatsapp", exact: true },
            { id: "admin-whatsapp-messages", label: "Message Logs", href: "/whatsapp/messages", exact: true }
        ]
    }
];

test("Navigation Matcher: Exact match activates correct leaf", () => {
    const result = resolveActiveNavigation("/dashboard", TEST_NAV_SECTIONS);
    assert.equal(result.activeLeafId, "admin-dashboard");
    assert.equal(result.activeLeafHref, "/dashboard");
});

test("Navigation Matcher: Most specific leaf wins on overlapping parent/child routes", () => {
    // /billing/gateway should activate admin-billing-gateway, NOT admin-billing
    const gatewayResult = resolveActiveNavigation("/billing/gateway", TEST_NAV_SECTIONS);
    assert.equal(gatewayResult.activeLeafId, "admin-billing-gateway");
    assert.equal(gatewayResult.activeLeafHref, "/billing/gateway");

    // /billing should activate admin-billing
    const billingResult = resolveActiveNavigation("/billing", TEST_NAV_SECTIONS);
    assert.equal(billingResult.activeLeafId, "admin-billing");

    // /whatsapp/messages should activate admin-whatsapp-messages, NOT admin-whatsapp
    const whatsappResult = resolveActiveNavigation("/whatsapp/messages", TEST_NAV_SECTIONS);
    assert.equal(whatsappResult.activeLeafId, "admin-whatsapp-messages");
});

test("Navigation Matcher: Wildcard pattern matching activates parent leaf for detail routes", () => {
    const userDetail = resolveActiveNavigation("/users/452", TEST_NAV_SECTIONS);
    assert.equal(userDetail.activeLeafId, "admin-users");

    const workspaceDetail = resolveActiveNavigation("/workspaces/tenant-alpha-99", TEST_NAV_SECTIONS);
    assert.equal(workspaceDetail.activeLeafId, "admin-workspaces");
});

test("Navigation Matcher: Unknown routes return null active state", () => {
    const unknown = resolveActiveNavigation("/settings/unknown-path", TEST_NAV_SECTIONS);
    assert.equal(unknown.activeLeafId, null);
    assert.equal(unknown.activeLeafHref, null);
});

// 2. Token Normalization Logic
function sanitizeToken(raw) {
    if (!raw || raw === "null" || raw === "undefined") {
        return "";
    }
    return raw.trim();
}

test("Token Sanitization: Filters null, undefined string edge cases", () => {
    assert.equal(sanitizeToken("null"), "");
    assert.equal(sanitizeToken("undefined"), "");
    assert.equal(sanitizeToken(null), "");
    assert.equal(sanitizeToken(undefined), "");
    assert.equal(sanitizeToken("   valid_token_xyz   "), "valid_token_xyz");
});

// 3. API Proxy Endpoint Builder
function buildProxyEndpoint(pathArray, searchParamsString) {
    const endpoint = `/${pathArray.join("/")}`;
    return searchParamsString ? `${endpoint}?${searchParamsString}` : endpoint;
}

test("API Proxy: Forwarding path segments and preserving query parameters", () => {
    const path = ["admin", "whatsapp", "logs"];
    const search = "page=2&status=failed&search=wamid_123";
    const result = buildProxyEndpoint(path, search);

    assert.equal(result, "/admin/whatsapp/logs?page=2&status=failed&search=wamid_123");
});
