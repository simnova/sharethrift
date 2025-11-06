# @sthrift/messaging-service-mock

Mock implementation of the messaging service interface for local development and testing.

## Purpose

HTTP client that communicates with `@sthrift/mock-messaging-server`, eliminating the need for real messaging provider credentials during development.

### Integration with Application

```bash
# Enable mock mode
MESSAGING_USE_MOCK=true
```

The application automatically uses this mock service instead of the production service.

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `MESSAGING_MOCK_URL` | Mock server URL | `http://localhost:10000` |
| `MESSAGING_USE_MOCK` | Enable mock mode | `false` |

## Related Packages

- `@sthrift/mock-messaging-server` - The HTTP server this client connects to
- `@sthrift/messaging-service-twilio` - Production Twilio implementation
- `@cellix/messaging` - Messaging service interface definition
