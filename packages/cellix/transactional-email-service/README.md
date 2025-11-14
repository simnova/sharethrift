# @cellix/transactional-email-service

Generic interface for transactional email services. This package defines a minimal, vendor-agnostic interface that hides proprietary details of specific email service providers.

## Purpose

This package provides a common interface that allows implementations to be swapped without impacting upstream code. It enables a true plug-and-play approach for email services.

## Interface

### `TransactionalEmailService`

Main service interface that extends `ServiceBase`:

```typescript
interface TransactionalEmailService extends ServiceBase<TransactionalEmailService> {
  sendEmail(message: EmailMessage): Promise<void>;
}
```

### `EmailMessage`

Simple, generic message structure:

```typescript
interface EmailMessage {
  to: string;      // Recipient email address
  from: string;    // Sender email address  
  subject: string; // Email subject line
  html: string;    // HTML content of the email
}
```

## Available Implementations

- **@sthrift/transactional-email-service-sendgrid** - SendGrid v3 implementation
- **@sthrift/transactional-email-service-mock** - Mock implementation for local development

## Future Implementations

The architecture supports adding new providers:

- Azure Communication Services
- AWS SES
- Mailgun
- etc.

## Usage

This package is typically not used directly. Instead, use one of the implementations or the facade package `@sthrift/service-sendgrid`.

```typescript
import type { TransactionalEmailService, EmailMessage } from '@cellix/transactional-email-service';

// Use in type definitions
function setupEmailService(service: TransactionalEmailService) {
  // ...
}
```

## Architecture

This package follows the facade pattern, allowing the email service implementation to be determined at runtime or by configuration, without changing any upstream code that depends on it.
