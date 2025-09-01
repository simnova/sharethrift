import type { ServiceBase } from '@cellix/api-services-spec';
import axios, { AxiosInstance } from 'axios';

export interface PaymentRequest {
  amount: number;
  currency: string;
  source: string;
  description?: string;
  [key: string]: any;
}

export interface PaymentResponse {
  id: string;
  status: string;
  [key: string]: any;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  [key: string]: any;
}

export interface RefundResponse {
  id: string;
  status: string;
  [key: string]: any;
}

export class ServiceCybersource implements ServiceBase<ServiceCybersource> {

  private client: AxiosInstance | undefined;
  private baseUrl: string;

  constructor(baseUrl: string = process.env['PAYMENT_API_URL'] || 'http://localhost:4005') {
    this.baseUrl = baseUrl;
  }

  public async startUp(): Promise<Exclude<ServiceCybersource, ServiceBase<ServiceCybersource>>> {
    if (this.client) throw new Error('ServiceCybersource is already started');
    this.client = axios.create({ baseURL: this.baseUrl });
    return this as Exclude<ServiceCybersource, ServiceBase<ServiceCybersource>>;
  }

  public async shutdown(): Promise<void> {
    this.client = undefined;
  }

  public get service(): AxiosInstance {
    if (!this.client) throw new Error('ServiceCybersource is not started - cannot access service');
    return this.client;
  }

  public async createPayment(req: PaymentRequest): Promise<PaymentResponse> {
    const { data } = await this.service.post('/pts/v2/payments', req);
    return data;
  }

  public async refundPayment(req: RefundRequest): Promise<RefundResponse> {
    const { data } = await this.service.post('/pts/v2/refunds', req);
    return data;
  }
}
