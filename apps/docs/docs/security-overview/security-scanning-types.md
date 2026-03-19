---
sidebar_position: 1
sidebar_label: Security Scanning Types
description: ""
date: 2025-11-25
deciders: 
consulted: 
informed: 
---


# Security Scanning Types in CI/CD

This document outlines the four security scan types used in our CI/CD pipelines for both open-source and closed-source applications. Each scan type supports our overall application security posture and helps identify issues at various stages of the pipeline.

## 1. SAST — Static Application Security Testing

SAST analyzes source code without executing it.  
It runs early in the CI/CD pipeline, typically during pull requests or prior to build steps.

**ShareThrift Implementation:**
- **SonarCloud** - Primary SAST tool for code quality and security vulnerability detection
  - Quality gate enforcement (breaks build on failure)
  - Runs on both PR and main branch builds

- **Snyk Code** - Advanced SAST for security vulnerability detection
  - Integrates with Azure DevOps pipeline
  - Complementary analysis to SonarCloud
  - Focuses on security-specific code patterns
  - Severity threshold: High (blocks build on critical issues)

---

## 2. SCA — Software Composition Analysis

SCA identifies vulnerabilities in dependencies, libraries, and open-source packages.  
Runs during dependency installation or build steps.

**ShareThrift Implementation:**
- **PNPM Audit** - Legacy dependency vulnerability scanner (being phased out)
  - Scans production dependencies only (`--prod`)
  - High severity threshold (`--audit-level=high`)
  - Limited vulnerability database

- **Snyk Open Source** - Primary dependency vulnerability scanner
  - Enhanced vulnerability database with detailed remediation guidance
  - Integrates with Azure DevOps pipeline
  - Monitors dependencies continuously
  - Provides fix PRs for known vulnerabilities
  - Supports monorepo workspace structure

---

## 3. Secret Scanning

Secret Scanning detects embedded credentials, API keys, tokens, and misconfigurations.  
This scan type runs early (PR stage) to prevent sensitive data from entering the codebase.

**ShareThrift Implementation:**
- **GitHub Advanced Security** - Primary secret scanning for repository
  - Automatically scans commits for exposed secrets
  - Integrates with pull request checks
  - Blocks commits containing detected secrets
  - Covers API keys, tokens, connection strings, private keys

- **Snyk Secrets** - Enhanced secret detection in CI/CD pipeline
  - Complementary scanning with different detection patterns
  - Integrates with Azure DevOps pipeline
  - Scans code, configuration files, and infrastructure templates
  - Custom rules for ShareThrift-specific secret patterns

---

## 4. DAST — Dynamic Application Security Testing

DAST analyzes the application in a running state by simulating real-world attacks.  
Runs later in CI/CD after deployment to a test/staging environment.

**ShareThrift Implementation:**
- **EdgeScan** - Primary DAST platform for comprehensive security testing
  - Automated vulnerability scanning of live DEV environment
  - Web application security testing (OWASP Top 10)
  - GraphQL API security assessment
  - Authentication and authorization testing
  - Integration with Azure DevOps pipeline
  - Continuous monitoring of production environment

---

### Security Tool Configuration

**Quality Gates:**
- **Build Stage:** SAST + SCA failures block deployment
- **Security Stage:** DAST failures block production promotion
- **Continuous Monitoring:** EdgeScan monitors production environment

