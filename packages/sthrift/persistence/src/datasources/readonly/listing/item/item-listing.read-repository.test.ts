import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { expect, vi } from 'vitest';
import {
	getItemListingReadRepository,
	type ItemListingReadRepository,
} from './item-listing.read-repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.read-repository.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({} as Domain.Passport);
}

function makeModels(): ModelsContext {
	return vi.mocked({
		Listing: {
			ItemListing: {
				findOne: vi.fn(),
				find: vi.fn(),
			},
		},
	} as unknown as ModelsContext);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ItemListingReadRepository;

	BeforeEachScenario(() => {
		repository = getItemListingReadRepository(makeModels(), makePassport());
	});

	Background(({ Given }) => {
		Given('an ItemListingReadRepository instance with models and passport', () => {
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
});
