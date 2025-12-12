# User Profile Navigation

This document describes the navigation pattern for linking to user profiles from various locations in the ShareThrift UI.

## Overview

Users can navigate to another user's profile by clicking on their name or profile image wherever it appears in the application. This provides a consistent and intuitive way to view user information.

## Navigation Route

User profiles are accessed via the route:

```
/user/:userId
```

Where `:userId` is the ObjectID of the user.

## Shared Components

Two reusable components are provided for consistent user profile navigation:

### UserProfileLink

A clickable text link that navigates to a user's profile.

**Usage:**
```tsx
import { UserProfileLink } from '../shared/user-profile-link.tsx';

<UserProfileLink 
  userId="507f1f77bcf86cd799439011" 
  displayName="John Doe"
  style={{ fontWeight: 500 }}
/>
```

**Props:**
- `userId` (required): The ObjectID of the user
- `displayName` (required): The text to display as the link
- `className` (optional): Additional CSS classes
- `style` (optional): Custom inline styles

### UserAvatar

A clickable avatar that navigates to a user's profile.

**Usage:**
```tsx
import { UserAvatar } from '../shared/user-avatar.tsx';

<UserAvatar 
  userId="507f1f77bcf86cd799439011" 
  userName="John Doe"
  size={48}
  avatarUrl="https://example.com/avatar.jpg"
  shape="circle"
/>
```

**Props:**
- `userId` (required): The ObjectID of the user
- `userName` (required): The name of the user (for accessibility and fallback initial)
- `size` (optional): Size of the avatar in pixels (default: 48)
- `avatarUrl` (optional): URL of the user's avatar image
- `className` (optional): Additional CSS classes
- `style` (optional): Custom inline styles
- `shape` (optional): 'circle' or 'square' (default: 'circle')

## Implementation Locations

User profile navigation has been implemented in the following components:

### 1. Listing Sharer Information
**Component:** `sharer-information.tsx`
- Avatar and name link to the sharer's profile
- Located on item listing detail pages

### 2. Conversation Headers (Listing Banner)
**Component:** `listing-banner.tsx`
- User name in conversation headers links to their profile
- Located in the Messages section

### 3. My Listings - Requests Table
**Component:** `requests-table.tsx`
- "Requested By" column entries link to the requester's profile
- Located in My Listings > Requests view

### 4. Message Thread
**Component:** `message-thread.tsx`
- Message author avatars link to their profiles
- Located in the Messages conversation view

## GraphQL Integration

### User Profile Query

The `UserProfileViewContainer` uses the following GraphQL query to fetch user data:

```graphql
query HomeViewUserProfileContainerUserById($userId: ObjectID!) {
  userById(id: $userId) {
    ... on PersonalUser {
      id
      userType
      createdAt
      account {
        accountType
        username
        profile {
          firstName
          lastName
          aboutMe
          location {
            city
            state
          }
        }
      }
    }
    ... on AdminUser {
      # Similar fields for admin users
    }
  }
}
```

### Listing Request Enhancement

The `ListingRequest` type has been enhanced with a `requestedById` field:

```graphql
type ListingRequest {
  id: ObjectID!
  title: String!
  image: String
  requestedBy: String!
  requestedById: ObjectID  # New field
  requestedOn: String!
  reservationPeriod: String!
  status: String!
}
```

## Accessibility

Both `UserProfileLink` and `UserAvatar` components are designed with accessibility in mind:

- Use semantic Ant Design Link component for proper keyboard navigation
- Include ARIA labels on avatars (`aria-label="View {userName}'s profile"`)
- Maintain focus states for keyboard navigation
- Provide visual indication of clickability (hover states, pointer cursor)

## Best Practices

1. **Always use the shared components** (`UserProfileLink` and `UserAvatar`) instead of creating custom navigation implementations
2. **Pass the user ID** from your GraphQL data to ensure correct navigation
3. **Provide meaningful display names** for accessibility
4. **Test keyboard navigation** when implementing in new locations
5. **Handle edge cases** (e.g., when user data is unavailable)

## Testing

Storybook stories are available for both components:
- `UserProfileLink.stories.tsx`
- `UserAvatar.stories.tsx`

These stories demonstrate various use cases and styling options.

## Future Enhancements

Potential future enhancements to the user profile navigation pattern:

1. Add user listings to the public profile view (requires backend query for public listings by user ID)
2. Implement user blocking/reporting functionality accessible from profile
3. Add user rating/review system
4. Enable direct messaging from profile view
5. Show mutual connections or shared listings
