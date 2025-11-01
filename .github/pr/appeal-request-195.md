## feat(appeal-request): implement backend structure for issue #195

### Summary
Implements the backend for Appeal Requests (issue #195), including domain, persistence, application services, GraphQL schema & resolvers, Mongoose models (discriminators), and seed data. This adds two subdomains: Listing Appeal Requests and User Appeal Requests, stored in a single `appealRequests` collection using a `type` discriminator.

### What changed
- Domain
  - New aggregates and value objects for listing and user appeal requests.
  - Repositories and Unit of Work (UoW) interfaces/implementations for domain operations.
- Data models
  - Mongoose base model for appeal requests and discriminators for `listing` and `user` types.
  - Model factory and type exports for use by persistence adapters.
- Persistence
  - Domain adapters, repositories, and UoW factories for both subdomains.
  - Read-only repository factories (placeholders for getAll filters/pagination).
- Application services
  - Create, get-by-id, get-all, and update-state services for both listing and user appeal request contexts.
- GraphQL
  - Schema files and resolvers for appeal-request contexts (Listing/User).
  - Resolvers wired to application services; TODOs left where auth/authorization needs to be implemented.
- Seed data
  - Example seed entries for use with the local in-memory MongoDB seeder.
- Wiring & exports
  - Context registration and index wiring so domain/models/persistence/app-services are discoverable by the app.
- Git
  - Branch: `feature/appeal-request-backend-195`
  - Commits: All changes committed and pushed.

### Packages touched (high level)
- `packages/sthrift/domain`
- `packages/sthrift/data-sources-mongoose-models`
- `packages/sthrift/persistence`
- `packages/sthrift/application-services`
- `packages/sthrift/graphql`
- `packages/sthrift/mock-mongodb-memory-server` (seed data)

### How to test (quick smoke)
1. Build workspace:
   ```bash
   pnpm -w build
   ```
2. Run the API functions (in dev mode):
   - From `apps/api` or the root tasks: start the functions host and watch/build tasks.
   - Or run workspace start tasks used by the repo (see top-level README).
3. Seed DB (if using local memory seeder) or insert sample documents into `appealRequests` collection with `type: "listing"` or `type: "user"`.
4. Query via GraphQL:
   - Create a listing appeal request:
     ```graphql
     mutation {
       createListingAppealRequest(input: { reason: "Incorrect listing", listingId: "<id>" }) { id reason state }
     }
     ```
   - Fetch by ID or list (read-only getAll endpoints are present, but full pagination/filtering is TODO).

### Notable implementation details
- Single collection `appealRequests` with a discriminator key `type` (values: `listing` | `user`).
- Domain value objects enforce constraints (reason length, state enum).
- Read-only getAll implementations currently include placeholder pagination/filtering and return a basic paged result — see TODO below.
- GraphQL resolvers include TODOs for authentication and authorization checks (passport/visa integration). These resolvers return results but do not yet enforce user/admin checks.

### Known TODOs / Follow-ups
- Implement passport/visa auth checks and robust authorization in GraphQL resolvers.
- Complete pagination, filtering, and sorting in read-only repository implementations for `getAll`.
- Add unit and integration tests for domain logic, persistence adapters, and app services.
- Consider adding more seed data examples and CI test coverage for new contexts.

### Checklist for PR reviewers
- [ ] Confirm domain contracts match expected business requirements.
- [ ] Verify Mongoose discriminator usage is correct and migrations (if any) are safe.
- [ ] Review GraphQL schema & resolver shape and confirm missing auth checks are acceptable as deferred work.
- [ ] Run workspace build and smoke test GraphQL queries (see "How to test").
- [ ] Suggest or request tests to cover critical domain rules and persistence behavior.

### Migration / DB notes
- Existing collection `appealRequests` will contain documents with a `type` field. If you have existing data, validate `type` values and update accordingly.
- No destructive migrations included.

### Branch / commit
- Branch: `feature/appeal-request-backend-195`
- Commit message includes reference to issue #195.

---

If you’d like, I can:
- Add the PR body into a new GitHub PR draft and populate reviewers (requires GitHub access).
- Implement the auth checks or finish pagination next.
