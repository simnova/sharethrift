---
sidebar_position: 3
sidebar_label: 0003 User Blocking Moderation
description: "Admins must be able to block/unblock users and listings to moderate abuse or violations"
status: pending
contact: 
date: 2025-10-29
deciders: 
consulted: 
informed: 
---

# User Blocking Moderation

## Security Requirement Statement
Admins must be able to block/unblock users and listings to moderate abuse or violations.

## Control Classification
- **Timing Control Category**: Corrective
- **Nature Control Category**: Administrative
- **Status**: Identified
- **Date Identified**: 2025-10-29
- **Date First Implemented**: TBD
- **Date Last Reviewed**: 2025-10-29
- **Date Retired**: N/A

**Admin Dashboard with Real-time Management**
- Centralized admin dashboard at `/home/account/admin-dashboard` provides tabular view of all users with filtering by status (Active/Blocked)
- Real-time user search and pagination with 50 users per page (BRD specification)
- Instant block/unblock actions with modal confirmations requiring reason selection and description
- Visual status indicators using color-coded tags (red for blocked, green for active)

**GraphQL-Based Blocking System**
- `blockUser` and `unblockUser` mutations in GraphQL schema accept userId parameter
- Mutations integrated with PersonalUserApplicationService.update() for persistence
- Real-time UI updates with Apollo Client mutation callbacks and success messaging
- Network-only fetch policy ensures fresh data after blocking operations

**Domain-Driven Permission Architecture**
- `UserDomainPermissions` interface defines `canBlockUsers` and `canUnblockUsers` capabilities
- PersonalUser aggregate root validates permission changes through Passport/Visa system
- Domain-layer validation prevents unauthorized blocking operations: `validateVisa()` method checks permissions
- `isBlocked` boolean field on PersonalUser entity controls user capabilities platform-wide

**Administrative Control Interface**
- Block reasons dropdown: "Late Return", "Item Damage", "Policy Violation", "Inappropriate Behavior", "Other"
- Block duration options: 7 days, 30 days, indefinite with administrative discretion
- Required description field shown to blocked users explaining the action
- Confirmation modals prevent accidental blocking with clear consequence messaging

**Event-Driven Audit System**
- Domain events `UserBlocked` and `UserUnblocked` documented in User bounded context README
- EventBus integration through `NodeEventBusInstance` for audit trail and notifications
- AggregateRoot base class provides `addDomainEvent()` capability for tracking state changes
- Unit of Work pattern ensures atomic operations with event dispatching

## Compensating Controls

**Multiple Authorization Layers**
- JWT authentication required for all admin operations
- Admin permission checks in GraphQL resolvers (marked as TODO for implementation)
- Domain-layer permission validation through UserDomainPermissions interface
- Passport/Visa authorization system validates admin capabilities at entity level

**Comprehensive Audit Trail**
- All blocking actions logged through domain events system
- GraphQL operation logging with user context and action details
- Success/failure message tracking in UI with Apollo Client error handling
- MongoDB persistence layer maintains blocked status history through updatedAt timestamps

**User Impact Mitigation**
- Blocked users receive clear description of reason and duration
- Modal confirmations prevent accidental administrative actions
- Unblock capability allows appeal resolution and administrative review
- Status-based UI rendering prevents blocked users from performing platform actions

**Data Integrity Protection**
- PersonalUser aggregate validates `isBlocked` changes through domain rules
- Mongoose schema enforcement ensures boolean data type consistency
- Domain adapter pattern maintains data consistency between persistence and domain layers
- Unit of Work pattern ensures transactional consistency for blocking operations

## Context and Problem Statement

**User Safety Requirements**
The ShareThrift platform requires robust user moderation capabilities to protect community members from harmful, inappropriate, or policy-violating behavior. Without effective blocking mechanisms, malicious users can continue to abuse the platform, damage property, violate community standards, and harm other users' experiences.

**Administrative Control Needs**
Platform administrators need immediate capability to remove problematic users from active participation while maintaining due process through documented reasons and time-limited restrictions. The system must support rapid response to safety incidents while providing transparency to affected users about administrative actions taken against their accounts.

**Platform Integrity Protection**
User blocking serves as a critical security control preventing abuse of listing creation, reservation systems, messaging, and financial transactions. Blocked users must be completely prevented from platform interactions while maintaining their account data for potential appeals and administrative review.

**Regulatory Compliance**
Implementation follows principle of proportional response with documented reasoning, time limitations, and clear communication to users. The system supports regulatory requirements for user protection, data retention, and administrative transparency in content moderation decisions.

## Success Criteria

**SC-3.1: Administrative Effectiveness**
- Administrators can block/unblock users within 10 seconds of accessing admin dashboard
- Blocking confirmation modals prevent &gt;95% of accidental administrative actions
- All blocking operations complete successfully with &lt;2 second response time
- Admin interface provides clear visual indication of user status changes

**SC-3.2: Platform Protection Coverage**
- Blocked users are prevented from 100% of restricted platform activities (listings, reservations, messaging)
- No blocked user can circumvent restrictions through any platform interface or API endpoint
- Platform maintains &lt;1% false positive rate for legitimate administrative actions
- User blocking effectively prevents repeat policy violations in &gt;90% of cases

**SC-3.3: User Communication Clarity**
- 100% of blocked users receive clear explanation of blocking reason and duration
- Block descriptions help users understand policy violations and requirements for appeal
- Administrative messaging maintains professional tone while clearly communicating consequences
- Users can access block status information through account interface

**SC-3.4: Audit Trail Completeness**
- 100% of blocking/unblocking actions generate complete audit events with all required metadata
- Event system successfully dispatches all domain events within 1 second of action completion
- Audit logs maintain complete history of administrative actions for compliance review
- Event data includes sufficient detail for regulatory reporting and user appeal processes

**SC-3.5: System Reliability and Performance**
- Blocking system maintains 99.9% uptime during normal platform operations
- Database consistency maintained across all blocking operations with zero data corruption
- Admin dashboard loads user data within 3 seconds for tables up to 1000 users
- GraphQL mutations execute successfully &gt;99.5% of time under normal load conditions

**SC-3.6: Security Control Effectiveness**
- Permission system successfully prevents unauthorized access to blocking functions in 100% of attempts
- Domain-layer validation catches and prevents all invalid blocking operations
- JWT authentication prevents unauthenticated access to admin functions
- No privilege escalation vulnerabilities exist in blocking system implementation