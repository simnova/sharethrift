import type { ServiceCybersource } from '@sthrift/service-cybersource';

export interface PaymentApplicationService {
    processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse>;
    refundPayment(request: RefundPaymentRequest): Promise<RefundPaymentResponse>;
}

export interface ProcessPaymentRequest {
    userId: string;
    orderInformation: {
        amountDetails: {
            totalAmount: number;
            currency: string;
        };
        billTo: {
            firstName: string;
            lastName: string;
            address1: string;
            address2?: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            phoneNumber?: string;
            email?: string;
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

export interface ProcessPaymentResponse {
    id?: string;
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

export interface RefundPaymentRequest {
    userId: string;
    transactionId: string;
    amount?: number;
    orderInformation: {
        amountDetails: {
            totalAmount: number;
            currency: string;
        };
    };
}

export interface RefundPaymentResponse {
    id?: string;
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

export class DefaultPaymentApplicationService implements PaymentApplicationService {
    private readonly paymentService: ServiceCybersource;

    constructor(paymentService: ServiceCybersource) {
        this.paymentService = paymentService;
    }

    async processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
        try {
            const paymentResponse = await this.paymentService.createPayment({
                clientReferenceInformation: {
                    userId: request.userId
                },
                orderInformation: request.orderInformation,
                paymentInformation: request.paymentInformation
            });

            return {
                id: paymentResponse.id,
                status: paymentResponse.status,
                orderInformation: {
                    amountDetails: {
                        totalAmount: request.orderInformation.amountDetails.totalAmount.toString(),
                        currency: request.orderInformation.amountDetails.currency
                    }
                }
            };
        } catch (error) {
            console.error('Payment processing error:', error);
            return {
                status: 'FAILED',
                errorInformation: {
                    reason: 'PROCESSING_ERROR',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }
            };
        }
    }

    async refundPayment(request: RefundPaymentRequest): Promise<RefundPaymentResponse> {
        try {
            const refundResponse = await this.paymentService.refundPayment({
                paymentId: request.transactionId,
                orderInformation: request.orderInformation,
                clientReferenceInformation: {
                    userId: request.userId
                }
            });

            return {
                id: refundResponse.id,
                status: refundResponse.status,
                orderInformation: {
                    amountDetails: {
                        totalAmount: request.orderInformation.amountDetails.totalAmount.toString(),
                        currency: request.orderInformation.amountDetails.currency
                    }
                }
            };
        } catch (error) {
            console.error('Refund processing error:', error);
            return {
                status: 'FAILED',
                errorInformation: {
                    reason: 'PROCESSING_ERROR',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }
            };
        }
    }


}
