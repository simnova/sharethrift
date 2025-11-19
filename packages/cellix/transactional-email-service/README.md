# @cellix/transactional-email-service

Generic interface for transactional email services. This package defines a minimal, vendor-agnostic API for sending transactional emails, hiding all proprietary implementation details.

## Purpose

This interface package enables:
- **Vendor independence**: Swap email providers without changing upstream code
- **Testability**: Use mock implementations for local development
- **Consistency**: Unified API across different email service providers

## Interface

### `TransactionalEmailService`

Extends `ServiceBase<TransactionalEmailService>` with the following methods:

#### `sendEmailWithMagicLink(userEmail: string, magicLink: string): Promise<void>`

Sends an email with a magic link for authentication.

**Parameters:**
- `userEmail`: Recipient email address
- `magicLink`: The magic link URL to include in the email

**Returns:** Promise that resolves when email is sent (or saved for mock)

### `EmailTemplate`

Type definition for email templates:

```typescript
{
  fromEmail: string;    // Sender email address
  subject: string;      // Email subject line
  body: string;        // HTML email body (may contain {{magicLink}} placeholder)
}
```

## Implementation Packages

See related packages for concrete implementations:

- `@sthrift/transactional-email-service-sendgrid` - SendGrid v3 API implementation
- `@sthrift/transactional-email-service-mock` - Local mock for development

## Usage

This is an interface-only package. Consumers should depend on specific implementation packages and use this interface for type definitions only.

```typescript
import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import { ServiceTransactionalEmailSendGrid } from '@sthrift/transactional-email-service-sendgrid';

const emailService: TransactionalEmailService = new ServiceTransactionalEmailSendGrid('template-name');
await emailService.startUp();
await emailService.sendEmailWithMagicLink('user@example.com', 'https://example.com/magic/abc123');
await emailService.shutDown();
```

## Architecture

This package follows the facade pattern used throughout the codebase:
1. Define a generic interface package (this package)
2. Create vendor-specific implementation packages
3. Use a facade to select the appropriate implementation at runtime
