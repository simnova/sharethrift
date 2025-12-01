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

## Related Documentation
- Application security architecture
- API security guidelines and implementation
- Incident response procedures for security vulnerabilities