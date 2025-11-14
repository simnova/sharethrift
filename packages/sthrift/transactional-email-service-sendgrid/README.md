# @sthrift/transactional-email-service-sendgrid

SendGrid implementation of the transactional email service interface. Provides email sending via SendGrid's API v8.

## Purpose

Production-ready email sending using SendGrid. This implementation wraps the SendGrid SDK and provides a clean interface for sending transactional emails.

## Installation

```bash
pnpm add @sthrift/transactional-email-service-sendgrid
```

## Prerequisites

- SendGrid account
- SendGrid API key with send permissions

## Configuration

Set the `SENDGRID_API_KEY` environment variable:

```bash
export SENDGRID_API_KEY=your_api_key_here
```

Or pass it to the constructor:

```typescript
const service = new ServiceTransactionalEmailSendGrid('your_api_key_here');
```

## Usage

```typescript
import { ServiceTransactionalEmailSendGrid } from '@sthrift/transactional-email-service-sendgrid';

// Create service instance
const service = new ServiceTransactionalEmailSendGrid();
// Or with explicit API key:
// const service = new ServiceTransactionalEmailSendGrid('sg.xxxxx');

// Start service
await service.startUp();

// Send email
await service.sendEmail({
  to: 'recipient@example.com',
  from: 'sender@yourdomain.com',
  subject: 'Your Subject',
  html: '<h1>Email Content</h1>'
});

// Shutdown service
await service.shutDown();
```

## API

### Constructor

```typescript
constructor(apiKey?: string)
```

- **apiKey** (optional) - SendGrid API key. If not provided, reads from `SENDGRID_API_KEY` environment variable.

### Methods

#### `startUp()`

Initializes the SendGrid client with the API key.

```typescript
await service.startUp();
```

Throws error if API key is not configured.

#### `sendEmail(message: EmailMessage)`

Sends an email via SendGrid.

```typescript
await service.sendEmail({
  to: 'user@example.com',
  from: 'noreply@example.com',
  subject: 'Welcome',
  html: '<p>Hello!</p>'
});
```

#### `shutDown()`

Shuts down the service.

```typescript
await service.shutDown();
```

## Error Handling

The service will:
- Warn if API key is not configured at construction
- Throw error if `startUp()` is called without API key
- Log errors from SendGrid API
- Re-throw errors to caller for handling

## SendGrid SDK

Uses `@sendgrid/mail` v8.x. Consult [SendGrid documentation](https://docs.sendgrid.com/) for:
- API key management
- Domain authentication
- Rate limits
- Deliverability best practices

## Testing

For testing, use the mock implementation:

```typescript
import { ServiceTransactionalEmailMock } from '@sthrift/transactional-email-service-mock';
```

Or use the facade which auto-switches based on environment:

```typescript
import { ServiceSendGrid } from '@sthrift/service-sendgrid';
```

## Interface Compliance

Implements `TransactionalEmailService` from `@cellix/transactional-email-service`.

## Dependencies

- `@sendgrid/mail` ^8.0.0
- `@cellix/api-services-spec`
- `@cellix/transactional-email-service`

## Related Packages

- **@cellix/transactional-email-service** - Interface definition
- **@sthrift/transactional-email-service-mock** - Mock implementation
- **@sthrift/service-sendgrid** - Facade that auto-selects implementation

## Production Considerations

1. **API Key Security** - Never commit API keys. Use environment variables or secret management.
2. **Rate Limits** - SendGrid has rate limits. Handle throttling appropriately.
3. **Email Verification** - Configure domain authentication in SendGrid.
4. **Monitoring** - Monitor SendGrid dashboard for deliverability issues.
5. **Bounce Handling** - Implement webhook handlers for bounce/spam reports.
