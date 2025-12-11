import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { expect, vi } from 'vitest';
import {
	UserAppealRequestConverter,
	type UserAppealRequestDomainAdapter,
	UserAppealRequestRepository,
} from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/user-appeal-request.repository.feature'),
);

function makeAppealRequestDoc() {
	return {
		_id: 'appeal-1',
		user: new MongooseSeedwork.ObjectId(),
		target: new MongooseSeedwork.ObjectId(),
		blocker: new MongooseSeedwork.ObjectId(),
		reason: 'Test reason',
		state: 'pending',
		type: 'harassment',
	};
}

function makePassport(): Domain.Passport {
	return vi.mocked({
		appealRequest: {
			forUserAppealRequest: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: UserAppealRequestRepository<UserAppealRequestDomainAdapter>;
	let mockDoc: ReturnType<typeof makeAppealRequestDoc>;
	let result: unknown;

	BeforeEachScenario(() => {
		const mockModel = {
			findOne: vi.fn(() => ({
				exec: vi.fn(() => Promise.resolve(mockDoc)),
			})),
			find: vi.fn(() => ({
				exec: vi.fn(() => Promise.resolve([mockDoc])),
			})),
			create: vi.fn(() => Promise.resolve(mockDoc)),
		};

		mockDoc = makeAppealRequestDoc();

		repository = new UserAppealRequestRepository(
			makePassport(),
			mockModel as unknown as never,
			new UserAppealRequestConverter(),
			{} as unknown as never,
			{} as unknown as never,
		);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a UserAppealRequestRepository instance with a working Mongoose model, type converter, and passport',
			() => {
				// Repository initialized in BeforeEachScenario
			},
		);
		And('valid UserAppealRequest documents exist in the database', () => {
			// Mock documents set up in BeforeEachScenario
		});
	});

	Scenario('Getting a user appeal request by ID', ({ Given, When, Then }) => {
		Given('a UserAppealRequest document with id "appeal-1"', () => {
			mockDoc._id = 'appeal-1';
		});

		When('I call getById with "appeal-1"', async () => {
			try {
				result = await repository.getById('appeal-1');
			} catch (error) {
				result = error;
			}
		});

		Then('I should receive a UserAppealRequest domain object', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario(
		'Getting a user appeal request by a nonexistent ID',
		({ When, Then }) => {
			When('I call getById with "nonexistent-id"', async () => {
				// Mock to return null for nonexistent ID
			const mockModel = repository['model'] as unknown as {
					findOne: ReturnType<typeof vi.fn>;
				};
				mockModel.findOne = vi.fn(() => ({
					exec: vi.fn(() => Promise.resolve(null)),
				}));

				try {
					result = await repository.getById('nonexistent-id');
				} catch (error) {
					result = error;
				}
			});

			Then(
				'an error should be thrown indicating the user appeal request was not found',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toContain('not found');
				},
			);
		},
	);

	Scenario('Creating a new user appeal request instance', ({ When, Then }) => {
		When('I call getNewInstance', async () => {
			try {
				result = await repository.getNewInstance('user-1', 'test reason', 'blocker-1');
			} catch (error) {
				result = error;
			}
		});

		Then('I should receive a new UserAppealRequest domain object', () => {
			expect(result).toBeDefined();
		});
	});
});
