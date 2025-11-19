import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type ConversationCreateCommand, create } from './create.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/create.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUserReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockListingReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockMessagingRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: ConversationCreateCommand;
	let result:
		| Domain.Contexts.Conversation.Conversation.ConversationEntityReference
		| undefined;
	let error: Error | undefined;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getBySharerReserverListing: vi.fn(),
		};

	mockUserReadRepo = {
		getById: vi.fn(),
	};

	// Create wrapper functions that delegate to getById
	const getUserByIdSpy = vi.fn(async (id: string) => {
		return mockUserReadRepo.getById(id);
	});
	const getUserByEmailSpy = vi.fn();

	mockListingReadRepo = {
		getById: vi.fn(),
	};

	mockMessagingRepo = {
		createConversation: vi.fn(),
	};

	mockRepo = {
		getNewInstance: vi.fn(),
		save: vi.fn(),
	};

	mockUnitOfWork = {
		// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
		withScopedTransaction: vi.fn(async (callback: any) => {
			return await callback(mockRepo);
		}),
	};		mockDataSources = {
			domainDataSource: {
				Conversation: {
					Conversation: {
						ConversationUnitOfWork: mockUnitOfWork,
					},
				},
			},
			readonlyDataSource: {
				Conversation: {
					Conversation: {
						ConversationReadRepo: mockReadRepo,
					},
				},
			User: {
				PersonalUser: {
					PersonalUserReadRepo: mockUserReadRepo,
				},
				getUserById: getUserByIdSpy,
				getUserByEmail: getUserByEmailSpy,
			},
				Listing: {
					ItemListing: {
						ItemListingReadRepo: mockListingReadRepo,
					},
				},
			},
			messagingDataSource: {
				Conversation: {
					Conversation: {
						MessagingConversationRepo: mockMessagingRepo,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully creating a new conversation',
		({ Given, When, Then, And }) => {
			Given(
				'valid sharer ID "sharer-123", reserver ID "reserver-456", and listing ID "listing-789"',
				() => {
					command = {
						sharerId: 'sharer-123',
						reserverId: 'reserver-456',
						listingId: 'listing-789',
					};
				},
			);

			And('all entities exist in the database', () => {
				const mockSharer = {
					id: 'sharer-123',
					account: { username: 'sharer_user' },
				};
				const mockReserver = {
					id: 'reserver-456',
					account: { username: 'reserver_user' },
				};
				const mockListing = {
					id: 'listing-789',
				};

				mockUserReadRepo.getById.mockImplementation((id: string) => {
					if (id === 'sharer-123') return Promise.resolve(mockSharer);
					if (id === 'reserver-456') return Promise.resolve(mockReserver);
					return Promise.resolve(null);
				});

				mockListingReadRepo.getById.mockResolvedValue(mockListing);
			});

			And('no existing conversation exists for these entities', () => {
				mockReadRepo.getBySharerReserverListing.mockResolvedValue(null);
			});

			When('the create command is executed', async () => {
				mockMessagingRepo.createConversation.mockResolvedValue({
					id: 'messaging-conv-123',
				});

				const mockConversation = {
					id: 'conv-123',
					messagingConversationId: 'messaging-conv-123',
				};

				mockRepo.getNewInstance.mockResolvedValue(mockConversation);
				mockRepo.save.mockResolvedValue(mockConversation);

				try {
					const createFn = create(mockDataSources);
					result = await createFn(command);
				} catch (err) {
					error = err as Error;
				}
			});

			Then('a messaging conversation should be created', () => {
				expect(mockMessagingRepo.createConversation).toHaveBeenCalled();
			});

			And('a domain conversation should be created and saved', () => {
				expect(mockRepo.getNewInstance).toHaveBeenCalled();
				expect(mockRepo.save).toHaveBeenCalled();
			});

			And(
				'the conversation should be returned with the messaging conversation ID',
				() => {
					expect(result).toBeDefined();
					expect(result?.id).toBe('conv-123');
					expect(result?.messagingConversationId).toBe('messaging-conv-123');
				},
			);
		},
	);

	Scenario('Returning existing conversation', ({ Given, When, Then, And }) => {
		Given(
			'valid sharer ID "sharer-123", reserver ID "reserver-456", and listing ID "listing-789"',
			() => {
				command = {
					sharerId: 'sharer-123',
					reserverId: 'reserver-456',
					listingId: 'listing-789',
				};
			},
		);

		And('an existing conversation already exists for these entities', () => {
			const existingConversation = {
				id: 'existing-conv-123',
				messagingConversationId: 'messaging-conv-existing',
			};
			mockReadRepo.getBySharerReserverListing.mockResolvedValue(
				existingConversation,
			);
		});

		When('the create command is executed', async () => {
			try {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('the existing conversation should be returned', () => {
			expect(result).toBeDefined();
			expect(result?.id).toBe('existing-conv-123');
		});

		And('no new conversation should be created', () => {
			expect(mockMessagingRepo.createConversation).not.toHaveBeenCalled();
			expect(mockRepo.getNewInstance).not.toHaveBeenCalled();
		});
	});

	Scenario('Handling missing sharer', ({ Given, When, Then }) => {
		Given('a non-existent sharer ID "invalid-sharer"', () => {
			command = {
				sharerId: 'invalid-sharer',
				reserverId: 'reserver-456',
				listingId: 'listing-789',
			};

			mockReadRepo.getBySharerReserverListing.mockResolvedValue(null);
			mockUserReadRepo.getById.mockImplementation((id: string) => {
				if (id === 'invalid-sharer') return Promise.resolve(null);
				if (id === 'reserver-456')
					return Promise.resolve({ id: 'reserver-456' });
				return Promise.resolve(null);
			});
			mockListingReadRepo.getById.mockResolvedValue({ id: 'listing-789' });
		});

		When('the create command is executed', async () => {
			try {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating sharer not found', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Personal user (sharer) not found');
		});
	});

	Scenario('Handling missing reserver', ({ Given, When, Then }) => {
		Given('a non-existent reserver ID "invalid-reserver"', () => {
			command = {
				sharerId: 'sharer-123',
				reserverId: 'invalid-reserver',
				listingId: 'listing-789',
			};

			mockReadRepo.getBySharerReserverListing.mockResolvedValue(null);
			mockUserReadRepo.getById.mockImplementation((id: string) => {
				if (id === 'sharer-123')
					return Promise.resolve({
						id: 'sharer-123',
						account: { username: 'sharer' },
					});
				if (id === 'invalid-reserver') return Promise.resolve(null);
				return Promise.resolve(null);
			});
			mockListingReadRepo.getById.mockResolvedValue({ id: 'listing-789' });
		});

		When('the create command is executed', async () => {
			try {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating reserver not found', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Personal user (reserver) not found');
		});
	});

	Scenario('Handling missing listing', ({ Given, When, Then }) => {
		Given('a non-existent listing ID "invalid-listing"', () => {
			command = {
				sharerId: 'sharer-123',
				reserverId: 'reserver-456',
				listingId: 'invalid-listing',
			};

			mockReadRepo.getBySharerReserverListing.mockResolvedValue(null);
			mockUserReadRepo.getById.mockImplementation((id: string) => {
				if (id === 'sharer-123')
					return Promise.resolve({
						id: 'sharer-123',
						account: { username: 'sharer' },
					});
				if (id === 'reserver-456')
					return Promise.resolve({
						id: 'reserver-456',
						account: { username: 'reserver' },
					});
				return Promise.resolve(null);
			});
			mockListingReadRepo.getById.mockResolvedValue(null);
		});

		When('the create command is executed', async () => {
			try {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating listing not found', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Listing not found');
		});
	});

	Scenario(
		'Handling messaging service unavailable',
		({ Given, When, Then, And }) => {
			Given('valid entities', () => {
				command = {
					sharerId: 'sharer-123',
					reserverId: 'reserver-456',
					listingId: 'listing-789',
				};

				mockReadRepo.getBySharerReserverListing.mockResolvedValue(null);
				mockUserReadRepo.getById.mockImplementation((id: string) => {
					if (id === 'sharer-123')
						return Promise.resolve({
							id: 'sharer-123',
							account: { username: 'sharer' },
						});
					if (id === 'reserver-456')
						return Promise.resolve({
							id: 'reserver-456',
							account: { username: 'reserver' },
						});
					return Promise.resolve(null);
				});
				mockListingReadRepo.getById.mockResolvedValue({ id: 'listing-789' });
			});

			And('the messaging data source is unavailable', () => {
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.messagingDataSource = null as any;
			});

			When('the create command is executed', async () => {
				try {
					const createFn = create(mockDataSources);
					result = await createFn(command);
				} catch (err) {
					error = err as Error;
				}
			});

			Then(
				'an error should be thrown indicating messaging service unavailable',
				() => {
					expect(error).toBeDefined();
					expect(error?.message).toContain(
						'Messaging data source is not available',
					);
				},
			);
		},
	);
});
