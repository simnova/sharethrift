# @sthrift/messaging-service-mock

Mock implementation of the messaging service interface for local development and testing.

## Purpose

HTTP client that communicates with `@sthrift/mock-messaging-server`, eliminating the need for real messaging provider credentials during development.

## Usage

### Basic Usage

```typescript
import { MockServiceTwilio } from '@sthrift/messaging-service-mock';

const service = new MockServiceTwilio();
await service.startUp();

// Create a conversation
const conversation = await service.createConversation('Support Chat');

// Send a message
const message = await service.sendMessage(
  conversation.id,
  'Hello! How can we help?',
  'support@example.com'
);

await service.shutDown();
```

### Integration with Application

```bash
# Enable mock mode
MESSAGING_USE_MOCK=true
```

The application automatically uses this mock service instead of the production service.

### Testing with Custom Server URL

```typescript
const service = new MockServiceTwilio('http://localhost:9999');
await service.startUp();
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `MESSAGING_MOCK_URL` | Mock server URL | `http://localhost:10000` |
| `MESSAGING_USE_MOCK` | Enable mock mode | `false` |

### Constructor

```typescript
constructor(mockBaseUrl?: string)
```

Override the mock server URL. Defaults to `MESSAGING_MOCK_URL` environment variable, then `http://localhost:10000`.

## API Methods

### Service Lifecycle
- `startUp()` - Initialize service
- `shutDown()` - Cleanup resources

### Conversations
- `createConversation(displayName?, uniqueIdentifier?)` - Create conversation
- `getConversation(conversationId)` - Get conversation
- `listConversations()` - List all conversations
- `deleteConversation(conversationId)` - Delete conversation

### Messages
- `sendMessage(conversationId, body, author?)` - Send message
- `getMessages(conversationId)` - Get messages

## Testing

```typescript
import { MockServiceTwilio } from '@sthrift/messaging-service-mock';

describe('Messaging', () => {
  let service: MockServiceTwilio;

  beforeEach(async () => {
    service = new MockServiceTwilio();
    await service.startUp();
  });

  afterEach(async () => {
    await service.shutDown();
  });

  it('should create conversation', async () => {
    const conversation = await service.createConversation('Test');
    expect(conversation.id).toBeDefined();
  });
});
```

## Seeded Data

Use seeded conversation IDs from `@sthrift/mock-messaging-server`:
- `CH123`, `CH124`, `CH125`

## Related Packages

- `@sthrift/mock-messaging-server` - The HTTP server this client connects to
- `@sthrift/messaging-service-twilio` - Production Twilio implementation
- `@cellix/messaging` - Messaging service interface definition
