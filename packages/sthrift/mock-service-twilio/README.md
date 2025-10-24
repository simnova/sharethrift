# @sthrift/mock-service-twilio

Mock implementation of Twilio messaging service for local development and testing.

## Overview

This package provides `ServiceTwilioMock`, an HTTP-based mock implementation of the `IMessagingService` interface from `@cellix/messaging`. It communicates with the `@sthrift/mock-twilio-server` instead of the real Twilio API.

## Installation

```bash
pnpm add @sthrift/mock-service-twilio
```

## Usage

```typescript
import { ServiceTwilioMock } from '@sthrift/mock-service-twilio';

// Create mock service pointing to local mock server
const mockService = new ServiceTwilioMock('http://localhost:10000');

// Start the service
await mockService.startUp();

// Use the service
const conversation = await mockService.createConversation('Test Chat');
await mockService.sendMessage(conversation.sid, 'Hello!', 'user@example.com');

// Clean up
await mockService.shutDown();
```

## Requirements

Requires `@sthrift/mock-twilio-server` to be running on the specified URL (default: `http://localhost:10000`).

Start the mock server:
```bash
pnpm --filter @sthrift/mock-twilio-server run dev
```

## API

Implements all methods from `IMessagingService`:

- `startUp()` - Initialize the mock service
- `shutDown()` - Stop the mock service
- `getConversation(id)` - Get a conversation by ID
- `sendMessage(conversationId, body, author?)` - Send a message
- `deleteConversation(id)` - Delete a conversation
- `listConversations()` - List all conversations
- `createConversation(friendlyName?, uniqueName?)` - Create a new conversation

## Testing

```bash
pnpm test                    # Run tests
pnpm test:watch             # Watch mode
pnpm test:coverage          # Coverage report
```

## Architecture

This package is part of the messaging architecture:

```
@cellix/messaging (generic interface)
    ↓
@sthrift/mock-service-twilio (mock implementation)
    ↓
@sthrift/mock-twilio-server (HTTP server)
```

For production, use `@sthrift/service-twilio` which implements the real Twilio API.
