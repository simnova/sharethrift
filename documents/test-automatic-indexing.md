# Testing Automatic Search Indexing

## Prerequisites
1. Start the API: `cd apps/api && func start --typescript`
2. Start the Frontend: `cd apps/ui-sharethrift && pnpm dev`
3. Ensure MongoDB is running (via MongoDB Memory Server)

## Test Scenario 1: Create a New Listing

### Steps:
1. Open browser to `http://localhost:5173`
2. Navigate to "Create Listing" form
3. Fill in the form:
   - Title: "GoPro Hero 12 for Weekend Trips"
   - Description: "4K camera perfect for adventures"
   - Category: "Electronics"
4. Click "Save"

### What Happens Behind the Scenes:
```
Frontend Form Submit
  ↓
GraphQL Mutation: createItemListing()
  ↓
Application Service: ListingService.create()
  ↓
Domain Entity: ItemListing.onSave(true) // isModified = true
  ↓
Integration Event Raised: ItemListingUpdatedEvent
  ↓
Event Handler: ItemListingUpdatedUpdateSearchIndexHandler()
  ↓
Search Index Updated: searchService.indexDocument()
```

### Verification:
1. Navigate to Search page
2. Search for "GoPro" or "camera" or "adventures"
3. **The new listing should appear in results immediately!**

## Test Scenario 2: Update an Existing Listing

### Steps:
1. Open an existing listing (e.g., "Camera")
2. Edit the title to add "Professional" → "Professional Camera"
3. Click "Save"

### What Happens:
```
GraphQL Mutation: updateItemListing()
  ↓
ItemListing.onSave(true) // isModified = true
  ↓
ItemListingUpdatedEvent raised
  ↓
Search index automatically updated
```

### Verification:
1. Search for "Professional"
2. **The updated listing should appear with the new title!**

## Test Scenario 3: Delete a Listing

### Steps:
1. Open an existing listing
2. Click "Delete" button
3. Confirm deletion

### What Happens:
```
GraphQL Mutation: deleteItemListing()
  ↓
ItemListing.isDeleted = true
ItemListing.onSave(true)
  ↓
ItemListingDeletedEvent raised
  ↓
Search document removed from index
```

### Verification:
1. Search for the deleted listing's title
2. **It should NOT appear in results anymore!**

## Test Scenario 4: No Changes = No Indexing

### Steps:
1. Open an existing listing
2. Don't make any changes
3. Click "Save"

### What Happens:
```
GraphQL Mutation: updateItemListing()
  ↓
ItemListing.onSave(false) // isModified = false
  ↓
NO integration event raised (optimization!)
  ↓
No unnecessary search index updates
```

## Debugging Tips

### Check if Events are Being Raised
Look for these console logs in the API terminal:
```
Repo dispatching IntegrationEvent : ItemListingUpdatedEvent
```

### Check Search Index State
Run this GraphQL query to see what's in the search index:
```graphql
query {
  searchListings(input: { searchString: "*" }) {
    count
    items {
      id
      title
      updatedAt
    }
  }
}
```

### Manual Re-indexing
If something gets out of sync, you can manually re-index all listings:
```graphql
mutation {
  bulkIndexListings {
    successCount
    totalCount
    message
  }
}
```

## Performance Notes

- **Asynchronous**: Search indexing happens AFTER the database transaction commits
- **Non-blocking**: The GraphQL mutation returns immediately; indexing happens in the background
- **Optimized**: Only modified listings trigger re-indexing
- **Consistent**: If database save fails, no event is raised (no orphaned index updates)

## Troubleshooting

### Listing not appearing in search results?
1. Check if the listing was actually saved to the database
2. Verify the integration event handler is registered (check startup logs)
3. Run bulk re-indexing mutation to sync everything
4. Check for errors in the API terminal

### Search results showing old data?
1. The listing might not have been modified (check `isModified` flag)
2. Try manual re-indexing
3. Restart the API to clear any cached state

### Events not firing?
1. Ensure `ItemListing.onSave()` is being called (add a breakpoint or log)
2. Check that the repository is calling `item.onSave()`
3. Verify integration event bus is initialized properly
