# Reservation Request Acceptance Workflow

## Overview

This document describes the implementation of the reservation request acceptance workflow, which allows sharers to accept incoming reservation requests for their listings.

## Business Rules

1. Only sharers who own the listing can accept reservation requests
2. Only requests in "Requested" state can be accepted
3. Double booking is prevented - no overlapping accepted reservations for the same listing
4. Upon acceptance:
   - Status changes from "Requested" to "Accepted"
   - A domain event `ReservationAcceptedEvent` is emitted
   - Both parties (reserver and sharer) should be notified
   - A message thread should be created for coordination

## Architecture

### Domain Layer

**Location**: `packages/sthrift/domain/src/domain/contexts/reservation-request/reservation-request/`

- `reservation-request.ts`: Contains the `accept()` method that enforces business rules and state transitions
- `reservation-request.events.ts`: Defines `ReservationAcceptedEvent` emitted when acceptance occurs
- `reservation-request.value-objects.ts`: Defines valid states including "Accepted"

**Domain Event**:
```typescript
ReservationAcceptedEvent {
  reservationRequestId: string
  reserverId: string
  sharerId: string
  listingId: string
  reservationPeriodStart: Date
  reservationPeriodEnd: Date
}
```

### Application Service Layer

**Location**: `packages/sthrift/application-services/src/contexts/reservation-request/reservation-request/`

- `accept.ts`: Orchestrates the acceptance workflow:
  1. Loads the reservation request
  2. Verifies sharer authorization
  3. Checks for overlapping reservations
  4. Updates state to "Accepted"
  5. Persists via Unit of Work (which publishes domain events)

**Service Interface**:
```typescript
accept(command: {
  reservationRequestId: string
  sharerEmail: string
}): Promise<ReservationRequestEntityReference>
```

### GraphQL API

**Location**: `packages/sthrift/graphql/src/schema/types/reservation-request/`

**Mutation**:
```graphql
acceptReservationRequest(
  input: AcceptReservationRequestInput!
): ReservationRequest!

input AcceptReservationRequestInput {
  reservationRequestId: ObjectID!
}
```

**Resolver**: Extracts authenticated user from JWT and calls application service

## Event Handling

Domain events are emitted when the aggregate is saved via the Unit of Work pattern. The event infrastructure is documented in:

**Location**: `packages/sthrift/event-handler/src/handlers/integration/`

Future event handlers should:
1. Listen for `ReservationAcceptedEvent`
2. Create conversation thread between reserver and sharer
3. Send notification emails to both parties

## Testing

- **Unit Tests**: `reservation-request.aggregate.test.ts` validates:
  - State transition from "Requested" to "Accepted"
  - Event emission with correct payload
  - Permission enforcement
  - Invalid state transition rejection

- **Service Tests**: Overlap detection logic is validated through the application service

## Usage Example

```graphql
mutation AcceptReservation {
  acceptReservationRequest(
    input: { reservationRequestId: "123456" }
  ) {
    id
    state
    reservationPeriodStart
    reservationPeriodEnd
    listing {
      title
    }
    reserver {
      account {
        username
      }
    }
  }
}
```

## Security

- Authentication required (JWT token validated)
- Authorization enforced (sharer must own the listing)
- Idempotency supported (accepting an already-accepted request throws error)

## Related Documentation

- BRD/SRD: "Reservation Request – Requested" and "Reservation Request – Accepted"
- ADR: Domain-Driven Design (`docs/decisions/0003-domain-driven-design.md`)
- ADR: OpenTelemetry for observability

## Future Enhancements

1. **Email Notifications**: Implement SendGrid templates for acceptance notifications
2. **Conversation Creation**: Automatically create message thread on acceptance
3. **Push Notifications**: Add mobile/web push notifications for real-time updates
4. **Calendar Integration**: Sync accepted reservations to user calendars
5. **Metrics & Monitoring**: Track acceptance rates, time-to-acceptance, etc.
