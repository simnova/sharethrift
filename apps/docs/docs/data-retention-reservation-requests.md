# Data Retention: Expired Reservation Request Deletion

## Overview

This feature implements automatic deletion of expired reservation requests in accordance with the ShareThrift Data Retention Strategy specified in the SRD and BRD documents.

**Retention Policy**: Reservation requests in the CLOSED state (completed) are archived for 6 months and then automatically deleted from the operational database (Azure Cosmos DB, MongoDB API).

## Architecture

### Components

1. **Timer Trigger** (`apps/api/src/features/cleanup-expired-reservation-requests.ts`)
   - Azure Function Timer Trigger
   - Schedule: Daily at 2 AM UTC (`0 0 2 * * *`)
   - Uses system-level permissions for automated cleanup

2. **Application Service** (`packages/sthrift/application-services/src/contexts/reservation-request/reservation-request/delete-expired.ts`)
   - Orchestrates the deletion process
   - Integrates OpenTelemetry tracing for observability
   - Batch processes expired requests with error handling

3. **Repository Method** (`packages/sthrift/persistence/src/datasources/readonly/reservation-request/`)
   - `getExpiredClosed()`: Queries for CLOSED requests older than 6 months
   - Filter: `state='Closed' AND updatedAt < (now - 6 months)`

4. **Domain Method** (`packages/sthrift/domain/src/domain/contexts/reservation-request/`)
   - `requestDelete()`: Marks reservation request for deletion
   - Requires `canDeleteRequest` permission (granted to system passport)

### Flow

```
┌─────────────────────┐
│ Timer Trigger       │
│ (Daily 2 AM UTC)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Application Service │
│ deleteExpiredRR()   │
└──────────┬──────────┘
           │
           ├──► Query expired requests
           │    (getExpiredClosed)
           │
           ├──► For each expired request:
           │    ├─► Load aggregate
           │    ├─► Call requestDelete()
           │    └─► Repository hard deletes
           │
           └──► Return count & log metrics
```

## Configuration

### Timer Schedule

The timer is configured with NCRONTAB expression:
```typescript
schedule: '0 0 2 * * *'  // Daily at 2 AM UTC
```

To modify the schedule, update `apps/api/src/index.ts`.

### Retention Period

The 6-month retention period is defined in `getExpiredClosed()`. To modify, update the repository method.

## Observability

The deletion process emits OpenTelemetry spans with the following metrics:
- `reservation_requests.expired.count`: Number of expired requests found
- `reservation_requests.deleted.count`: Number successfully deleted

Console logs are emitted at key points for monitoring.

## References

- **BRD**: `documents/share-thrift-brd.md`
- **SRD**: `documents/share-thrift-srd-bronze.md` (Data Retention Strategy)
- Related: Listing deletion (issue #199) - similar pattern
