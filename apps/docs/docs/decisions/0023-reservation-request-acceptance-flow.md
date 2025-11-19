---
sidebar_position: 23
sidebar_label: 0023 Reservation Request Acceptance Flow
description: "Decision record for reservation request acceptance workflow and auto-rejection of overlapping requests."
status: accepted
contact: development team
date: 2025-01-09
deciders: development team
consulted: product team
informed: all stakeholders
---

# Reservation Request Acceptance Flow

## Context and Problem Statement

When a sharer accepts a reservation request for a listing, there may be other pending (Requested state) reservation requests that overlap with the accepted time period. We need to define the behavior for handling these overlapping requests to prevent double-booking and maintain data consistency.

## Decision Drivers

* **Prevent Double-Booking**: Only one reservation should be active for a given time period
* **User Experience**: Reservers should be notified when their requests are auto-rejected
* **Data Consistency**: State transitions must follow domain rules and be transactional
* **Performance**: Auto-rejection should not significantly impact acceptance operation
* **Error Handling**: Failures in auto-rejection should not prevent the primary acceptance

## Considered Options

1. **Manual Rejection Only**: Require sharers to manually reject each overlapping request
2. **Auto-Reject with Notification**: Automatically reject overlapping requests and notify users
3. **Queue-Based Processing**: Accept the request and process overlapping rejections asynchronously

## Decision Outcome

Chosen option: **Auto-Reject with Notification**, because it provides the best balance of user experience, data consistency, and system reliability.

### Implementation Details

#### Acceptance Flow

1. **Validation Phase**
   - Verify reservation request exists and is in "Requested" state
   - Load associated listing and verify sharer ownership
   - Verify sharer has permission to accept requests

2. **Acceptance Phase**
   - Set reservation request state to "Accepted"
   - Persist the accepted reservation request
   - Commit transaction

3. **Auto-Rejection Phase** (within same transaction)
   - Query all reservation requests for the listing that:
     - Are in "Requested" state
     - Overlap with the accepted reservation period
     - Are not the accepted request itself
   - For each overlapping request:
     - Load the full aggregate
     - Set state to "Rejected"
     - Persist the rejection
     - Log the auto-rejection
   - Catch and log errors for individual rejections (non-blocking)

4. **Notification Phase** (future implementation)
   - Trigger domain event: `ReservationRequestAccepted`
   - Trigger domain event: `ReservationRequestAutoRejected` for each rejected request
   - Email notification service processes events asynchronously

#### State Transitions

```
Requested --[accept by sharer]--> Accepted
Requested --[auto-reject due to overlap]--> Rejected
```

#### Error Handling

- If acceptance fails, the entire transaction rolls back
- If auto-rejection of individual requests fails:
  - Error is logged
  - Acceptance operation continues
  - Failed rejections can be retried or handled manually

#### Code Location

- **Application Service**: `packages/sthrift/application-services/src/contexts/reservation-request/reservation-request/accept.ts`
- **Domain Aggregate**: `packages/sthrift/domain/src/domain/contexts/reservation-request/reservation-request/reservation-request.ts`
- **GraphQL Resolver**: `packages/sthrift/graphql/src/schema/types/reservation-request/reservation-request.resolvers.ts`

### Consequences

#### Good

- **Automatic Conflict Resolution**: Prevents double-booking without manual intervention
- **Transactional Integrity**: All state changes happen within a single database transaction
- **Graceful Degradation**: Failures in auto-rejection don't block the primary acceptance
- **Audit Trail**: All auto-rejections are logged for debugging and compliance

#### Bad

- **Performance Impact**: Acceptance operation may take longer when many overlapping requests exist
- **Notification Lag**: Users don't receive immediate feedback (depends on future notification implementation)
- **Complexity**: Adds complexity to the acceptance logic

#### Neutral

- **Future Notification Work**: Requires implementation of domain events and notification service
- **Manual Fallback**: Administrators may need to manually handle edge cases

## Validation

### Test Scenarios

1. Accept a reservation request with no overlapping pending requests → Success
2. Accept a reservation request with 1 overlapping pending request → Success, 1 auto-rejection
3. Accept a reservation request with multiple overlapping pending requests → Success, multiple auto-rejections
4. Accept a reservation request where auto-rejection fails → Acceptance succeeds, error logged
5. Attempt to accept when not the listing owner → Rejection with permission error

### Monitoring

- Log count of auto-rejected requests per acceptance
- Track acceptance operation duration
- Alert on auto-rejection failures exceeding threshold

## More Information

### Related Domain Concepts

- **Reservation States**: Requested, Accepted, Rejected, Cancelled, Closed (see `reservation-request.value-objects.ts`)
- **Listing States**: Active, Paused, Blocked, etc.
- **Domain Permissions**: `canAcceptRequest`, `canRejectRequest` (see `reservation-request.domain-permissions.ts`)

### Related Documentation

- Business Requirements Document - Reservation Lifecycle (see share-thrift-brd.md#reservation-lifecycle)
- System Requirements Document - Reservation Request (see share-thrift-srd-bronze.md#reservation-request)
- Domain Feature File - Reservation Request (see packages/sthrift/domain/src/domain/contexts/reservation-request/reservation-request/features/reservation-request.feature)

### Future Enhancements

1. **Domain Events**: Implement `ReservationRequestAccepted` and `ReservationRequestAutoRejected` events
2. **Notification Service**: Send emails to affected reservers
3. **Messaging Integration**: Automatically send in-app messages explaining the auto-rejection
4. **Analytics**: Track auto-rejection rates and patterns
5. **Retry Mechanism**: Implement automatic retry for failed auto-rejections