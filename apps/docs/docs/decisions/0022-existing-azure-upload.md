---
sidebar_position: 22
sidebar_label: 0022 Existing Azure Upload
description: "Existing Azure Upload with Direct client uploads using Azure Blob SAS tokens."
status: proposed
date: 2025-10-21
deciders: gidich
consulted: nnoce14 jasonmorais
informed:
---

# Existing Azure Upload Implementation

## Context and Problem Statement

Our application requires a secure and scalable mechanism for handling file uploads. From the start, the design approach was to leverage Azure Blob Storage as the primary file storage service due to its reliability, scalability, and seamless integration with the Azure ecosystem.

Users need to upload various file types (PDFs, images) along with metadata and tags for tracking. The system implements a direct upload flow where the client requests authorization from the backend, which issues a SAS (Shared Access Signature) token allowing the file to be uploaded directly to Azure Blob Storage.

we considered two authorization strategies:
- Short-lived SAS : A short-lived SAS (Shared Access Signature) in Azure Blob Storage is a token with a limited time validity that grants specific permissions to access a blob or container. And this can be breach by someone and can misuse this short lived token.
- Shared Key SAS : A Shared Key–signed SAS (Shared Access Signature) is a time‑limited and permission‑scoped token generated using the storage account’s shared key. It allows clients temporary access to upload or modify blobs without exposing the actual account key.

We Chosen **Shared Key SAS** 
Because:
- The backend generates SAS tokens along with all relevant metadata for each specific upload request, ensuring contextual and controlled access.
- Tokens are cryptographically signed using the storage account key, making them tamper‑proof and preventing third‑party manipulation.

## Decision Drivers

- **Scalability**: The system must efficiently handle large file uploads and multiple concurrent requests without overloading backend services.
- **Performance**: Direct client-to-Azure Blob uploads reduce backend latency and improve user upload speed.
- **Cost Optimization**: Offloading upload bandwidth from backend servers to Azure Blob Storage minimizes infrastructure and data transfer costs.
- **Security**: Uploads must be secure and authenticated. Shared Key SAS tokens (valet keys) provide controlled, time-bound access to the storage account.
- **Malware Scanning**: Uploaded files must undergo malware scanning. Any malicious files must be identified, quarantined, and deleted immediately to maintain data integrity and user safety.

## Considered Options

- **Option 1: Backend-mediated uploads (server uploads to Blob Storage)**
    - The client uploads files to the backend, which then transfers them to Azure Blob Storage.

- **Option 2: Direct client uploads using Azure Blob SAS tokens (current approach)**
    - The backend generates a Shared Key SAS token authorizing the client to upload directly to Blob Storage.

## Decision Outcome

Chosen option: **Option 2: Direct client uploads using Azure Blob SAS tokens (current approach)**, because it offloads upload traffic from the backend, reduces latency, lowers cost, and maintains security via Shared Key tokens.

## Consequences

- Good, because uploading directly from the client to Azure Blob Storage significantly reduces backend bandwidth usage and infrastructure costs.
- Good, because versioning support allows easy rollback in case of corruption or malicious file detection.
- Bad, because malware scanning occurs after upload, introducing a brief exposure window before a file is fully validated.

## Implementation Details

**Frontend Components:**
- Handles client-side file validation (type, size, dimensions).
- Requests authorization from the backend to upload a specific file.
- Uses the received SAS token to upload the file directly to Azure Blob Storage.
- After upload, notifies the backend to trigger malware scanning and persist upload metadata.

**Backend Services:**
- SAS Token Generation:
    - The backend handles SAS token generation and validation for Azure Blob Storage uploads, ensuring secure and controlled access for file uploads. There are different mutations for PDF and image files. The backend service encapsulates all business logic enforcing file upload restrictions and security requirements before enabling clients to upload files directly to Azure Blob Storage with Shared Key and carefully permissioned SAS tokens. 
- Post-Upload Malware Handling:
    - The backend polls the blob for the Microsoft Defender for Cloud scan result tag: `No threats found` or `Malicious`.
        - `No threats found` → retain the blob.
        - `Malicious` → delete the current blob version and restore the previous non-malicious version.
            - The previous version is promoted to current using copyBlob.
            - Current malicious version is deleted, optionally using permanentlyDeleteBlobVersion if supported.

- Versioning & Recovery 
    - Blob versioning is enforced to support rollback.
    - Previous non-malicious versions are retained and promoted if a malicious file is detected.


**Sequence Diagram**
```mermaid
sequenceDiagram
participant User
participant Frontend
participant Backend
participant Blob

User->>Frontend: Click upload and select file
Frontend->>Frontend: Sanitize & validate (type, size, dimensions)
Frontend->>Backend: Request SAS token (name, type, size)
Backend->>Backend: Build blob path + tags + metadata, validate upload rules
Backend-->>Frontend: AuthResult (blob URL + SAS token + x-ms-date + tags + metadata)
Frontend->>Blob: PUT file bytes (headers + auth + tags + metadata)
Blob-->>Frontend: 201 Created (x-ms-version-id)
Frontend->>Backend: Persist blob reference/version ID
Backend->>Backend: Process blob( versionId and blobURL)
alt Scan: No threats found
    Backend->>Frontend: Acknowledge success, retain blob
else Scan: Malicious
    Backend->>Blob: Delete current malicious version, promote previous version
    Backend->>Frontend: Acknowledge file replacement or deletion
end
Frontend-->>User: Show success / preview / error if malicious
```


## Technical Considerations and Known Limitations

- Malware scanning occurs after upload using Azure Blob Storage’s capabilities. Files flagged as malicious are deleted or reverted to ensure data integrity. The system uses Microsoft Defender for Storage to automatically scan uploaded blobs for malware. Defender checks for known malware signatures, embedded scripts, and other suspicious file patterns. This introduces a small window where a malicious file may exist in storage before removal.
- At present, backend permission enforcement for blob upload is minimal. The frontend restricts upload actions according to application state, but users could potentially bypass this if they possess valid credentials.
- Future improvements will focus on implementing domain-driven permission checks before SAS tokens are issued and exploring pre-upload scanning alternatives to further reduce risk.
- Shared Key