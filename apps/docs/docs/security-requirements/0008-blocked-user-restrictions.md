---
sidebar_position: 9
sidebar_label: 0008 Blocked User Restrictions
description: "Blocked users must not be able to take actions such as messaging, reserving, or publishing"
status: pending
contact: 
date: 2025-10-29
deciders: 
consulted: 
informed: 
---

# Blocked User Restrictions

## Security Requirement Statement
Blocked users must not be able to take actions such as messaging, reserving, or publishing.

## Control Classification
- **Timing Control Category**: Preventive
- **Nature Control Category**: Technical
- **Status**: Identified
- **Date Identified**: 2025-10-29
- **Date First Implemented**: TBD
- **Date Last Reviewed**: 2025-10-29
- **Date Retired**: N/A

## Replacement Control
TBD

## Implementation Approach
ShareThrift implements blocked user restrictions through a multi-layered data model and domain-driven architecture. User blocking is managed through the `isBlocked` boolean field on user entities, with enforcement mechanisms implemented at the UI, GraphQL, and domain layers.

## Compensating Controls
1. **Admin Dashboard Interface**: Comprehensive UI for blocking/unblocking users with reason tracking and duration controls
2. **Database-Level Flags**: `isBlocked` boolean field on `PersonalUser` model ensures persistent blocked state
3. **GraphQL Resolver Authentication**: JWT token validation prevents unauthenticated access to restricted operations
4. **Frontend State Management**: UI components conditionally render based on user status and authentication state

## Context and Problem Statement
ShareThrift requires robust mechanisms to prevent blocked users from performing platform actions including creating listings, making reservations, and engaging in messaging. The platform must ensure that when administrators block users for policy violations, late returns, inappropriate behavior, or other infractions, those users cannot circumvent restrictions through any available interface.

### Business Impact:
- **Trust & Safety**: Blocked users cannot continue harmful behaviors or policy violations
- **Community Protection**: Legitimate users are protected from blocked users' potential misconduct  
- **Administrative Control**: Staff can effectively moderate platform usage and enforce community standards
- **Compliance**: Platform can demonstrate proactive user management for regulatory purposes

## Technical Requirements

### 1. User Blocking Data Model
**Database Schema Implementation**:
```typescript
// PersonalUser model with blocking capability
interface PersonalUser extends User {
  isBlocked: boolean; // Default: false
  account: {
    accountType: string;
    username: string;
    profile: UserProfile;
  };
  role: PersonalUserRoleReference;
  // Other user properties...
}

// Block reason tracking in admin interface
interface BlockingDetails {
  reason: 'Late Return' | 'Item Damage' | 'Policy Violation' | 'Inappropriate Behavior' | 'Other';
  duration: '7' | '30' | '90' | 'indefinite'; // Days
  description: string; // Message shown to user
  blockedAt: Date;
  blockedBy: AdminUserReference;
}
```

### 2. Admin Blocking Operations
**Admin Dashboard Controls**:
```typescript
// Block user operation with comprehensive tracking
interface BlockUserOperation {
  targetUserId: string;
  blockingDetails: {
    reason: BlockReason;
    duration: BlockDuration;
    adminDescription: string; // Internal notes
    userMessage: string; // Message displayed to blocked user
  };
  adminUserId: string;
  timestamp: Date;
}

// Unblock operation restores user capabilities
interface UnblockUserOperation {
  targetUserId: string;
  adminUserId: string;
  unblockReason: string;
  timestamp: Date;
}
```

**Admin Interface Features**:
- **Block Duration Options**: 7 days, 30 days, 90 days, indefinite
- **Reason Categories**: Late Return, Item Damage, Policy Violation, Inappropriate Behavior, Other
- **User Communication**: Custom message displayed explaining block reason
- **Confirmation Required**: "This will prevent them from creating listings and making reservations"

### 3. Blocked User State Management
**Domain Entity Integration**:
```typescript
// PersonalUser domain entity with block state
export class PersonalUser extends AggregateRoot {
  get isBlocked(): boolean {
    return this.props.isBlocked;
  }
  
  set isBlocked(value: boolean) {
    this.validateAdminPermissions(); // Only admins can modify
    this.props.isBlocked = value;
    this.props.updatedAt = new Date();
  }
  
  // Domain validation for blocked user operations
  validateUserCanPerformAction(action: UserAction): void {
    if (this.isBlocked) {
      throw new BusinessRuleViolationError(
        `Blocked users cannot perform ${action}. Contact support for assistance.`
      );
    }
  }
}
```

### 4. GraphQL Mutation Protection
**Reservation Request Creation Security**:
```typescript
// Reservation creation with user validation
createReservationRequest: async (parent, args, context) => {
  const authenticatedUser = context.applicationServices.verifiedUser;
  if (!authenticatedUser?.verifiedJwt) {
    throw new Error('User must be authenticated to create a reservation request');
  }
  
  const reserver = await context.applicationServices.User.PersonalUser
    .getByEmail(authenticatedUser.verifiedJwt.email);
    
  // Validate user is not blocked before allowing reservation
  if (reserver?.isBlocked) {
    throw new Error('Blocked users cannot make reservation requests');
  }
  
  return await context.applicationServices.ReservationRequest.create({
    listingId: args.input.listingId,
    reservationPeriodStart: new Date(args.input.reservationPeriodStart),
    reservationPeriodEnd: new Date(args.input.reservationPeriodEnd),
    reserverEmail: authenticatedUser.verifiedJwt.email,
  });
}
```

**Listing Creation Security**:
```typescript
// Listing creation with sharer validation  
createItemListing: async (parent, args, context) => {
  const userEmail = context.applicationServices.verifiedUser?.verifiedJwt?.email;
  if (!userEmail) {
    throw new Error('Authentication required');
  }
  
  const user = await context.applicationServices.User.PersonalUser
    .queryByEmail({ email: userEmail });
  if (!user) {
    throw new Error(`User not found for email ${userEmail}`);
  }
  
  // Prevent blocked users from creating listings
  if (user.isBlocked) {
    throw new Error('Blocked users cannot create listings');
  }
  
  return await context.applicationServices.Listing.ItemListing.create({
    sharer: user,
    title: args.input.title,
    description: args.input.description,
    // Additional listing fields...
  });
}
```

### 5. UI Access Control Implementation
**Blocked User Experience**:
```typescript
// Conditional rendering based on user block status
export const CreateListingButton: React.FC = () => {
  const { currentUser } = useAuthContext();
  const isBlocked = currentUser?.isBlocked;
  
  if (isBlocked) {
    return (
      <Tooltip title="Your account has been restricted. Contact support for assistance.">
        <Button disabled type="primary">
          Create Listing (Restricted)
        </Button>
      </Tooltip>
    );
  }
  
  return (
    <Button type="primary" onClick={handleCreateListing}>
      Create Listing
    </Button>
  );
};

// Reservation request restrictions
export const ReservationControls: React.FC = ({ listing }) => {
  const { currentUser } = useAuthContext();
  
  if (currentUser?.isBlocked) {
    return (
      <Alert 
        type="warning" 
        message="Account Restricted"
        description="Your account is currently blocked. You cannot make reservation requests."
        showIcon
      />
    );
  }
  
  return <ReservationRequestForm listing={listing} />;
};
```

## Success Criteria

### ✅ Implemented Security Controls:
1. **Database Blocking Model**: `isBlocked` boolean field persistently tracks user restriction status
2. **Admin Management Interface**: Comprehensive blocking/unblocking controls with reason tracking and duration options
3. **GraphQL Authentication Gates**: JWT token validation prevents unauthenticated access to restricted operations
4. **UI State Management**: Frontend components conditionally render based on user authentication and block status
5. **Block Communication System**: Custom messages inform users about restrictions and contact information

### 🔄 Current Implementation Status:
**Fully Implemented**:
- User blocking data model with `isBlocked` field
- Admin dashboard with block/unblock operations
- UI components that check authentication status
- GraphQL resolvers with JWT validation

**Partially Implemented**:
- GraphQL resolvers validate authentication but lack explicit `isBlocked` checks
- UI components check authentication but may not explicitly validate block status
- Domain layer has blocking capabilities but enforcement may not be comprehensive

### 📊 Restriction Coverage:
1. **Listing Creation**: GraphQL resolver authenticates users but needs explicit block validation
2. **Reservation Requests**: Authentication required but block status checking needs enhancement  
3. **Messaging Operations**: Authentication framework in place, block enforcement needs verification
4. **Profile Updates**: Authentication-gated with domain-level permission validation

### 🔧 Enhancement Opportunities:
1. **Comprehensive Block Validation**: Add explicit `isBlocked` checks to all user-initiated operations
2. **Standardized Error Messaging**: Consistent blocked user error responses across all endpoints
3. **Audit Trail Enhancement**: Detailed logging of blocked user attempt activities
4. **Block Reason Display**: User-facing explanation of block reasons and appeal processes
5. **Time-Based Block Expiration**: Automatic unblocking based on configured duration periods