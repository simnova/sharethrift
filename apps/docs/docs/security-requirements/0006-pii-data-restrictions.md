---
sidebar_position: 6
sidebar_label: 0006 PII Data Restrictions
description: "No financial or sensitive PII data (e.g., SSNs, payment info) may be stored on the platform"
status: pending
contact: 
date: 2025-10-29
deciders: 
consulted: 
informed: 
---

# PII Data Restrictions

## Security Requirement Statement
No financial or sensitive PII data (e.g., SSNs, payment info) may be stored on the platform.

## Control Classification
- **Timing Control Category**: Preventive
- **Nature Control Category**: Technical
- **Status**: Identified
- **Date Identified**: 2025-10-29
- **Date First Implemented**: TBD
- **Date Last Reviewed**: 2025-10-29
- **Date Retired**: N/A

**Payment Data Tokenization (CyberSource Integration)**
- `ServiceCybersource` handles all payment processing through external provider
- Customer profiles stored with tokenized payment instruments rather than raw card data
- `PersonalUserAccountProfileBilling` entity stores only payment references (subscriptionId, cybersourceCustomerId, lastTransactionId, paymentState)
- Payment token information (`PaymentTokenInfo`) used for secure payment instrument management

**Domain-Layer Authorization (Passport/Visa Pattern)**
- `PersonalUserProfile` enforces visa validation for PII access: `this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)`
- `PersonalUser` aggregate validates authorization before any PII modifications
- `UserDomainPermissions` interface defines specific permissions for PII operations
- Access control enforced at entity level through visa validation in setters

**Payment Processing Architecture**
- Payment forms collect data client-side for direct CyberSource tokenization
- No sensitive payment data stored in application database
- Transaction references and payment states tracked for billing reconciliation
- Customer payment instruments managed through CyberSource Token Management API

## Compensating Controls

**Payment Data Security**
- CyberSource third-party payment processor provides PCI DSS compliance
- Payment instruments tokenized before any application processing
- Customer profiles contain only billing metadata, not sensitive payment details
- Mock payment server used for development with no real payment data

**Authorization Framework**
- Passport/Visa pattern provides fine-grained access control to PII data
- Domain validation enforced in entity setters and mutating operations
- `PersonalUserUserVisa` implements role-based permissions for account data access
- Guest users have no access to PII through `GuestUserPassport` returning false for all permissions

**Data Minimization**
- Only payment references stored in `PersonalUserAccountProfileBilling` 
- Sensitive payment details handled entirely by CyberSource tokenization
- Profile data access restricted to account owners through visa validation


**Domain Entity Validation**
- All PersonalUser profile modifications must pass visa validation
- PersonalUserAccountProfileBilling stores only payment metadata and references
- Payment processing delegated to external CyberSource service with proper tokenization

**Authentication & Authorization**
- Passport/Visa pattern enforced on all PII access operations
- UserDomainPermissions defines specific capabilities (isEditingOwnAccount, canBlockUsers, etc.)
- Access control implemented at aggregate root level through visa validation

**Payment Security**
- CyberSource integration for all payment processing and tokenization
- Payment instrument management through Token Management API
- No raw payment data persistence in application database

## Success Criteria

**PII Access Control**
- All PersonalUser profile modifications require valid visa authorization
- Payment data handled exclusively through CyberSource tokenization
- Guest users cannot access any PII data through domain authorization

**Payment Data Security**
- No sensitive payment information stored in application database
- Payment processing delegated to PCI DSS compliant third-party provider
- Payment references and transaction metadata only stored for billing operations

**Authorization Enforcement**
- Domain-layer visa validation prevents unauthorized PII access
- Passport/Visa pattern provides role-based access control to sensitive data
- Access control enforced at entity level through proper domain validation