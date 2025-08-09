# JobMate2 Performance & Stability Roadmap

This document outlines the next phases to optimize performance, stabilize auth/session handling, and improve developer experience for JobMate2 (Next.js 14 App Router + Supabase).

## Completed (Baseline)

- __Assistant performance__: SWR caching, auth-gated init, debounced suggestions, batched logging in `src/contexts/AssistantContext/AssistantContext.tsx`.
- __Conditional mounting__: Gate `AIAdaptivePanel` by `isAuthenticated` in `src/components/layout/client-layout.tsx`.
- __Homepage optimizations__: Lazy-load map, defer waitlist popup in `src/components/pages/unified-home-page-final.tsx`.
- __API type safety__: Zod-validated bodies with inferred types; `createApiHandler` forwards `params`.
- __Auth init__: Abortable, debounced `/api/auth/me` with fast-path from localStorage in `src/contexts/AuthContext.tsx`.
- __SSR hydration__: Server reads `auth_token` and hydrates `AuthProvider` via `src/app/layout.tsx` + `src/lib/server-auth.ts`. No initial auth probe on first paint.
- __Supabase client__: Factory-only clients in `src/lib/supabase/client.ts` to prevent "Invalid URL" at module load.

---

## Phase 4 — API Consistency & Error Normalization

- __Motivation__: Clients see varying error shapes (401/403). Normalize for simpler handling and fewer edge bugs.
- __Tasks__:
  - __[utils]__ Add helpers in `src/app/api/utils.ts`:
    - `jsonUnauthorized(message = 'Unauthorized')`
    - `jsonForbidden(message = 'Forbidden')`
    - `jsonOk<T>(data: T)`
  - __[routes]__ Update `src/app/api/**` to use helpers for 401/403/200.
- __Success metrics__:
  - 100% API routes return consistent JSON shape.
  - Client-side auth error handling simplified (fewer branches).
- __Risks__:
  - Missing edge routes; mitigate with grep pass and PR review.

## Phase 5 — Middleware & Route Protection

- __Motivation__: Align auth at the edge to prevent SSR/CSR mismatches and reduce wasted rendering.
- __Tasks__:
  - Create `middleware.ts` to check `auth_token` for protected paths (`/app`, `/dashboard`, `/messages`, etc.).
  - Redirect unauthenticated to `/login` with `nextUrl.searchParams.set('next', pathname)`.
  - Allow public assets/APIs.
- __Success metrics__:
  - No unauthenticated SSR of private pages.
  - Reduced client-side redirects.
- __Risks__:
  - Overblocking APIs; add explicit allowlist and tests.

## Phase 6 — Network Call De-duplication & Caching Strategy

- __Motivation__: Reduce redundant fetches across components; unify caching behavior.
- __Tasks__:
  - Catalog high-frequency fetchers (SWR keys) across pages.
  - Introduce global SWR config in `_app` equivalent (client root) with sensible defaults (`dedupingInterval`, `revalidateOnFocus`, `errorRetryInterval`).
  - For stable resources (e.g., preferences), set long `dedupingInterval` and manual revalidation on mutations.
- __Success metrics__:
  - >30% reduction in duplicate network requests on navigation.
  - Improved TTI (time-to-interactive) on logged-in pages.

## Phase 7 — Rendering Optimization & Code Splitting

- __Motivation__: Reduce JS execution and layout thrash on initial render.
- __Tasks__:
  - Audit large components for `dynamic(() => import(...), { ssr: false })` where acceptable (non-critical UI).
  - Split `AIAdaptivePanel` heavy submodules and only load when opened.
  - Use `React.memo` and stable callbacks for frequently re-rendered lists.
- __Success metrics__:
  - Smaller initial JS bundle for common pages.
  - Fewer long tasks (>50ms) in Performance tab.

## Phase 8 — Realtime & Subscription Hygiene

- __Motivation__: Prevent memory leaks and idle CPU/network usage.
- __Tasks__:
  - Inventory Supabase realtime subscriptions; ensure unsubscribe on unmount and panel close.
  - Lazy-init realtime only when user navigates to screens needing it.
- __Success metrics__:
  - Subscriptions only active when corresponding UI is visible.
  - Lower background CPU in Performance profiles when idle.

## Phase 9 — Observability & Metrics

- __Motivation__: Quantify improvements and guard against regressions.
- __Tasks__:
  - Add lightweight client metrics (e.g., `performance.mark/measure`, log counts of key network calls).
  - Create a simple `/debug/metrics` page to inspect counters locally.
- __Success metrics__:
  - Baseline charts for network calls and TTI per route.
  - PRs include metrics deltas for targeted pages.

## Phase 10 — CI/CD & DX Improvements

- __Motivation__: Catch issues earlier and speed up developer feedback loops.
- __Tasks__:
  - Typecheck and build in CI with `NEXT_TELEMETRY_DISABLED=1`.
  - Add Jest unit tests for auth utils (`server-auth`, token verify) and API utils (`jsonUnauthorized`, etc.).
  - Add Playwright smoke tests for protected routes redirect behavior (middleware).
- __Success metrics__:
  - CI fails fast on route/auth regressions.
  - Fewer manual QA cycles for auth flows.

---

## Implementation Notes

- __Files referenced__:
  - `src/components/layout/client-layout.tsx`
  - `src/contexts/AuthContext.tsx`
  - `src/contexts/AssistantContext/AssistantContext.tsx`
  - `src/app/layout.tsx`
  - `src/lib/server-auth.ts`
  - `src/lib/supabase/client.ts`
  - `src/app/api/utils.ts` (helpers to be added)
- __Env__:
  - Ensure `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

## Rollout Strategy

- __Order__:
  1. Phase 4 (low-risk refactor)
  2. Phase 5 (middleware) with targeted allowlist and smoke tests
  3. Phase 6–7 (perf), starting with most trafficked pages
  4. Phase 8 (realtime) once perf baselines exist
  5. Phase 9–10 (metrics + CI)
- __Release__: Feature-flag risky shifts; enable per route.

## Tracking Metrics (suggested)

- __Network__: total requests, duplicated keys avoided (SWR)
- __Performance__: TTI, total JS execution time, long tasks count
- __Auth__: time to authenticated render, 401/403 counts, redirect loops
- __Realtime__: active subscriptions when idle vs active

---

## Open Questions

- Should we transition to NextAuth session for SSR across all private routes or keep JWT cookie? (Currently using `auth_token` + SSR decode.)
- Which routes are considered private vs public beyond the obvious dashboard/messages?
