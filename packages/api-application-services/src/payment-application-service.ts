import type { ServiceCybersource, PaymentRequest as CybersourcePaymentRequest } from '@sthrift/service-cybersource';

export type PaymentRequest = CybersourcePaymentRequest;
export type PaymentResponse = {
    transactionId: string;
    status: string;
    success: boolean;
    message: string;
};

export interface PaymentApplicationService {
    processPayment(request: PaymentRequest): Promise<PaymentResponse>;
}

export class DefaultPaymentApplicationService implements PaymentApplicationService {
    private readonly paymentService: ServiceCybersource;

    constructor(paymentService: ServiceCybersource) {
        this.paymentService = paymentService;
    }

    async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            const paymentResponse = await this.paymentService.createPayment(request);

            return {
                transactionId: paymentResponse.id,
                status: paymentResponse.status,
                success: paymentResponse.status === 'SUCCEEDED',
                message: 'Payment processed successfully'
            };
        } catch (error) {
            console.error('Payment processing error:', error);
            throw error;
        }
    }
}
