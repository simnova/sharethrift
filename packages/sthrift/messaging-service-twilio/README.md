# @sthrift/messaging-service-twilio

Production implementation of the messaging service interface using Twilio Conversations API.

## Purpose

Real-time conversation and messaging management using Twilio's infrastructure for production environments.

### Required Environment Variables

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
```

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Yes |
| `MESSAGING_USE_MOCK` | Use mock service | No (default: `false`) |

## Local Development

Use mock service for local development:

```bash
MESSAGING_USE_MOCK=true
```

## Related Packages

- `@sthrift/messaging-service-mock` - Mock implementation for local development
- `@sthrift/mock-messaging-server` - HTTP mock server
- `@cellix/messaging` - Messaging service interface definition

## References

- [Twilio Conversations API](https://www.twilio.com/docs/conversations/api)
- [Twilio Node.js SDK](https://www.twilio.com/docs/libraries/node)
- [Twilio Error Codes](https://www.twilio.com/docs/api/errors)
