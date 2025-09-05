# Status Tag Component

## Purpose
A reusable status tag component that displays listing and request statuses with appropriate color coding according to the design specifications.

## Usage

```tsx
import { StatusTag } from '@sthrift/ui-sharethrift-components';

// For listing statuses
<StatusTag status="Active" />
<StatusTag status="Paused" />
<StatusTag status="Reserved" />

// For request statuses  
<StatusTag status="Pending" />
<StatusTag status="Accepted" />
<StatusTag status="Rejected" />
```

## Status Colors

### Listing Statuses
- **Active**: Green
- **Paused**: Yellow  
- **Reserved**: Blue
- **Draft**: Gray (default)
- **Blocked**: Purple
- **Expired**: Red

### Request Statuses
- **Accepted**: Green
- **Rejected**: Red
- **Closed**: Gray (default)
- **Pending**: Orange
- **Closing**: Blue

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| status | `ListingStatus \| RequestStatus` | Yes | The status to display |
| className | `string` | No | Additional CSS classes |

## Examples

```tsx
// Basic usage
<StatusTag status="Active" />

// With custom styling
<StatusTag status="Blocked" className="my-custom-class" />
```