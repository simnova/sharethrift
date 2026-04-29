# Codebase Audit — 2026-04-29

**Scope**: Full repository weekly audit — sharethrift monorepo (pnpm/Turborepo, TypeScript, Azure Functions, Apollo GraphQL, MongoDB/Mongoose, React)
**Commits since last audit**: 7 (`e3857ff74..7ad2eded4`) — 41 files changed, +2 059 / −776 lines (2026-04-22 → HEAD)
**Prior audit**: _none — this is the baseline_

---

## Executive Summary

This is the **first weekly audit** for the sharethrift monorepo and establishes the baseline for all future trend comparisons. Across three analysis domains (Dependency Security, Code Quality, and Performance) the audit surfaced **1 Critical, 7 High, 9 Medium, 5 Low, and 4 Info** findings (26 total). The dominant risk areas are **unenforced access control in the GraphQL layer** and **unbounded MongoDB queries that will degrade or crash the API under real load**. One safe mechanical fix was automatically applied during this audit: nine obsolete Snyk ignore waivers were pruned from `.snyk`, leaving only the five live waivers that are still needed. No production secrets were exposed and no breaking build changes were detected. The team should address the single Critical finding (unauthenticated admin endpoint) and the dead permissions middleware before next release.

---

## Trend vs Last Week

_No prior audit exists — the following table is the baseline._

| Severity | Last Week | This Week | Δ |
|----------|-----------|-----------|---|
| Critical | —         | 1         | baseline |
| High     | —         | 7         | baseline |
| Medium   | —         | 9         | baseline |
| Low      | —         | 5         | baseline |
| Info     | —         | 4         | baseline |

**New this week**: 26 (all baseline) | **Resolved since last week**: — | **Still open**: 26

---

## Auto-Fixed During This Audit

| File | Fix | Applied By |
|------|-----|------------|
| `.snyk` | Removed 9 obsolete ignore waivers for packages whose vulnerable versions are no longer present in the lockfile: `node-forge`, `express`, `@pnpm/npm-conf`, `undici`, `qs`, `ajv`, `minimatch`, `yauzl`, `svgo`. Snyk still passes with 5 remaining live waivers. | DependencySecurity |

---

## Critical Findings

### CRIT-1 · `adminListings` and `unblockListing` resolvers have no authentication or role check

**Source**: CodeQuality | **File**: `packages/sthrift/graphql/src/schema/types/item-listing.resolvers.ts` lines 62, 111

**Description**: The `adminListings` resolver serves paginated listing data intended for the admin dashboard but performs zero authentication — no `requireCurrentAdminUser`, no JWT verification, nothing. A code comment explicitly acknowledges this: `// Admin-note: role-based authorization should be implemented here (security)`. The same gap exists on `unblockListing` (line 111). Any unauthenticated HTTP client can call these queries over the public API and receive or mutate the full listing dataset.

**Recommendation**: Add `await requireCurrentAdminUser(context)` at the top of both `adminListings` and `unblockListing` before any application-service call, matching the pattern already used in `admin-user.resolvers.ts`. Add an integration test asserting that unauthenticated callers receive a 401/403.

---

## High Priority

### HIGH-1 · `graphql-middleware` permissions layer is built but never wired to Apollo Server

**Source**: CodeQuality | **File**: `packages/sthrift/graphql/src/init/handler.ts:26`

`resolver-builder.ts` collects all `*.permissions.{js,cjs,mjs}` files and exports a `permissions` Resolvers object, but `handler.ts` calls `applyMiddleware(combinedSchema)` with **no middleware arguments**. The entire permission rule layer is silently dead at runtime. Any resolver relying on those permission files for access control has no enforcement.

**Recommendation**: Either pass `applyMiddleware(combinedSchema, permissions)` as intended, or remove the permissions infrastructure and document that inline resolver checks are the canonical pattern. This is currently misleading infrastructure — it looks like a safety net but provides none.

---

### HIGH-2 · `listingType` setter on `ItemListing` aggregate bypasses the visa permission model

**Source**: CodeQuality | **File**: `packages/sthrift/domain/src/domain/contexts/listing/item/item-listing.aggregate.ts:394`

Every other mutable property on `ItemListing` guards its setter with `this.visa.determineIf(...)`. The `listingType` setter has no guard — any code holding an `ItemListing` reference can change `listingType` unconditionally, silently bypassing the DDD permission model.

**Recommendation**: Apply `if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing))` identical to the `title` setter (line 220). If `listingType` is internal-only, make it `private set` or restrict it to factory methods.

---

### HIGH-3 · Seven CyberSource `PaymentService` methods unconditionally throw `"Method not implemented"`

**Source**: CodeQuality | **File**: `packages/cellix/service-payment-cybersource/src/index.ts:1072`

`createPlan`, `listOfPlans`, `getPlan`, `createSubscription`, `updatePlanForSubscription`, `listOfSubscriptions`, and `suspendSubscription` satisfy the interface at compile time but unconditionally throw at runtime. Any code path that reaches these methods will produce an unhandled exception in production.

**Recommendation**: Implement or remove each method. For truly out-of-scope methods, add a `// NOT_IMPLEMENTED: tracked in <issue-link>` comment and add a guard in the service factory to ensure application code never calls them. Do not rely solely on TypeScript satisfying the interface.

---

### HIGH-4 · N+1 DB queries from GraphQL field resolvers (PopulateUserFromField / PopulateItemListingFromField / PopulateConversationParticipantFromField)

**Source**: Performance | **File**: `packages/sthrift/graphql/src/schema/resolver-helper.ts:134`

Three field-resolver helpers each issue one individual `queryById` DB call per parent object. `PopulateConversationParticipantFromField` tries AdminUser then PersonalUser, firing up to 2N queries per field. For a user with 20 conversations needing `sharer + reserver + listing` populated, 60–120 additional MongoDB round-trips fire per request.

**Recommendation**: Introduce DataLoader (or Apollo's built-in batching) for `PersonalUser`, `AdminUser`, and `ItemListing` lookups. A `getByIds(ids)` method backed by `{ _id: { $in: ids } }` would reduce N lookups to 1 per request batch.

---

### HIGH-5 · `getAllUsers` loads entire User collection into Node.js memory before filtering/sorting/paginating

**Source**: Performance | **File**: `packages/sthrift/persistence/src/datasources/readonly/user/personal-user/personal-user.read-repository.ts:73`

`PersonalUserReadRepositoryImpl.getAllUsers` calls `find({})` with no filter or limit and performs search, status filtering, sorting, and pagination entirely in JavaScript. At 10 000 users this consumes significant process heap; at 100 000 it will OOM the function.

**Recommendation**: Push filtering, sorting, and pagination into MongoDB: `find({ 'account.email': { $regex: … } }).sort(…).skip(offset).limit(pageSize)` with a separate `countDocuments(filter)` call. Add a compound index on `{ 'account.email': 1, isBlocked: 1 }`.

---

### HIGH-6 · `itemListings` query returns all listing documents with no limit or pagination

**Source**: Performance | **File**: `packages/sthrift/graphql/src/schema/types/item-listing.resolvers.ts:53`

The `itemListings` resolver calls `queryAll({})` which flows to a raw `find({})` with no filter, sort, or limit. The entire `Listing` collection (including full description, image arrays, history) is returned to the caller in one unbounded payload.

**Recommendation**: Either remove the endpoint (paginated `adminListings` / `myListingsAll` already exist for the known consumers) or add mandatory `page`/`pageSize` arguments with a hard cap (e.g. `limit(500)`). _Note: this resolver also carries the auth gap flagged in CRIT-1._

---

### HIGH-7 · Pagination total count computed by full collection scan instead of `countDocuments`

**Source**: Performance | **File**: `packages/sthrift/persistence/src/datasources/readonly/listing/item/item-listing.read-repository.ts:149`

`ItemListingReadRepositoryImpl.getPaged` computes the `total` by calling `this.mongoDataSource.find(query)` (no limit) and reading `.length` — loading all matching documents into memory just to count them. This doubles latency and memory usage on every paginated listing request.

**Recommendation**: Expose `countDocuments(query)` on `MongoDataSource` and use it here. The write-side `ItemListingRepository.getBySharerIDWithPagination` already uses `Promise.all([find(…), countDocuments(…)])` correctly — align the read-side.

---

## Medium Priority

| ID | Source | File | Title |
|----|--------|------|-------|
| MED-1 | CodeQuality | `packages/sthrift/graphql/src/schema/types/personal-user.resolvers.ts:114` | `personalUserUpdate` missing admin permission check — any authenticated user may attempt to update another user's record (TODO: SECURITY comment present) |
| MED-2 | CodeQuality | `packages/cellix/service-payment-cybersource/src/index.ts:711` | `createPaymentRequest` rejects with a plain object literal instead of an `Error` instance — breaks `instanceof Error` checks, logging libraries, and debuggers |
| MED-3 | CodeQuality | `packages/sthrift/domain/src/domain/contexts/listing/item/item-listing.aggregate.ts:380` | `expiresAt` setter missing `!this.isNew` guard — visa permission check fires during `getNewInstance`, potentially throwing a spurious `PermissionError` on new record construction |
| MED-4 | CodeQuality | `packages/sthrift/graphql/src/schema/resolver-helper.ts:21` | Exception-as-control-flow in `getUserByEmail` swallows real infrastructure errors (DB timeout, serialization failure) as silent `null` — repeat pattern in `requireCurrentAdminUser` and `PopulateConversationParticipantFromField` |
| MED-5 | CodeQuality | `packages/cellix/service-payment-cybersource/src/index.ts:1` | File-wide `biome-ignore-all` for `noExplicitAny` and `useAwait` across ~1 100 lines — masks new violations; should be replaced with targeted per-line suppressions |
| MED-6 | Performance | `packages/sthrift/data-sources-mongoose-models/src/models/reservation-request/reservation-request.model.ts:18` | `ReservationRequest` collection has no indexes on `reserver`, `listing`, or `state` — all reservation queries (including the overlap check on every `createReservationRequest` mutation) are full collection scans |
| MED-7 | Performance | `packages/sthrift/data-sources-mongoose-models/src/models/conversations/conversation.model.ts:16` | `Conversation` collection missing indexes on `sharer` and `reserver` — `conversationsByUser` (called on messages page) does a full COLLSCAN |
| MED-8 | Performance | `packages/sthrift/graphql/src/schema/resolver-helper.ts:71` | `currentViewerIsAdmin` called multiple times per request with no memoization — can issue 1+N `queryByEmail` hits to `AdminUser` collection per request on list views |
| MED-9 | Performance | `packages/sthrift/persistence/src/datasources/readonly/reservation-request/reservation-request/reservation-request.read-repository.ts:219` | `getListingRequestsBySharerId` pre-fetches all sharer listing IDs with no limit before building `$in` filter — large `$in` arrays degrade MongoDB index selectivity toward a near-COLLSCAN |

**MongoDB index additions for MED-6 and MED-7:**
```js
// ReservationRequest
ReservationRequestSchema.index({ reserver: 1, state: 1 });
ReservationRequestSchema.index({ listing: 1, state: 1 });
ReservationRequestSchema.index({ listing: 1, state: 1, reservationPeriodStart: 1, reservationPeriodEnd: 1 });

// Conversation
ConversationSchema.index({ sharer: 1 });
ConversationSchema.index({ reserver: 1 });
ConversationSchema.index({ sharer: 1, reserver: 1, listing: 1 }, { unique: true });
```

---

## Low Priority

| ID | Source | File | Title |
|----|--------|------|-------|
| LOW-1 | CodeQuality | `packages/cellix/service-payment-mock/src/index.ts:467` | `isSuccess` hardcoded `true` — `else` block (error path) is permanently unreachable dead code |
| LOW-2 | CodeQuality | `packages/cellix/service-payment-mock/src/index.ts:59` | Marked-for-deletion accessor + ~230 lines of commented-out code (`setDefaultCustomerPaymentInstrument`, `voidPayment`) — delete and rely on git history |
| LOW-3 | CodeQuality | `packages/cellix/service-messaging-mock/src/index.test.ts:4` | Only test is `expect(true).toBe(true)` — the non-trivial `ServiceMessagingMock` class has zero meaningful test coverage |
| LOW-4 | Performance | `apps/ui-sharethrift/package.json:29` | Full `lodash` (CJS, ~75 KB gzipped) imported as runtime dependency — switch to `lodash-es` or individual named imports for tree-shaking |
| LOW-5 | Performance | `packages/sthrift/ui-sharethrift-route-root/src/components/pages/my-listings/components/all-listings-table.tsx:56` | `columns` array and `getActionButtons` function recreated on every render — wrap in `useMemo`/`useCallback` to prevent unnecessary Ant Design Table cell re-renders |

---

## Info

| ID | Source | Finding |
|----|--------|---------|
| INFO-1 | DependencySecurity | `sirv 2.0.4` waiver in `.snyk` remains live via `@docusaurus/core → webpack-bundle-analyzer`. Keep until Docusaurus upgrades. |
| INFO-2 | DependencySecurity | `js-yaml 3.14.2` waiver remains live via `gray-matter` in `apps/docs`. Keep until chain drops 3.x. |
| INFO-3 | DependencySecurity | Two `lodash 4.17.23` waivers remain live across GraphQL Code Generator, azurite, and sequelize transitive deps. No fixed version available upstream. |
| INFO-4 | DependencySecurity | `@apollo/protobufjs 1.2.7` waiver remains live — Apollo Server 5.5.0 still hard-pins it via usage-reporting internals. Keep until Apollo publishes a fixed chain. |

_These waivers are accepted risks with no immediate action required. Review each quarter or when the upstream packages release new versions._

---

## Per-Agent Summaries

### DependencySecurity

The dependency surface is in good shape after this week's lockfile regeneration. Nine Snyk ignore waivers were found to be obsolete (the previously vulnerable package versions are no longer present in `pnpm-lock.yaml`) and were automatically removed from `.snyk`. Five waivers remain necessary: `sirv`, `js-yaml`, two `lodash`, and `@apollo/protobufjs` — all tied to transitive dependencies in toolchain or Apollo internals where no upstream fix is yet available. No new CVEs were introduced by this week's commits. The pnpm override policies in `root package.json` continue to keep the application's own dependency tree on patched versions.

### CodeQuality

12 findings across three themes: **security gaps in the GraphQL layer** (permissions middleware never wired, two admin resolvers with no auth, a permission-bypass setter, and a missing role check), **brittle error handling** (exception-as-control-flow swallowing infrastructure errors, plain-object rejections), and **dead-code accumulation** (seven unimplemented CyberSource stubs, 230+ commented-out lines in the payment mock, a stub test suite, blanket linter suppressions). The highest-priority items cluster in `packages/sthrift/graphql/` and `packages/cellix/service-payment-cybersource/`. The `ItemListing` domain aggregate also has two setter inconsistencies that could cause subtle permission-bypass or construction errors.

### Performance

10 findings in the backend data layer and frontend. The most severe are: N+1 queries from three generic field resolver helpers in `resolver-helper.ts` (can fire 60–120 extra DB round-trips per request), two unbounded queries that load entire MongoDB collections into Lambda/function memory (`getAllUsers`, `itemListings`), and a total-count scan that doubles the cost of every paginated listing request. Secondary issues include missing indexes on `ReservationRequest` and `Conversation` collections (all reservation and conversation queries are full collection scans), redundant per-request admin-status lookups with no memoization, and an unbounded listing ID pre-fetch before building a `$in` reservation filter. On the frontend, the full CJS lodash bundle and un-memoized Ant Design column definitions are lower-urgency but worth cleaning up with the lodash dependency work.

---

## Recommended Action Plan

### Sprint 1 — Security (fix before next release)

1. **[CRIT-1]** Wire auth on `adminListings` + `unblockListing`: add `await requireCurrentAdminUser(context)` to both resolvers. Add failing integration tests first to confirm the gap.
2. **[HIGH-1]** Resolve the dead permissions middleware: decide canonical pattern (wire `permissions` into `applyMiddleware` or delete the infrastructure and document inline-check approach). Ship the decision, not the ambiguity.
3. **[HIGH-2]** Add visa guard to `listingType` setter on `ItemListing` to match all peer setters.
4. **[MED-1]** Add admin or ownership guard to `personalUserUpdate` (resolve the TODO: SECURITY comment).

### Sprint 2 — Performance (critical data-layer fixes)

5. **[HIGH-4]** Introduce DataLoader for `PersonalUser`, `AdminUser`, and `ItemListing` batch lookups in `resolver-helper.ts`. This is the highest-leverage performance fix.
6. **[HIGH-5 + HIGH-6 + HIGH-7]** Push filtering/sorting/pagination into MongoDB for `getAllUsers`, add a limit/pagination to `itemListings`, and replace the count scan in `getPaged` with `countDocuments`. These can be bundled as one PR on the persistence layer.
7. **[MED-6 + MED-7]** Add the six missing Mongoose schema indexes (ReservationRequest, Conversation) listed above — this is a one-file change per model with high impact on query performance.

### Sprint 3 — Quality & Maintainability

8. **[HIGH-3]** Either implement or formally remove the seven stub CyberSource methods. Guard the service factory so they can never be called at runtime until implemented.
9. **[MED-4]** Fix exception-as-control-flow in `getUserByEmail` and related helpers — catch only typed `NotFoundError`, re-throw everything else.
10. **[MED-2 + MED-3]** Fix `expiresAt` setter `!isNew` guard; create `PaymentError extends Error` to replace plain-object rejection in `createPaymentRequest`.
11. **[MED-8 + MED-9]** Memoize `currentViewerIsAdmin` result in GraphQL context; replace two-step listing-ID pre-fetch with `$lookup` aggregation or denormalised `sharerId` field on `ReservationRequest`.
12. **[MED-5]** Replace file-wide `biome-ignore-all` in CyberSource service with targeted per-line suppressions.

### Backlog

13. **[LOW-1 + LOW-2]** Delete dead code in `service-payment-mock` (unreachable else branch, commented-out blocks, deletion markers).
14. **[LOW-3]** Replace no-op test in `service-messaging-mock` with meaningful lifecycle and mapping unit tests.
15. **[LOW-4]** Migrate `apps/ui-sharethrift` from `lodash` (CJS) to `lodash-es` for proper tree-shaking.
16. **[LOW-5]** Wrap `AllListingsTable` column definitions in `useMemo`/`useCallback`.

---

## Appendix: Raw Analyzer Reports

| Report | Agent | Status | Findings |
|--------|-------|--------|----------|
| `scope.json` | Scoper | ✅ completed | 7-commit window, 41 files changed, no prior audit |
| `DependencySecurity.json` | DependencySecurity | ✅ completed | 1 auto-fix applied, 4 medium (retained waivers), 1 info |
| `CodeQuality.json` | CodeQuality | ✅ completed | 4 high, 5 medium, 3 low |
| `Performance.json` | Performance | ✅ completed | 4 high, 4 medium, 2 low |

No analyzers reported `status: "error"`. All four reports were consumed without issue.

---

_Generated by the sharethrift weekly audit pipeline · 2026-04-29_
