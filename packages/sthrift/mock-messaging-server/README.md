# @sthrift/mock-messaging-server

Mock HTTP server for local messaging provider emulation during development and testing.

## Purpose

Provides a REST API compatible with messaging service clients, eliminating the need for real provider credentials during development. Implements conversation and message management endpoints that mirror the structure of production messaging APIs.

## Seeded Test Data

Automatically seeds on startup when enabled:
- **CH123**: Lawn Mower Chat
- **CH124**: Mountain Bike Chat
- **CH125**: City Bike Chat
- **CH126**: Power Drill Chat

## Configuration

| Variable | Default |
|----------|---------|
| `PORT` | `10000` |

## Related Packages

- `@sthrift/messaging-service-mock` - HTTP client for this server
- `@sthrift/messaging-service-twilio` - Production implementation
- `@cellix/messaging` - Service interface definition
