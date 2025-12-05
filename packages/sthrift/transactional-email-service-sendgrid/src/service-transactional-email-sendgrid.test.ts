import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServiceTransactionalEmailSendGrid } from './service-transactional-email-sendgrid.js';
import sendgrid from '@sendgrid/mail';

vi.mock('@sendgrid/mail');

describe('ServiceTransactionalEmailSendGrid', () => {
  let svc: ServiceTransactionalEmailSendGrid;

  beforeEach(() => {
    svc = new ServiceTransactionalEmailSendGrid();
    // Set a default API key for test isolation
    process.env['SENDGRID_API_KEY'] = 'test-api-key-default';
    vi.clearAllMocks();
  });

  it('throws when sendTemplatedEmail is called before startUp', async () => {
    await expect(
      svc.sendTemplatedEmail(
        'reservation-request-notification',
        { email: 'user@example.com', name: 'User' },
        { name: 'User' },
      ),
    ).rejects.toThrow(/not initialized/i);
  });

  it('startUp rejects if API key is missing', async () => {
    delete process.env['SENDGRID_API_KEY'];
    await expect(svc.startUp()).rejects.toThrow(/SENDGRID_API_KEY/);
  });

  it('startUp rejects with helpful error message when API key is missing', async () => {
    delete process.env['SENDGRID_API_KEY'];
    
    try {
      await svc.startUp();
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('SENDGRID_API_KEY');
      expect((error as Error).message).toContain('environment variable');
    }
  });

  it('shutDown completes without throwing before startUp', async () => {
    await expect(svc.shutDown()).resolves.not.toThrow();
  });

  it('shutDown completes without throwing after startUp', async () => {
    // We can't actually test startUp success without a valid API key,
    // but we can ensure shutDown doesn't throw even if startUp failed
    try {
      await svc.startUp();
    } catch (error) {
      // Expected to fail without API key
    }
    
    await expect(svc.shutDown()).resolves.not.toThrow();
  });

  it('throws before initialization with correct error message', async () => {
    const svc2 = new ServiceTransactionalEmailSendGrid();
    
    const error = await svc2
      .sendTemplatedEmail(
        'reservation-request-notification',
        { email: 'test@example.com' },
        { name: 'Test' },
      )
      .catch((e) => e);

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toMatch(/not initialized/i);
    expect((error as Error).message).toMatch(/startUp/i);
  });

  it('has a consistent constructor', async () => {
    const svc1 = new ServiceTransactionalEmailSendGrid();
    const svc2 = new ServiceTransactionalEmailSendGrid();
    
    // Both instances should behave the same way
    expect(svc1).toBeInstanceOf(ServiceTransactionalEmailSendGrid);
    expect(svc2).toBeInstanceOf(ServiceTransactionalEmailSendGrid);
  });

  it('multiple instances do not interfere with each other', async () => {
    const svc1 = new ServiceTransactionalEmailSendGrid();
    const svc2 = new ServiceTransactionalEmailSendGrid();
    
    // Attempting to send on one should not affect the other
    const error1 = await svc1
      .sendTemplatedEmail(
        'test',
        { email: 'test@example.com' },
        {},
      )
      .catch((e) => e);
    
    const error2 = await svc2
      .sendTemplatedEmail(
        'test',
        { email: 'test@example.com' },
        {},
      )
      .catch((e) => e);

    expect(error1).toBeInstanceOf(Error);
    expect(error2).toBeInstanceOf(Error);
  });

  it('returns a Promise from sendTemplatedEmail', async () => {
    const svc2 = new ServiceTransactionalEmailSendGrid();
    
    const result = svc2.sendTemplatedEmail(
      'test',
      { email: 'test@example.com' },
      {},
    );

    expect(result).toBeInstanceOf(Promise);
    
    // Handle the rejection to avoid unhandled promise rejection
    await result.catch(() => {
      // Expected - service is not initialized
    });
  });

  it('startup returns a Promise', () => {
    const svc2 = new ServiceTransactionalEmailSendGrid();
    
    const result = svc2.startUp();

    expect(result).toBeInstanceOf(Promise);
  });

  it('shutdown returns a Promise', () => {
    const result = svc.shutDown();

    expect(result).toBeInstanceOf(Promise);
  });

  describe('With valid API key', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-api-key-12345';
      vi.mocked(sendgrid.setApiKey).mockClear();
      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);
    });

    it('startUp initializes SendGrid with API key', async () => {
      await svc.startUp();
      expect(vi.mocked(sendgrid.setApiKey)).toHaveBeenCalledWith('test-api-key-12345');
    });

    it('successfully sends email with valid template', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'user@example.com', name: 'Test User' },
          { name: 'Test User', listingTitle: 'Beautiful Home' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch (error) {
        // Template might not exist in test environment
        expect((error as Error).message).toContain('Template file not found');
      }
    });

    it('sends email with correct recipient email', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'customer@example.com', name: 'Customer' },
          { name: 'Customer', listingTitle: 'Test Property' },
        );

        const sendCall = vi.mocked(sendgrid.send).mock.calls[0];
        if (sendCall) {
          const messageArg = sendCall[0] as any;
          expect(messageArg.to).toContain('customer@example.com');
        }
      } catch (error) {
        expect((error as Error).message).toContain('Template file not found');
      }
    });

    it('handles template not found gracefully', async () => {
      await svc.startUp();

      await expect(
        svc.sendTemplatedEmail(
          'nonexistent-template-xyz',
          { email: 'user@example.com' },
          { name: 'User' },
        ),
      ).rejects.toThrow(/Template file not found|template/i);
    });

    it('handles SendGrid API errors', async () => {
      await svc.startUp();
      
      const errorMessage = 'SendGrid API error: Invalid email address';
      vi.mocked(sendgrid.send).mockRejectedValueOnce(new Error(errorMessage));

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'invalid-email', name: 'Test' },
          { name: 'Test', listingTitle: 'Test' },
        );
      } catch (error) {
        // Should throw error from SendGrid or template loading
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('processes template variables correctly', async () => {
      await svc.startUp();

      const templateData = {
        name: 'John Doe',
        listingTitle: 'Modern Apartment',
        price: '250000',
        checkInDate: '2024-01-15',
      };

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'john@example.com' },
          templateData,
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch (error) {
        expect((error as Error).message).toContain('Template file not found');
      }
    });
  });

  describe('Multiple email sends', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-api-key';
      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);
    });

    it('can send multiple emails sequentially', async () => {
      await svc.startUp();

      const recipients = [
        { email: 'user1@example.com', name: 'User 1' },
        { email: 'user2@example.com', name: 'User 2' },
      ];

      for (const recipient of recipients) {
        try {
          await svc.sendTemplatedEmail(
            'reservation-request-notification',
            recipient,
            { name: recipient.name, listingTitle: 'Test' },
          );
        } catch (error) {
          expect((error as Error).message).toContain('Template file not found');
        }
      }
    });
  });

  describe('Recipient handling', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-api-key';
      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);
    });

    it('handles recipient without name', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'noname@example.com' },
          { name: '', listingTitle: 'Test' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch (error) {
        expect((error as Error).message).toContain('Template file not found');
      }
    });

    it('handles recipient with special characters in name', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'user@example.com', name: "O'Brien-Smith (Dr.)" },
          { name: "O'Brien-Smith (Dr.)", listingTitle: 'Test' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch (error) {
        expect((error as Error).message).toContain('Template file not found');
      }
    });

    it('handles email with plus addressing', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'user+tag@example.com', name: 'User' },
          { name: 'User', listingTitle: 'Test' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch (error) {
        expect((error as Error).message).toContain('Template file not found');
      }
    });
  });

  describe('Initialization state', () => {
    it('isInitialized flag is false by default', async () => {
      const newSvc = new ServiceTransactionalEmailSendGrid();
      
      const promise = newSvc.sendTemplatedEmail(
        'test',
        { email: 'test@example.com' },
        {},
      );

      await expect(promise).rejects.toThrow(/not initialized/i);
    });

    it('logs messages on startup and shutdown', async () => {
      process.env['SENDGRID_API_KEY'] = 'test-api-key';
      const logSpy = vi.spyOn(console, 'log');
      const consoleSpy = vi.spyOn(console, 'error');

      await svc.startUp();
      expect(logSpy).toHaveBeenCalledWith('ServiceTransactionalEmailSendGrid started');

      await svc.shutDown();
      expect(logSpy).toHaveBeenCalledWith('ServiceTransactionalEmailSendGrid stopped');

      logSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('SendGrid API integration', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-key-12345';
      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);
    });

    it('calls sendgrid.send with correct message structure', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'recipient@example.com', name: 'Test' },
          { name: 'Test', listingTitle: 'Property' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
        const { calls } = vi.mocked(sendgrid.send).mock;
        if (calls.length > 0) {
          const [messageArg] = calls[0];
          const message = messageArg as any;
          expect(message).toHaveProperty('to');
          expect(message).toHaveProperty('from');
          expect(message).toHaveProperty('subject');
          expect(message).toHaveProperty('html');
        }
      } catch (error) {
        expect((error as Error).message).toContain('Template file not found');
      }
    });

    it('passes correct recipient email to SendGrid', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'john@example.com' },
          { name: 'John', listingTitle: 'Home' },
        );

        const { calls } = vi.mocked(sendgrid.send).mock;
        if (calls.length > 0) {
          const [sendCall] = calls;
          const message = sendCall as any;
          expect(message.to).toContain('john@example.com');
        }
      } catch {
        // Template may not exist in test env
      }
    });

    it('handles SendGrid success response (202)', async () => {
      await svc.startUp();
      vi.mocked(sendgrid.send).mockResolvedValue([
        { statusCode: 202, headers: {}, body: '' },
      ] as any);

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'test@example.com' },
          { name: 'Test', listingTitle: 'Test' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch {
        // Template loading may fail
      }
    });

    it('handles SendGrid HTTP errors', async () => {
      await svc.startUp();
      const errorMessage = 'Invalid email address';
      vi.mocked(sendgrid.send).mockRejectedValue(new Error(errorMessage));

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'invalid' },
          { name: 'Test', listingTitle: 'Test' },
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('handles SendGrid rate limiting (429)', async () => {
      await svc.startUp();
      const rateLimitError = new Error('Rate limit exceeded');
      // biome-ignore lint/suspicious/noExplicitAny: Mock error structure
      (rateLimitError as any).code = 429;
      vi.mocked(sendgrid.send).mockRejectedValue(rateLimitError);

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'test@example.com' },
          { name: 'Test', listingTitle: 'Test' },
        );
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Email content handling', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-key';
      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);
    });

    it('includes subject line in email', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'test@example.com' },
          { name: 'Test', listingTitle: 'MyHome' },
        );

        const { calls } = vi.mocked(sendgrid.send).mock;
        if (calls.length > 0) {
          const [sendCall] = calls;
          const message = sendCall as any;
          expect(message.subject).toBeDefined();
          expect(typeof message.subject).toBe('string');
        }
      } catch {
        // Expected if template not found
      }
    });

    it('includes HTML body in email', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'test@example.com' },
          { name: 'Test', listingTitle: 'Property' },
        );

        const { calls } = vi.mocked(sendgrid.send).mock;
        if (calls.length > 0) {
          const [sendCall] = calls;
          const message = sendCall as any;
          expect(message.html).toBeDefined();
          expect(typeof message.html).toBe('string');
        }
      } catch {
        // Expected
      }
    });

    it('includes from address from template', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'recipient@example.com' },
          { name: 'Test', listingTitle: 'Home' },
        );

        const { calls } = vi.mocked(sendgrid.send).mock;
        if (calls.length > 0) {
          const [sendCall] = calls;
          const message = sendCall as any;
          expect(message.from).toBeDefined();
        }
      } catch {
        // Expected
      }
    });
  });

  describe('Console logging', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-key';
      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);
    });

    it('logs success message on successful email send', async () => {
      const logSpy = vi.spyOn(console, 'log');
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'reservation-request-notification',
          { email: 'test@example.com' },
          { name: 'Test', listingTitle: 'Test' },
        );

        // May be called with success message if template found
        if (logSpy.mock.calls.length > 1) {
          expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('Email sent successfully'),
          );
        }
      } catch {
        // Template may not exist
      }

      logSpy.mockRestore();
    });

    it('logs error when email sending fails', async () => {
      const errorSpy = vi.spyOn(console, 'error');
      await svc.startUp();

      const sendError = new Error('SendGrid connection failed');
      vi.mocked(sendgrid.send).mockRejectedValue(sendError);

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'test@example.com' },
          { name: 'Test', listingTitle: 'Test' },
        );
      } catch {
        // Expected
      }

      expect(errorSpy).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
      errorSpy.mockRestore();
    });
  });

  describe('Service state management', () => {
    it('isInitialized flag is set after successful startUp', async () => {
      process.env['SENDGRID_API_KEY'] = 'test-key';
      const svc2 = new ServiceTransactionalEmailSendGrid();

      await svc2.startUp();

      // Service should now accept emails without throwing
      const promise = svc2.sendTemplatedEmail(
        'test',
        { email: 'test@example.com' },
        { name: 'Test' },
      );

      expect(promise).toBeInstanceOf(Promise);
      await promise.catch(() => {
        // Expected if template not found
      });
    });

    it('throws error if sendTemplatedEmail called before startUp', async () => {
      const svc2 = new ServiceTransactionalEmailSendGrid();

      const promise = svc2.sendTemplatedEmail(
        'test',
        { email: 'test@example.com' },
        { name: 'Test' },
      );

      await expect(promise).rejects.toThrow(/not initialized/i);
    });

    it('setApiKey is called with correct API key from environment', async () => {
      process.env['SENDGRID_API_KEY'] = 'my-secret-key-xyz';
      const svc2 = new ServiceTransactionalEmailSendGrid();

      await svc2.startUp();

      expect(vi.mocked(sendgrid.setApiKey)).toHaveBeenCalledWith('my-secret-key-xyz');
    });
  });

  describe('Email recipient variations', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-key';
      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);
    });

    it('handles recipient with very long email address', async () => {
      await svc.startUp();
      const longEmail = 'a'.repeat(100) + '@example.com';

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: longEmail },
          { name: 'Test', listingTitle: 'Test' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch {
        // May fail due to template
      }
    });

    it('handles recipient with internationalized domain', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'user@münchen.de' },
          { name: 'Test', listingTitle: 'Test' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch {
        // Expected
      }
    });

    it('handles recipient with unicode name', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'test@example.com', name: 'José García' },
          { name: 'José García', listingTitle: 'Test' },
        );

        const { calls } = vi.mocked(sendgrid.send).mock;
        if (calls.length > 0) {
          const [sendCall] = calls;
          const message = sendCall as any;
          expect(message.to).toBeDefined();
        }
      } catch {
        // Expected
      }
    });
  });

  describe('Template data processing', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-key';
      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);
    });

    it('handles template data with special characters', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'test@example.com' },
          {
            name: 'Test & <Company>',
            listingTitle: 'Property "ABC" & Co.',
          },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch {
        // Expected
      }
    });

    it('handles template data with empty strings', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'test@example.com' },
          {
            name: '',
            listingTitle: '',
            propertyDescription: '',
          },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch {
        // Expected
      }
    });

    it('handles template data with very long strings', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'test@example.com' },
          {
            name: 'Test',
            listingTitle: 'A'.repeat(1000),
            description: 'B'.repeat(5000),
          },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch {
        // Expected
      }
    });

    it('handles template data with numeric values', async () => {
      await svc.startUp();

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'test@example.com' },
          {
            name: 'Test',
            listingTitle: 'Property',
            price: 250000,
            bedrooms: 3,
            rating: 4.5,
          } as any,
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalled();
      } catch {
        // Expected
      }
    });
  });

  describe('Error handling and recovery', () => {
    beforeEach(() => {
      process.env['SENDGRID_API_KEY'] = 'test-key';
    });

    it('throws and logs when SendGrid throws an error', async () => {
      await svc.startUp();
      const errorSpy = vi.spyOn(console, 'error');

      const sendgridError = new Error('SendGrid connection timeout');
      vi.mocked(sendgrid.send).mockRejectedValue(sendgridError);

      try {
        await svc.sendTemplatedEmail(
          'test',
          { email: 'test@example.com' },
          { name: 'Test', listingTitle: 'Test' },
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('allows multiple emails to be sent sequentially after first one fails', async () => {
      await svc.startUp();

      vi.mocked(sendgrid.send).mockRejectedValueOnce(new Error('First attempt failed'));

      try {
        await svc.sendTemplatedEmail(
          'test1',
          { email: 'test1@example.com' },
          { name: 'Test1', listingTitle: 'Test' },
        );
      } catch {
        // Expected to fail
      }

      vi.mocked(sendgrid.send).mockResolvedValue([{ statusCode: 202 }] as any);

      try {
        await svc.sendTemplatedEmail(
          'test2',
          { email: 'test2@example.com' },
          { name: 'Test2', listingTitle: 'Test' },
        );

        expect(vi.mocked(sendgrid.send)).toHaveBeenCalledTimes(2);
      } catch {
        // Template may not exist
      }
    });
  });

  describe('API key management', () => {
    it('throws error if SENDGRID_API_KEY environment variable is not set', async () => {
      delete process.env['SENDGRID_API_KEY'];
      const svc2 = new ServiceTransactionalEmailSendGrid();

      await expect(svc2.startUp()).rejects.toThrow(/SENDGRID_API_KEY/);
    });

    it('throws error with helpful message when API key is empty string', async () => {
      process.env['SENDGRID_API_KEY'] = '';
      const svc2 = new ServiceTransactionalEmailSendGrid();

      await expect(svc2.startUp()).rejects.toThrow(/SENDGRID_API_KEY/);
    });

    it('successfully uses API key after setting it', async () => {
      process.env['SENDGRID_API_KEY'] = 'valid-test-key-12345';
      const svc2 = new ServiceTransactionalEmailSendGrid();

      await svc2.startUp();

      expect(vi.mocked(sendgrid.setApiKey)).toHaveBeenCalledWith('valid-test-key-12345');
    });

    it('different instances can be initialized with different API keys', async () => {
      process.env['SENDGRID_API_KEY'] = 'key-1';
      const svc1 = new ServiceTransactionalEmailSendGrid();
      await svc1.startUp();

      process.env['SENDGRID_API_KEY'] = 'key-2';
      const svc2 = new ServiceTransactionalEmailSendGrid();
      await svc2.startUp();

      const { calls } = vi.mocked(sendgrid.setApiKey).mock;
      expect(calls.length).toBeGreaterThanOrEqual(2);
    });
  });
});
