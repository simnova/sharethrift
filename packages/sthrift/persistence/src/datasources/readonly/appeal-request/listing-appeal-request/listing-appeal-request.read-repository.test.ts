import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { expect, vi } from 'vitest';
import {
	getListingAppealRequestReadRepository,
	type ListingAppealRequestReadRepository,
} from './listing-appeal-request.read-repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/listing-appeal-request.read-repository.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({} as Domain.Passport);
}

function makeModels(): ModelsContext {
	return vi.mocked({
		AppealRequest: {
			ListingAppealRequest: {
				findOne: vi.fn(),
				find: vi.fn(),
			},
		},
	} as unknown as ModelsContext);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ListingAppealRequestReadRepository;

	BeforeEachScenario(() => {
		repository = getListingAppealRequestReadRepository(makeModels(), makePassport());
	});

	Background(({ Given }) => {
		Given('a ListingAppealRequestReadRepository instance with models and passport', () => {
			// Repository initialized in BeforeEachScenario
		});
	});

	Scenario('Repository initialization', ({ Then, And }) => {
		Then('the read repository should be defined', () => {
			expect(repository).toBeDefined();
		});

		And('the read repository should have a getAll method', () => {
			expect(repository.getAll).toBeDefined();
		});

		And('the read repository should have a getById method', () => {
			expect(repository.getById).toBeDefined();
		});
	});

	Scenario('Getting all appeal requests', ({ When, Then }) => {
		let result: unknown;

		When('I call getAll with pagination parameters', async () => {
			result = await repository.getAll({ page: 1, pageSize: 10 });
		});

		Then('it should return an empty paginated result', () => {
			expect(result).toEqual({
				items: [],
				total: 0,
				page: 1,
				pageSize: 10,
			});
		});
	});
});
