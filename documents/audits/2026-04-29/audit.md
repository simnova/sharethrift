# Codebase Audit — 2026-04-29

**Scope**: Full-repo baseline audit — all packages under `apps/`, `packages/cellix/`, `packages/sthrift/`, `packages/sthrift-verification/`
**Commits since last audit**: 50 (`33efee808 (2025-12-01)` → `HEAD 79bc7bb5a (2026-04-29)`, ~5 months)
**Prior audit**: _none — this is the inaugural baseline_

---

## Executive Summary

This is the first weekly audit for the ShareThrift monorepo and establishes the baseline across security, code quality, and performance dimensions. **One Critical finding requires immediate action**: four GraphQL appeal-request resolvers (two mutations, two queries) are deployed to production without any authentication or authorization checks, as evidenced by explicit `TODO SECURITY` comments in the code. Seven High-severity findings cover unbounded database queries that will cause OOM failures at scale, a silently non-functional event-handler integration, and an exception-as-control-flow pattern in auth code that can silently grant access during DB errors. The overall health of the codebase is **below target for a production system**: multiple core features (appeal-request retrieval, conversation messaging, event-driven side-effects) are stubbed out and silently non-functional. **No auto-fixes were applied by any analyzer during this run.** Note: the `DependencySecurity.json` report was not present in the session directory and could not be read; dependency security findings summarized in this report are drawn from the task-provided context only and should be validated independently.

---

## Trend vs Last Week

_No prior audit exists. This table establishes the baseline._

| Severity | Last Week | This Week | Δ |
|----------|-----------|-----------|---|
| Critical | —         | 1         | — |
| High     | —         | 6         | — |
| Medium   | —         | 12        | — |
| Low      | —         | 6         | — |
| Info     | —         | 0         | — |
| **Total**| —         | **25**    | — |

> One finding was deduplicated: `console.log` in production hot paths was flagged by both CodeQuality (medium, PII risk) and Performance (low, overhead). The merged entry is carried at **Medium** (higher severity wins). Raw finding counts per analyzer: CodeQuality 17, Performance 9, DependencySecurity not read.

**New this week**: 25 (baseline) | **Resolved since last week**: N/A | **Still open**: 25

---

## Auto-Fixed During This Audit

No safe mechanical fixes were applied by any analyzer during this audit run. All findings below represent open work.

---

## Critical Findings

### [CQ-H1] Appeal-request GraphQL resolvers deployed without authentication or authorization

**Severity**: Critical (promoted from analyzer-rated High — live security hole in deployed API)
**Location**: `packages/sthrift/graphql/src/schema/types/listing-appeal-request.resolvers.ts:29` and `user-appeal-request.resolvers.ts:27`
**Category**: Security / Missing Auth

All four appeal-request operations — `createListingAppealRequest`, `getAllListingAppealRequests`, `createUserAppealRequest`, `getAllUserAppealRequests` — are live in the deployed API with explicit `TODO SECURITY` comments and zero access control. Specifically:

- **`createListingAppealRequest` / `createUserAppealRequest`**: Do not verify (1) the caller is authenticated, (2) the `userId` in the payload matches the session user, or (3) the caller is actually blocked by `blockerId`. Any unauthenticated user can submit appeal requests on behalf of any other user.
- **`getAllListingAppealRequests` / `getAllUserAppealRequests`**: Do not verify admin role. Any caller can enumerate all appeal records.

**Recommendation**: Apply `requireAuthentication(context)` to the create mutations and `requireCurrentAdminUser(context)` to the getAll queries immediately — both helpers already exist in `resolver-helper.ts`. This must not be deferred; the endpoints are reachable today. Apply symmetrically to both `listing-appeal-request.resolvers.ts` and `user-appeal-request.resolvers.ts`.

---

## High Priority

### [PERF-H1] `getAllUsers()` loads the entire user collection into Node memory

**Severity**: High
**Location**: `packages/sthrift/persistence/src/datasources/readonly/user/personal-user/personal-user.read-repository.ts:73`; also `admin-user.read-repository.ts:79`
**Category**: Performance / Unbounded Query

Both `PersonalUserReadRepositoryImpl.getAllUsers()` and `AdminUserReadRepositoryImpl.getAllUsers()` call `this.getAll()` — an unbounded `find({})` — then apply text filtering, status filtering, sorting, and pagination entirely in JavaScript. At 50k users, every admin dashboard page-turn allocates and processes the full user collection on the Node.js heap. At 500k users, this will OOM an Azure Function.

**Recommendation**: Push all filtering, sorting, and pagination into MongoDB: use `$regex`/text index for search, `$in` for status, `.sort()`, `.skip()`, `.limit()`, and a parallel `countDocuments()` call.

---

### [PERF-H2] Home listings page fetches ALL listings; filtering and pagination are client-side

**Severity**: High
**Location**: `packages/sthrift/ui-sharethrift-route-root/src/components/pages/home/components/listings-page.container.tsx:26`
**Category**: Performance / Unbounded Query

`ListingsPageContainer` issues `itemListings` with no arguments → `queryAll` → `ItemListingReadRepositoryImpl.getAll()` → `find({})` with no limit. Every anonymous visitor downloads all listing documents (including `sharingHistory`, `reports`, `schemaVersion` fields not rendered on the page). Category, search, and pagination are handled client-side via `.filter()` + `.slice()`.

**Recommendation**: Migrate to a server-side paginated query (reuse the `adminListings` paginated resolver pattern). Pass `page`, `pageSize`, `searchText`, and `category` as GraphQL arguments and remove client-side filter/slice logic.

---

### [PERF-H3] `getPaged()` counts results by fetching all matching documents instead of `countDocuments()`

**Severity**: High
**Location**: `packages/sthrift/persistence/src/datasources/readonly/listing/item/item-listing.read-repository.ts:149`
**Category**: Performance / Unbounded Query

`ItemListingReadRepositoryImpl.getPaged()` obtains the total document count via `this.mongoDataSource.find(query).then((result) => result?.length ?? 0)` — an unlimited find that scans every matching document just to count them. The page data is fetched separately with a proper limit, but the count query doubles every admin/sharer dashboard request's DB cost.

**Recommendation**: Replace with `this.model.countDocuments(query).exec()` and run it in parallel with the data query via `Promise.all`.

---

### [CQ-H2] Event-handler integration module is a no-op shell — all domain/integration events are silently dropped

**Severity**: High
**Location**: `packages/sthrift/event-handler/src/handlers/integration/index.ts:6`; `domain/index.ts:4`
**Category**: Code Quality / Dead Code

`RegisterIntegrationEventHandlers` contains only `console.log(domainDataSource)`. `RegisterDomainEventHandlers` is an empty stub. The event bus is wired into the startup path. Any events that should trigger side-effects (notifications, projections, audit trails) are silently discarded.

**Recommendation**: Implement the handlers, or remove the wiring and replace with `throw new Error('Integration event handlers not implemented')` so the gap is visible in CI.

---

### [CQ-H3] Appeal-request `getAll` always returns an empty list — feature is silently non-functional

**Severity**: High
**Location**: `packages/sthrift/persistence/src/datasources/readonly/appeal-request/listing-appeal-request/listing-appeal-request.read-repository.ts:51`; `user-appeal-request.read-repository.ts:51`
**Category**: Code Quality / Stub / Workaround

Both appeal-request read repositories implement `getAll` as `Promise.resolve({ items: [], total: 0, ... })`. Admin operators querying all appeal requests always receive an empty table with no error.

**Recommendation**: Implement the MongoDB query using the `reservation-request.read-repository.ts` pagination pattern as a reference. This pairs with [CQ-H1] — fix auth first, then implement the data layer.

---

### [CQ-H4] Exception-as-control-flow in auth helper can silently grant public access during DB errors

**Severity**: High
**Location**: `packages/sthrift/graphql/src/schema/resolver-helper.ts:27`; also `:63`, `:87`
**Category**: Code Quality / Security / Workaround

`getUserByEmail`, `requireCurrentAdminUser`, and `PopulateConversationParticipantFromField` use `try/catch` to distinguish "user not found in AdminUser table" from "user not found in PersonalUser table." A genuine DB connectivity error or timeout is caught, treated as "user not found," and `currentViewerIsAdmin` returns `false` — meaning a flaky database can quietly grant public access to any resolver guarded by that boolean.

**Recommendation**: Redesign so `queryByEmail` returns `null` for not-found (rather than throwing). Infrastructure exceptions should propagate to the caller as GraphQL errors.

---

## Medium / Low / Info

### Medium Findings

| ID | Title | Location | Category |
|----|-------|----------|----------|
| CQ-M1 | 10+ files byte-for-byte identical between `ui-admin-route-root` and `ui-sharethrift-route-root` | `ui-admin-route-root/…/conversation-box.container.tsx:1` | Duplication |
| CQ-M2 | Arch-unit `checkCodeMetrics` / `checkCodeQuality` are permanently disabled stubs | `packages/cellix/arch-unit-tests/src/checks/code-metrics.ts:15` | Dead Code |
| CQ-M3 | Conversation messages always return empty — messaging integration is non-functional | `packages/sthrift/persistence/…/conversation.domain-adapter.ts:214` | Workaround |
| CQ-M4 | `as unknown as ClientSession` shim in appeal-request read repositories | `…/user-appeal-request.read-repository.ts:34` | Workaround |
| CQ-M5 | `console.log` in hot resolver paths logs PII (`aboutMe`, payment args) | `packages/sthrift/graphql/…/personal-user.resolvers.ts:63` | PII / Perf _(merged with PERF-L1)_ |
| CQ-M6 | `message.info('TODO: Navigate to user profile…')` surfaces placeholder text to admin users | `…/admin-users-table.container.tsx:133` | UX / Workaround |
| CQ-M7 | Broad `error as Error` cast in 14 catch blocks — non-Error throws yield `undefined` error messages | `…/listing-appeal-request.resolvers.ts:76` | Type Safety |
| CQ-M8 | Hardcoded mock `PLAN_OPTIONS` array in production `settings-view.tsx` | `…/settings-view.tsx:27` | Workaround |
| PERF-M1 | N+1 GraphQL field resolvers for `sharer`, `reserver`, `listing` (up to 120 extra DB queries per page) | `packages/sthrift/graphql/src/schema/resolver-helper.ts:134` | N+1 |
| PERF-M2 | Missing compound indexes on `ReservationRequest` and `ItemListing` high-cardinality query fields | `…/reservation-request.model.ts:18` | Missing Index |
| PERF-M3 | `getListingRequestsBySharerId` does unbounded pre-query to collect listing IDs for a sharer | `…/reservation-request.read-repository.ts:219` | N+1 / Two-step Query |
| PERF-M4 | `ApolloClient` is recreated on every OAuth token refresh, wiping `InMemoryCache` | `packages/sthrift/ui-shared/src/shared/apollo-connection.tsx:97` | Client Performance |

**Recommended fix for CQ-M5 / PERF-L1 (merged)**: Replace all `console.log/warn/error` in production resolver paths with the project's OTEL tracer or a structured logger. Immediately audit `processPayment`, `refundPayment`, and `update.ts:77` for PII — these log billing details and `aboutMe` content to the log stream today.

**Recommended fix for PERF-M2**: Add the following Mongoose indexes:
```
ReservationRequestSchema.index({ listing: 1, state: 1 })
ReservationRequestSchema.index({ reserver: 1, state: 1 })
ItemListingSchema.index({ sharer: 1 })
ItemListingSchema.index({ state: 1 })
```

### Low Findings

| ID | Title | Location |
|----|-------|----------|
| CQ-L1 | Near-identical `createValidatedStringAccessors` utility in domain and persistence layers | `packages/sthrift/domain/…/admin-user.helpers.ts:1` |
| CQ-L2 | `versionKey: 'version'` commented out in Role model — inconsistent schema vs other models | `…/role.model.ts:8` |
| CQ-L3 | `EMAIL_PATTERN` regex not unicode-compliant (live TODO in shared validation) | `…/patterns.ts:8` |
| CQ-L4 | Unsafe string-to-union downcast for appeal-request `state` — invalid values accepted at type level | `…/listing-appeal-request.resolvers.ts:91` |
| CQ-L5 | Bare `@ts-ignore` without rationale in `test-utils/index.ts` — should be `@ts-expect-error` | `packages/cellix/test-utils/src/index.ts:9` |
| PERF-L2 | Text search uses unindexed `$regex` on 4 fields (full-collection scan per search keystroke) | `…/item-listing.read-repository.ts:105` |

---

## Per-Agent Summaries

### DependencySecurity

> ⚠️ **Report not available** — `DependencySecurity.json` was not present in the session reports directory. The findings below are drawn from the task-provided context only and have not been validated from a machine-readable report.

From context: 16 findings total — 10 obsolete `.snyk` waivers that should be cleaned up (vulnerabilities they covered are fixed upstream), 2 high-severity items (axios pinned at 1.15.0 with known CVEs; lodash waivers with a fix now available), 2 waivers confirmed still needed, and 2 unclear. No auto-fixes were applied. **Action required**: run the dependency security agent in isolation to produce a machine-readable report, then address the 2 high-severity upgrade items.

### CodeQuality

17 findings across 62 files reviewed. The most critical items are two live security holes (missing auth on appeal resolvers, exception-as-control-flow granting access during DB errors). The codebase carries a significant backlog of "TODO" stubs that are silently non-functional at runtime: event handlers, conversation message loading, appeal-request pagination, and plan-option data sourcing are all stubs. Code duplication between the two UI route packages (10+ identical files) is a maintainability risk that will compound bug-fix effort. PII exposure via `console.log` in production resolver paths is a compliance risk that warrants immediate audit.

### Performance

9 findings across 42 files reviewed. Three high-severity unbounded-query patterns will cause linear memory growth and eventual OOM at scale: the home page fetches every listing for every visitor, both admin user repositories load entire user collections for every paginated request, and the paginated listing count path performs a redundant full-table scan. The N+1 resolver pattern (up to 120 DB round-trips per page load) and missing Mongoose indexes compound the query overhead. The Apollo client being recreated on token refresh causes unnecessary full-data refetches every 15–30 minutes for active sessions.

---

## Recommended Action Plan

Priority order: fix what's live and broken in production first, then scalability, then maintainability.

1. **[Immediate — this sprint] Secure the appeal-request API** (`CQ-H1`)
   Apply `requireAuthentication` to create mutations and `requireCurrentAdminUser` to getAll queries in both `listing-appeal-request.resolvers.ts` and `user-appeal-request.resolvers.ts`. Ship as a hotfix PR.

2. **[This sprint] Audit and remove PII-leaking `console.log` calls** (`CQ-M5` / `PERF-L1`)
   Audit `processPayment`, `refundPayment`, and `personal-user.resolvers.ts` / `update.ts` for PII in log output. Replace all production `console.log` with structured OTEL logging. This is a compliance risk today.

3. **[This sprint] Fix exception-as-control-flow in auth helpers** (`CQ-H4`)
   Redesign `queryByEmail` to return `null` on not-found. DB errors must propagate. This closes the silent-grant-on-DB-failure vulnerability.

4. **[This sprint] Add MongoDB indexes** (`PERF-M2`, `PERF-L2`)
   Add compound indexes on `ReservationRequest(listing, state)`, `ReservationRequest(reserver, state)`, `ItemListing(sharer)`, `ItemListing(state)`, and a text index on `ItemListing(title, description, category, location)`. Zero-downtime: indexes build in the background on MongoDB.

5. **[This sprint] Fix the three unbounded-query OOM hazards** (`PERF-H1`, `PERF-H2`, `PERF-H3`)
   Push filtering/sort/pagination into MongoDB for `getAllUsers()` (both repos), migrate the home listings page to a server-side paginated GraphQL query, and replace the count `find()` with `countDocuments()`. Group these into a single "pagination hardening" PR.

6. **[Next sprint] Implement appeal-request read repository and event handlers** (`CQ-H3`, `CQ-H2`)
   Implement `getAll` pagination for both appeal-request read repositories (mirrors `reservation-request.read-repository.ts`). Separately, implement or explicitly tombstone the integration/domain event handlers so the gap is visible in CI.

7. **[Next sprint] Introduce DataLoader for N+1 GraphQL resolvers** (`PERF-M1`)
   Add per-request DataLoader instances for `PersonalUser.getById`, `AdminUser.getById`, and `ItemListing.getById`. This eliminates up to 120 extra DB round-trips per page for conversation and reservation-request lists.

8. **[Next sprint] Fix ApolloClient recreation on token refresh** (`PERF-M4`)
   Move the `ApolloClient` instance to a `useRef` or module-level singleton. Inject the current token dynamically inside the auth link closure.

9. **[Within the month] Consolidate duplicated UI components** (`CQ-M1`)
   Move the 10+ identical files from `ui-admin-route-root` and `ui-sharethrift-route-root` to `packages/sthrift/ui-shared`. Add an arch-unit test to prevent regression.

10. **[Within the month] Address dependency security findings** (DependencySecurity — pending report)
    Once the DependencySecurity report is re-run: upgrade axios past the pinned 1.15.0, resolve lodash waivers where a fix is available, and prune the 10 obsolete `.snyk` waivers.

11. **[Backlog] Harden type safety and clean up workarounds** (`CQ-M7`, `CQ-L3`, `CQ-L4`, `CQ-L5`, `CQ-M4`, `CQ-M8`, `CQ-M6`, `CQ-L2`, `CQ-M2`)
    Extract a shared `extractErrorMessage(e: unknown)` utility and apply it to all 14 catch blocks. Fix the unicode email regex. Add state validation for appeal-request inputs. Upgrade `@ts-ignore` to `@ts-expect-error`. Wire `PLAN_OPTIONS` to the GraphQL API. Replace TODO toast messages. Document or resolve the Role model `versionKey` decision. Activate or remove the arch-unit code-metric stubs.

---

## Appendix: Raw Analyzer Reports

| File | Status | Notes |
|------|--------|-------|
| `scope.json` | ✅ completed | 50 commits, 9 contributors, 2062 files changed, 158k lines added |
| `CodeQuality.json` | ✅ completed | 17 findings (4H, 8M, 5L) across 62 files |
| `Performance.json` | ✅ completed | 9 findings (3H, 4M, 2L) across 42 files |
| `DependencySecurity.json` | ❌ **not found** | File was not present in the session reports directory. Findings from this analyzer are unavailable for this audit. Re-run the DependencySecurity agent independently. |

_All findings in this audit are traceable to the analyzer reports above. No findings were invented. One finding was deduplicated (console.log PII/overhead flagged by both CodeQuality at medium and Performance at low; carried as Medium). The Critical severity on [CQ-H1] was promoted by the synthesizer from the analyzer-rated High because the endpoints are live in production with no access control._
