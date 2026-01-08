---
sidebar_position: 12
sidebar_label: 0012 Conversation Data Retention
description: "Conversations are automatically deleted 6 months after the associated listing is archived"
status: implemented
contact: 
date: 2025-06-27
deciders: 
consulted: 
informed: 
---

# Conversation Data Retention

## Security Requirement Statement
Conversations must be automatically deleted 6 months after the associated listing is archived to comply with data minimization principles and reduce data exposure risk.

## Control Classification
- **Timing Control Category**: Detective/Corrective
- **Nature Control Category**: Technical
- **Status**: Implemented
- **Date Identified**: 2025-06-27
- **Date First Implemented**: 2025-06-27
- **Date Last Reviewed**: 2025-06-27
- **Date Retired**: N/A

## Implementation Details

### TTL-Based Automatic Deletion (Primary Mechanism)
- **MongoDB TTL Index**: Conversations have an `expiresAt` field with a TTL index (`expires: 0`)
- **Automatic Cleanup**: MongoDB automatically removes documents when the `expiresAt` timestamp is reached
- **Retention Period**: 6 months (180 days) from listing archival date
- **Trigger**: When a listing is archived, all associated conversations are scheduled for deletion

### Domain Layer Implementation
- `Conversation.scheduleForDeletion(archivalDate: Date)` method sets the expiration date
- `Conversation.expiresAt` property stores the deletion timestamp
- Authorization enforced through `ConversationDomainPermissions.isSystemAccount` permission
- Only the system passport can schedule conversations for deletion

### Application Services

**ScheduleConversationDeletionByListing Service**
- Triggered when a listing is archived
- Finds all conversations associated with the listing
- Schedules each conversation for deletion with a 6-month retention period
- Uses batch processing with configurable batch sizes
- Includes OpenTelemetry tracing for observability

**CleanupArchivedConversations Service**
- Fallback mechanism for data integrity
- Azure Functions timer trigger runs daily at 2:00 AM UTC
- Queries listings archived more than 6 months ago without corresponding conversation deletions
- Schedules any missed conversations for immediate deletion
- Handles partial failures gracefully with error collection

### Persistence Layer
- `ConversationModel.expiresAt` field in MongoDB schema
- TTL index configured with `expires: 0` for automatic deletion shortly after the expiration time
- `getByListingId()` repository method for finding conversations by listing
- `getExpired()` repository method for querying already-expired conversations (fallback)

## Compensating Controls

### Multi-Layer Deletion Approach
- **Primary**: TTL index provides automatic deletion without application intervention
- **Secondary**: Scheduled cleanup service catches any missed deletions
- **Fallback**: `getExpired()` method allows manual cleanup if both automated systems fail

### Authorization Framework
- Only `SystemPassport` can schedule conversation deletion
- Domain layer enforces permission checks before setting expiration
- Passport/Visa pattern prevents unauthorized data retention modifications

### Audit Trail
- OpenTelemetry tracing records all deletion scheduling operations
- Span events capture individual conversation processing
- Error spans track any failures during batch processing

### Data Integrity
- Conversations linked to listings via a `listingId` foreign key
- Cascade deletion triggered by listing archival status change
- No orphaned conversations due to comprehensive cleanup mechanism

## Success Criteria

### Automatic Deletion
- All conversations for archived listings are deleted shortly after 6 months
- MongoDB TTL index and the daily cleanup job remove expired documents; deletions are performed by MongoDB's background TTL task and may be delayed beyond the exact expiration time
- No manual intervention is typically required for the standard deletion flow, aside from operational responses to observed failures

### Authorization Enforcement
- Domain layer prevents unauthorized expiration date modifications
- Only system-level operations can schedule deletions
- User passports cannot extend or prevent deletion

### Observability
- Deletion scheduling operations are traced with OpenTelemetry
- Batch processing results are logged with counts
- Failures are recorded with appropriate error context

### Fallback Coverage
- Daily cleanup job catches any missed deletions
- Partial failures don't prevent other conversations from being processed
- Error collection enables investigation of persistent issues
