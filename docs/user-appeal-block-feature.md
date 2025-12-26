# User Appeal Block Feature

## Overview
The User Appeal Block feature enables blocked users to submit appeals requesting a review of their account status. Administrators can then review these appeals and decide whether to accept or deny them, providing transparency and fairness in the moderation process.

## User Experience

### For Blocked Users

When a user's account is blocked:
1. An alert banner appears at the top of their profile page
2. The banner explains they've been blocked and can submit an appeal
3. A form is provided to submit their appeal with:
   - Text area for explanation (10-1000 characters)
   - Character counter
   - Submit button
4. After submission, the user sees:
   - Their appeal text
   - Current status (Pending/Accepted/Denied)
   - Submission date
   - Status-specific information message

### For Administrators

Administrators can manage appeals through the Admin Dashboard:
1. Navigate to Admin Dashboard → Appeals tab
2. View list of all appeal requests with:
   - User name and email
   - Appeal type (USER or LISTING)
   - Status (Pending/Accepted/Denied)
   - Submission date
3. Filter appeals by status
4. Search by user name or email
5. Actions available:
   - View Details: See full appeal in modal
   - View User: Navigate to user profile (TODO)
   - Accept: Approve appeal and unblock user
   - Deny: Reject appeal, keep user blocked

## Technical Architecture

### Components

#### User-Facing Components
- **`UserAppeal`** (`user-appeal.tsx`): Presentational component displaying appeal form/status
- **`UserAppealContainer`** (`user-appeal.container.tsx`): Container handling GraphQL mutations
- **`ProfileView`**: Updated to conditionally show UserAppeal when user is blocked

#### Admin Components
- **`AdminAppealsTable`** (`admin-appeals-table.tsx`): Table displaying all appeals
- **`AdminAppealsTableContainer`** (`admin-appeals-table.container.tsx`): Container fetching appeals data
- **`AdminDashboardMain`**: Updated with Appeals tab

### GraphQL Operations

#### Mutations
```graphql
# User submits appeal
mutation CreateUserAppealRequest($input: CreateUserAppealRequestInput!) {
  createUserAppealRequest(input: $input) {
    id
    reason
    state
    type
    createdAt
  }
}

# Admin updates appeal status
mutation UpdateUserAppealRequestState($input: UpdateUserAppealRequestStateInput!) {
  updateUserAppealRequestState(input: $input) {
    id
    state
    updatedAt
  }
}
```

#### Queries
```graphql
# Admin fetches all appeals
query GetAllUserAppealRequests($input: GetAllUserAppealRequestsInput!) {
  getAllUserAppealRequests(input: $input) {
    items {
      id
      reason
      state
      type
      createdAt
      user {
        id
        account {
          username
          email
          profile {
            firstName
            lastName
          }
        }
      }
    }
    total
    page
    pageSize
  }
}
```

### State Management

Appeal states:
- **REQUESTED**: Initial state when appeal is submitted
- **ACCEPTED**: Admin approved the appeal
- **DENIED**: Admin rejected the appeal

### Validation

**Client-Side:**
- Appeal reason: 10-1000 characters
- Required fields validation
- Form validation via Ant Design Form

**Server-Side:**
- Domain model `Reason` value object validates minimum 10 characters
- State transitions validated by domain logic
- Permissions checked via visa pattern

## Known Limitations

### TODO Items
1. **BlockerId Issue**: Currently uses userId as fallback. Backend should provide actual blocker ID.
2. **View User Navigation**: Placeholder implementation, needs routing setup.
3. **Server-Side Search**: Search is client-side, should be in GraphQL query for performance.

### Future Enhancements
- Real-time notifications for appeal status changes
- Email notifications to users
- Appeal analytics dashboard
- Multi-level appeal review process
- OpenTelemetry logging integration
- Appeal history tracking

## References

- BRD: `documents/share-thrift-brd.md` - Appeal Block section
- SRD: `documents/share-thrift-srd-bronze.md` - Appeal Block workflow
- Domain Model: `packages/sthrift/domain/src/domain/contexts/appeal-request/`
- Application Services: `packages/sthrift/application-services/src/contexts/appeal-request/`
- GraphQL Schema: `packages/sthrift/graphql/src/schema/types/appeal-request/`
