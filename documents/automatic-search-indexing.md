# Automatic Search Indexing

## Overview

The application now automatically updates the search index whenever listings are created, updated, or deleted. You no longer need to manually call `bulkIndexListings` after making changes.

## How It Works

### Architecture

1. **Domain Events**: When an `ItemListing` entity is saved, it raises integration events:
   - `ItemListingUpdatedEvent` - When a listing is created or modified
   - `ItemListingDeletedEvent` - When a listing is deleted

2. **Event Handlers**: These events are caught by handlers in `packages/sthrift/event-handler/src/handlers/integration/`:
   - `item-listing-updated--update-search-index.ts` - Updates the search index
   - `item-listing-deleted--update-search-index.ts` - Removes from search index

3. **Unit of Work**: The `MongoUnitOfWork` automatically:
   - Collects integration events from saved entities
   - Dispatches them after the database transaction commits
   - Ensures search index stays in sync with database

### Code Changes

**ItemListing Entity** (`packages/sthrift/domain/src/domain/contexts/listing/item/item-listing.ts`):
```typescript
public override onSave(isModified: boolean): void {
  if (this.isDeleted) {
    // Raise deleted event for search index cleanup
    this.addIntegrationEvent(ItemListingDeletedEvent, {
      id: this.props.id,
      deletedAt: new Date(),
    });
  } else if (isModified) {
    // Raise updated event for search index update
    this.addIntegrationEvent(ItemListingUpdatedEvent, {
      id: this.props.id,
      updatedAt: this.props.updatedAt,
    });
  }
}
```

## Testing Automatic Indexing

### 1. Create a New Listing

```bash
curl -s http://localhost:7071/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createItemListing(input: { ... }) { id title } }"
  }' | jq
```

The listing will be automatically indexed - no manual action needed!

### 2. Update an Existing Listing

```bash
curl -s http://localhost:7071/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { updateItemListing(id: \"...\", input: { ... }) { id title } }"
  }' | jq
```

The search index will automatically update with the new data.

### 3. Delete a Listing

```bash
curl -s http://localhost:7071/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { deleteItemListing(id: \"...\") }"
  }' | jq
```

The listing will be automatically removed from the search index.

### 4. Verify Search Results

```bash
curl -s http://localhost:7071/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { searchListings(input: { searchString: \"your search\" }) { count items { id title } } }"
  }' | jq
```

## When to Use Bulk Indexing

You only need `bulkIndexListings` in these scenarios:

1. **Initial Setup**: When first setting up the system with existing data
2. **After API Restart**: Since the mock search service is in-memory (dev only)
3. **Index Corruption**: If the index gets out of sync for some reason
4. **Data Migration**: After bulk importing data directly into the database

## Production Considerations

### Real Azure Cognitive Search

In production with real Azure Cognitive Search:
- The index persists across restarts
- Automatic indexing keeps everything in sync
- Manual bulk indexing rarely needed

### Mock Search Service (Development)

In development with the mock in-memory search:
- Index is lost on API restart
- Run `bulkIndexListings` once after startup if needed
- Automatic indexing works during runtime

## Monitoring

Watch for these log messages to confirm automatic indexing is working:

```
dispatch integration event ItemListingUpdatedEvent with payload {"id":"...","updatedAt":"..."}
Listing ... not found, skipping search index update
Failed to update search index for ItemListing ...:
```

## Troubleshooting

### Listing Not Appearing in Search

1. **Check if event was raised**: Look for "dispatch integration event" in logs
2. **Verify event handler registered**: Look for "Registering search index event handlers..." at startup
3. **Check for errors**: Look for "Failed to update search index" messages

### Index Out of Sync

Run manual bulk indexing:

```bash
curl -s http://localhost:7071/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { bulkIndexListings { successCount totalCount message } }"}' | jq
```

## Benefits

✅ **Always in Sync**: Search results always match database state
✅ **No Manual Work**: Developers don't need to remember to reindex
✅ **Real-time Updates**: Search reflects changes immediately
✅ **Reliable**: Uses database transactions to ensure consistency
✅ **Automatic Cleanup**: Deleted listings automatically removed from index
