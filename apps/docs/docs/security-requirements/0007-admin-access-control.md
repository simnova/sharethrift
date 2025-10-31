---
sidebar_position: 8
sidebar_label: 0007 Admin Access Control
description: "Access to admin-only routes must be restricted via role-based access control"
status: pending
contact: 
date: 2025-10-29
deciders: 
consulted: 
informed: 
---

# Admin Access Control

## Security Requirement Statement
Access to admin-only routes must be restricted via role-based access control.

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
ShareThrift implements admin access control through a multi-layered authorization system combining role-based permissions, domain-driven authorization, and GraphQL resolver-level security controls.

## Compensating Controls
1. **JWT Authentication**: All admin operations require valid JWT tokens validated through Azure AD B2C
2. **Domain Permissions**: Fine-grained permission checking at the domain layer via Passport/Visa pattern
3. **UI Route Protection**: Admin dashboard routes are conditionally rendered based on user permissions
4. **GraphQL Context Authorization**: Request-level context includes user verification and permission evaluation

## Context and Problem Statement
ShareThrift requires robust admin access control to protect administrative operations including user blocking/unblocking, listing moderation, and platform management. The platform needs to ensure that only authorized staff members can access admin functionality while maintaining proper audit trails and security boundaries.

### Business Requirements Addressed:
- **Admin Dashboard Access**: Restricted to admin accounts only via `AdminDashboard` component protection
- **User Moderation**: Block/unblock users through role-based permissions (`canBlockUsers`, `canUnblockUsers`)
- **Listing Management**: Admin-only listing moderation capabilities (`canBlockListings`, `canRemoveListings`)
- **Report Access**: Admin view of user and listing reports (`canViewUserReports`, `canViewListingReports`)

## Technical Requirements

### 1. Domain Permission Model
```typescript
// packages/sthrift/domain/src/domain/contexts/user/user.domain-permissions.ts
export interface UserDomainPermissions {
  // Admin Permissions
  canCreateUser: boolean;
  canBlockUsers: boolean;
  canBlockListings: boolean;
  canUnblockUsers: boolean;
  canUnblockListings: boolean;
  canRemoveListings: boolean;
  canViewListingReports: boolean;
  canViewUserReports: boolean;
  
  isEditingOwnAccount: boolean;
  isSystemAccount: boolean;
}
```

### 2. Passport/Visa Authorization Pattern
**System-Level Passport** (Admin Privileges):
```typescript
// packages/sthrift/domain/src/domain/iam/system/contexts/system.user.passport.ts
export class SystemUserPassport extends SystemPassportBase implements UserPassport {
  forPersonalUser(_root: PersonalUserEntityReference): UserVisa {
    const permissions = this.permissions as UserDomainPermissions;
    return { determineIf: (func) => func(permissions) };
  }
}
```

**User-Level Passport** (Standard Users):
```typescript
// packages/sthrift/domain/src/domain/iam/user/personal-user/personal-user.user.visa.ts
export class PersonalUserUserVisa implements UserVisa {
  determineIf(func: (permissions: Readonly<UserDomainPermissions>) => boolean): boolean {
    const updatedPermissions: UserDomainPermissions = {
      canCreateUser: false,
      canBlockUsers: false,        // Regular users cannot block
      canBlockListings: false,     // Regular users cannot moderate listings
      canUnblockUsers: false,      // Regular users cannot unblock
      canUnblockListings: false,   // Regular users cannot unblock listings
      canRemoveListings: false,    // Regular users cannot remove listings
      canViewListingReports: false, // Regular users cannot view reports
      canViewUserReports: false,   // Regular users cannot view reports
      
      isEditingOwnAccount: this.user.id === this.root.id,
      isSystemAccount: false,
    };
    return func(updatedPermissions);
  }
}
```

### 3. GraphQL Resolver Protection
**Multi-Layer Authorization Implementation**:
```typescript
// GraphQL resolver security pattern
export class AdminOperationResolver {
  async performAdminAction(args: AdminActionArgs, context: GraphContext) {
    // Layer 1: JWT Authentication
    this.validateAuthentication(context);
    
    // Layer 2: Admin Permission Verification
    this.validateAdminPermissions(context);
    
    // Layer 3: Domain Authorization
    const userVisa = context.passport.user.forPersonalUser(targetUser);
    if (!userVisa.determineIf(p => p.canPerformAdminAction)) {
      throw new Error('Insufficient permissions');
    }
    
    return await this.executeOperation(args);
  }
}

### 4. Frontend Admin Dashboard Protection
**Admin Dashboard Components**:
- `AdminUsersTable`: User management with block/unblock operations
- `AdminUsersCard`: Individual user action controls
- Route: `/account/admin-dashboard` (conditionally accessible)

**Admin Action Types**:
```typescript
// apps/ui-sharethrift/src/components/layouts/home/account/admin-dashboard/components/admin-users-table.types.ts
export interface AdminUsersTableProps {
  onAction: (
    action: 'block' | 'unblock' | 'view-profile' | 'view-report', 
    userId: string
  ) => void;
}
```

**Admin Operations UI**:
- **Block User Modal**: Reason selection (Late Return, Item Damage, Policy Violation, Inappropriate Behavior, Other)
- **Duration Options**: 7 Days, 30 Days, 90 Days, Indefinite
- **Unblock Confirmation**: Restore user access capabilities

### 5. API Security Configuration
**Secure Handler Implementation**:
```typescript
// API endpoint configuration with authentication
.registerSecureHandler('admin-operations', {
  route: 'admin/{*operations}',
  authLevel: 'authenticated',
  methods: ['POST', 'PUT', 'DELETE'],
}, secureAdminHandlerCreator)
```

**Request Authorization Pipeline**:
```typescript
// Security context establishment
context: async ({ req }) => {
  const authToken = this.extractAuthToken(req);
  const userContext = await this.validateAndEnrichUser(authToken);
  
  return {
    applicationServices: await this.createAuthorizedServices(userContext),
    securityContext: this.establishSecurityBoundary(userContext)
  };
}
```

## Success Criteria

### ✅ Implemented Security Controls:
1. **Multi-Factor Authentication**: JWT token validation integrated with Azure AD B2C identity provider
2. **Role-Based Authorization**: Comprehensive domain permission framework with granular admin capabilities
3. **Architectural Security**: Passport/Visa pattern ensures clean separation of authorization concerns
4. **UI Security Boundaries**: Admin interface components implement proper access control validation
5. **Type-Safe Operations**: Strongly-typed API contracts prevent parameter manipulation attacks
6. **Request Context Security**: Authenticated request processing with user verification pipeline

### 🔒 Security Enforcement Layers:
1. **Authentication Layer**: Valid JWT tokens required for all administrative operations
2. **Authorization Layer**: Domain-specific permissions validated before operation execution  
3. **UI Protection Layer**: Admin dashboard access restricted based on user role verification
4. **Data Access Layer**: Repository-level access controls ensure data boundary enforcement

### � Compliance Achievements:
- **Principle of Least Privilege**: Users granted minimum necessary permissions for their role
- **Defense in Depth**: Multiple security layers prevent single point of failure
- **Audit Readiness**: Administrative operations include comprehensive logging capabilities
- **Secure by Default**: System denies access unless explicitly authorized

### 🎯 Operational Security Features:
- **Session Management**: Secure token handling with appropriate expiration policies
- **Permission Granularity**: Fine-grained control over individual administrative capabilities
- **Error Handling**: Security-conscious error responses prevent information disclosure
- **Access Monitoring**: Administrative action tracking for security oversight