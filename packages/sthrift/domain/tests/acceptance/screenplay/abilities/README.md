# Serenity.js Screenplay Abilities

This directory contains Serenity.js Abilities that represent an Actor's capacity to interact with the domain model, following Hexagonal Architecture principles.

## Architecture Principles

### ✅ DO: Align with the Domain Model
- Use actual domain aggregate factory methods (e.g., `ItemListing.getNewInstance()`)
- Interact through the domain's UnitOfWork pattern
- Leverage real repository implementations
- Call aggregate's public methods for state transitions (`publish()`, `pause()`, `cancel()`, `reinstate()`)

### ❌ DON'T: Mock the Domain
- Don't manually construct domain objects
- Don't use in-memory arrays to simulate persistence
- Don't bypass domain logic
- Don't manually set state properties (use `listing.publish()` not `listing.state = 'Published'`)

## Example: CreateListingAbility

```typescript
// ✅ CORRECT: Uses domain factory and UnitOfWork
await this.unitOfWork.withScopedTransaction(async (repo) => {
  const listing = ItemListing.getNewInstance(user, params, passport);
  createdListing = await repo.save(listing);
});

// ✅ CORRECT: Use aggregate's public methods for state transitions
await this.unitOfWork.withScopedTransaction(async (repo) => {
  const listing = await repo.getById(listingId);
  listing.publish(); // Domain method enforces business rules
  await repo.save(listing);
});

// ❌ WRONG: Manually constructs objects
const listing = {
  id: `listing-${Date.now()}`,
  title: params.title,
  state: 'Published', // Bypasses domain logic
  ...
};
this.listings.push(listing); // Mocks database

// ❌ WRONG: Manually sets state property
listing.state = 'Published'; // Bypasses validation
```

## Testing Infrastructure

Since local development uses MongoDB memory server, we use the actual UnitOfWork implementation rather than mocking. This ensures:

1. **Tests verify real behavior** - Same code path as production
2. **Domain rules are enforced** - Factory methods validate business logic
3. **Repository integration is tested** - Actual persistence layer is exercised

## Usage

```typescript
const createListing = CreateListingAbility.with(
  unitOfWork,    // Real UnitOfWork with MongoDB memory server
  actorUser,     // Domain user entity
  passport       // Security context
);

actor.whoCan(createListing);

// Create a listing
const listing = await createListing.createListing({
  title: 'Bike for sharing',
  description: 'Mountain bike',
  category: 'Sports',
  location: 'Delhi',
  sharingPeriodStart: new Date(),
  sharingPeriodEnd: new Date(),
});

// Test state transitions using domain methods
await createListing.publishListing(listing.id);
await createListing.pauseListing(listing.id);
await createListing.reinstateListing(listing.id);

// Query via repository
const userListings = await createListing.getUserListings('user-123');
```

## References

- [Serenity.js Screenplay Pattern](https://serenity-js.org/handbook/design/screenplay-pattern/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- Domain Unit of Work: `packages/sthrift/domain/src/domain/contexts/listing/item/item-listing.uow.ts`
