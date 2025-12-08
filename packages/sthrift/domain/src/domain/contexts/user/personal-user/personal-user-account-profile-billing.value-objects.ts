import { VOString } from '@lucaspaganini/value-objects';

/**
 * Payment status enumeration
 */
export const PaymentStateEnum = {
	Pending: 'PENDING',
	Succeeded: 'SUCCEEDED',
	Failed: 'FAILED',
	Refunded: 'REFUNDED',
} as const;

export class PaymentState extends VOString({
	trim: true,
	minLength: 6,
	maxLength: 9,
}) {
	static Pending = new PaymentState(PaymentStateEnum.Pending);
	static Succeeded = new PaymentState(PaymentStateEnum.Succeeded);
	static Failed = new PaymentState(PaymentStateEnum.Failed);
	static Refunded = new PaymentState(PaymentStateEnum.Refunded);
}
