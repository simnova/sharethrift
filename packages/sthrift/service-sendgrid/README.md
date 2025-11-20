# @sthrift/service-sendgrid

Facade for transactional email services. Automatically selects between SendGrid production implementation and mock implementation based on environment configuration.

## Purpose

This package provides a backward-compatible facade that:
- Maintains the original `SendGrid` class API
- Automatically selects the appropriate implementation at runtime
- Enables local development without SendGrid API keys
- Supports easy swapping of email providers in the future

## Features

- **Automatic selection**: Chooses mock or SendGrid based on environment
- **Backward compatible**: Drop-in replacement for the original implementation
- **Zero config for development**: Just set `NODE_ENV=development`
- **Production ready**: Works with real SendGrid in production

## Usage

The facade maintains the original API, so existing code works unchanged:

```typescript
import { SendGrid } from '@sthrift/service-sendgrid';

// Create instance (automatically selects implementation)
const emailService = new SendGrid('magic-link-template');

// Send email
await emailService.sendEmailWithMagicLink(
  'user@example.com',
  'https://example.com/magic/abc123'
);
```

## Implementation Selection

The facade selects an implementation based on:

### Mock Implementation (Development)
Selected when **any** of:
- `NODE_ENV=development`
- `SENDGRID_API_KEY=mock`

Mock saves emails to `tmp/emails/` for local verification.

### SendGrid Implementation (Production)
Selected when:
- `NODE_ENV` is NOT `development`
- `SENDGRID_API_KEY` is set to a valid API key

Sends emails via SendGrid API.

## Configuration

### Environment Variables

- `NODE_ENV`: Set to `development` for mock mode
- `SENDGRID_API_KEY`: 
  - Set to `mock` for explicit mock mode
  - Set to valid SendGrid API key for production
  - Required for production mode
- `SENDGRID_MAGICLINK_SUBJECT_SUFFIX`: Optional suffix for email subjects

### Email Templates

Templates should be in `assets/email-templates/` relative to `process.cwd()`:

```json
{
  "fromEmail": "noreply@example.com",
  "subject": "Your Magic Link",
  "body": "<html><body>Click: {{magicLink}}</body></html>"
}
```

## Local Development

1. Set `NODE_ENV=development`
2. Use the service normally
3. Emails are saved to `tmp/emails/` (gitignored)
4. Open HTML files in browser to verify styling

Example:
```bash
NODE_ENV=development node your-app.js
```

Saved emails will be in `tmp/emails/user_example.com_1234567890.html`

## Production Deployment

1. Set `SENDGRID_API_KEY` to your API key
2. Ensure `NODE_ENV` is NOT `development` (or unset)
3. Emails will be sent via SendGrid

Example:
```bash
SENDGRID_API_KEY=SG.your-api-key node your-app.js
```

## Migration from Original Implementation

This is a **drop-in replacement** for the original `@sthrift/service-sendgrid` package. No code changes required in consuming packages.

### What Changed

**Before:**
- Inline implementation with conditional logic
- Direct SendGrid SDK usage
- Basic file-based mocking

**After:**
- Facade pattern with clean separation
- Pluggable implementations
- Comprehensive testing
- Better documentation

### Breaking Changes

**None** - The public API remains identical:
- `new SendGrid(templateName)` - Same constructor
- `sendEmailWithMagicLink(email, link)` - Same method

## Architecture

This package implements the facade pattern:

```
@sthrift/service-sendgrid (Facade)
    ├── @cellix/transactional-email-service (Interface)
    ├── @sthrift/transactional-email-service-sendgrid (SendGrid impl)
    └── @sthrift/transactional-email-service-mock (Mock impl)
```

### Benefits

1. **Testability**: Easy to mock in tests
2. **Maintainability**: Clear separation of concerns
3. **Extensibility**: Add new providers without changing facade
4. **Development speed**: No external dependencies in dev mode

## Future Enhancements

The architecture supports easy addition of new providers:
- Azure Communication Services
- AWS SES
- Mailgun
- Any other email service

Just implement the `TransactionalEmailService` interface and update the facade's selection logic.

## Related Packages

- `@cellix/transactional-email-service` - Interface definition
- `@sthrift/transactional-email-service-sendgrid` - SendGrid implementation
- `@sthrift/transactional-email-service-mock` - Mock implementation

## Troubleshooting

### Emails not sending in production
- Verify `SENDGRID_API_KEY` is set correctly
- Check `NODE_ENV` is not `development`
- Review application logs for errors

### Mock not being used in development
- Ensure `NODE_ENV=development` is set
- Or set `SENDGRID_API_KEY=mock` explicitly
- Check console logs for "MOCK mode" message

### Template not found errors
- Verify template files exist in `assets/email-templates/`
- Check template name matches file name (without .json)
- Ensure working directory is correct
