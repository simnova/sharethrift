import express from 'express';
import type { Request, Response } from 'express';
import type {
	CustomerProfile,
	PaymentTokenInfo,
	PaymentTransactionResponse,
	CustomerPaymentResponse,
	CustomerPaymentInstrumentResponse,
	CustomerPaymentInstrumentsResponse,
	TransactionReceipt,
	PlanCreation,
	PlanCreationResponse,
	PlansListResponse,
	PlanResponse,
	Subscription,
	SubscriptionResponse,
	SuspendSubscriptionResponse,
	SubscriptionsListResponse,
	PaymentInstrumentInfo,
} from './payment-interface.ts';

const app = express();
app.disable('x-powered-by');
const DEFAULT_PORT = Number(process.env['PORT'] ?? 3001);

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
	res.send('Payment Mock Server is running!');
});

// generatePublicKey endpoint
app.get('/pts/v2/public-key', (_req: Request, res: Response) => {
	return res.status(200).json({
		publicKey: 'MOCK_PUBLIC_KEY_1234567890',
	});
});

// createCustomerProfile endpoint
app.post(
	'/pts/v2/customers',
	(
		req: Request<
			{},
			{},
			{ customerProfile: CustomerProfile; paymentTokenInfo: PaymentTokenInfo }
		>,
		res: Response<PaymentTransactionResponse>,
	) => {
		const { customerProfile, paymentTokenInfo } = req.body;

		console.log(
			'Mock createCustomerProfile called with:',
			customerProfile,
			paymentTokenInfo,
		);

		const mockResponse: PaymentTransactionResponse = {
			_links: {
				self: {
					href: 'https://api.mockcybersource.com/customers/MOCK_CUSTOMER_ID_123456',
					method: 'GET',
				},
				capture: {
					href: 'https://api.mockcybersource.com/customers/MOCK_CUSTOMER_ID_123456/capture',
					method: 'POST',
				},
			},
			id: 'MOCK_CUSTOMER_ID_123456',
			submitTimeUtc: new Date().toISOString(),
			status: 'AUTHORIZED',
			reason: 'NONE',
			reconciliationId: 'MOCK_RECONCILIATION_7890',
			clientReferenceInformation: { code: 'REF-MOCK-123' },
			processorInformation: {
				approvalCode: 'APPROVED123',
				responseCode: '100',
				avs: { code: 'Y', codeRaw: 'Y' },
				cardVerification: { resultCode: 'M' },
				paymentAccountReferenceNumber: 'PAR123456789',
				transactionId: 'TXN-MOCK-456789',
				networkTransactionId: 'NTXN-MOCK-987654',
			},
			paymentAccountInformation: {
				card: { type: '001' },
			},
			paymentInformation: {
				card: { type: '001' },
				tokenizedCard: { type: '001' },
				paymentInstrument: { id: 'MOCK_PAYINSTRUMENT_111' },
				instrumentIdentifier: { id: 'MOCK_INSTRUMENT_222', state: 'ACTIVE' },
				accountFeatures: { balanceAmount: '0.00' },
				customer: { id: 'MOCK_CUSTOMER_ID_123456' },
			},
			orderInformation: {
				amountDetails: {
					totalAmount: '0.00',
					authorizedAmount: '0.00',
					currency: 'USD',
				},
			},
			pointOfSaleInformation: { terminalId: 'MOCK_TERMINAL_01' },
			tokenInformation: {
				instrumentidentifierNew: true,
				paymentInstrument: { id: 'MOCK_PAYINSTRUMENT_111' },
				instrumentIdentifier: { id: 'MOCK_INSTRUMENT_222', state: 'ACTIVE' },
				customer: { id: 'MOCK_CUSTOMER_ID_123456' },
			},
			voidAmountDetails: {
				voidAmount: '0.00',
				currency: 'USD',
			},
		};

		return res.status(201).json(mockResponse);
	},
);

// getCustomerProfile endpoint
app.get(
	'/pts/v2/customers/:customerId',
	(
		req: Request<{ customerId: string }>,
		res: Response<CustomerPaymentResponse>,
	) => {
		const { customerId } = req.params;

		console.log('Mock getCustomerProfile called with:', customerId);

		const mockResponse: CustomerPaymentResponse = {
			_links: {
				self: {
					href: `https://api.mockcybersource.com/customers/${customerId}`,
				},
				paymentInstruments: {
					href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
				},
			},
			id: customerId,
			clientReferenceInformation: { code: 'MOCK-REF-001' },
			defaultPaymentInstrument: { id: 'MOCK_PAYMENT_INSTRUMENT_1' },
			metadata: { creator: 'mock_service' },
			_embedded: {
				defaultPaymentInstrument: {
					_links: {
						self: {
							href: `https://api.mockcybersource.com/payment-instruments/MOCK_PAYMENT_INSTRUMENT_1`,
						},
						customer: {
							href: `https://api.mockcybersource.com/customers/${customerId}`,
						},
					},
					id: 'MOCK_PAYMENT_INSTRUMENT_1',
					object: 'paymentInstrument',
					default: true,
					state: 'ACTIVE',
					card: {
						expirationMonth: '12',
						expirationYear: '2025',
						type: '001', // Visa
					},
					buyerInformation: {
						currency: 'USD',
					},
					billTo: {
						firstName: 'John',
						lastName: 'Doe',
						address1: '123 Mock Street',
						address2: 'Suite 100',
						locality: 'Mock City',
						administrativeArea: 'CA',
						postalCode: '90001',
						country: 'US',
						email: 'john.doe@example.com',
						phoneNumber: '1234567890',
					},
					processingInformation: {
						billPaymentProgramEnabled: false,
					},
					metadata: {
						creator: 'mock_service',
					},
					instrumentIdentifier: {
						id: 'MOCK_INSTRUMENT_123',
					},
					_embedded: {
						instrumentIdentifier: {
							_links: {
								self: {
									href: `https://api.mockcybersource.com/instrument-identifiers/MOCK_INSTRUMENT_123`,
								},
								paymentInstruments: {
									href: `https://api.mockcybersource.com/instrument-identifiers/MOCK_INSTRUMENT_123/payment-instruments`,
								},
							},
							id: 'MOCK_INSTRUMENT_123',
							object: 'instrumentIdentifier',
							state: 'ACTIVE',
							card: {
								number: '411111XXXXXX1111',
							},
							processingInformation: {
								authorizationOptions: {
									initiator: {
										merchantInitiatedTransaction: {
											previousTransactionId: 'TXN-MOCK-INIT-0001',
										},
									},
								},
							},
							metadata: {
								creator: 'mock_service',
							},
						},
					},
				},
			},
		};

		return res.status(200).json(mockResponse);
	},
);

// addCustomerPaymentInstrument endpoint
app.post(
	'/tms/v2/customers/:customerId/payment-instruments',
	(
		req: Request<
			{ customerId: string },
			{},
			{ customerProfile: CustomerProfile; paymentTokenInfo: PaymentTokenInfo }
		>,
		res: Response<PaymentTransactionResponse>,
	) => {
		const { customerId } = req.params;
		const { customerProfile, paymentTokenInfo } = req.body;
		console.log(
			'Mock addCustomerPaymentInstrument called with:',
			customerId,
			customerProfile,
			paymentTokenInfo,
		);

		const mockResponse: PaymentTransactionResponse = {
			_links: {
				self: {
					href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/MOCK_INSTRUMENT_456`,
					method: 'GET',
				},
				capture: {
					href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/MOCK_INSTRUMENT_456/capture`,
					method: 'POST',
				},
			},
			id: 'MOCK_INSTRUMENT_456',
			submitTimeUtc: new Date().toISOString(),
			status: 'AUTHORIZED',
			reason: 'NONE',
			reconciliationId: 'MOCK_RECONCILIATION_2222',
			clientReferenceInformation: { code: 'REF-MOCK-INSTRUMENT' },
			processorInformation: {
				approvalCode: 'APPROVED456',
				responseCode: '100',
				avs: { code: 'Y', codeRaw: 'Y' },
				cardVerification: { resultCode: 'M' },
				paymentAccountReferenceNumber: 'PAR-MOCK-456',
				transactionId: 'TXN-MOCK-2222',
				networkTransactionId: 'NTXN-MOCK-2222',
			},
			paymentAccountInformation: {
				card: { type: '002' }, // MasterCard
			},
			paymentInformation: {
				card: { type: '002' },
				tokenizedCard: { type: '002' },
				paymentInstrument: { id: 'MOCK_INSTRUMENT_456' },
				instrumentIdentifier: { id: 'MOCK_IDENTIFIER_456', state: 'ACTIVE' },
				accountFeatures: { balanceAmount: '0.00' },
				customer: { id: customerId },
			},
			orderInformation: {
				amountDetails: {
					totalAmount: '0.00',
					authorizedAmount: '0.00',
					currency: 'USD',
				},
			},
			pointOfSaleInformation: {
				terminalId: 'MOCK_TERMINAL_02',
			},
			tokenInformation: {
				instrumentidentifierNew: true,
				paymentInstrument: { id: 'MOCK_INSTRUMENT_456' },
				instrumentIdentifier: { id: 'MOCK_IDENTIFIER_456', state: 'ACTIVE' },
				customer: { id: customerId },
			},
			voidAmountDetails: {
				voidAmount: '0.00',
				currency: 'USD',
			},
		};

		return res.status(201).json(mockResponse);
	},
);

// getCustomerPaymentInstrument endpoint
app.get(
	'/tms/v2/customers/:customerId/payment-instruments/:paymentInstrumentId',
	(
		req: Request<{ customerId: string; paymentInstrumentId: string }>,
		res: Response<CustomerPaymentInstrumentResponse>,
	) => {
		try {
			const { customerId, paymentInstrumentId } = req.params;

			const mockResponse: CustomerPaymentInstrumentResponse = {
				_links: {
					self: {
						href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
					},
					customer: {
						href: `https://api.mockcybersource.com/customers/${customerId}`,
					},
				},
				id: 'PI_1111',
				object: 'paymentInstrument',
				default: true,
				state: 'ACTIVE',
				card: {
					expirationMonth: '12',
					expirationYear: '2026',
					type: '001', // Visa
				},
				buyerInformation: { currency: 'USD' },
				billTo: {
					firstName: 'John',
					lastName: 'Doe',
					address1: '123 Mock Street',
					address2: '',
					locality: 'Faketown',
					administrativeArea: 'CA',
					postalCode: '99999',
					country: 'US',
					email: 'john.doe@example.com',
					phoneNumber: '+1-555-1234',
				},
				processingInformation: { billPaymentProgramEnabled: false },
				instrumentIdentifier: { id: 'MOCK_IDENTIFIER_1111' },
				metadata: { creator: 'mock_system' },
				_embedded: {
					instrumentIdentifier: {
						_links: {
							self: {
								href: `https://api.mockcybersource.com/instrument-identifiers/MOCK_IDENTIFIER_1111`,
							},
							paymentInstruments: {
								href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
							},
						},
						id: 'MOCK_IDENTIFIER_1111',
						object: 'instrumentIdentifier',
						state: 'ACTIVE',
						card: { number: '411111XXXXXX1111' },
						processingInformation: {
							authorizationOptions: {
								initiator: {
									merchantInitiatedTransaction: {
										previousTransactionId: 'TXN12345',
									},
								},
							},
						},
						metadata: { creator: 'mock_system' },
					},
				},
			};
			res.status(200).json(mockResponse);
		} catch (err) {
			console.error('Mock error:', err);
			res.status(500).json({ error: 'Internal mock error' } as any);
		}
	},
);

// getCustomerPaymentInstruments endpoint
app.get(
	'/tms/v2/customers/:customerId/payment-instruments',
	(
		req: Request<{ customerId: string }>,
		res: Response<CustomerPaymentInstrumentsResponse>,
	) => {
		const { customerId } = req.params;
		const offset = Number((req.query['offset'] as string) ?? 0);
		const limit = Number((req.query['limit'] as string) ?? 10);

		console.log(
			'Mock getCustomerPaymentInstruments called with:',
			customerId,
			offset,
			limit,
		);

		const paymentInstruments = [
			{
				_links: {
					self: {
						href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/PI_1111`,
					},
					customer: {
						href: `https://api.mockcybersource.com/customers/${customerId}`,
					},
				},
				id: 'PI_1111',
				object: 'paymentInstrument',
				default: true,
				state: 'ACTIVE',
				card: {
					expirationMonth: '12',
					expirationYear: '2026',
					type: '001', // Visa
				},
				buyerInformation: { currency: 'USD' },
				billTo: {
					firstName: 'John',
					lastName: 'Doe',
					address1: '123 Mock Street',
					address2: '',
					locality: 'Faketown',
					administrativeArea: 'CA',
					postalCode: '99999',
					country: 'US',
					email: 'john.doe@example.com',
					phoneNumber: '+1-555-1234',
				},
				processingInformation: { billPaymentProgramEnabled: false },
				instrumentIdentifier: { id: 'MOCK_IDENTIFIER_1111' },
				metadata: { creator: 'mock_system' },
				_embedded: {
					instrumentIdentifier: {
						_links: {
							self: {
								href: `https://api.mockcybersource.com/instrument-identifiers/MOCK_IDENTIFIER_1111`,
							},
							paymentInstruments: {
								href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
							},
						},
						id: 'MOCK_IDENTIFIER_1111',
						object: 'instrumentIdentifier',
						state: 'ACTIVE',
						card: { number: '411111XXXXXX1111' },
						processingInformation: {
							authorizationOptions: {
								initiator: {
									merchantInitiatedTransaction: {
										previousTransactionId: 'TXN12345',
									},
								},
							},
						},
						metadata: { creator: 'mock_system' },
					},
				},
			},
		];

		const response = {
			_links: {
				self: {
					href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments`,
				},
				first: {
					href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments?offset=0&limit=${limit}`,
				},
				last: {
					href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments?offset=0&limit=${limit}`,
				},
			},
			offset,
			limit,
			count: paymentInstruments.length,
			total: paymentInstruments.length,
			_embedded: {
				paymentInstruments: paymentInstruments.slice(offset, offset + limit),
			},
		};

		res.status(200).json(response);
	},
);

// deleteCustomerPaymentInstrument endpoint
app.delete(
	'/tms/v2/customers/:customerId/payment-instruments/:paymentInstrumentId',
	(
		req: Request<{ customerId: string; paymentInstrumentId: string }>,
		res: Response,
	) => {
		const { customerId, paymentInstrumentId } = req.params;
		console.log(
			'Mock deleteCustomerPaymentInstrument called with:',
			customerId,
			paymentInstrumentId,
		);
		res.status(204).send();
	},
);

// updateCustomerPaymentInstrument endpoint
app.patch(
	'/tms/v2/customers/:customerId/payment-instruments/:paymentInstrumentId',
	(
		req: Request<
			{ customerId: string; paymentInstrumentId: string },
			{},
			{
				customerProfile: CustomerProfile;
				paymentInstrumentInfo: PaymentInstrumentInfo;
			}
		>,
		res: Response<CustomerPaymentInstrumentResponse>,
	) => {
		const { customerId, paymentInstrumentId } = req.params;
		const { customerProfile, paymentInstrumentInfo } = req.body;
		console.log(
			'Mock updateCustomerPaymentInstrument called with:',
			customerId,
			paymentInstrumentId,
		);

		const mockResponse: CustomerPaymentInstrumentResponse = {
			_links: {
				self: {
					href: `https://api.mockcybersource.com/customers/${customerId}/payment-instruments/${paymentInstrumentId}`,
				},
				customer: {
					href: `https://api.mockcybersource.com/customers/${customerId}`,
				},
			},
			id: paymentInstrumentId,
			object: 'paymentInstrument',
			default: paymentInstrumentInfo.id === 'DEFAULT',
			state: 'ACTIVE',
			card: {
				expirationMonth: paymentInstrumentInfo.cardExpirationMonth,
				expirationYear: paymentInstrumentInfo.cardExpirationYear,
				type: paymentInstrumentInfo.cardType, // e.g., "001" Visa
			},
			buyerInformation: {
				currency: 'USD',
			},
			billTo: {
				firstName: customerProfile.billingFirstName,
				lastName: customerProfile.billingLastName,
				address1: customerProfile.billingAddressLine1,
				address2: customerProfile.billingAddressLine2 || '',
				locality: customerProfile.billingCity,
				administrativeArea: customerProfile.billingState,
				postalCode: customerProfile.billingPostalCode,
				country: customerProfile.billingCountry,
				email: customerProfile.billingEmail,
				phoneNumber: customerProfile.billingPhone || '',
			},
			processingInformation: {
				billPaymentProgramEnabled: false,
			},
			instrumentIdentifier: {
				id: `MOCK_IDENTIFIER_${paymentInstrumentInfo.paymentInstrumentId}`,
			},
			metadata: {
				creator: 'mock-service',
			},
			_embedded: {
				instrumentIdentifier: {
					_links: {
						self: {
							href: `https://api.mockcybersource.com/instrumentidentifiers/MOCK_IDENTIFIER_${paymentInstrumentInfo.paymentInstrumentId}`,
						},
						paymentInstruments: {
							href: `https://api.mockcybersource.com/instrumentidentifiers/MOCK_IDENTIFIER_${paymentInstrumentInfo.paymentInstrumentId}/payment-instruments`,
						},
					},
					id: `MOCK_IDENTIFIER_${paymentInstrumentInfo.paymentInstrumentId}`,
					object: 'instrumentIdentifier',
					state: 'ACTIVE',
					card: {
						number: '411111XXXXXX1111',
					},
					processingInformation: {
						authorizationOptions: {
							initiator: {
								merchantInitiatedTransaction: {
									previousTransactionId: 'TXN_UPDATED_12345',
								},
							},
						},
					},
					metadata: {
						creator: 'mock-service',
					},
				},
			},
		};
		return res.status(200).json(mockResponse);
	},
);

// processPayment endpoint
app.post(
	'/pts/v2/payments',
	(
		req: Request<
			{},
			{},
			{
				clientReferenceCode: string;
				paymentInstrumentId: string;
				amount: number;
			}
		>,
		res: Response<TransactionReceipt>,
	) => {
		const { clientReferenceCode, paymentInstrumentId, amount } = req.body;
		console.log(
			'Mock processPayment called with:',
			clientReferenceCode,
			paymentInstrumentId,
			amount,
		);
		// Simple mock rule: decline if amount > 1000
		if (amount > 1000) {
			return res.status(402).json({
				isSuccess: false,
				vendor: 'MockCybersource',
				errorOccurredAt: new Date(),
				amount,
				transactionId: `TXN_FAIL_${Date.now()}`,
				reconciliationId: `RECON_FAIL_${Date.now()}`,
				errorCode: 'LIMIT_EXCEEDED',
				errorMessage: 'Mock: Transactions over 1000 are declined.',
			});
		}

		const receipt: TransactionReceipt = {
			isSuccess: true,
			vendor: 'MockCybersource',
			completedAt: new Date(),
			amount,
			transactionId: `TXN_${Date.now()}`,
			reconciliationId: `RECON_${Date.now()}`,
		};

		return res.status(201).json(receipt);
	},
);

// processRefund endpoint
app.post(
	'/pts/v2/refunds',
	(
		req: Request<
			{},
			{},
			{ transactionId: string; amount: number; referenceId: number }
		>,
		res: Response<TransactionReceipt>,
	) => {
		const { transactionId, amount, referenceId } = req.body;

		console.log(
			'Mock processRefund called with:',
			transactionId,
			amount,
			referenceId,
		);

		// Simple mock rule: decline if amount > 1000
		if (amount > 1000) {
			return res.status(402).json({
				isSuccess: false,
				vendor: 'MockCybersource',
				errorOccurredAt: new Date(),
				amount,
				transactionId: `TXN_FAIL_${Date.now()}`,
				reconciliationId: `RECON_FAIL_${Date.now()}`,
				errorCode: 'LIMIT_EXCEEDED',
				errorMessage: 'Mock: Transactions over 1000 are declined.',
			});
		}

		const receipt: TransactionReceipt = {
			isSuccess: true,
			vendor: 'MockCybersource',
			completedAt: new Date(),
			amount,
			transactionId: `TXN_${Date.now()}`,
			reconciliationId: `RECON_${Date.now()}`,
		};

		return res.status(201).json(receipt);
	},
);

// createPlan endpoint
app.post(
	'/rbs/v1/plans',
	(
		_req: Request<{}, {}, { plan: PlanCreation }>,
		res: Response<PlanCreationResponse>,
	) => {
		console.log('Mock createPlan called');

		const mockResponse: PlanCreationResponse = {
			_links: {
				self: {
					href: `/rbs/v1/plans/7577512808726664404807`,
					method: 'GET',
				},
				update: {
					href: `/rbs/v1/plans/7577512808726664404807`,
					method: 'POST',
				},
				deactivate: {
					href: `/rbs/v1/plans/7577512808726664404807/deactivate`,
					method: 'POST',
				},
			},
			id: `PLAN_${Date.now()}`,
			status: 'COMPLETED',
			submitTimeUtc: new Date().toISOString(),
			planInformation: {
				status: 'ACTIVE',
			},
		};
		return res.status(201).json(mockResponse);
	},
);

// listOfPlans endpoint
app.get('/rbs/v1/plans', (_req: Request, res: Response<PlansListResponse>) => {
	console.log('Mock listOfPlans called');

	const mockResponse: PlansListResponse = {
		_links: {
			self: {
				href: '/rbs/v1/plans?limit=2',
				method: 'GET',
			},
			next: {
				href: '/rbs/v1/plans?offset=2&limit=2',
				method: 'GET',
			},
		},
		totalCount: 29,
		plans: [
			{
				_links: {
					self: {
						href: '/rbs/v1/plans/1619212820',
						method: 'GET',
					},
					update: {
						href: '/rbs/v1/plans/1619212820',
						method: 'PATCH',
					},
					deactivate: {
						href: '/rbs/v1/plans/1619212820/deactivate',
						method: 'POST',
					},
				},
				id: '1619212820',
				planInformation: {
					code: '1619310018',
					status: 'ACTIVE',
					name: 'Test plan',
					description: 'Description',
					billingPeriod: {
						length: '1',
						unit: 'W',
					},
					billingCycles: {
						total: '4',
					},
				},
				orderInformation: {
					amountDetails: {
						currency: 'USD',
						billingAmount: '7.00',
						setupFee: '0.00',
					},
				},
			},
			{
				_links: {
					self: {
						href: '/rbs/v1/plans/6183561970436023701960',
						method: 'GET',
					},
					update: {
						href: '/rbs/v1/plans/6183561970436023701960',
						method: 'PATCH',
					},
					activate: {
						href: '/rbs/v1/plans/6183561970436023701960/activate',
						method: 'POST',
					},
				},
				id: '6183561970436023701960',
				planInformation: {
					code: '1616024773',
					status: 'DRAFT',
					name: 'Plan Test',
					description: '12123',
					billingPeriod: {
						length: '9999',
						unit: 'Y',
					},
					billingCycles: {
						total: '123',
					},
				},
				orderInformation: {
					amountDetails: {
						currency: 'USD',
						billingAmount: '1.00',
						setupFee: '0.00',
					},
				},
			},
		],
	};

	return res.status(200).json(mockResponse);
});

// getPlan endpoint
app.get(
	'/rbs/v1/plans/:planId',
	(req: Request<{ planId: string }>, res: Response<PlanResponse>) => {
		const { planId } = req.params;
		console.log('Mock getPlan called with:', planId);

		const mockResponse: PlanResponse = {
			_links: {
				self: {
					href: '/rbs/v1/plans/7577512808726664404807',
					method: 'GET',
				},
				update: {
					href: '/rbs/v1/plans/7577512808726664404807',
					method: 'PATCH',
				},
				deactivate: {
					href: '/rbs/v1/plans/7577512808726664404807/deactivate',
					method: 'POST',
				},
			},
			id: '7577512808726664404807',
			submitTimeUtc: '2025-09-13T13:09:53.410Z',
			planInformation: {
				code: 'UP1A912B2BAEGXBJ20',
				status: 'ACTIVE',
				name: 'Gold Plan',
				description: 'New Gold Plan',
				billingPeriod: { length: 1, unit: 'M' },
				billingCycles: { total: 12 },
			},
			orderInformation: {
				amountDetails: {
					currency: 'USD',
					billingAmount: '10.00',
				},
			},
		};
		return res.status(200).json(mockResponse);
	},
);

// createSubscription endpoint
app.post(
	'/rbs/v1/subscriptions',
	(
		_req: Request<{}, {}, { subscription: Subscription }>,
		res: Response<SubscriptionResponse>,
	) => {
		console.log('Mock createSubscription called');

		const mockResponse: SubscriptionResponse = {
			_links: {
				self: {
					href: '/rbs/v1/subscriptions/7577512808726664404807',
					method: 'GET',
				},
				cancel: {
					href: '/rbs/v1/subscriptions/7577512808726664404807/cancel',
					method: 'POST',
				},
				update: {
					href: '/rbs/v1/subscriptions/7577512808726664404807',
					method: 'PATCH',
				},
			},
			id: `SUBS_${Date.now()}`,
			status: 'ACTIVE',
			submitTimeUtc: new Date().toISOString(),
			subscriptionInformation: {
				status: 'ACTIVE',
			},
		};

		return res.status(201).json(mockResponse);
	},
);

// updatePlanForSubscription endpoint
app.patch(
	'/rbs/v1/subscriptions/:subscriptionId',
	(
		req: Request<{ subscriptionId: string }>,
		res: Response<SubscriptionResponse>,
	) => {
		const { subscriptionId } = req.params;
		console.log('Mock updatePlanForSubscription called with:', subscriptionId);

		const mockResponse: SubscriptionResponse = {
			_links: {
				self: {
					href: `/rbs/v1/subscriptions/${subscriptionId}`,
					method: 'GET',
				},
				cancel: {
					href: `/rbs/v1/subscriptions/${subscriptionId}/cancel`,
					method: 'POST',
				},
				update: {
					href: `/rbs/v1/subscriptions/${subscriptionId}`,
					method: 'PATCH',
				},
			},
			id: subscriptionId,
			status: 'ACTIVE',
			submitTimeUtc: new Date().toISOString(),
			subscriptionInformation: {
				status: 'ACTIVE',
			},
		};

		return res.status(200).json(mockResponse);
	},
);

// listOfSubscriptions endpoint
app.get(
	'/rbs/v1/subscriptions',
	(_req: Request, res: Response<SubscriptionsListResponse>) => {
		console.log('Mock listOfSubscriptions called');
		const mockResponse: SubscriptionsListResponse = {
			_links: {
				self: {
					href: '/rbs/v1/subscriptions?status=ACTIVE&limit=2',
					method: 'GET',
				},
				next: {
					href: '/rbs/v1/subscriptions?status=ACTIVE&offset=2&limit=2',
					method: 'GET',
				},
			},
			totalCount: 29,
			subscriptions: [
				{
					_links: {
						self: {
							href: '/rbs/v1/subscriptions/6192112872526176101960',
							method: 'GET',
						},
						update: {
							href: '/rbs/v1/subscriptions/6192112872526176101960',
							method: 'PATCH',
						},
						cancel: {
							href: '/rbs/v1/subscriptions/6192112872526176101960/cancel',
							method: 'POST',
						},
						suspend: {
							href: '/rbs/v1/subscriptions/6192112872526176101960/suspend',
							method: 'POST',
						},
					},
					id: '6192112872526176101960',
					planInformation: {
						code: '34873819306413101960',
						name: 'RainTree Books Daily Plan',
						billingPeriod: {
							length: '1',
							unit: 'D',
						},
						billingCycles: {
							total: '2',
							current: '1',
						},
					},
					subscriptionInformation: {
						code: 'AWC-44',
						planId: '6034873819306413101960',
						name: 'Test',
						startDate: '2023-04-13T17:01:42Z',
						status: 'ACTIVE',
					},
					paymentInformation: {
						customer: {
							id: 'C09F227C54F94951E0533F36CF0A3D91',
						},
					},
					orderInformation: {
						amountDetails: {
							currency: 'USD',
							billingAmount: '2.00',
							setupFee: '1.00',
						},
						billTo: {
							firstName: 'JENNY',
							lastName: 'AUTO',
						},
					},
				},
				{
					_links: {
						self: {
							href: '/rbs/v1/subscriptions/6192115800926177701960',
							method: 'GET',
						},
						update: {
							href: '/rbs/v1/subscriptions/6192115800926177701960',
							method: 'PATCH',
						},
						cancel: {
							href: '/rbs/v1/subscriptions/6192115800926177701960/cancel',
							method: 'POST',
						},
						suspend: {
							href: '/rbs/v1/subscriptions/6192115800926177701960/suspend',
							method: 'POST',
						},
					},
					id: '6192115800926177701960',
					planInformation: {
						code: 'SITPlanCode6',
						name: 'Jan11DeployPlan1',
						billingPeriod: {
							length: '1',
							unit: 'W',
						},
						billingCycles: {
							total: '6',
							current: '1',
						},
					},
					subscriptionInformation: {
						code: 'AWC-45',
						planId: '6104313186846711501956',
						name: 'Testsub1',
						startDate: '2023-04-13T17:01:42Z',
						status: 'ACTIVE',
					},
					paymentInformation: {
						customer: {
							id: 'C09F227C54F94951E0533F36CF0A3D91',
						},
					},
					orderInformation: {
						amountDetails: {
							currency: 'USD',
							billingAmount: '1.00',
							setupFee: '5.00',
						},
						billTo: {
							firstName: 'JENNY',
							lastName: 'AUTO',
						},
					},
				},
			],
		};

		return res.status(200).json(mockResponse);
	},
);

// suspendSubscription endpoint
app.post(
	'/rbs/v1/subscriptions/:subscriptionId/suspend',
	(
		req: Request<{ subscriptionId: string }>,
		res: Response<SuspendSubscriptionResponse>,
	) => {
		const { subscriptionId } = req.params;
		console.log('Mock suspendSubscription called with:', subscriptionId);

		const mockResponse: SuspendSubscriptionResponse = {
			_links: {
				self: {
					href: `/rbs/v1/subscriptions/${subscriptionId}`,
					method: 'GET',
				},
				update: {
					href: `/rbs/v1/subscriptions/${subscriptionId}`,
					method: 'PATCH',
				},
				cancel: {
					href: `/rbs/v1/subscriptions/${subscriptionId}/cancel`,
					method: 'POST',
				},
				suspend: {
					href: `/rbs/v1/subscriptions/${subscriptionId}/suspend`,
					method: 'POST',
				},
			},
			id: subscriptionId,
			status: 'ACCEPTED',
			subscriptionInformation: {
				code: 'AWC-44',
				status: 'SUSPENDED',
			},
		};
		return res.status(200).json(mockResponse);
	},
);

const startServer = (portToTry: number, attempt = 0): void => {
	const server = app.listen(portToTry, () => {
		console.log(`Payment Mock Server listening on port ${portToTry}`);
	});

	server.on('error', (error: NodeJS.ErrnoException) => {
		if (error.code === 'EADDRINUSE' && attempt < 5) {
			const nextPort = portToTry + 1;
			console.warn(
				`Port ${portToTry} in use. Retrying mock-payment-server on ${nextPort}...`,
			);
			startServer(nextPort, attempt + 1);
			return;
		}

		console.error('Failed to start mock-payment-server', error);
	});
};

startServer(DEFAULT_PORT);
