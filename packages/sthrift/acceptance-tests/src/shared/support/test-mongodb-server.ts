import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { ObjectId } from 'mongodb';
import { ServiceMongoose } from '@cellix/service-mongoose';
import { Persistence } from '@sthrift/persistence';
import {
	buildApplicationServicesFactory,
	type ApplicationServicesFactory,
} from '@sthrift/application-services';
import type { ApiContextSpec } from '@sthrift/context-spec';
import type {
	TokenValidation,
	TokenValidationResult,
} from '@cellix/service-token-validation';
import type { MessagingService } from '@cellix/service-messaging-base';
import type { PaymentService } from '@cellix/service-payment-base';
import { TestServer } from './test-server.js';
import { getAllMockAccountPlans } from './test-data/account-plan.test-data.js';
import { getAllMockUsers } from './test-data/user.test-data.js';

function createMockTokenValidation(): TokenValidation {
	return {
		verifyJwt: <ClaimsType>(
			_token: string,
		): Promise<TokenValidationResult<ClaimsType> | null> => {
			return Promise.resolve({
				verifiedJwt: {
					given_name: 'Alice',
					family_name: 'Smith',
					email: 'alice@example.com',
					sub: 'test-alice-sub',
				} as unknown as ClaimsType,
				openIdConfigKey: 'UserPortal',
			});
		},
	};
}

function createNoOpMessagingService(): MessagingService {
	const notImplemented = () => {
		throw new Error('MessagingService not implemented in mongodb test session');
	};
	const service: MessagingService = {
		startUp: () => Promise.resolve(service) as ReturnType<MessagingService['startUp']>,
		shutDown: () => Promise.resolve(),
		getConversation: notImplemented,
		sendMessage: notImplemented,
		getMessages: notImplemented,
		deleteConversation: notImplemented,
		listConversations: notImplemented,
		createConversation: notImplemented,
	};
	return service;
}

function createNoOpPaymentService(): PaymentService {
	const notImplemented = () => {
		throw new Error('PaymentService not implemented in mongodb test session');
	};
	const service: PaymentService = {
		startUp: () => Promise.resolve(service) as ReturnType<PaymentService['startUp']>,
		shutDown: () => Promise.resolve(),
		generatePublicKey: notImplemented,
		createCustomerProfile: notImplemented,
		getCustomerProfile: notImplemented,
		addCustomerPaymentInstrument: notImplemented,
		getCustomerPaymentInstrument: notImplemented,
		getCustomerPaymentInstruments: notImplemented,
		deleteCustomerPaymentInstrument: notImplemented,
		updateCustomerPaymentInstrument: notImplemented,
		processPayment: notImplemented,
		processRefund: notImplemented,
		getSuccessOrLatestFailedTransactionsByReferenceId: notImplemented,
		createPlan: notImplemented,
		listOfPlans: notImplemented,
		getPlan: notImplemented,
		createSubscription: notImplemented,
		updatePlanForSubscription: notImplemented,
		listOfSubscriptions: notImplemented,
		suspendSubscription: notImplemented,
	};
	return service;
}

async function seedTestDatabase(
	serviceMongoose: ServiceMongoose,
): Promise<void> {
	const { connection } = serviceMongoose.service;

	const accountPlans = getAllMockAccountPlans();
	if (accountPlans.length > 0) {
		await connection.collection('accountplans').insertMany(
			accountPlans.map((plan) => ({
				_id: new ObjectId(plan.id),
				...plan,
			})),
		);
	}

	const usersList = getAllMockUsers();
	if (usersList.length > 0) {
		await connection.collection('users').insertMany(
			usersList.map((user) => {
				const userRecord = user as unknown as Record<string, unknown>;
				return {
					_id: new ObjectId(String(userRecord['id'])),
					userType: userRecord['userType'],
					isBlocked: userRecord['isBlocked'],
					hasCompletedOnboarding: userRecord['hasCompletedOnboarding'],
					account: userRecord['account'],
					schemaVersion: userRecord['schemaVersion'],
					createdAt: userRecord['createdAt'],
					updatedAt: userRecord['updatedAt'],
				};
			}),
		);
	}
}
export class MongoDBTestServer {
	private replSet: MongoMemoryReplSet | null = null;
	private serviceMongoose: ServiceMongoose | null = null;
	private testServer: TestServer | null = null;

	async start(port = 4001): Promise<string> {
		this.replSet = await MongoMemoryReplSet.create({
			binary: { version: '7.0.14' },
			replSet: { name: 'rs0', count: 1, storageEngine: 'wiredTiger' },
		});
		const uri = this.replSet.getUri();

		this.serviceMongoose = new ServiceMongoose(uri, {
			dbName: 'sharethrift-test',
			autoIndex: true,
			autoCreate: true,
		});
		await this.serviceMongoose.startUp();

		const { connection } = this.serviceMongoose.service;
		for (const modelName of Object.keys(connection.models)) {
			try {
				connection.deleteModel(modelName);
			} catch {
				// Model may already be deleted
			}
		}

		await seedTestDatabase(this.serviceMongoose);

		const dataSourcesFactory = Persistence(this.serviceMongoose);

		const apiContextSpec: ApiContextSpec = {
			dataSourcesFactory,
			tokenValidationService: createMockTokenValidation(),
			messagingService: createNoOpMessagingService(),
			paymentService: createNoOpPaymentService(),
		};

		const realFactory = buildApplicationServicesFactory(apiContextSpec);

		const testFactory: ApplicationServicesFactory = {
			forRequest: (_rawAuthHeader, hints) => {
				return realFactory.forRequest('Bearer test-token', hints);
			},
		};

		this.testServer = new TestServer(testFactory);
		return await this.testServer.start(port);
	}

	async stop(): Promise<void> {
		if (this.testServer) {
			await this.testServer.stop();
			this.testServer = null;
		}
		if (this.serviceMongoose) {
			await this.serviceMongoose.shutDown();
			this.serviceMongoose = null;
		}
		if (this.replSet) {
			await this.replSet.stop();
			this.replSet = null;
		}
	}

	isRunning(): boolean {
		return this.testServer !== null;
	}
}
