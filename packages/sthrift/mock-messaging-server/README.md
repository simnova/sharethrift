# @sthrift/mock-messaging-server

Mock HTTP server for local messaging provider emulation during development and testing.

## Purpose

Provides a REST API compatible with messaging service clients, eliminating the need for real provider credentials during development.

## Usage

### Start Server

```bash
# From monorepo root
pnpm run start-emulator:messaging-server

# Or standalone
pnpm run start
```

Server starts on `http://localhost:10000` with seeded test data.

### Programmatic Usage

```typescript
import { startServer, stopServer } from '@sthrift/mock-messaging-server';

const server = await startServer(10000, true); // port, seedData
// ... your tests
await stopServer(server);
```

## API Endpoints

- `POST /v1/Conversations` - Create conversation
- `GET /v1/Conversations` - List conversations
- `GET /v1/Conversations/:sid` - Get conversation
- `DELETE /v1/Conversations/:sid` - Delete conversation
- `POST /v1/Conversations/:sid/Messages` - Send message
- `GET /v1/Conversations/:sid/Messages` - Get messages
- `GET /v1/Conversations/:sid/Participants` - Get participants

## Seeded Test Data

Automatically seeds on startup:
- **CH123**: General Discussion (3 participants, 4 messages)
- **CH124**: Project Updates (2 participants, 3 messages)
- **CH125**: Support Tickets (1 participant, 2 messages)

## Configuration

| Variable | Default |
|----------|---------|
| `PORT` | `10000` |

## Related Packages

- `@sthrift/messaging-service-mock` - HTTP client for this server
- `@sthrift/messaging-service-twilio` - Production implementation
- `@cellix/messaging` - Service interface definition
