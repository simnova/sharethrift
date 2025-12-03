import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ServiceTransactionalEmailMock } from './service-transactional-email-mock.js';

function findTmpDir(): string {
  // Mirror the implementation default: tmp/emails under repo root
  return path.resolve(process.cwd(), 'apps/api/tmp/emails');
}

describe('ServiceTransactionalEmailMock', () => {
  it('startUp and shutDown complete without throwing', async () => {
    const svc = new ServiceTransactionalEmailMock();
    await expect(svc.startUp()).resolves.not.toThrow();
    await expect(svc.shutDown()).resolves.not.toThrow();
  });

  it('writes an email HTML file when sending', async () => {
    const svc = new ServiceTransactionalEmailMock();
    await svc.startUp();
    await svc.sendTemplatedEmail(
      'reservation-request-notification',
      { email: 'user@example.com', name: 'User' },
      { name: 'User', listingTitle: 'Test Listing' },
    );
    const outDir = findTmpDir();
    const files = fs.existsSync(outDir) ? fs.readdirSync(outDir) : [];
    const hasHtml = files.some((f) => f.endsWith('.html'));
    expect(hasHtml).toBe(true);
    await svc.shutDown();
  });
});
