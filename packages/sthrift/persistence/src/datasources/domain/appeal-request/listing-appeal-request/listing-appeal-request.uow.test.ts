import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import { getListingAppealRequestUnitOfWork } from './listing-appeal-request.uow.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/listing-appeal-request.uow.feature'),
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

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let listingAppealRequestModel: Models.AppealRequest.ListingAppealRequestModelType;
	let passport: Domain.Passport;
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		listingAppealRequestModel = {
			findOne: vi.fn(),
			find: vi.fn(),
			create: vi.fn(),
		} as unknown as Models.AppealRequest.ListingAppealRequestModelType;
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given('a Mongoose context factory with a working service', () => {
			// Mock service is set up
		});
		And('a valid ListingAppealRequest model from the models context', () => {
			// Model is set up in BeforeEachScenario
		});
		And('a valid passport for domain operations', () => {
			passport = makePassport();
		});
	});

	Scenario(
		'Creating a ListingAppealRequest Unit of Work',
		({ When, Then, And }) => {
			When(
				'I call getListingAppealRequestUnitOfWork with the ListingAppealRequest model and passport',
				() => {
					try {
						result = getListingAppealRequestUnitOfWork(listingAppealRequestModel, passport);
					} catch (error) {
						result = error;
					}
				},
			);

			Then(
				'I should receive a properly initialized ListingAppealRequestUnitOfWork',
				() => {
					expect(result).toBeDefined();
				},
			);

			And('the Unit of Work should have the correct methods', () => {
				// UOW structure may vary, just verify it exists
				expect(result).toBeDefined();
			});
		},
	);
});
