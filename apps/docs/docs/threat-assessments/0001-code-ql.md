---
sidebar_position: 1
sidebar_label: 0001 CodeQL
description: "GitHub CodeQL static application security testing for vulnerability detection"
status: pending
contact: 
date: 2025-10-30
deciders: 
consulted: 
informed: 
---

# CodeQL (GitHub Advanced Security)

## Threat Assessment Overview
GitHub CodeQL provides advanced static application security testing (SAST) capabilities to identify security vulnerabilities in source code through semantic code analysis.

## Assessment Classification
- **Assessment Type**: Static Application Security Testing (SAST)
- **Approach Used**: TBD
- **Status**: Not Implemented
- **Date Identified**: 2025-10-30
- **Date First Implemented**: TBD
- **Date Last Reviewed**: 2025-10-30
- **Date Retired**: N/A


## Coverage Scope
**Target Languages**: TypeScript, JavaScript, Node.js
**Security Detection**: SQL injection, XSS, path traversal, command injection, authentication bypasses
**Integration**: GitHub Actions workflow with automated PR and push analysis

## Implementation Status
**Current State**: Not implemented
**GitHub Actions**: No CodeQL workflow configuration found
**Repository**: GitHub Advanced Security features not enabled
**Alternative**: SonarCloud provides overlapping SAST coverage

## Success Criteria
TBD

## Compensating Controls
- SonarCloud static analysis provides comprehensive SAST coverage
- Manual security code review through pull request process
- TypeScript strict mode compilation catches type-related vulnerabilities

## Related Documentation
- SonarSource Cloud threat assessment (overlapping coverage)
- GitHub Advanced Security documentation
- Repository security policy requirements