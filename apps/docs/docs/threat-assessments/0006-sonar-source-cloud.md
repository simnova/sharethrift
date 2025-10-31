---
sidebar_position: 6
sidebar_label: 0006 Sonar Source Cloud
description: "SonarCloud static application security testing and code quality analysis integration"
status: pending
contact: 
date: 2025-10-30
deciders: 
consulted: 
informed: 
---

# SonarSource Cloud (SonarQube)

## Threat Assessment Overview
SonarCloud provides comprehensive static application security testing (SAST) and code quality analysis integrated into the CI/CD pipeline to identify security vulnerabilities, code smells, and maintainability issues.

## Assessment Classification
- **Assessment Type**: Static Application Security Testing (SAST) / Code Quality Analysis
- **Approach Used**: Automated pipeline integration with quality gate enforcement
- **Status**: Implemented
- **Date Identified**: TBD
- **Date First Implemented**: Implemented (Active in pipeline)
- **Date Last Reviewed**: 2025-10-30
- **Date Retired**: N/A

## Implementation Approach
- **Pipeline Integration**: Fully integrated into Azure DevOps pipeline with automated analysis
- **Quality Gates**: Build-breaking quality gates enforce security and quality standards
- **Coverage**: TypeScript/JavaScript codebase analysis with test coverage integration
- **Reporting**: Automated PR comments and main branch analysis with trend tracking

## Technical Implementation
**Azure DevOps Integration**:
- Automated analysis on every pull request and main branch commit
- Java 17 JRE provisioning for SonarCloud scanner
- Custom quality gate check script with polling mechanism
- Build breaker integration preventing deployment of failing code

**Configuration**:
- Project key: `simnova_sharethrift-data-access`
- Organization: `simnova`
- Coverage path: `coverage/lcov.info` (merged from all packages)
- Exclusions: Test files, generated code, configuration files

**Pipeline Workflow**:
1. Code changes trigger Azure DevOps pipeline
2. PNPM audit runs for dependency vulnerabilities
3. Test coverage generation across all affected packages
4. SonarCloud analysis with custom parameters for PR/main builds
5. Quality gate evaluation with build breaking on failure
6. Custom polling script verifies analysis completion

## Coverage Scope
**Source Analysis**:
- All TypeScript/JavaScript source code in `apps/` and `packages/`
- Security vulnerability detection
- Code quality and maintainability metrics
- Test coverage analysis and reporting

**Security Detection**:
- SQL injection vulnerabilities
- Cross-site scripting (XSS) patterns
- Insecure cryptographic usage
- Authentication and authorization flaws
- Input validation issues

**Quality Metrics**:
- Code duplication detection
- Cyclomatic complexity analysis
- Maintainability index calculation
- Technical debt quantification

## Implementation Status
**Current State**: Fully operational with pipeline enforcement
**Quality Gates**: Active with build-breaking configuration
**Coverage**: Comprehensive analysis of monorepo structure
**Automation**: Complete integration with PR and main branch workflows

## Success Criteria
- All code changes analyzed before merge
- Quality gate compliance enforced on all builds
- Security vulnerabilities identified and blocked
- Test coverage maintained above defined thresholds
- Technical debt tracked and managed

## Pipeline Evidence
**Configuration Files**:
- `sonar-project.properties` - Project configuration
- `build-pipeline/core/monorepo-build-stage.yml` - Pipeline integration
- `build-pipeline/scripts/check-sonar-quality-gate.cjs` - Custom quality gate verification

**Pipeline Tasks**:
- SonarCloud analysis with environment-specific parameters
- Quality gate polling and verification
- Build breaker task for failing quality gates
- Coverage report integration from merged LCOV files

## Compensating Controls
- Manual code review process through pull requests
- TypeScript strict mode compilation
- ESLint static analysis for additional code quality
- Automated testing requirements before merge

## Related Documentation
- ADR 0015: Addressing Node.js 16 End-of-Life in SonarCloud
- Azure DevOps pipeline configuration
- Monorepo build and test strategy documentation