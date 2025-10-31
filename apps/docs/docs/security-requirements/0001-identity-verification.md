---
sidebar_position: 2
sidebar_label: 0001 Identity Verification
description: "Identity verification is required for access to advanced account tiers (e.g., Verified Plus, Business)"
status: pending
contact: 
date: 2025-10-23
deciders: 
consulted: 
informed: 
---

# Identity Verification

## Security Requirement Statement
Identity verification is required for access to advanced account tiers (e.g., Verified Plus, Business).

## Control Classification
- **Timing Control Category**: Preventive
- **Nature Control Category**: Technical
- **Status**: Identified
- **Date Identified**: 2025-10-23
- **Date First Implemented**: TBD
- **Date Last Reviewed**: 2025-10-30
- **Date Retired**: N/A

## Replacement Control
N/A — active control; no replacement identified.

## Implementation Approach
Integration with the existing Passport/Visa authorization system to gate access to advanced account tiers. Identity verification will be implemented as a new domain permission that must be satisfied before users can upgrade to verified account types.

**Current Account Types Supported:**
- `non-verified-personal` - Basic account with limited features
- `verified-personal` - ID-verified account with expanded features  
- `verified-personal-plus` - Premium account requiring verification + payment

## Compensating Controls
- Manual verification process for high-value accounts
- Role-based access control through existing UserDomainPermissions system
- Account type restrictions enforced at domain layer via PersonalUserAccount entity
- Billing integration with Cybersource for paid tier validation

## Context and Problem Statement
ShareThrift's tiered account system provides different feature limits and capabilities based on account type. The platform currently supports multiple account tiers from basic non-verified personal accounts to enterprise accounts with custom restrictions. 

**Current Feature Limits by Account Type:**
- **Non-Verified Personal**: 3 reservations, 3 bookmarks, 15 items, 5 friends
- **Verified Personal**: 10 reservations, 10 bookmarks, 30 items, 10 friends  
- **Verified Personal Plus**: 30 reservations, 30 bookmarks, 50 items, 30 friends

Without proper identity verification, users could claim verified status and access premium features without proper validation, leading to fraud risk and unfair resource usage.

## Technical Requirements
**Domain Layer Integration:**
- Extend PersonalUserAccount entity with verification status tracking
- Add verification permissions to UserDomainPermissions interface
- Implement verification checks in account type upgrade validation
- Integration with existing Passport/Visa authorization pattern

**Current Authorization Infrastructure:**
- UserVisa interface with `determineIf()` permission checking
- UserDomainPermissions with admin capabilities (canBlockUsers, canCreateUser, etc.)
- Role-based permissions through PersonalUserRole entity
- Account editing restricted via `isEditingOwnAccount` permission

**Required Enhancements:**
- Add verification service to infrastructure layer (similar to ServiceCybersource)
- Extend account type validation in PersonalUserAccount.accountType setter
- Implement verification webhook handling for real-time status updates
- Add verification status to GraphQL schema and resolvers

## Success Criteria
- Account type upgrades blocked without proper verification status
- Integration with existing role-based access control system
- Real-time verification status updates via webhook integration
- Proper enforcement through domain layer validation (PersonalUserAccount entity)
- Compliance with existing authorization patterns (Passport/Visa system)
- Support for all defined account types with appropriate verification requirements
- Integration with existing billing system for paid tiers (Cybersource)
