# @sthrift/transactional-email-service-mock

Mock implementation of the transactional email service for local development and testing. Instead of sending real emails, this service saves HTML email templates to local files.

## Purpose

Enables developers to:
- Verify email content and styling locally
- Test email flows without external dependencies
- Inspect complete email HTML including styling
- Develop offline without SendGrid API keys

## Features

- ✅ Saves complete HTML emails to local filesystem
- ✅ Includes metadata header (to, from, subject, timestamp)
- ✅ Preserves all styling and formatting
- ✅ Sanitizes filenames for safe filesystem storage
- ✅ Creates output directory automatically
- ✅ No external dependencies or network calls

## Installation

```bash
pnpm add @sthrift/transactional-email-service-mock
```

## Usage

```typescript
import { ServiceTransactionalEmailMock } from '@sthrift/transactional-email-service-mock';

// Create service instance
const service = new ServiceTransactionalEmailMock();
// Optional: specify custom output directory
// const service = new ServiceTransactionalEmailMock('/path/to/output');

// Start service
await service.startUp();

// Send email (saves to file)
await service.sendEmail({
  to: 'user@example.com',
  from: 'noreply@example.com',
  subject: 'Welcome!',
  html: '<h1>Hello!</h1><p>Welcome to our service.</p>'
});

// Shutdown service
await service.shutDown();
```

## Output

Emails are saved to `tmp/emails/` by default. Each file contains:

1. **Metadata Header** - Shows recipient, sender, subject, timestamp
2. **Original HTML** - Complete with all styling

Example filename: `user_example.com_1763141067616.html`

Special characters in email addresses are sanitized for safe filenames.

## Demo

Run the included demo to see it in action:

```bash
npm run build
npx tsc demo/demo-mock.ts --outDir demo-dist --module nodenext --moduleResolution nodenext --target es2022
node demo-dist/demo/demo-mock.js
```

Check `tmp/emails/` folder for generated HTML files.

## Testing

Comprehensive test suite included:

```bash
npm test
```

Tests cover:
- Service lifecycle (startup/shutdown)
- Email saving and file creation
- Filename sanitization
- Multiple email handling
- Metadata inclusion

## Configuration

### Output Directory

Default: `tmp/emails/` (relative to current working directory)

Custom directory:

```typescript
const service = new ServiceTransactionalEmailMock('/custom/path');
```

## .gitignore

Add to your `.gitignore`:

```
tmp/
```

The mock service creates this directory and it should not be committed to version control.

## Use Cases

- **Local Development** - Test email functionality without SendGrid
- **CI/CD** - Run tests without external service dependencies
- **Email Template Design** - Iterate on email designs quickly
- **Debugging** - Inspect actual email HTML being generated
- **Offline Development** - Work without internet connection

## Interface Compliance

Implements `TransactionalEmailService` from `@cellix/transactional-email-service`.

## Related Packages

- **@cellix/transactional-email-service** - Interface definition
- **@sthrift/transactional-email-service-sendgrid** - SendGrid implementation
- **@sthrift/service-sendgrid** - Facade that auto-selects implementation
