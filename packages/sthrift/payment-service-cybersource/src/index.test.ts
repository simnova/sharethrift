import { describe, it, expect, beforeEach } from 'vitest';
import { PaymentServiceCybersource } from './index.ts';

describe('PaymentServiceCybersource', () => {
  let service: PaymentServiceCybersource;

  beforeEach(() => {
    service = new PaymentServiceCybersource(
      'app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin'
    );
  });

  it('should instantiate with provided config', () => {
    expect(service).toBeInstanceOf(PaymentServiceCybersource);
  });

  it('should throw if required config is missing', () => {
    expect(() => new PaymentServiceCybersource()).toThrow();
  });

  it('should have a configObject with correct properties', () => {
    expect(service['configObject']).toMatchObject({
      authenticationType: 'http_signature',
      runEnvironment: 'env',
      merchantID: 'merchant',
      merchantKeyId: 'keyId',
      merchantsecretKey: 'keySecret',
      logConfiguration: { enableLog: 'true' },
    });
  });

  // Add more tests for public methods as needed, e.g.:
  // it('should call authorizePayment and return expected result', async () => {
  //   // Mock dependencies and test method
  // });
});
