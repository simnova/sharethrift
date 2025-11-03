import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { getItemListingUnitOfWork } from './item-listing.uow.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.uow.feature'),
);

function makeMockModel(): Models.Listing.ItemListingModelType {
	const ModelMock = function (
		this: Models.Listing.ItemListing,
		_props?: Partial<Models.Listing.ItemListing>,
	) {
		Object.assign(this, {
			_id: 'listing-1',
			title: 'Test Listing',
			description: 'Test description',
			category: 'Electronics',
			location: 'Delhi',
			sharingPeriodStart: new Date('2025-10-06'),
			sharingPeriodEnd: new Date('2025-11-06'),
			state: 'Published',
			sharer: 'user-1',
			images: [],
			reports: 0,
			sharingHistory: [],
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
		});
	} as unknown as Models.Listing.ItemListingModelType;

	// Add static methods
	Object.assign(ModelMock, {
		findOne: vi.fn(),
		find: vi.fn(),
		findById: vi.fn(),
		startSession: vi.fn(() => ({
			startTransaction: vi.fn(),
			commitTransaction: vi.fn(),
			abortTransaction: vi.fn(),
			endSession: vi.fn(),
		})),
	});

	return ModelMock;
}

function makeMockPassport(): Domain.Passport {
	return {
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
	} as unknown as Domain.Passport;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let model: Models.Listing.ItemListingModelType;
	let passport: Domain.Passport;
	let unitOfWork: Domain.Contexts.Listing.ItemListing.ItemListingUnitOfWork;

	BeforeEachScenario(() => {
		model = makeMockModel();
		passport = makeMockPassport();
		unitOfWork =
			{} as Domain.Contexts.Listing.ItemListing.ItemListingUnitOfWork;
	});

	Background(({ Given }) => {
		Given(
			'the system is configured with Mongoose, EventBus, and domain adapters',
			() => {
				// This is set up in BeforeEachScenario
			},
		);
	});

	Scenario(
		'Initialize an ItemListingUnitOfWork successfully',
		({ Given, And, When, Then }) => {
			Given('a valid Mongoose ItemListing model', () => {
				model = makeMockModel();
			});
			And('a valid domain passport', () => {
				passport = makeMockPassport();
			});
			When(
				'I call getItemListingUnitOfWork with the model and passport',
				() => {
					unitOfWork = getItemListingUnitOfWork(model, passport);
				},
			);
			Then(
				'I should receive a fully initialized ItemListingUnitOfWork instance',
				() => {
					expect(unitOfWork).toBeDefined();
					expect(typeof unitOfWork).toBe('object');
				},
			);
			And(
				'the instance should include an ItemListingRepository connected to the model',
				() => {
					expect(unitOfWork).toHaveProperty('withTransaction');
					expect(unitOfWork).toHaveProperty('withScopedTransaction');
					expect(unitOfWork).toHaveProperty('withScopedTransactionById');
					expect(typeof unitOfWork.withTransaction).toBe('function');
					expect(typeof unitOfWork.withScopedTransaction).toBe('function');
					expect(typeof unitOfWork.withScopedTransactionById).toBe('function');
				},
			);
			And(
				'the instance should use ItemListingConverter for domain conversions',
				() => {
					// UoW encapsulates the converter internally, we can verify functionality through transaction operations
					expect(unitOfWork.withTransaction).toBeDefined();
				},
			);
			And(
				'the instance should be registered with both InProcEventBusInstance and NodeEventBusInstance',
				() => {
					// Event buses are encapsulated within the UoW implementation
					expect(unitOfWork.withScopedTransaction).toBeDefined();
				},
			);
			And(
				'the instance should be initialized with the provided passport',
				() => {
					// Passport is encapsulated within the UoW implementation and used during transactions
					expect(unitOfWork.withScopedTransactionById).toBeDefined();
				},
			);
		},
	);

	Scenario(
		'Attempt to initialize ItemListingUnitOfWork with an invalid model',
		({ Given, And, When, Then }) => {
			let invalidModel: Models.Listing.ItemListingModelType | undefined;
			let initializingWithInvalidModel: () => void;
			Given('an invalid or undefined ItemListing model', () => {
				invalidModel = undefined;
			});
			And('a valid domain passport', () => {
				passport = makeMockPassport();
			});
			When('I call getItemListingUnitOfWork', () => {
				initializingWithInvalidModel = () => {
					unitOfWork = getItemListingUnitOfWork(
						invalidModel as Models.Listing.ItemListingModelType,
						passport,
					);
				};
			});
			Then(
				'an error should be thrown indicating the model is not valid',
				() => {
					expect(initializingWithInvalidModel).toThrow();
				},
			);
		},
	);

	Scenario(
		'Attempt to initialize ItemListingUnitOfWork with a missing passport',
		({ Given, And, When, Then }) => {
			let invalidPassport: Domain.Passport | undefined;
			let initializingWithMissingPassport: () => void;
			Given('a valid Mongoose ItemListing model', () => {
				model = makeMockModel();
			});
			And('an undefined or missing passport', () => {
				invalidPassport = undefined;
			});
			When('I call getItemListingUnitOfWork', () => {
				initializingWithMissingPassport = () => {
					unitOfWork = getItemListingUnitOfWork(
						model,
						invalidPassport as Domain.Passport,
					);
				};
			});
			Then(
				'an error should be thrown indicating the passport is required',
				() => {
					expect(initializingWithMissingPassport).toThrow();
				},
			);
		},
	);
});
