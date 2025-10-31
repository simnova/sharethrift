---
sidebar_position: 4
sidebar_label: 0004 Microsoft Defender
description: "Microsoft Defender for Cloud malware scanning integration for Azure Blob Storage uploads"
status: designed
contact: 
date: 2025-10-30
deciders: 
consulted: 
informed: 
---

# Microsoft Defender for Blob Storage

## Threat Assessment Overview
Microsoft Defender for Cloud provides malware scanning capabilities for Azure Blob Storage uploads, protecting against malicious file uploads and maintaining data integrity.

## Assessment Classification
- **Assessment Type**: Malware Scanning / Cloud Security
- **Approach Used**: Integrated with Azure Blob Storage for automated file upload scanning with versioning and rollback
- **Status**: Designed (Infrastructure Ready)
- **Date Identified**: 2025-10-21
- **Date First Implemented**: TBD
- **Date Last Reviewed**: 2025-10-30
- **Date Retired**: N/A

## Implementation Approach
**Architecture**: Direct client upload to Azure Blob Storage with post-upload malware scanning
**Workflow**:
1. Client uploads file directly to Azure Blob Storage using SAS token
2. Microsoft Defender scans uploaded blob and tags with scan result
3. Backend polls for scan result tags: `No threats found` or `Malicious`
4. If malicious: delete current version and restore previous clean version
5. If clean: retain blob and proceed with application workflow

## Technical Implementation
**Azure Blob Storage Configuration**:
- Blob versioning enabled for rollback capability
- Microsoft Defender for Cloud integration
- Automated scanning of all uploaded content
- Version management for malicious content removal

**Backend Integration**:
- SAS token generation for secure uploads
- Polling mechanism for scan result verification
- Automated version management and cleanup
- Fallback to previous non-malicious versions

## Coverage Scope
**Protected Assets**:
- Profile pictures uploaded by users
- Listing photos and attachments
- All user-generated file content in blob storage

**Threat Mitigation**:
- Malware upload prevention
- Automated quarantine and cleanup
- Version-based recovery mechanisms
- Real-time threat detection

## Implementation Status
**Current State**: Infrastructure designed and documented in ADR 0022-existing-azure-upload
**Infrastructure**: Azure Blob Storage with versioning enabled
**Integration**: Workflow documented but not fully implemented
**Gaps**: Backend polling logic and version management not implemented

## Success Criteria
- All uploaded files scanned for malware before processing
- Malicious files automatically quarantined and removed
- Previous clean versions restored when threats detected
- Zero malicious files persist in production storage
- Automated cleanup with audit trail maintenance

## Compensating Controls
- File type validation on client side
- Size limits enforced (2MB for images)
- CORS restrictions limiting upload origins
- Manual review processes for reported content

## Related Documentation
- ADR 0022: Existing Azure Upload Implementation
- SR-014: Image Overwrite Policy
- Azure Blob Storage infrastructure configuration