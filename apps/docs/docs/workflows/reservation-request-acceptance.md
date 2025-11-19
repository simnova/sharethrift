---
sidebar_position: 1
sidebar_label: Reservation Request Acceptance
description: "Detailed workflow for reservation request acceptance and auto-rejection"
---

# Reservation Request Acceptance Workflow

## Overview

This document describes the complete workflow for accepting a reservation request in the ShareThrift platform, including validation, state transitions, auto-rejection of overlapping requests, and notification triggers.

## Actors

- **Reserver**: User who created the reservation request
- **Sharer**: Owner of the listing who accepts/rejects requests
- **System**: Automated processes (auto-rejection, notifications)

## Preconditions

- A reservation request exists in "Requested" state
- The listing is in "Active" state
- The sharer is authenticated and authorized

## Main Flow

### 1. Acceptance Request

**Trigger**: Sharer clicks "Accept" button on a reservation request

**GraphQL Mutation**:
```graphql
mutation AcceptReservationRequest($input: AcceptReservationRequestInput!) {
  acceptReservationRequest(input: $input) {
    id
    state
    reservationPeriodStart
    reservationPeriodEnd
    createdAt
    updatedAt
  }
}
```

**Input**:
```typescript
{
  id: "reservation-request-id"
}
```

### 2. Application Service Processing

**File**: `packages/sthrift/application-services/src/contexts/reservation-request/reservation-request/accept.ts`

**Steps**:

1. **Query Reservation Request**
   ```typescript
   const reservationRequestToAccept = await repo.getById(command.id);
   ```

2. **Validate Request Exists**
   ```typescript
   if (!reservationRequestToAccept) {
     throw new Error('Reservation request not found');
   }
   ```

3. **Load and Validate Listing**
   ```typescript
   const listing = await reservationRequestToAccept.loadListing();
   if (!listing) {
     throw new Error('Listing not found');
   }
   ```

4. **Verify Sharer Ownership**
   ```typescript
   const sharer = await dataSources.readonlyDataSource.User.PersonalUser
     .PersonalUserReadRepo.getByEmail(command.sharerEmail);
   
   if (!sharer || listing.sharer?.id !== sharer.id) {
     throw new Error('You do not have permission to accept this reservation request');
   }
   ```

5. **Accept Reservation**
   ```typescript
   reservationRequestToAccept.state = 'Accepted';
   acceptedReservationRequest = await repo.save(reservationRequestToAccept);
   ```

6. **Auto-Reject Overlapping Requests**
   ```typescript
   await autoRejectOverlappingRequests(
     acceptedReservationRequest,
     listing.id,
     repo,
     dataSources
   );
   ```

### 3. Domain Validation

**File**: `packages/sthrift/domain/src/domain/contexts/reservation-request/reservation-request/reservation-request.ts`

**Method**: `private accept(): void`

**Validation Rules**:
- Current state must be "Requested"
- User must have `canAcceptRequest` permission
- If validation fails, throws `PermissionError` or domain error

**State Transition**:
```typescript
this.props.state = new ValueObjects.ReservationRequestStateValue(
  ReservationRequestStates.ACCEPTED
).valueOf();
```

### 4. Auto-Rejection of Overlapping Requests

**Function**: `autoRejectOverlappingRequests()`

**Steps**:

1. **Query Overlapping Requests**
   ```typescript
   const overlappingRequests = await dataSources.readonlyDataSource
     .ReservationRequest.ReservationRequest.ReservationRequestReadRepo
     .queryOverlapByListingIdAndReservationPeriod({
       listingId,
       reservationPeriodStart: acceptedRequest.reservationPeriodStart,
       reservationPeriodEnd: acceptedRequest.reservationPeriodEnd,
     });
   ```

2. **Filter Requests to Reject**
   ```typescript
   const requestsToReject = overlappingRequests.filter(
     (request) => request.id !== acceptedRequest.id && request.state === 'Requested'
   );
   ```

3. **Reject Each Request**
   ```typescript
   for (const request of requestsToReject) {
     const requestToReject = await repo.getById(request.id);
     if (requestToReject && requestToReject.state === 'Requested') {
       requestToReject.state = 'Rejected';
       await repo.save(requestToReject);
     }
   }
   ```

4. **Log Results**
   - Log each successful auto-rejection
   - Log any errors (non-blocking)
   - Log summary count

### 5. Notification Triggers (Future Implementation)

**Domain Events to Emit**:

1. **ReservationRequestAccepted**
   ```typescript
   {
     reservationRequestId: string;
     listingId: string;
     sharerId: string;
     reserverId: string;
     reservationPeriodStart: Date;
     reservationPeriodEnd: Date;
     timestamp: Date;
   }
   ```

   **Notification Recipients**:
   - **Reserver**: "Your request for [listing.title] has been accepted!"
   - **Sharer**: "You accepted the request from [reserver.name]"

2. **ReservationRequestAutoRejected** (for each rejected request)
   ```typescript
   {
     reservationRequestId: string;
     listingId: string;
     reserverId: string;
     reason: "overlapping_acceptance";
     acceptedReservationRequestId: string;
     timestamp: Date;
   }
   ```

   **Notification Recipients**:
   - **Reserver**: "Your request for [listing.title] was declined because the dates are no longer available"

### 6. Messaging Integration (Future Implementation)

**Automated Message Content**:

**To Reserver (Acceptance)**:

```text
Great news! [sharer.firstName] has accepted your request for "[listing.title]".

Reservation Period: [reservationPeriodStart] - [reservationPeriodEnd]

Next Steps:
1. Coordinate pickup details with [sharer.firstName]
2. Review the listing location and description
3. Enjoy your reservation!

[Message [sharer.firstName]] [View Listing]
```

**To Reserver (Auto-Rejection)**:

```text
Unfortunately, your request for "[listing.title]" is no longer available.

The dates you selected have been reserved by another user.

Would you like to:
- Request different dates for this listing
- Browse similar listings

[Change Dates] [Find Similar]
```

## Error Scenarios

### Error 1: Reservation Request Not Found

**Cause**: Invalid ID or request was deleted

**Response**:
```json
{
  "errors": [{
    "message": "Reservation request not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Error 2: Permission Denied

**Cause**: User is not the listing owner

**Response**:
```json
{
  "errors": [{
    "message": "You do not have permission to accept this reservation request",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Error 3: Invalid State Transition

**Cause**: Request is not in "Requested" state

**Response**:
```json
{
  "errors": [{
    "message": "Can only accept requested reservations",
    "extensions": {
      "code": "INVALID_STATE"
    }
  }]
}
```

### Error 4: Auto-Rejection Failure

**Handling**: 
- Primary acceptance succeeds
- Error logged for monitoring
- Failed rejections remain in "Requested" state
- Manual intervention may be required

## Success Response

```json
{
  "data": {
    "acceptReservationRequest": {
      "id": "reservation-request-id",
      "state": "Accepted",
      "reservationPeriodStart": "2025-02-15T00:00:00.000Z",
      "reservationPeriodEnd": "2025-02-22T00:00:00.000Z",
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T15:30:00.000Z"
    }
  }
}
```

## State Diagram

```
┌──────────┐
│Requested │
└────┬─────┘
     │
     ├─── [accept by sharer] ──────────┐
     │                                  │
     │                            ┌─────▼────┐
     │                            │ Accepted │
     │                            └─────┬────┘
     │                                  │
     ├─── [auto-reject overlap] ───┐   │
     │                              │   │
     │                         ┌────▼───▼───┐
     │                         │  Rejected  │
     │                         └────────────┘
     │
     └─── [manual reject] ─────────┘
```

## Related Documentation

- [ADR-0023: Reservation Request Acceptance Flow](../decisions/0023-reservation-request-acceptance-flow.md)
- Business Requirements: Reservation Lifecycle (see share-thrift-brd.md#reservation-lifecycle)
- Domain Feature: Reservation Request (see packages/sthrift/domain/src/domain/contexts/reservation-request/reservation-request/features/reservation-request.feature)

## Future Enhancements

1. **Batch Auto-Rejection**: Process multiple rejections more efficiently
2. **Notification Preferences**: Allow users to customize notification settings
3. **Calendar Integration**: Sync accepted reservations to external calendars
4. **Conflict Detection UI**: Show sharers when accepting will auto-reject other requests
5. **Retry Mechanism**: Automatic retry for failed auto-rejections with exponential backoff