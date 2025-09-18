import type { ServiceBase } from '@cellix/api-services-spec';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

export interface PaymentRequest {
	clientReferenceInformation?: {
		userId: string;
		[key: string]: any;
	};
	orderInformation: {
		amountDetails: {
			totalAmount: number | undefined;
			currency: string | undefined;
		};
		billTo: {
			firstName: string;
			lastName: string;
			address1: string;
			address2: string | undefined;
			city: string;
			state: string;
			postalCode: string;
			country: string;
			phoneNumber: string | undefined;
			email: string | undefined;
		};
	};
	paymentInformation: {
		card: {
			number: string;
			expirationMonth: string;
			expirationYear: string;
			securityCode: string;
		};
	};
}

export interface PaymentResponse {
	id: string;
	status: string;
	errorInformation?: {
		reason?: string;
		message?: string;
	};
	orderInformation?: {
		amountDetails?: {
			totalAmount?: string;
			currency?: string;
		};
	};
}

export interface RefundRequest {
	paymentId: string;
	clientReferenceInformation?: {
		userId: string;
		[key: string]: any;
	};
	orderInformation: {
		amountDetails: {
			totalAmount: number;
			currency: string;
		};
	};
}

export interface RefundResponse {
	id: string;
	status: string;
	errorInformation?: {
		reason?: string;
		message?: string;
	};
	orderInformation?: {
		amountDetails?: {
			totalAmount?: string;
			currency?: string;
		};
	};
}

export class ServiceCybersource implements ServiceBase<ServiceCybersource> {
	private client: AxiosInstance | undefined;
	private baseUrl: string;

	constructor(baseUrl: string = process.env['PAYMENT_API_URL']!) {
		this.baseUrl = baseUrl;
	}

	public async startUp(): Promise<
		Exclude<ServiceCybersource, ServiceBase<ServiceCybersource>>
	> {
		if (this.client) throw new Error('ServiceCybersource is already started');
		this.client = axios.create({ baseURL: this.baseUrl });
		return this as Exclude<ServiceCybersource, ServiceBase<ServiceCybersource>>;
	}

	public async shutDown(): Promise<void> {
		this.client = undefined;
	}

	public get service(): AxiosInstance {
		if (!this.client)
			throw new Error(
				'ServiceCybersource is not started - cannot access service',
			);
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
