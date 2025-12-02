import type { ServiceBase } from '@cellix/api-services-spec';
import type {
	PaymentService,
	CustomerProfile,
	PaymentTokenInfo,
	PaymentTransactionResponse,
	CustomerPaymentResponse,
	CustomerPaymentInstrumentResponse,
	PaymentInstrumentInfo,
	TransactionReceipt,
	CustomerPaymentInstrumentsResponse,
	PlanCreation,
	PlanCreationResponse,
	PlanResponse,
	Subscription,
	SubscriptionResponse,
	SubscriptionsListResponse,
	SuspendSubscriptionResponse,
	PlansListResponse,
} from '@cellix/payment-service';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

export class PaymentServiceMock
	implements ServiceBase<PaymentServiceMock>, PaymentService
{
	private http: AxiosInstance | undefined;
	private readonly mockBaseUrl: string;

	constructor(mockBaseUrl?: string) {
		this.mockBaseUrl =
			mockBaseUrl ?? process.env['PAYMENT_MOCK_URL'] ?? 'http://localhost:3001';
	}

	public startUp(): Promise<
		Exclude<PaymentServiceMock, ServiceBase<PaymentServiceMock>>
	> {
		if (this.http) {
			throw new Error('Mock PaymentService is already started');
		}

		this.http = axios.create({ baseURL: this.mockBaseUrl });
		console.log(`PaymentServiceMock started in MOCK mode: ${this.mockBaseUrl}`);
		return Promise.resolve(this as Exclude<
			PaymentServiceMock,
			ServiceBase<PaymentServiceMock>
		>);
	}

	public shutDown(): Promise<void> {
		if (!this.http) {
			throw new Error('PaymentServiceMock is not started - shutdown cannot proceed');
		}
		this.http = undefined;
		console.log('PaymentServiceMock stopped');
		return Promise.resolve();
	}

	//   ========== This code will get deleted ===========
	public get service(): AxiosInstance {
		if (!this.http) {
			throw new Error(
				'Mock ServiceCybersource is not started - cannot access service',
			);
		}
		return this.http;
	}

	//   public async createPayment(_req: unknown): Promise<unknown> {
	//     throw new Error(
	//       "ServiceCybersource.createPayment is deprecated. Use processPayment(clientReferenceCode, paymentInstrumentId, amount) instead."
	//     );
	//   }

	//   public async refundPayment(_req: unknown): Promise<unknown> {
	//     throw new Error(
	//       "ServiceCybersource.refundPayment is deprecated. Use processRefund(transactionId, amount, referenceId) instead."
	//     );
	//   }
	//   ========== This code will get deleted ===========

	async generatePublicKey(): Promise<string> {
		try {
			const { data } = await this.service.get('/pts/v2/public-key');
			return data.publicKey;
		} catch (error) {
			console.error('Error generating public key:', error);
			throw new Error('Failed to generate public key');
		}
	}

	async createCustomerProfile(
		customerProfile: CustomerProfile,
		paymentTokenInfo: PaymentTokenInfo,
	): Promise<PaymentTransactionResponse> {
		try {
			const { data } = await this.service.post('/pts/v2/customers', {
				customerProfile,
				paymentTokenInfo,
			});
			return data;
		} catch (error) {
			console.error('Error creating customer profile:', error);
			throw new Error('Failed to create customer profile');
		}
	}

	async getCustomerProfile(
		customerId: string,
	): Promise<CustomerPaymentResponse> {
		try {
			const { data } = await this.service.get(
				`/pts/v2/customers/${customerId}`,
			);
			return data;
		} catch (error) {
			console.error('Error getting customer profile:', error);
			throw new Error('Failed to get customer profile');
		}
	}

	async addCustomerPaymentInstrument(
		customerProfile: CustomerProfile,
		paymentTokenInfo: PaymentTokenInfo,
	): Promise<PaymentTransactionResponse> {
		try {
			const { data } = await this.service.post(
				`/tms/v2/customers/${customerProfile.customerId}/payment-instruments`,
				{ paymentTokenInfo },
			);
			return data;
		} catch (error) {
			console.error('Error adding customer payment instrument:', error);
			throw new Error('Failed to add customer payment instrument');
		}
	}

	async getCustomerPaymentInstrument(
		customerId: string,
		paymentInstrumentId: string,
	): Promise<CustomerPaymentInstrumentResponse> {
		try {
			const { data } = await this.service.get(
				`/tms/v2/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
			);
			return data;
		} catch (error) {
			console.error('Error getting customer payment instrument:', error);
			throw new Error('Failed to get customer payment instrument');
		}
	}

	async getCustomerPaymentInstruments(
		customerId: string,
		offset: number = 0,
		limit: number = 10,
	): Promise<CustomerPaymentInstrumentsResponse> {
		try {
			const { data } = await this.service.get(
				`/tms/v2/customers/${customerId}/payment-instruments?offset=${offset}&limit=${limit}`,
			);
			return data;
		} catch (error) {
			console.error('Error getting customer payment instruments:', error);
			throw new Error('Failed to get customer payment instruments');
		}
	}

	async deleteCustomerPaymentInstrument(
		customerId: string,
		paymentInstrumentId: string,
	): Promise<boolean> {
		try {
			const { data } = await this.service.delete(
				`/tms/v2/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
			);
			return data;
		} catch (error) {
			console.error('Error deleting customer payment instrument:', error);
			throw new Error('Failed to delete customer payment instrument');
		}
	}

	//   async setDefaultCustomerPaymentInstrument(
	//     customerId: string,
	//     paymentInstrumentId: string
	//   ): Promise<CustomerPaymentResponse> {
	//     console.log(
	//       "Mock setDefaultCustomerPaymentInstrument called with:",
	//       customerId,
	//       paymentInstrumentId
	//     );
	//     return {
	//       _links: {
	//         self: {
	//           href: `https://api.mockcybersource.com/customers/${customerId}`,
	//         },
	//         paymentInstruments: {
	//           href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
	//         },
	//       },
	//       id: customerId,
	//       clientReferenceInformation: {
	//         code: `SET_DEFAULT_${paymentInstrumentId}`,
	//       },
	//       defaultPaymentInstrument: {
	//         id: paymentInstrumentId,
	//       },
	//       metadata: {
	//         creator: "mock-service",
	//       },
	//       _embedded: {
	//         defaultPaymentInstrument: {
	//           _links: {
	//             self: {
	//               href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
	//             },
	//             customer: {
	//               href: `https://api.mockcybersource.com/customers/${customerId}`,
	//             },
	//           },
	//           id: paymentInstrumentId,
	//           object: "paymentInstrument",
	//           default: true,
	//           state: "ACTIVE",
	//           card: {
	//             expirationMonth: "12",
	//             expirationYear: "2026",
	//             type: "001", // Visa
	//           },
	//           buyerInformation: {
	//             currency: "USD",
	//           },
	//           billTo: {
	//             firstName: "John",
	//             lastName: "Doe",
	//             address1: "123 Mock Street",
	//             address2: "Unit 4",
	//             locality: "Faketown",
	//             administrativeArea: "CA",
	//             postalCode: "99999",
	//             country: "US",
	//             email: "john.doe@example.com",
	//             phoneNumber: "555-123-4567",
	//           },
	//           processingInformation: {
	//             billPaymentProgramEnabled: false,
	//           },
	//           instrumentIdentifier: {
	//             id: "MOCK_IDENTIFIER_DEFAULT",
	//           },
	//           metadata: {
	//             creator: "mock-service",
	//           },
	//           _embedded: {
	//             instrumentIdentifier: {
	//               _links: {
	//                 self: {
	//                   href: `https://api.mockcybersource.com/instrumentidentifiers/MOCK_IDENTIFIER_DEFAULT`,
	//                 },
	//                 paymentInstruments: {
	//                   href: `https://api.mockcybersource.com/instrumentidentifiers/MOCK_IDENTIFIER_DEFAULT/payment-instruments`,
	//                 },
	//               },
	//               id: "MOCK_IDENTIFIER_DEFAULT",
	//               object: "instrumentIdentifier",
	//               state: "ACTIVE",
	//               card: {
	//                 number: "411111XXXXXX1111",
	//               },
	//               processingInformation: {
	//                 authorizationOptions: {
	//                   initiator: {
	//                     merchantInitiatedTransaction: {
	//                       previousTransactionId: "TXN123456789",
	//                     },
	//                   },
	//                 },
	//               },
	//               metadata: {
	//                 creator: "mock-service",
	//               },
	//             },
	//           },
	//         },
	//       },
	//     };
	//   }

	async updateCustomerPaymentInstrument(
		customerProfile: CustomerProfile,
		paymentInstrumentInfo: PaymentInstrumentInfo,
	): Promise<CustomerPaymentInstrumentResponse> {
		try {
			const { data } = await this.service.patch(
				`/tms/v2/customers/${customerProfile.customerId}/payment-instruments/${paymentInstrumentInfo.id}`,
				{ customerProfile, paymentInstrumentInfo },
			);
			return data;
		} catch (error) {
			console.error('Error updating customer payment instrument:', error);
			throw new Error('Failed to update customer payment instrument');
		}
	}

	async processPayment(
		clientReferenceCode: string,
		paymentInstrumentId: string,
		amount: number,
	): Promise<TransactionReceipt> {
		try {
			const { data } = await this.service.post('/pts/v2/payments', {
				clientReferenceCode,
				paymentInstrumentId,
				amount,
			});
			return data;
		} catch (error) {
			console.error('Error processing payment:', error);
			throw error;
		}
	}

	async processRefund(
		transactionId: string,
		amount: number,
		referenceId: string,
	): Promise<TransactionReceipt> {
		try {
			const { data } = await this.service.post('/pts/v2/refunds', {
				transactionId,
				amount,
				referenceId,
			});
			return data;
		} catch (error) {
			console.error('Error processing refund:', error);
			throw error;
		}
	}

	//   async voidPayment(
	//     clientReferenceCode: string,
	//     transactionId: string
	//   ): Promise<PaymentTransactionResponse> {
	//     console.log(
	//       "Mock voidPayment called with:",
	//       clientReferenceCode,
	//       transactionId
	//     );
	//     // Mock rule: transactionId must start with TXN_
	//     if (!transactionId.startsWith("TXN_")) {
	//       return {
	//         _links: {
	//           self: {
	//             href: `https://api.mockcybersource.com/payments/${transactionId}`,
	//             method: "GET",
	//           },
	//           capture: {
	//             href: `https://api.mockcybersource.com/payments/${transactionId}`,
	//             method: "POST",
	//           },
	//         },
	//         id: transactionId,
	//         submitTimeUtc: new Date().toISOString(),
	//         status: "ERROR",
	//         reason: "INVALID_TRANSACTION",
	//         reconciliationId: `RECON_VOID_FAIL_${Date.now()}`,
	//         clientReferenceInformation: { code: clientReferenceCode },
	//         processorInformation: {
	//           approvalCode: "",
	//           responseCode: "404",
	//           avs: { code: "", codeRaw: "" },
	//           cardVerification: { resultCode: "" },
	//           paymentAccountReferenceNumber: "",
	//           transactionId,
	//           networkTransactionId: "",
	//         },
	//         paymentAccountInformation: { card: { type: "001" } },
	//         paymentInformation: {
	//           card: { type: "001" },
	//           tokenizedCard: { type: "TOKEN_123456" },
	//           paymentInstrument: { id: "MOCK_INSTRUMENT_1" },
	//           instrumentIdentifier: { id: "INSTRUMENT_1", state: "ACTIVE" },
	//           accountFeatures: { balanceAmount: "1000" },
	//           customer: { id: "MOCK_CUSTOMER_1" },
	//         },
	//         orderInformation: {
	//           amountDetails: {
	//             totalAmount: "100",
	//             authorizedAmount: "100",
	//             currency: "USD",
	//           },
	//         },
	//         pointOfSaleInformation: { terminalId: "POS_1" },
	//         tokenInformation: {
	//           instrumentidentifierNew: false,
	//           paymentInstrument: { id: "MOCK_INSTRUMENT_1" },
	//           instrumentIdentifier: { id: "INSTRUMENT_1", state: "ACTIVE" },
	//           customer: { id: "MOCK_CUSTOMER_1" },
	//         },
	//         voidAmountDetails: { voidAmount: "100", currency: "USD" },
	//       };
	//     }

	//     // Otherwise, return a successful void response
	//     return {
	//       _links: {
	//         self: {
	//           href: `https://api.mockcybersource.com/payments/${transactionId}`,
	//           method: "GET",
	//         },
	//         capture: {
	//           href: `https://api.mockcybersource.com/payments/${transactionId}`,
	//           method: "POST",
	//         },
	//       },
	//       id: transactionId,
	//       submitTimeUtc: new Date().toISOString(),
	//       status: "VOIDED",
	//       reason: "VOIDED_BY_MOCK",
	//       reconciliationId: `RECON_VOID_${Date.now()}`,
	//       clientReferenceInformation: { code: clientReferenceCode },
	//       processorInformation: {
	//         approvalCode: "APPROVED",
	//         responseCode: "200",
	//         avs: { code: "Y", codeRaw: "Y" },
	//         cardVerification: { resultCode: "M" },
	//         paymentAccountReferenceNumber: "REF_123456",
	//         transactionId,
	//         networkTransactionId: `NET_${Date.now()}`,
	//       },
	//       paymentAccountInformation: { card: { type: "001" } },
	//       paymentInformation: {
	//         card: { type: "001" },
	//         tokenizedCard: { type: "TOKEN_123456" },
	//         paymentInstrument: { id: "MOCK_INSTRUMENT_1" },
	//         instrumentIdentifier: { id: "INSTRUMENT_1", state: "ACTIVE" },
	//         accountFeatures: { balanceAmount: "1000" },
	//         customer: { id: "MOCK_CUSTOMER_1" },
	//       },
	//       orderInformation: {
	//         amountDetails: {
	//           totalAmount: "100",
	//           authorizedAmount: "100",
	//           currency: "USD",
	//         },
	//       },
	//       pointOfSaleInformation: { terminalId: "POS_1" },
	//       tokenInformation: {
	//         instrumentidentifierNew: false,
	//         paymentInstrument: { id: "MOCK_INSTRUMENT_1" },
	//         instrumentIdentifier: { id: "INSTRUMENT_1", state: "ACTIVE" },
	//         customer: { id: "MOCK_CUSTOMER_1" },
	//       },
	//       voidAmountDetails: { voidAmount: "100", currency: "USD" },
	//     };
	//   }

	getSuccessOrLatestFailedTransactionsByReferenceId(
		referenceId: string,
	): Promise<TransactionReceipt> {
		console.log(
			'Mock getSuccessOrLatestFailedTransactionsByReferenceId called with:',
			referenceId,
		);
		const isSuccess = true;
		const now = new Date();

		if (isSuccess) {
			return Promise.resolve({
				isSuccess: true,
				vendor: 'MOCK_CYBERSOURCE',
				completedAt: now,
				amount: 100,
				transactionId: `TXN_${referenceId}_${Date.now()}`,
				reconciliationId: `RECON_${referenceId}_${Date.now()}`,
			});
		} else {
			return Promise.resolve({
				isSuccess: false,
				vendor: 'MOCK_CYBERSOURCE',
				errorOccurredAt: now,
				errorCode: 'MOCK_FAILED',
				errorMessage: `Transaction with referenceId ${referenceId} failed.`,
				transactionId: `TXN_${referenceId}_${Date.now()}`,
				reconciliationId: `RECON_${referenceId}_${Date.now()}`,
			});
		}
	}

	async createPlan(plan: PlanCreation): Promise<PlanCreationResponse> {
		try {
			const { data } = await this.service.post('/rbs/v1/plans', plan);
			return data;
		} catch (error) {
			console.error('Error creating plan:', error);
			throw error;
		}
	}

	async listOfPlans(): Promise<PlansListResponse> {
		try {
			const { data } = await this.service.get('/rbs/v1/plans');
			return data;
		} catch (error) {
			console.error('Error fetching list of plans:', error);
			throw error;
		}
	}

	async getPlan(planId: string): Promise<PlanResponse> {
		try {
			const { data } = await this.service.get(`/rbs/v1/plans/${planId}`);
			return data;
		} catch (error) {
			console.error('Error fetching plan:', error);
			throw error;
		}
	}

	async createSubscription(
		subscription: Subscription,
	): Promise<SubscriptionResponse> {
		try {
			const { data } = await this.service.post(
				'/rbs/v1/subscriptions',
				subscription,
			);
			return data;
		} catch (error) {
			console.error('Error creating subscription:', error);
			throw error;
		}
	}

	async updatePlanForSubscription(
		subscriptionId: string,
		planId: string,
	): Promise<SubscriptionResponse> {
		try {
			const { data } = await this.service.patch(
				`/rbs/v1/subscriptions/${subscriptionId}`,
				{ planId },
			);
			return data;
		} catch (error) {
			console.error('Error updating plan for subscription:', error);
			throw error;
		}
	}

	async listOfSubscriptions(): Promise<SubscriptionsListResponse> {
		try {
			const { data } = await this.service.get('/rbs/v1/subscriptions');
			return data;
		} catch (error) {
			console.error('Error fetching list of subscriptions:', error);
			throw error;
		}
	}

	async suspendSubscription(
		subscriptionId: string,
	): Promise<SuspendSubscriptionResponse> {
		try {
			const { data } = await this.service.post(
				`/rbs/v1/subscriptions/${subscriptionId}/suspend`,
			);
			return data;
		} catch (error) {
			console.error('Error suspending subscription:', error);
			throw error;
		}
	}
}
