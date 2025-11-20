# @sthrift/transactional-email-service-mock

Mock implementation of the transactional email service for local development. Instead of sending emails, this saves them as HTML files to disk for easy inspection.

## Features

- **No external dependencies**: Works without API keys or network access
- **Local verification**: Saves complete HTML emails to disk
- **Email metadata**: Includes To/Subject in saved files
- **Filename sanitization**: Safe filenames from email addresses
- **Complete HTML**: Saves fully formatted HTML documents

## Usage

```typescript
import { ServiceTransactionalEmailMock } from '@sthrift/transactional-email-service-mock';

// Create service with template name and optional output directory
const emailService = new ServiceTransactionalEmailMock(
  'magic-link-template',
  '/path/to/output/dir'  // Optional, defaults to tmp/emails in cwd
);

// Start the service
await emailService.startUp();

// Send an email (saves to disk)
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
- `outputDir` (optional): Directory where emails will be saved
  - Default: `tmp/emails` relative to `process.cwd()`

### Environment Variables

- `SENDGRID_MAGICLINK_SUBJECT_SUFFIX`: Appended to email subject line (optional)

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

## Output Format

Saved emails are complete HTML documents with metadata:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your Magic Link</title>
</head>
<body>
  <div style="background-color: #f0f0f0; padding: 20px; margin-bottom: 20px;">
    <strong>To:</strong> user@example.com<br>
    <strong>Subject:</strong> Your Magic Link
  </div>
  <!-- Original email body with magic link replaced -->
</body>
</html>
```

## File Naming

Files are saved as: `{sanitized-email}_{timestamp}.html`

Example: `user_example.com_1234567890.html`

Characters sanitized: `@`, `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`, `+`

## Development Workflow

1. Set `NODE_ENV=development` or `SENDGRID_API_KEY=mock`
2. The facade (`@sthrift/service-sendgrid`) will automatically use this mock
3. Emails are saved to `tmp/emails/` (gitignored)
4. Open the HTML files in a browser to verify styling and content

## Testing

The package includes comprehensive unit tests covering:
- Service lifecycle
- Email file creation
- Magic link replacement
- Filename sanitization
- Multiple email handling

Run tests:
```bash
pnpm test
```

## Related Packages

- `@cellix/transactional-email-service` - Interface definition
- `@sthrift/transactional-email-service-sendgrid` - Production SendGrid implementation
- `@sthrift/service-sendgrid` - Facade that selects implementation
