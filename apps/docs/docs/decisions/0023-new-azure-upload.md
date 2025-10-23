---
sidebar_position: 23
sidebar_label: 0023 New Azure Upload Flow
description: "Proposed change to delay Azure Blob upload until user confirmation (Save and Continue)."
status: proposed
date: 2025-10-22
deciders:
consulted:
informed:
---

# New Azure Upload Flow

## Context and Problem Statement

In the current implementation, as soon as a user selects a file in the upload interface, the file is immediately uploaded to Azure Blob Storage using a short-lived SAS token.
While this approach ensures that uploads are quick and responsive, it introduces several issues in scenarios where a user decides **not to save or proceed** after selecting a file.

This results in **orphaned files** — uploaded to Azure but not referenced in any saved entity(user collection). These unreferenced blobs still consume storage and may accumulate over time, increasing storage costs and cluttering the container. And instant uploads may also expose sensitive files before they're officially committed.

Therefore, we need a flow where files are only uploaded **after explicit user confirmation** — such as clicking **“Save and Continue or Proceed”** — ensuring that every uploaded blob corresponds to a committed change in the application.

## Decision Drivers

- **Data Integrity**: Ensure only confirmed user actions create stored files.
- **Cost Efficiency**: Prevent accumulation of unreferenced or orphaned blobs in storage.
- **User Experience**: Keep upload responsiveness while reducing accidental uploads.
- **Security and Compliance**: Limit storage exposure by avoiding unnecessary data persistence.
- **Maintainability**: Simplify cleanup and lifecycle management by aligning uploads with committed user actions.

## Considered Options

- **Option 1: Immediate upload on file select (current approach)**  
  - Uploads start as soon as the user selects a file.
  - Backend issues SAS token and file is persisted to Azure instantly.

- **Option 2: Deferred upload triggered by Save and Continue (proposed)**  
  - Files are temporarily stored in memory or local state after selection.
  - Upload to Azure Blob Storage only begins once the user explicitly confirms the action (e.g., clicks “Save and Continue”).
  - If the user cancels or navigates away, the file is discarded locally and never uploaded.

## Decision Outcome

Chosen option: **Option 2: Deferred upload triggered by user confirmation.**  
This approach prevents orphaned files, aligns uploads with intentional user actions, and reduces unnecessary storage utilization.
Although it slightly delays the upload until user confirmation, the trade-off is acceptable given the improvements in data consistency and maintainability.

## Consequences

- **Positive:**  
  - Eliminates orphaned or unreferenced blobs.
  - Reduces storage costs and maintenance overhead.
  - Improves logical consistency between UI actions and stored data.
  - Simplifies cleanup and version management.

- **Negative:**  
  - Upload initiation is delayed until user confirmation, possibly increasing total save time.
  - Requires additional UI state management to retain selected files before upload.
  - Slightly more complex frontend logic to manage pending uploads and confirmation triggers.

## Technical Considerations

- The frontend will temporarily hold selected files in memory or a local object store until “Save and Continue” is clicked.
- The backend will continue to issue SAS tokens on-demand but only after the confirmation action.
- Cleanup will no longer be required for abandoned uploads, as no file is stored remotely without user confirmation.

---