# Browse Listings Page Components

This directory contains the components for the Browse Listings functionality in ShareThrift.

## Overview

The Browse Listings page allows both logged-in and logged-out users to browse and view available listings. It implements the design specifications from the Figma file and includes filtering, search, and responsive layouts.

## Components Structure

### Molecules

- **`listing-card`** - Individual listing card component showing thumbnail, title, dates, and location in a 4-card grid layout
- **`hero-section`** - Hero section with background image, tagline, and search bar (shown only for logged-out users)  
- **`search-filter-bar`** - Combined search input, category filter dropdown, and Create Listing button (for logged-in users)

### Organisms

- **`listings-grid`** - Grid layout component that displays listing cards in a responsive 4-column layout with pagination

### Pages

- **`Listings.tsx`** - Main page component that orchestrates all the above components and manages state

## Features Implemented

✅ **User State Management**: Different layouts for logged-in vs logged-out users  
✅ **Hero Section**: Only displayed for logged-out users with search functionality  
✅ **Search**: Filter listings by title text  
✅ **Category Filter**: Dropdown with predefined categories  
✅ **Grid Layout**: Responsive 4-card grid (4 on desktop, 3 on tablet, 2 on mobile, 1 on small mobile)  
✅ **Listing Cards**: Square thumbnails with title, date range, and location  
✅ **Create Listing Button**: Shown only for logged-in users  
✅ **Pagination**: Ready for implementation with backend  
✅ **Empty States**: "No Listings Found" message when filters yield no results  
✅ **Lazy Loading**: Images use `loading="lazy"` attribute  
✅ **Location Display**: Shows current location (Philadelphia, PA · 10 mi)  

## State Management

The main Listings page manages the following state:
- `searchQuery` - Current search text
- `selectedCategory` - Selected category filter
- `currentPage` - Current pagination page
- `isAuthenticated` - User authentication status (TODO: connect to real auth)

## Data

Currently uses dummy data from `src/data/dummy-listings.ts` with 12 sample listings using assets from `src/assets/item-images/`. This will be replaced with GraphQL queries when the backend is ready.

## GraphQL Schema

The GraphQL query structure is defined in `src/graphql/listings.graphql` and follows the ItemListing schema from the requirements:

```typescript
interface ItemListing {
  _id: string;
  sharer: string; // User reference
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  state?: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
  // ... other fields
}
```

## Responsive Design

The grid layout adapts to different screen sizes:
- **Desktop (1200px+)**: 4 cards per row
- **Tablet (768px-1199px)**: 3 cards per row  
- **Mobile (576px-767px)**: 2 cards per row
- **Small Mobile (<576px)**: 1 card per row

## Future Enhancements

- Connect to real authentication context
- Integrate with backend GraphQL API
- Implement infinite scroll as alternative to pagination
- Add more sophisticated filtering options
- Add sorting capabilities
- Implement listing detail page navigation