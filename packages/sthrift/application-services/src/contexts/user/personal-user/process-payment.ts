import type { DataSources } from '@sthrift/persistence';
import type {ProcessPaymentResponse} from '@cellix/payment-service';

export interface ProcessPaymentCommand {
	userId: string;
	paymentAmount: number;
	currency: string;
	paymentInstrument: {
		billingFirstName: string;
		billingLastName: string;
		billingAddressLine1: string;
		billingAddressLine2?: string;
		billingCity: string;
		billingState: string;
		billingPostalCode: string;
		billingCountry: string;
		billingPhone?: string;
		billingEmail: string;
		paymentToken: string;
	};
}

export const processPayment = (dataSources: DataSources) => {
	return async (
		command: ProcessPaymentCommand,
	): Promise<ProcessPaymentResponse> => {
		return await dataSources.paymentDataSource.processPayment(command);
	};
};
