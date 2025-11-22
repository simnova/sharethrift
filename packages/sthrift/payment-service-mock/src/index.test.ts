import { describe, it, expect, beforeEach } from 'vitest';
import { PaymentServiceMock } from './index.ts';

describe('PaymentServiceMock', () => {
  let service: PaymentServiceMock;

  beforeEach(() => {
    service = new PaymentServiceMock('http://localhost:3001');
  });

  it('should instantiate with default or provided baseUrl', () => {
    expect(service).toBeInstanceOf(PaymentServiceMock);
    expect(service['mockBaseUrl']).toBe('http://localhost:3001');
  });

  it('should start up and return itself', async () => {
    const started = await service.startUp();
    expect(started).toBe(service);
    expect(service['http']).toBeDefined();
  });

  it('should throw if started twice', async () => {
    await service.startUp();
    await expect(() => service.startUp()).rejects.toThrow('already started');
  });

  it('should shut down after start', async () => {
    await service.startUp();
    await service.shutDown();
    expect(service['http']).toBeUndefined();
  });

  it('should throw if shut down before start', async () => {
    await expect(service.shutDown()).rejects.toThrow('not started');
  });

  it('should throw if service getter is called before start', () => {
    expect(() => service.service).toThrow('not started');
  });

  it('should return http instance after start', async () => {
    await service.startUp();
    expect(service.service).toBeDefined();
  });
});
