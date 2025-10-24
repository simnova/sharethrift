# Mock Twilio Server

Express-based HTTP server that mocks Twilio Conversations API for local development.

## Installation

```bash
npm install @sthrift/mock-twilio-server
```

## Quick Start

```bash
# Default port 10000
npm start

# Custom port
PORT=3000 npm start

# With seed data
SEED_DATA=true npm start
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `10000` | Server port |
| `SEED_DATA` | `false` | Seed test data on startup |

## Seeded Data

With `SEED_DATA=true`:
- **3 conversations**: Customer Support Chat, Product Inquiry, Order #12345 Discussion
- **9 messages**: 3 per conversation
- **6 participants**: 2 per conversation

## API Endpoints

### Conversations
```
GET/POST    /v1/Conversations
GET/POST    /v1/Conversations/:sid
DELETE      /v1/Conversations/:sid
```

### Messages
```
GET/POST    /v1/Conversations/:conversationSid/Messages
GET/POST    /v1/Conversations/:conversationSid/Messages/:sid
DELETE      /v1/Conversations/:conversationSid/Messages/:sid
```

### Participants
```
GET/POST    /v1/Conversations/:conversationSid/Participants
GET/POST    /v1/Conversations/:conversationSid/Participants/:sid
DELETE      /v1/Conversations/:conversationSid/Participants/:sid
```

### Utilities
```
POST   /mock/reset    # Clear all data
POST   /mock/seed     # Seed test data
GET    /mock/health   # Health check
```

## Usage with ServiceTwilioMock

```typescript
import { ServiceTwilioMock } from '@sthrift/mock-service-twilio';

const mockService = new ServiceTwilioMock('http://localhost:10000');
await mockService.startUp();

const conversations = await mockService.listConversations();
```

## Health Check

```bash
curl http://localhost:10000/mock/health
```
