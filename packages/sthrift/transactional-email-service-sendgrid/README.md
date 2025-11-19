# @sthrift/transactional-email-service-sendgrid

SendGrid implementation of the transactional email service interface. This package provides production email sending capabilities using the SendGrid v3 API.

## Features

- **SendGrid v3 API**: Uses official `@sendgrid/mail` SDK
- **Template support**: Reads email templates from disk
- **Magic link replacement**: Replaces `{{magicLink}}` placeholder
- **Environment configuration**: API key via environment variable
- **Lifecycle management**: Proper startup/shutdown

## Usage

```typescript
import { ServiceTransactionalEmailSendGrid } from '@sthrift/transactional-email-service-sendgrid';

// Create service with template name and optional API key
const emailService = new ServiceTransactionalEmailSendGrid(
  'magic-link-template',
  'SG.your-api-key'  // Optional, reads from SENDGRID_API_KEY env var
);

// Start the service
await emailService.startUp();

// Send an email
await emailService.sendEmailWithMagicLink(
  'user@example.com',
  'https://example.com/magic/abc123'
);

// Shutdown
await emailService.shutDown();
```

## Configuration

### Constructor Parameters

- `emailTemplateName` (required): Name of the email template (without .json extension)
- `apiKey` (optional): SendGrid API key
  - If not provided, reads from `SENDGRID_API_KEY` environment variable
  - Must be a valid SendGrid API key

### Environment Variables

- `SENDGRID_API_KEY` (required if not passed to constructor): Your SendGrid API key
- `SENDGRID_MAGICLINK_SUBJECT_SUFFIX` (optional): Appended to email subject line

## Email Templates

Templates should be placed in `assets/email-templates/` relative to `process.cwd()`.

Template format (JSON):
```json
{
  "fromEmail": "noreply@example.com",
  "subject": "Your Magic Link",
  "body": "<html><body><h1>Welcome!</h1><p>Click here: {{magicLink}}</p></body></html>"
}
```

The `{{magicLink}}` placeholder will be replaced with the actual magic link URL.

## Error Handling

The service will throw errors in the following cases:
- Missing or invalid API key at construction time
- Failed to start service when already started
- Failed to send email (SendGrid API errors)
- Invalid or missing email template

## SendGrid API

This implementation uses:
- `@sendgrid/mail` version 8.x
- SendGrid v3 API
- Single email sending (not bulk)

For SendGrid-specific features beyond the interface, you may need to extend this implementation.

## Production Deployment

1. Set `SENDGRID_API_KEY` environment variable with a valid SendGrid API key
2. Ensure `NODE_ENV` is NOT set to `development`
3. The facade will automatically select this implementation

## Related Packages

- `@cellix/transactional-email-service` - Interface definition
- `@sthrift/transactional-email-service-mock` - Mock implementation for development
- `@sthrift/service-sendgrid` - Facade that selects implementation

## Migration from Legacy Code

This package replaces the legacy inline SendGrid implementation. The interface remains compatible, but the internal architecture has been refactored for better separation of concerns and testability.
