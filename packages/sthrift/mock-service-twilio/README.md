# Mock Service Twilio

HTTP client implementation of `IMessagingService` that calls the mock Twilio server.

## Installation

```bash
npm install @sthrift/mock-service-twilio
```

## Quick Start

```typescript
import { ServiceTwilioMock } from '@sthrift/mock-service-twilio';

const mockService = new ServiceTwilioMock('http://localhost:10000');
await mockService.startUp();

const conversations = await mockService.listConversations();
await mockService.shutDown();
```

## Constructor

```typescript
constructor(baseUrl: string)
```

Uses `TWILIO_MOCK_URL` environment variable or default `http://localhost:10000`.

## IMessagingService Methods

### Conversations
- `listConversations()`
- `createConversation(friendlyName)`
- `getConversation(conversationSid)`
- `updateConversation(conversationSid, friendlyName)`
- `deleteConversation(conversationSid)`

### Messages
- `listMessages(conversationSid)`
- `createMessage(conversationSid, body, author?)`
- `getMessage(conversationSid, messageSid)`
- `updateMessage(conversationSid, messageSid, body)`
- `deleteMessage(conversationSid, messageSid)`

### Participants
- `listParticipants(conversationSid)`
- `createParticipant(conversationSid, identity)`
- `getParticipant(conversationSid, participantSid)`
- `updateParticipant(conversationSid, participantSid, ...)`
- `deleteParticipant(conversationSid, participantSid)`

## Usage with Persistence

```typescript
import { Persistence } from '@sthrift/persistence';
import { ServiceTwilioMock } from '@sthrift/mock-service-twilio';

const mockService = new ServiceTwilioMock('http://localhost:10000');
await mockService.startUp();

const dataSources = Persistence(mongooseService).withPassport(passport, mockService);
const conversations = await dataSources.twilioDataSource
  ?.Conversation.Conversation.TwilioConversationRepo.listConversations();
```

## Switching Mock/Real

```typescript
import type { IMessagingService } from '@cellix/messaging';
import { ServiceTwilioReal } from '@sthrift/service-twilio';
import { ServiceTwilioMock } from '@sthrift/mock-service-twilio';

function createMessagingService(): IMessagingService {
  if (process.env.USE_TWILIO_MOCK === 'true') {
    return new ServiceTwilioMock(process.env.TWILIO_MOCK_URL || 'http://localhost:10000');
  }
  return new ServiceTwilioReal();
}
```
