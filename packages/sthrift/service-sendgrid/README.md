# @sthrift/service-sendgrid

Facade for transactional email services with automatic implementation selection. Provides high-level email functionality with magic link support.

## Purpose

This facade automatically selects between production SendGrid and local mock implementation based on configuration, enabling:
- Seamless local development without SendGrid
- Production email sending with SendGrid
- Easy provider swapping without code changes
- Magic link email templating

## Architecture

The facade follows the **Adapter Pattern**, selecting the appropriate implementation at runtime:

```
ServiceSendGrid (Facade)
    ├─> ServiceTransactionalEmailSendGrid (Production)
    └─> ServiceTransactionalEmailMock (Development)
```

Selection is based on `SENDGRID_API_KEY` environment variable:
- **Set and not 'mock'** → Uses SendGrid implementation
- **Unset or 'mock'** → Uses Mock implementation

## Installation

```bash
pnpm add @sthrift/service-sendgrid
```

## Usage

### Basic Usage

```typescript
import { ServiceSendGrid } from '@sthrift/service-sendgrid';

// Initialize with email template name
const service = new ServiceSendGrid('welcome-email');

// Start service
await service.startUp();

// Send magic link email
await service.sendEmailWithMagicLink(
  'user@example.com',
  'https://example.com/verify?token=abc123'
);

// Shutdown
await service.shutDown();
```

### Configuration

#### Production (SendGrid)

```bash
export SENDGRID_API_KEY=your_sendgrid_api_key
# Optional subject suffix
export SENDGRID_MAGICLINK_SUBJECT_SUFFIX="[Dev]"
```

#### Local Development (Mock)

```bash
# Option 1: Don't set SENDGRID_API_KEY
# Option 2: Set to 'mock'
export SENDGRID_API_KEY=mock
```

When using mock, emails are saved to `tmp/emails/` folder.

### Email Templates

Email templates are JSON files stored in `assets/email-templates/`:

```json
{
  "fromEmail": "noreply@example.com",
  "subject": "Verify your email",
  "body": "<html><body><p>Click here: {{magicLink}}</p></body></html>"
}
```

The `{{magicLink}}` placeholder is replaced with the actual magic link.

## API

### Constructor

```typescript
constructor(emailTemplateName: string)
```

- **emailTemplateName** - Name of email template file (without `.json` extension)

### Methods

#### `startUp()`

Initializes the selected email service implementation.

```typescript
await service.startUp();
```

#### `sendEmailWithMagicLink(userEmail, magicLink)`

Sends an email with a magic link for passwordless authentication.

```typescript
await service.sendEmailWithMagicLink(
  'user@example.com',
  'https://example.com/verify?token=xyz'
);
```

- **userEmail** - Recipient email address
- **magicLink** - URL to include in email

#### `shutDown()`

Shuts down the service.

```typescript
await service.shutDown();
```

## Implementation Selection

The facade determines which implementation to use at `startUp()`:

| SENDGRID_API_KEY | Implementation | Behavior |
|------------------|---------------|----------|
| Not set | Mock | Saves to `tmp/emails/` |
| `"mock"` | Mock | Saves to `tmp/emails/` |
| Valid API key | SendGrid | Sends via SendGrid |

## Legacy API

For backward compatibility, the original `SendGrid` class is still exported:

```typescript
import { SendGrid } from '@sthrift/service-sendgrid';

const service = new SendGrid('template-name');
await service.sendEmailWithMagicLink('user@example.com', 'https://...');
```

**Note**: The legacy class has its own logic for environment-based mock mode.

## Directory Structure

```
@sthrift/service-sendgrid/
├── src/
│   ├── index.ts                      # Exports
│   ├── service-sendgrid-facade.ts    # New facade (recommended)
│   ├── sendgrid.ts                   # Legacy class
│   └── get-email-template.ts         # Template loading
├── assets/
│   └── email-templates/              # Email template JSON files
└── tmp/                              # Mock email output (gitignored)
    └── emails/
```

## Migration Guide

### From Legacy SendGrid Class

**Before:**
```typescript
import { SendGrid } from '@sthrift/service-sendgrid';
const service = new SendGrid('template');
await service.sendEmailWithMagicLink(email, link);
```

**After:**
```typescript
import { ServiceSendGrid } from '@sthrift/service-sendgrid';
const service = new ServiceSendGrid('template');
await service.startUp();
await service.sendEmailWithMagicLink(email, link);
await service.shutDown();
```

**Key Changes:**
- Add `startUp()` call before use
- Add `shutDown()` call when done
- Use `ServiceSendGrid` instead of `SendGrid`

## Dependencies

This package depends on:
- `@cellix/transactional-email-service` - Interface
- `@sthrift/transactional-email-service-sendgrid` - SendGrid implementation
- `@sthrift/transactional-email-service-mock` - Mock implementation
- `@sendgrid/mail` - For legacy class

## Related Packages

- **@cellix/transactional-email-service** - Interface definition
- **@sthrift/transactional-email-service-sendgrid** - SendGrid implementation
- **@sthrift/transactional-email-service-mock** - Mock implementation

## Examples

### Development Workflow

1. Clone repository
2. Don't set `SENDGRID_API_KEY`
3. Run application
4. Check `tmp/emails/` for generated emails
5. Open HTML files in browser to verify styling

### Production Deployment

1. Set `SENDGRID_API_KEY` in environment
2. Configure SendGrid domain authentication
3. Deploy application
4. Emails are sent via SendGrid

## Best Practices

1. **Templates** - Keep email templates in version control
2. **Testing** - Use mock in CI/CD pipelines
3. **Monitoring** - Monitor SendGrid deliverability in production
4. **Security** - Never commit API keys
5. **Cleanup** - Add `tmp/` to `.gitignore`
