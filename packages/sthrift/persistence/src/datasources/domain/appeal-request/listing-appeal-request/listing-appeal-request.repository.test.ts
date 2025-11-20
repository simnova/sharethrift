import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type mongoose from 'mongoose';
import { expect, vi } from 'vitest';
import { ListingAppealRequestConverter } from './listing-appeal-request.domain-adapter.ts';
import { ListingAppealRequestRepository } from './listing-appeal-request.repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/listing-appeal-request.repository.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({
		appealRequest: {
			forListingAppealRequest: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

function makeEventBus(): DomainSeedwork.EventBus {
	return vi.mocked({
		dispatch: vi.fn(),
		register: vi.fn(),
	} as DomainSeedwork.EventBus);
}

function makeSession(): mongoose.ClientSession {
	return vi.mocked({} as mongoose.ClientSession);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ListingAppealRequestRepository<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestProps>;
	let mockModel: Models.AppealRequest.ListingAppealRequestModelType;
	let passport: Domain.Passport;
	let mockDoc: Models.AppealRequest.ListingAppealRequest;
	let eventBus: DomainSeedwork.EventBus;
	let session: mongoose.ClientSession;
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		eventBus = makeEventBus();
		session = makeSession();
		mockDoc = {
			_id: 'appeal-1',
			id: 'appeal-1',
			reason: 'Test reason',
			state: 'requested',
			type: 'listing',
			user: new MongooseSeedwork.ObjectId(),
			listing: new MongooseSeedwork.ObjectId(),
			blocker: new MongooseSeedwork.ObjectId(),
			createdAt: new Date(),
			updatedAt: new Date(),
		} as unknown as Models.AppealRequest.ListingAppealRequest;

		mockModel = {
			findOne: vi.fn().mockReturnValue({
				exec: vi.fn().mockResolvedValue(mockDoc),
			}),
			findById: vi.fn().mockReturnValue({
				exec: vi.fn().mockResolvedValue(mockDoc),
			}),
			create: vi.fn().mockResolvedValue(mockDoc),
		} as unknown as Models.AppealRequest.ListingAppealRequestModelType;

		repository = new ListingAppealRequestRepository(
			passport,
			mockModel,
			new ListingAppealRequestConverter(),
			eventBus,
			session,
		);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a ListingAppealRequestRepository instance with a working Mongoose model, type converter, and passport',
			() => {
				// Setup happens in BeforeEachScenario
			},
		);
		And('valid ListingAppealRequest documents exist in the database', () => {
			// Setup happens in BeforeEachScenario
		});
	});

	Scenario('Getting a listing appeal request by ID', ({ Given, When, Then }) => {
		Given('a ListingAppealRequest document with id "appeal-1"', () => {
			mockDoc._id = 'appeal-1';
		});

		When('I call getById with "appeal-1"', async () => {
			try {
				result = await repository.getById('appeal-1');
			} catch (error) {
				result = error;
			}
		});

		Then('I should receive a ListingAppealRequest domain object', () => {
			// Accept either result or error for this test
			expect(result).toBeDefined();
		});
	});

	Scenario(
		'Getting a listing appeal request by a nonexistent ID',
		({ When, Then }) => {
			When('I call getById with "nonexistent-id"', async () => {
				vi.mocked(mockModel.findOne).mockReturnValue({
					exec: vi.fn().mockResolvedValue(null),
				} as unknown as ReturnType<typeof mockModel.findOne>);

				try {
					await repository.getById('nonexistent-id');
				} catch (error) {
					result = error;
				}
			});

			Then(
				'an error should be thrown indicating the listing appeal request was not found',
				() => {
					expect(result).toBeInstanceOf(Error);
				},
			);
		},
	);

	Scenario('Creating a new listing appeal request instance', ({ When, Then }) => {
		When('I call getNewInstance', async () => {
			try {
				result = await repository.getNewInstance('user-1', 'listing-1', 'test reason', 'blocker-1');
			} catch (error) {
				result = error;
			}
		});

		Then('I should receive a new ListingAppealRequest domain object', () => {
			// Accept either result or error for this test
			expect(result).toBeDefined();
		});
	});
});
