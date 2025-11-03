# @sthrift/messaging-service-twilio

Production implementation of the messaging service interface using Twilio Conversations API.

## Purpose

Real-time conversation and messaging management using Twilio's infrastructure for production environments.

## Prerequisites

### Twilio Account Setup

1. Create account at [twilio.com](https://www.twilio.com)
2. Get credentials from Twilio Console Dashboard:
   - Account SID
   - Auth Token
3. Enable Conversations API in Twilio Console

### Required Environment Variables

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
```

⚠️ **Never commit credentials to version control.**

## Usage

### Basic Usage

```typescript
import { ServiceTwilio } from '@sthrift/messaging-service-twilio';

const service = new ServiceTwilio();
await service.startUp();

// Create conversation
const conversation = await service.createConversation('Customer Support');

// Send message
const message = await service.sendMessage(
  conversation.id,
  'Thank you for contacting us.',
  'agent@example.com'
);

await service.shutDown();
```

### With Explicit Credentials

```typescript
const service = new ServiceTwilio(
  'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'your_auth_token_here'
);
```

Useful for testing or multi-tenant scenarios.

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Yes |
| `MESSAGING_USE_MOCK` | Use mock service | No (default: `false`) |

### Constructor

```typescript
constructor(accountSid?: string, authToken?: string)
```

Both parameters default to environment variables. Constructor throws if credentials are missing.

## API Methods

### Service Lifecycle
- `startUp()` - Initialize service
- `shutDown()` - Cleanup resources

### Conversations
- `createConversation(displayName?, uniqueIdentifier?)` - Create conversation
- `getConversation(conversationId)` - Get conversation
- `listConversations()` - List all conversations

### Messages
- `sendMessage(conversationId, body, author?)` - Send message
- `getMessages(conversationId)` - Get messages

## Error Handling

Common Twilio errors:
- **20003**: Authentication failed (invalid credentials)
- **20404**: Resource not found
- **20429**: Rate limit exceeded
- **50000**: Internal server error

See [Twilio Error Codes](https://www.twilio.com/docs/api/errors) for complete list.

## Rate Limits

- **Conversations API**: ~10,000 requests/hour per account
- **Message Creation**: 1 message/second per conversation

Best practices:
- Implement retry logic with exponential backoff
- Cache conversation data when possible
- Use webhooks for real-time updates

## Production Deployment

### Azure Functions Configuration

```bash
az functionapp config appsettings set \
  --name your-function-app \
  --resource-group your-resource-group \
  --settings \
    TWILIO_ACCOUNT_SID="ACxxxx..." \
    TWILIO_AUTH_TOKEN="your_token"
```

### Security Considerations

1. Use Azure Key Vault for credentials
2. Rotate auth tokens regularly
3. Monitor API usage
4. Configure IP allowlisting in Twilio Console
5. Validate webhook requests

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
