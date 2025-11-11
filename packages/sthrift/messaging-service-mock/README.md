# @sthrift/messaging-service-mock

Mock implementation of the messaging service interface for local development and testing.

## Purpose

HTTP client that communicates with `@sthrift/mock-messaging-server`, eliminating the need for real messaging provider credentials during development.

### Integration with Application

```bash
# Enable mock mode
NODE_ENV=development
```

The application automatically uses this mock service instead of the production service when `NODE_ENV` is set to `development`.

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `MESSAGING_MOCK_URL` | Mock server URL | `http://localhost:10000` |
| `NODE_ENV` | Enable mock mode (set to `development`) | `production` |

## Related Packages

- `@sthrift/mock-messaging-server` - The HTTP server this client connects to
- `@sthrift/messaging-service-twilio` - Production Twilio implementation
- `@cellix/messaging` - Messaging service interface definition
