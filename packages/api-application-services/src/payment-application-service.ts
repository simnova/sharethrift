import type { ServiceCybersource } from '@sthrift/service-cybersource';

export interface PaymentApplicationService {
    processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse>;
    refundPayment(request: RefundPaymentRequest): Promise<RefundPaymentResponse>;
}

export interface ProcessPaymentRequest {
    userId: string;
    amount: number;
    source: string;
    description?: string;
}

export interface ProcessPaymentResponse {
    transactionId: string;
    status: string;
    success: boolean;
    message?: string;
}

export interface RefundPaymentRequest {
    userId: string;
    transactionId: string;
    amount: number;
}

export interface RefundPaymentResponse {
    transactionId: string;
    status: string;
    success: boolean;
    message?: string;
}

export class DefaultPaymentApplicationService implements PaymentApplicationService {
    private readonly paymentService: ServiceCybersource;

    constructor(paymentService: ServiceCybersource) {
        this.paymentService = paymentService;
    }

    async processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
        try {
            const paymentResponse = await this.paymentService.createPayment({
                amount: request.amount,
                currency: 'USD',
                source: request.source,
                description: request.description || 'Payment for account',
                metadata: {
                    userId: request.userId
                }
            });

            return {
                transactionId: paymentResponse.id,
                status: paymentResponse.status,
                success: paymentResponse.status === 'SUCCEEDED',
                message: 'Payment processed successfully'
            };
        } catch (error) {
            console.error('Payment processing error:', error);
            return {
                transactionId: '',
                status: 'FAILED',
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    async refundPayment(request: RefundPaymentRequest): Promise<RefundPaymentResponse> {
        try {
            const refundResponse = await this.paymentService.refundPayment({
                paymentId: request.transactionId,
                amount: request.amount
            });

            return {
                transactionId: refundResponse.id,
                status: refundResponse.status,
                success: refundResponse.status === 'SUCCEEDED',
                message: 'Refund processed successfully'
            };
        } catch (error) {
            console.error('Refund processing error:', error);
            return {
                transactionId: '',
                status: 'FAILED',
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }


}
