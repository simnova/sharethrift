# User Appeal Request

## Purpose
The `user-appeal-request` aggregate represents an appeal filed by a user to unblock their account that has been blocked by an administrator or system action.

## Domain Concepts

### Aggregate Root: UserAppealRequest
The main entity that encapsulates all business logic related to user account appeals.

**Key Properties:**
- `user`: The personal user who filed the appeal
- `reason`: The explanation for why the account should be unblocked
- `state`: Current state of the appeal (requested, denied, accepted)
- `type`: Type of appeal (always 'user' for this subdomain)
- `blocker`: The admin/user who blocked the account

### Value Objects
- `Reason`: Validates appeal reason (10-1000 characters)
- `State`: Ensures valid state transitions (requested → denied/accepted)
- `Type`: Validates appeal type

## Supported Commands
- **Create Appeal**: User files a new appeal for their blocked account
- **Update State**: Admin approves or denies the appeal
- **Query by ID**: Retrieve a specific appeal by identifier

## Authorization Requirements
TODO: Implement Passport/Visa when appeal-request context is complete
- Users can create appeals for their own blocked accounts
- Admins can view all appeals
- Only admins can approve/deny appeals

## Business Rules
1. Reason must be between 10 and 1000 characters
2. Appeals start in 'requested' state
3. State can only transition from requested → denied or requested → accepted
4. Once denied or accepted, state cannot be changed
5. Appeal type is always 'user' for this subdomain

## Events
TODO: Add domain/integration events for:
- Appeal created
- Appeal state changed (approved/denied)

## Related Aggregates
- **PersonalUser**: The user filing the appeal and the blocker
