# Connectly360 Admin Panel Design & Architecture Audit

## 1. Existing Client Application Architecture

The Connectly360 ecosystem consists of 4 complementary applications:
- **`connectly360-app`**: The primary tenant/customer workspace application (Next.js 16.2.9, React 19.2.4, Tailwind CSS v4, Lucide React, Radix UI, TanStack React Query, React Hook Form, Zod, Sonner).
- **`connectly360-backend`**: Centralized Laravel 10 / PHP 8.1+ REST API running on MySQL. Handles tenancy, user management, authentication, WhatsApp Cloud API integration, credits ledger, billing, and system operations.
- **`connectly360-website`**: Public marketing and landing website.
- **`connectly360-admin`**: Standalone platform administration panel for super administrators and staff.

### API Proxy & Communication
`connectly360-app` routes all client API calls through Next.js App Router route handlers (`app/api/[...path]/route.ts`) which invoke `lib/apiProxy.ts`.
- `apiProxy.ts` forwards requests to `http://127.0.0.1/connectly360/connectly360-backend/public/api`.
- Injects `X-Api-Token: API_TOKEN` server-side, protecting internal secrets.
- Forwards client `Authorization: Bearer <jwt_token>` and `Cookie` headers seamlessly.
- Connectly360 Admin utilizes the exact same proxy architecture via `connectly360-admin/lib/apiProxy.ts` and `connectly360-admin/app/api/[...path]/route.ts`.

---

## 2. Actual Design Tokens and Source Files

Verified from `c:/xampp/htdocs/connectly360/connectly360-app/app/globals.css`:

### Typography
- **Primary Font**: `Inter` (`--font-sans: var(--font-inter), sans-serif;`)
- **Display / Heading Font**: `Jost` (`--font-jost`)
- **Monospace Font**: `JetBrains Mono` (`--font-mono`)
- **Root Font Size**: `15px` (`html { font-size: 15px; }`)
- **Border Radius**: `--radius: 0.625rem` (10px) with Tailwind scale (`--radius-sm: 6px`, `--radius-md: 8px`, `--radius-lg: 10px`, `--radius-xl: 14px`).

### Color Palette (HSL & Hex)
- **Primary Teal**: `173 50% 37%` (`#2F8F83`)
  - Primary Foreground: `0 0% 100%` (`#FFFFFF`)
  - Primary Hover: `173 53% 31%` (`#267A70`)
  - Primary Soft: `#E8F6F3`
  - Primary Subtle: `#F2FAF8`
  - Primary Border: `#BFE4DD`
- **Background**: `210 20% 98%` (`#F7F9FA`)
- **Foreground (Text)**: `221 38% 15%` (`#172033`)
- **Surface**: `0 0% 100%` (`#FFFFFF`)
- **Borders & Inputs**: `216 20% 92%` (`#E5E9EE`)
- **Cards**: Background `0 0% 100%`, Border `216 20% 92%`, Text `221 38% 15%`
- **Sidebar**:
  - Background: `0 0% 100%` (`#FFFFFF`)
  - Foreground: `215 16% 40%` (`#536174`)
  - Active Accent: `167 47% 94%` (`#EAF7F4`)
  - Active Accent Foreground: `173 54% 31%` (`#24796F`)
  - Border: `216 20% 92%` (`#E5E9EE`)
- **Status Colors**:
  - Success: `#2E9B72` / Bg: `#EAF8F2`
  - Warning: `#D79A2B` / Bg: `#FFF7E6`
  - Danger / Destructive: `0 63% 61%` (`#D95C5C`) / Bg: `#FFF0F0`
  - Info: `#4F7FCB` / Bg: `#EEF4FF`

---

## 3. Reusable Components & Locations

Located in `components/ui/` (identical Radix/Tailwind components across both client and admin):
- `Button`, `Input`, `Label`, `Card`, `Badge`, `DropdownMenu`, `Dialog`, `Tooltip`, `Collapsible`, `Select`, `Checkbox`, `Switch`, `Table`, `Tabs`, `Skeleton`, `Sonner`, `StatCard`, `StatusBadge`, `EmptyState`, `ErrorState`.
- Authentication Components in `components/auth/`:
  - `AuthInput`: Floating error, accessible labels, clear borders.
  - `AuthPasswordInput`: Password visibility toggle, accessibility, validation errors.
  - `AuthSplitLayout`: Responsive split screen with product branding on the left and form card on the right.
  - `AuthDivider`: Clean separator.

---

## 4. Existing Authentication & Authorization Flow

### Backend Architecture
- **Tokens**: JWT token signed with `JWT_SECRET`, encoded in `AuthController` and decoded by `VerifyApiToken` and `VerifyAdmin` middleware.
- **Admin Guard / Verification (`VerifyAdmin.php`)**:
  - Extracts Bearer token.
  - Decodes `user_id`.
  - Verifies user in database has `status === 'active'`.
  - Verifies admin role: `is_admin == 1` OR `role` is one of `['super_admin', 'owner', 'admin']`.
  - Rejects unauthorized users with `403 Access denied`.
- **Admin Login Endpoint**: `POST /api/admin/auth/login` (Controller: `AdminController::login`). Returns `{ status: true, data: { access_token, user_id, name, email, role, tenant_id } }`.
- **Password Reset Endpoints**:
  - `POST /api/auth/forgot-password` (Controller: `AuthController::forgot_password`). Accepts `{ email }`.
  - `POST /api/auth/reset-password` (Controller: `AuthController::reset_password`). Accepts `{ token, password }`.
- **Profile / Session Introspection**: `GET /api/auth/profile` (Controller: `AuthController::profile`).

### Frontend Token Storage
- Admin token is persisted in `localStorage` under `"admin_auth_token"`.
- Context `useAuth()` validates the user on mount and route changes, strictly enforcing redirect to `/login` for unauthenticated visitors and `/dashboard` for logged-in admins.

---

## 5. Existing API Integration Pattern

The frontend executes API calls through the internal Next.js proxy route `/api/...`, e.g.:
```ts
const res = await fetch("/api/admin/dashboard", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});
```
The proxy handles forwarding headers (`X-Api-Token`, `Authorization`, `Cookie`) and streaming responses back.

---

## 6. Proposed Admin Project Structure

```text
connectly360-admin/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              # Clean minimal auth container with ambient accents
│   │   ├── login/page.tsx          # Split-screen Admin Login
│   │   ├── forgot-password/page.tsx # Admin Password Recovery
│   │   └── reset-password/page.tsx  # Admin Password Reset (token-based)
│   ├── dashboard/page.tsx          # Platform Overview dashboard with real metrics
│   ├── globals.css                 # Exact design tokens matching client app
│   ├── layout.tsx                  # Root layout with Inter font, Providers & AuthProvider
│   └── page.tsx                    # Redirects to /dashboard
├── components/
│   ├── auth/                       # AuthSplitLayout, AuthInput, AuthPasswordInput
│   ├── admin-layout.tsx            # Authenticated admin layout (Sidebar, Header, CommandPalette)
│   ├── admin-page-header.tsx       # Reusable page header with title, badge & actions
│   ├── ui/                         # Shared Radix/Tailwind components
│   └── ...
├── lib/
│   ├── admin-navigation-config.ts  # Centralized admin navigation definition
│   ├── navigation-matcher.ts       # Specificity-based route matching
│   ├── auth-context.tsx            # Admin authentication context & route guards
│   ├── apiProxy.ts                 # Next.js API proxy to Laravel backend
│   └── utils.ts
```

---

## 7. Files to Reuse, Create, and Protect

- **Files to reuse / update in `connectly360-admin`**:
  - `app/globals.css`: Aligned 100% with `connectly360-app` tokens, root 15px font size, and Inter typography.
  - `app/layout.tsx`: Configured with font variables, metadata, and clean wrapping.
  - `components/auth/`: Created for admin authentication matching client design.
  - `app/(auth)/login/page.tsx`: Updated with split layout, validation, and real `/api/admin/auth/login` endpoint.
  - `app/(auth)/forgot-password/page.tsx`: Updated with real `/api/auth/forgot-password` endpoint and split layout.
  - `app/(auth)/reset-password/page.tsx`: Implemented to support token-based reset via `/api/auth/reset-password`.
  - `components/admin-layout.tsx`: Polished sidebar, header, active states, and responsive drawer.
  - `app/dashboard/page.tsx`: Connected to real `/api/admin/dashboard` metrics with skeletons and empty states.
- **Files that must not be modified**:
  - `connectly360-app/` client files (remain intact).
  - `connectly360-website/` (remains intact).
  - Database schema / tables without necessity.
