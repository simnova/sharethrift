import { describe, it, expect } from 'vitest';
import { ServiceTransactionalEmailSendGrid } from './service-transactional-email-sendgrid.js';

describe('ServiceTransactionalEmailSendGrid', () => {
  it('throws when sendTemplatedEmail is called before startUp', async () => {
    const svc = new ServiceTransactionalEmailSendGrid();
    await expect(
      svc.sendTemplatedEmail(
        'reservation-request-notification',
        { email: 'user@example.com', name: 'User' },
        { name: 'User' },
      ),
    ).rejects.toThrow(/not initialized/i);
  });

  it('startUp rejects if API key is missing, shutDown is a no-op', async () => {
    const svc = new ServiceTransactionalEmailSendGrid();
    await expect(svc.startUp()).rejects.toThrow(/SENDGRID_API_KEY/);
    await expect(svc.shutDown()).resolves.not.toThrow();
  });
});
