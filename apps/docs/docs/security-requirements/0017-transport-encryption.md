---
sidebar_position: 18
sidebar_label: 0017 Transport Encryption
description: "All data in transit must be encrypted using TLS 1.2 or higher"
status: implemented
contact: 
date: 2025-10-29
deciders: 
consulted: 
informed: 
---

# Transport Encryption

## Security Requirement Statement
All data in transit must be encrypted using TLS 1.2 or higher.

## Control Classification
- **Timing Control Category**: Preventive
- **Nature Control Category**: Technical
- **Status**: Implemented
- **Date Identified**: 2025-10-29
- **Date First Implemented**: 2025-10-29
- **Date Last Reviewed**: 2025-10-29
- **Date Retired**: N/A

## Replacement Control
N/A

## Implementation Approach

The platform enforces transport encryption through infrastructure configuration and security headers:

**Azure Storage Account TLS Configuration**
- `minimumTlsVersion: 'TLS1_2'` enforced in storage account configuration
- Storage accounts require minimum TLS 1.2 for all blob operations
- Static website hosting configured with TLS enforcement

**Security Headers Implementation**
- Strict-Transport-Security header: `max-age=31536000; includeSubDomains; preload`
- Content Security Policy enforces HTTPS connections
- CDN delivery rules enforce HTTPS scheme conditions

**API and Service Communication**
- Apollo Client configured with HTTPS endpoints for GraphQL communication
- HTTP links use secure protocols for external service integration
- OAuth2 server implements proper TLS for token endpoints

## Compensating Controls

**Infrastructure Security**
- Azure CDN provides additional TLS termination layer
- CORS configuration enforces secure origin policies
- Security headers prevent protocol downgrade attacks

**Application Layer Security**
- Apollo Client links enforce secure transport protocols
- JWT token validation uses secure communication channels
- Mock services in development maintain HTTPS patterns for consistency

**Certificate Management**
- Azure infrastructure provides managed TLS certificates
- CDN endpoints configured with proper certificate chains
- OpenID Connect endpoints use proper TLS validation

## Technical Requirements

**Storage Account Configuration**
- All Azure Storage accounts must enforce `minimumTlsVersion: 'TLS1_2'`
- Blob services configured with proper CORS and security policies
- Public network access controlled with TLS enforcement

**CDN Security Rules**
- Delivery rules enforce HTTPS scheme requirements
- Security headers appended to all responses
- Request scheme validation prevents insecure connections

**Client Communication**
- Apollo Client HTTP links use HTTPS endpoints exclusively
- Authentication tokens transmitted over secure channels only
- Service-to-service communication enforces TLS validation

## Success Criteria

**Infrastructure Security**
- All Azure Storage accounts enforce minimum TLS 1.2
- CDN delivery rules validate HTTPS scheme requirements
- Security headers properly configured across all endpoints

**Transport Security**
- All client-server communication uses encrypted channels
- Third-party service integration maintains secure transport
- Development environment maintains HTTPS patterns for consistency

**Certificate Validation**
- TLS certificates properly validated for all external connections
- OAuth2 and OpenID Connect endpoints use secure protocols
- Token validation services enforce secure communication requirements