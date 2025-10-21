---
sidebar_position: 19
sidebar_label: 0019 Existing Azure Upload
description: "Existing Azure Upload with Direct client uploads using Azure Blob SAS tokens."
status: proposed
date: 2025-10-21
deciders:
consulted:
informed:
---

# Existing Azure Upload Implementation

## Context and Problem Statement

Our application requires a secure and scalable mechanism for handling file uploads. From the start, the design approach was to leverage Azure Blob Storage as the primary file storage service due to its reliability, scalability, and seamless integration with the Azure ecosystem.

Users need to upload various file types (PDFs, images) along with metadata and tags for tracking. The system implements a direct upload flow where the client requests authorization from the backend, which issues a short-lived SAS (Shared Access Signature) token allowing the file to be uploaded directly to Azure Blob Storage.

## Decision Drivers

- **Scalability**: The system must efficiently handle large file uploads and multiple concurrent requests without overloading backend services.
- **Performance**: Direct client-to-Azure Blob uploads reduce backend latency and improve user upload speed.
- **Cost Optimization**: Offloading upload bandwidth from backend servers to Azure Blob Storage minimizes infrastructure and data transfer costs.
- **Security**: Uploads must be secure and authenticated. Short-lived SAS tokens (valet keys) provide controlled, time-bound access to the storage account.
- **Malware Scanning**: Uploaded files must undergo malware scanning. Any malicious files must be identified, quarantined, and deleted immediately to maintain data integrity and user safety.

## Considered Options

- **Option 1: Backend-mediated uploads (server uploads to Blob Storage)**
    - The client uploads files to the backend, which then transfers them to Azure Blob Storage.

- **Option 2: Direct client uploads using Azure Blob SAS tokens (current approach)**
    - The backend generates a short-lived SAS token authorizing the client to upload directly to Blob Storage.

## Decision Outcome

Chosen option: **Option 2: Direct client uploads using Azure Blob SAS tokens (current approach)**, because it provides Offloads upload traffic from backend, reduces latency, lower cost, maintains security via short-lived tokens.


## Implementation Details

**Frontend Components:**
- `AzureUpload` The AzureUpload React component is designed to enable direct client-side uploads to Azure Blob Storage with built-in file validation,authentication, and post-upload malware scanning.
- It have two handler `beforeUpload` and `customizeUpload`
    - `beforeUpload` Handler:
        - Sanitizes and normalizes the file name.
        - Validates the file size, type, and image dimensions using FileValidator.
        - Requests upload authorization (SAS token) from the backend.
        - Returns the validated and authorized file for uploading or rejects on failure.
    - `customizeUpload` Handler:
        - Uses the SAS token and other auth headers to upload the file directly to Azure Blob Storage via an Axios PUT request.
        - Applies additional headers for metadata, blob type, and versioning.
        - Tracks upload progress and updates the UI accordingly.
        - Invokes a backend mutation after upload to check Microsoft Defender for Cloud scan results and handle malicious files if detected..
        - Handles malware scan results, showing messages or errors if malicious content is detected.

**Backend Services:**
- SAS Token Generation:
    - The backend handles SAS token generation and validation for Azure Blob Storage uploads, ensuring secure and controlled access for file uploads. There are different- different mutation (pdf & image files). The backend service encapsulates all business logic enforcing file upload restrictions and security requirements before enabling clients to upload files directly to Azure Blob Storage with short-lived and carefully permissioned SAS tokens. For exmple
        - `identityVerificationCaseV1CreateAuthHeader` method:
            - Accepts upload parameters such as case ID, file name, content type, content length, and file specifications (max size, permitted content types).
            - Validates the case status before proceeding.
            - Constructs a blob name/path based on the case ID and file versioning scheme.
            - Calls getHeader to perform detailed validation and token generation.
        - `getHeader` method:
            - Validates that the requested content type is allowed.
            - Checks the content length against the maximum permitted size.
            - Prepares metadata and indexing tag collections to enrich blob storage with contextual information, including uploader identity, upload timestamps, and case-related tags.
            - Constructs the full URL path to the Azure Blob. 
            - Generates a Shared Access Signature (SAS) token (auth header) with scoped permissions and request date using the blob storage client. 
            - Returns a comprehensive authentication header bundle including the SAS authorization header, request date, blob path, metadata, and tags. 
            - If validation fails (unsupported content type or size), returns failure status with meaningful error messages.

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
```participant User
participant Frontend
participant Backend
participant Blob

User->>Frontend: Select image & click Save/Continue
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

- Malware scanning occurs after upload using Azure Blob Storage’s capabilities. Files flagged as malicious are deleted or reverted to ensure data integrity. This introduces a small window where a malicious file may exist in storage before removal.
- At present, backend permission enforcement for blob upload is minimal. The frontend restricts upload actions according to application state, but users could potentially bypass this if they possess valid credentials.
- Future improvements will focus on implementing domain-driven permission checks before SAS tokens are issued and exploring pre-upload scanning alternatives to further reduce risk.