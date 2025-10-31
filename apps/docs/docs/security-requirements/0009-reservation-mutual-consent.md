---
sidebar_position: 10
sidebar_label: 0009 Reservation Mutual Consent
description: "Reservation requests must be mutually closed and cannot be auto-confirmed without both users"
status: pending
contact: 
date: 2025-10-29
deciders: 
consulted: 
informed: 
---

# Reservation Mutual Consent

## Security Requirement Statement
Reservation requests must be mutually closed and cannot be auto-confirmed without both users.

## Control Classification
- **Timing Control Category**: Preventive
- **Nature Control Category**: Technical
- **Status**: Identified
- **Date Identified**: 2025-10-29
- **Date First Implemented**: TBD
- **Date Last Reviewed**: 2025-10-29
- **Date Retired**: N/A

## Replacement Control
TBD

## Implementation Approach
ShareThrift implements reservation mutual consent through a sophisticated domain-driven workflow that manages reservation request lifecycle states and requires explicit user agreement for closure. The system prevents unauthorized auto-confirmation while ensuring both parties must participate in the closure process.

## Compensating Controls
1. **State-Based Workflow**: Reservation requests follow a strict state machine pattern preventing invalid transitions
2. **Permission-Based Authorization**: Domain-level permissions validate user authority for each reservation operation
3. **Bilateral Close Request Tracking**: Separate flags track close requests from both sharer and reserver parties
4. **Business Rule Enforcement**: Domain logic prevents direct state transitions without proper authorization

## Context and Problem Statement
ShareThrift's reservation system requires robust mutual consent mechanisms to ensure that reservation periods cannot be prematurely or unilaterally terminated. The platform must prevent auto-confirmation scenarios while maintaining clear workflows for both parties to agree on reservation lifecycle transitions, particularly for closing completed reservations.

### Business Requirements Addressed:
- **Mutual Consent Requirement**: "Both parties must mutually close the request to confirm the reservation period is complete"
- **Prevention of Auto-Confirmation**: Reservations cannot transition to closed state without explicit user action
- **Bilateral Agreement**: "The reservation will only be considered fully closed once both users have confirmed the closure"
- **Status Transparency**: "Closing - Awaiting Response" intermediate state provides clear workflow visibility

## Technical Requirements

### 1. Reservation Request State Machine
**Core State Definitions**:
```typescript
// Comprehensive state management with strict transitions
export const ReservationRequestStates = {
  REQUESTED: 'Requested',    // Initial request state
  ACCEPTED: 'Accepted',      // Sharer approved the request
  REJECTED: 'Rejected',      // Sharer declined the request
  CANCELLED: 'Cancelled',    // Either party cancelled before acceptance
  CLOSED: 'Closed'           // Both parties agreed to close
} as const;

// Value object ensures only valid states are accepted
export class ReservationRequestStateValue extends VOString {
  constructor(value: string) {
    if (!Object.values(ReservationRequestStates).includes(value)) {
      throw new Error(
        `Invalid state: ${value}. Allowed: ${Object.values(ReservationRequestStates).join(', ')}`
      );
    }
    super(value);
  }
}
```

### 2. Mutual Close Request Tracking
**Domain Entity Implementation**:
```typescript
// Bilateral close request flags in domain entity
export interface ReservationRequestProps {
  state: string;
  closeRequestedBySharer: boolean;     // Sharer requested closure
  closeRequestedByReserver: boolean;   // Reserver requested closure
  // Other reservation properties...
}

// Domain aggregate with close request setters
export class ReservationRequest extends AggregateRoot {
  set closeRequestedBySharer(value: boolean) {
    if (!this.visa.determineIf(p => p.canCloseRequest)) {
      throw new PermissionError('You do not have permission to request close');
    }
    
    if (this.props.state !== ReservationRequestStates.ACCEPTED) {
      throw new Error('Cannot close reservation in current state');
    }
    
    this.props.closeRequestedBySharer = value;
  }
  
  set closeRequestedByReserver(value: boolean) {
    if (!this.visa.determineIf(p => p.canCloseRequest)) {
      throw new PermissionError('You do not have permission to request close');
    }
    
    if (this.props.state !== ReservationRequestStates.ACCEPTED) {
      throw new Error('Cannot close reservation in current state');
    }
    
    this.props.closeRequestedByReserver = value;
  }
}
```

### 3. Close Operation Business Rules
**Current Implementation Analysis**:
```typescript
// IMPLEMENTATION GAP: Current logic only requires ONE party consent
private close(): void {
  // Permission validation
  if (!this.visa.determineIf(p => p.canCloseRequest)) {
    throw new PermissionError('You do not have permission to close this reservation request');
  }
  
  // State validation  
  if (this.props.state !== ReservationRequestStates.ACCEPTED) {
    throw new Error('Can only close accepted reservations');
  }
  
  // SECURITY ISSUE: OR logic instead of AND logic
  if (!(this.props.closeRequestedBySharer || this.props.closeRequestedByReserver)) {
    throw new Error('Can only close reservation requests if at least one user requested it');
  }
  
  // Transition to closed state
  this.props.state = new ReservationRequestStateValue(ReservationRequestStates.CLOSED);
}
```

**Required Mutual Consent Implementation**:
```typescript
// CORRECTED: Both parties must consent for closure
private close(): void {
  if (!this.visa.determineIf(p => p.canCloseRequest)) {
    throw new PermissionError('You do not have permission to close this reservation request');
  }
  
  if (this.props.state !== ReservationRequestStates.ACCEPTED) {
    throw new Error('Can only close accepted reservations');
  }
  
  // SECURITY FIX: AND logic ensures both parties must consent
  if (!(this.props.closeRequestedBySharer && this.props.closeRequestedByReserver)) {
    throw new Error('Both parties must request closure before reservation can be closed');
  }
  
  this.props.state = new ReservationRequestStateValue(ReservationRequestStates.CLOSED);
}
```

### 4. Permission-Based Authorization
**Domain Permissions Model**:
```typescript
// Fine-grained permissions for reservation operations
export interface ReservationRequestDomainPermissions {
  canCloseRequest: boolean;    // Permission to request closure
  canCancelRequest: boolean;   // Permission to cancel request
  canAcceptRequest: boolean;   // Permission to accept (sharer only)
  canRejectRequest: boolean;   // Permission to reject (sharer only)
}

// Authorization context ensures proper user validation
export class ReservationRequestVisa implements ReservationRequestVisa {
  determineIf(func: (permissions: ReservationRequestDomainPermissions) => boolean): boolean {
    const userPermissions = this.calculateUserPermissions();
    return func(userPermissions);
  }
}
```

### 5. UI Workflow Implementation
**Frontend Close Request Process**:
```typescript
// User interface workflow for bilateral close request
export const ReservationActions: React.FC = ({ status, onClose }) => {
  const getActionsForStatus = () => {
    const actions = [];
    
    switch (status) {
      case 'ACCEPTED':
        actions.push(
          <ReservationActionButton
            key="close"
            action="Close"
            onClick={onClose}
            loading={closeLoading}
          />
        );
        actions.push(
          <ReservationActionButton
            key="message"
            action="Message"
            onClick={onMessage}
          />
        );
        break;
      // Other status handling...
    }
    
    return actions;
  };
  
  return <Space>{getActionsForStatus()}</Space>;
};
```

**Close Request Status Indicators**:
```typescript
// Status tracking for bilateral consent workflow  
export interface ReservationRequest {
  id: string;
  state: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CLOSED' | 'CANCELLED';
  closeRequested: boolean;     // Simplified flag for UI state
  closeRequestedBySharer: boolean;    // Detailed tracking
  closeRequestedByReserver: boolean;  // Detailed tracking
}
```

### 6. Data Model Persistence
**Database Schema Support**:
```typescript
// MongoDB schema with close request tracking
const ReservationRequestSchema = new Schema({
  state: { type: String, required: true, enum: Object.values(ReservationRequestStates) },
  closeRequestedBySharer: { type: Boolean, required: true, default: false },
  closeRequestedByReserver: { type: Boolean, required: true, default: false },
  // Other reservation fields...
});
```

## Success Criteria

### ✅ Implemented Security Controls:
1. **State Machine Enforcement**: Strict state transitions prevent invalid reservation status changes
2. **Permission-Based Operations**: Domain-level authorization validates user authority for close requests
3. **Bilateral Tracking Infrastructure**: Database and domain models support separate close request flags
4. **UI Workflow Components**: Frontend interfaces provide clear close request functionality
5. **Business Rule Validation**: Domain logic prevents unauthorized state transitions

### ⚠️ Critical Implementation Gap:
**SECURITY VULNERABILITY IDENTIFIED**: Current close operation uses OR logic instead of AND logic:
```typescript
// CURRENT (VULNERABLE): Only one party needs to request close
if (!(this.props.closeRequestedBySharer || this.props.closeRequestedByReserver)) {
  throw new Error('Can only close reservation requests if at least one user requested it');
}

// REQUIRED (SECURE): Both parties must consent
if (!(this.props.closeRequestedBySharer && this.props.closeRequestedByReserver)) {
  throw new Error('Both parties must request closure before reservation can be closed');
}
```

### 🔧 Business Requirements Compliance:
**Documentation vs Implementation Mismatch**:
- **Business Requirement**: "Both parties must mutually close the request"
- **User Experience Design**: "The reservation will only be considered fully closed once both users have confirmed the closure"
- **Current Implementation**: Single-party consent sufficient for closure
- **Security Impact**: Unilateral closure capability violates mutual consent principle

### 📊 Workflow Status Analysis:
1. **Request Phase**: ✅ Properly implemented with permission validation
2. **Accept/Reject Phase**: ✅ Sharer-only authorization correctly enforced  
3. **Close Request Phase**: ✅ Individual close request tracking functional
4. **Final Closure Phase**: ❌ Missing bilateral consent requirement enforcement

### 🎯 Remediation Priority:
**HIGH PRIORITY**: Update domain close logic to require both parties' explicit consent before allowing transition to CLOSED state. This aligns implementation with documented business requirements and prevents unilateral reservation termination.