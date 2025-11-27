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