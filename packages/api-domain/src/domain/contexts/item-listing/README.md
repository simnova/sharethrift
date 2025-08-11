# ItemListing Domain Context

This bounded context manages the item listing functionality for the ShareThrift platform.

## Domain Structure

### Entities
- `ItemListing` - The main aggregate root representing a listing that users can create to share items

### Value Objects
- `ListingState` - Enumeration of possible listing states
- `Category` - Item categories for filtering
- `Location` - Location information for listings

### Operations
- Browse active listings
- Create new listings
- Update listing details
- Filter listings by category and location
- Search listings

## Business Rules

1. Only active listings are shown to regular users
2. Listings have a sharing period with start and end dates
3. Each listing belongs to a category for filtering
4. Location information is required for all listings
5. Users can only modify their own listings