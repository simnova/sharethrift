---
sidebar_position: 2
sidebar_label: 0002 Edgescan
description: "EdgeScan dynamic application security testing and penetration testing services"
status: pending
contact: 
date: 2025-10-30
deciders: 
consulted: 
informed: 
---

# EdgeScan

## Threat Assessment Overview
EdgeScan provides dynamic application security testing (DAST) and penetration testing services to identify runtime vulnerabilities and security weaknesses in the deployed application.

## Assessment Classification
- **Assessment Type**: Dynamic Application Security Testing (DAST) / Penetration Testing
- **Approach Used**: TBD
- **Status**: Not Implemented
- **Date Identified**: 2025-10-30
- **Date First Implemented**: TBD
- **Date Last Reviewed**: 2025-10-30
- **Date Retired**: N/A

## Implementation Approach
TBD

## Coverage Scope
**Application Targets**: 
- ShareThrift web application (React frontend)
- Azure Functions API endpoints
- GraphQL API surface
- Authentication and authorization flows

**Security Testing**:
- Runtime vulnerability detection
- Authentication bypass attempts
- Input validation and injection testing
- Session management evaluation
- Business logic flaw identification

## Implementation Status
**Current State**: Not implemented
**Service Integration**: No EdgeScan service configuration or scheduling
**Testing Environment**: No dedicated security testing environment
**Automation**: No integration with CI/CD pipeline

## Success Criteria
- Regular automated security scans of deployed environments
- Vulnerability detection and reporting integration
- Remediation tracking and verification
- Compliance with security testing requirements

## Compensating Controls
**Static Analysis**:
- SonarCloud provides comprehensive SAST coverage
- TypeScript strict mode catches type-related vulnerabilities
- Manual security code review process

**Infrastructure Security**:
- Azure security features and monitoring
- HTTPS enforcement and CORS configuration
- Managed identities and RBAC access control

**Manual Testing**:
- Security-focused code review process
- Manual penetration testing during major releases
- Security incident response procedures

## Technical Requirements
- EdgeScan service account and configuration
- Dedicated security testing environment
- Integration with existing monitoring and alerting
- Vulnerability management workflow

## Testing Considerations
**Environment Strategy**:
- Separate security testing environment
- Production-like configuration for realistic testing
- Safe testing parameters to avoid service disruption

**Authentication Testing**:
- OAuth 2.0 / OIDC flow testing
- Azure B2C integration security validation
- Session management and token security

**API Security Testing**:
- GraphQL query complexity and depth limiting
- Input validation across all API endpoints
- Rate limiting and DDoS protection validation

## Related Documentation
- Application security architecture
- API security guidelines and implementation
- Incident response procedures for security vulnerabilities