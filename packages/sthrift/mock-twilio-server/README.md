# Mock Twilio Server

A local development server that mimics Twilio's Conversations API for testing and development.

## 🎯 Purpose

Mock Twilio Server provides a lightweight, in-memory implementation of Twilio's Conversations API endpoints. It allows you to:

- ✅ Develop Twilio-dependent features locally without API credentials
- ✅ Run tests without making real API calls or incurring costs
- ✅ Work offline with consistent, reproducible data
- ✅ Iterate faster with instant responses (no network latency)
- ✅ Switch seamlessly between mock and real Twilio via environment variables

## 🚀 Quick Start

### Installation

```bash
cd packages/sthrift/mock-twilio-server
npm install
```

### Start the Server

```bash
npm run dev
```

Server runs on `http://localhost:3004` by default.

### Verify It's Running

```bash
curl http://localhost:3004/v1/Conversations
```

You should see a JSON response with 3 pre-seeded conversations.

## 📋 Features

- **Full Conversation Lifecycle** - Create, read, update, delete conversations
- **Message Management** - Send, retrieve, and delete messages
- **Participant Management** - Add/remove participants from conversations
- **User Management** - Create and manage user identities
- **Pre-Seeded Data** - 3 conversations, 9 messages, 6 participants, 3 users ready to use
- **In-Memory Storage** - No database required, fast and simple
- **Twilio-Compatible API** - Drop-in replacement for Twilio Conversations API
- **Lifecycle Methods** - `startUp()`, `shutDown()`, `healthcheck()` for integration
- **Reset/Reseed Support** - Restore initial state between tests via `/mock/reset` and `/mock/seed`

## 🔧 Configuration

### Environment Variables

```bash
# Mock server port (default: 3004)
PORT=3004

# When using ServiceTwilio
TWILIO_USE_MOCK=true  # Use mock server instead of real Twilio
TWILIO_MOCK_BASE_URL=http://localhost:3004  # Mock server URL
```

## 📡 API Endpoints

### Conversations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/Conversations` | List all conversations |
| POST | `/v1/Conversations` | Create a new conversation |
| GET | `/v1/Conversations/:sid` | Get conversation details |
| POST | `/v1/Conversations/:sid` | Update conversation |
| DELETE | `/v1/Conversations/:sid` | Delete conversation |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/Conversations/:conversationSid/Messages` | List all messages in conversation |
| POST | `/v1/Conversations/:conversationSid/Messages` | Send a new message |
| GET | `/v1/Conversations/:conversationSid/Messages/:sid` | Get message details |
| DELETE | `/v1/Conversations/:conversationSid/Messages/:sid` | Delete a message |

### Participants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/Conversations/:conversationSid/Participants` | List participants |
| POST | `/v1/Conversations/:conversationSid/Participants` | Add participant |
| GET | `/v1/Conversations/:conversationSid/Participants/:sid` | Get participant |
| DELETE | `/v1/Conversations/:conversationSid/Participants/:sid` | Remove participant |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/Users` | List all users |
| POST | `/v1/Users` | Create a new user |
| GET | `/v1/Users/:sid` | Get user details |

### Mock Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/mock/reset` | Clear all data (empty state) |
| POST | `/mock/seed` | Reload seed data (restore initial 3 conversations) |
| GET | `/mock/stats` | Get current data statistics |

## 💻 Usage Examples

### Standalone Server

Start the mock server as a standalone process:

```typescript
import { MockTwilioServer } from '@sthrift/mock-twilio-server';

const server = new MockTwilioServer({ port: 3004 });
await server.startUp();

console.log('Mock Twilio Server running on http://localhost:3004');

// ... your application code ...

// Cleanup
await server.shutDown();
```

### Integration with ServiceTwilio

Use the mock server with `@sthrift/service-twilio`:

```typescript
import { ServiceTwilio } from '@sthrift/service-twilio';
import { MockTwilioServer } from '@sthrift/mock-twilio-server';

// Set environment to use mock
process.env.TWILIO_USE_MOCK = 'true';

// Start mock server
const mockServer = new MockTwilioServer();
await mockServer.startUp();

// ServiceTwilio will automatically route to mock server
const twilioService = new ServiceTwilio();
await twilioService.startUp();

// Use as normal - calls go to mock server
const conversations = await twilioService.listConversations();
console.log(`Found ${conversations.conversations.length} conversations`);

// Cleanup
await twilioService.shutDown();
await mockServer.shutDown();
```

### Integration with Persistence Layer

Use the mock server through the persistence layer's Twilio datasource:

```typescript
import { Persistence } from '@sthrift/persistence';
import { ServiceTwilio } from '@sthrift/service-twilio';
import { MockTwilioServer } from '@sthrift/mock-twilio-server';

// Start mock server
process.env.TWILIO_USE_MOCK = 'true';
const mockServer = new MockTwilioServer();
await mockServer.startUp();

// Create Twilio service
const twilioService = new ServiceTwilio();
await twilioService.startUp();

// Create persistence with Twilio datasource
const persistenceFactory = Persistence(mongooseService);
const dataSources = persistenceFactory.withPassport(userPassport, twilioService);

// Access Twilio datasource (uses mock server)
const conversation = await dataSources.twilioDataSource
  ?.Conversation
  .Conversation
  .TwilioConversationRepo
  .getConversationBySid('CH123abc');

console.log(conversation?.friendlyName);
// Output: "MacBook Pro 2021 Rental Discussion"
```

### Testing with Mock Server

Reset data between tests:

```typescript
import { describe, it, beforeEach, afterAll } from 'vitest';
import { MockTwilioServer } from '@sthrift/mock-twilio-server';

describe('Twilio Integration Tests', () => {
  let mockServer: MockTwilioServer;

  beforeEach(async () => {
    mockServer = new MockTwilioServer();
    await mockServer.startUp();
  });

  afterAll(async () => {
    await mockServer.shutDown();
  });

  it('should list conversations', async () => {
    const response = await fetch('http://localhost:3004/v1/Conversations');
    const data = await response.json();
    
    expect(data.conversations).toHaveLength(3); // Seeded data
  });

  it('should create a new conversation', async () => {
    const response = await fetch('http://localhost:3004/v1/Conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ FriendlyName: 'Test Conversation' })
    });
    
    const conversation = await response.json();
    expect(conversation.friendly_name).toBe('Test Conversation');
    expect(conversation.sid).toMatch(/^CH[a-f0-9]{32}$/);
  });

  it('should reset data between tests', async () => {
    // Delete a conversation
    await fetch('http://localhost:3004/v1/Conversations/CH123abc', {
      method: 'DELETE'
    });

    // Reset to seed data
    await fetch('http://localhost:3004/mock/seed', { method: 'POST' });

    // Verify data restored
    const response = await fetch('http://localhost:3004/v1/Conversations');
    const data = await response.json();
    expect(data.conversations).toHaveLength(3);
  });
});
```

### Switching Between Mock and Real Twilio

Simply toggle the environment variable:

```typescript
// Development: Use mock server
if (process.env.NODE_ENV === 'development') {
  process.env.TWILIO_USE_MOCK = 'true';
  const mockServer = new MockTwilioServer();
  await mockServer.startUp();
}

// Production: Use real Twilio (no mock server needed)
if (process.env.NODE_ENV === 'production') {
  process.env.TWILIO_USE_MOCK = 'false';
  process.env.TWILIO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxx';
  process.env.TWILIO_AUTH_TOKEN = 'your_auth_token';
}

// Same code works for both!
const twilioService = new ServiceTwilio();
await twilioService.startUp();
const conversations = await twilioService.listConversations();
```

## 🌱 Seed Data

The server comes pre-populated with realistic test data:

### Conversations (3)
- **CH123abc** - "MacBook Pro 2021 Rental Discussion" (active)
- **CH456def** - "Canon Camera Rental Chat" (active)
- **CH789ghi** - "Camping Gear Inquiry" (closed)

### Messages (9)
- 3 messages per conversation with realistic rental discussion content

### Participants (6)
- 2 participants per conversation (sharer + reserver)

### Users (3)
- **US001** - john.doe@example.com
- **US002** - jane.smith@example.com
- **US003** - bob.wilson@example.com

Access seed data directly:

```typescript
import { seedConversations, seedMessages, seedParticipants, seedUsers } from '@sthrift/mock-twilio-server';

console.log(seedConversations);
// [{ sid: 'CH123abc', friendly_name: 'MacBook Pro 2021 Rental Discussion', ... }]
```

## 🔄 Resetting Data

The mock server automatically reseeds data on each `startUp()`:

```typescript
const server = new MockTwilioServer();

// First startup - seeded data present
await server.startUp();
let conversations = await fetch('http://localhost:3004/v1/Conversations').then(r => r.json());
console.log(conversations.conversations.length); // 3

// Make changes
await fetch('http://localhost:3004/v1/Conversations/CH123abc', { method: 'DELETE' });

// Reset via endpoint (without full restart)
await fetch('http://localhost:3004/mock/seed', { method: 'POST' });

// Data restored
conversations = await fetch('http://localhost:3004/v1/Conversations').then(r => r.json());
console.log(conversations.conversations.length); // 3 again
```

## 🏗️ Architecture

```
mock-twilio-server/
├── src/
│   ├── index.ts                    # Main export, MockTwilioServer class
│   ├── server.ts                   # Express app setup + lifecycle
│   ├── store.ts                    # In-memory Map-based storage
│   ├── types.ts                    # TypeScript interfaces
│   ├── routes/                     # API endpoint handlers
│   │   ├── conversations.routes.ts
│   │   ├── messages.routes.ts
│   │   ├── participants.routes.ts
│   │   └── users.routes.ts
│   └── seed/                       # Pre-populated test data
│       ├── conversations.seed.ts
│       ├── messages.seed.ts
│       ├── participants.seed.ts
│       └── users.seed.ts
└── package.json
```

## 🔗 Integration Points

### With @sthrift/service-twilio

`ServiceTwilio` automatically uses the mock server when `TWILIO_USE_MOCK=true`:

```typescript
import { ServiceTwilio } from '@sthrift/service-twilio';

process.env.TWILIO_USE_MOCK = 'true';

const service = new ServiceTwilio();
await service.startUp();

// This calls http://localhost:3004/v1/Conversations
const conversations = await service.listConversations();
```

### With @sthrift/persistence (Twilio DataSource)

The persistence layer uses `ServiceTwilio` under the hood:

```typescript
import { Persistence } from '@sthrift/persistence';
import { ServiceTwilio } from '@sthrift/service-twilio';

process.env.TWILIO_USE_MOCK = 'true';

const twilioService = new ServiceTwilio();
await twilioService.startUp();

const persistenceFactory = Persistence(mongooseService);
const dataSources = persistenceFactory.withPassport(userPassport, twilioService);

// Access Twilio datasource (uses mock server)
const conversation = await dataSources.twilioDataSource
  ?.Conversation
  .Conversation
  .TwilioConversationRepo
  .getConversationBySid('CH123abc');
```

## 🧪 Testing Tips

1. **Start fresh for each test** - Call `startUp()` in `beforeEach()` to reset data
2. **Use seeded SIDs** - Reference known conversations like `CH123abc`
3. **Use mock utilities** - Call `/mock/seed` to restore seed data without full restart
4. **Check response format** - Verify Twilio API structure is maintained
5. **Test error cases** - Try invalid SIDs, missing parameters
6. **Verify pagination** - Test with large datasets

## 🐛 Troubleshooting

### Port Already in Use

If port 3004 is taken, change it:

```bash
PORT=3005 npm run dev
```

Or in code:

```typescript
const server = new MockTwilioServer({ port: 3005 });
```

### Mock Server Not Responding

Ensure it's started and the URL is correct:

```bash
# Check if server is running
curl http://localhost:3004/v1/Conversations

# Verify TWILIO_USE_MOCK is set
echo $TWILIO_USE_MOCK  # Should output: true
```

### ServiceTwilio Still Calling Real Twilio

Make sure the environment variable is set **before** creating the service:

```typescript
process.env.TWILIO_USE_MOCK = 'true';  // Must be before instantiation
const service = new ServiceTwilio();
await service.startUp();
```

## 🤝 Contributing

When adding new endpoints:

1. Add route handler in `src/routes/`
2. Update `src/types.ts` with TypeScript interfaces
3. Add seed data in `src/seed/` if needed
4. Update this README with new endpoint documentation
