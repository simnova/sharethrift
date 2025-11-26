import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type PersonalUserQueryByIdCommand, queryById } from './query-by-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: PersonalUserQueryByIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getById: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				User: {
					PersonalUser: {
						PersonalUserReadRepo: mockReadRepo,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { id: 'user-123' };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving a personal user by ID',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command = { id: 'user-123' };
			});

			And('the user exists', () => {
				const mockUser = {
					id: 'user-123',
					account: { email: 'user@example.com' },
				};
				mockReadRepo.getById.mockResolvedValue(mockUser);
			});

			When('the queryById command is executed', async () => {
				const queryFn = queryById(mockDataSources);
				result = await queryFn(command);
			});

			Then('the user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario('Retrieving non-existent user', ({ Given, When, Then }) => {
		Given('a user ID "user-999" that does not exist', () => {
			command = { id: 'user-999' };
		});

		When('the queryById command is executed', async () => {
			mockReadRepo.getById.mockResolvedValue(null);
			const queryFn = queryById(mockDataSources);
			result = await queryFn(command);
		});

		Then('null should be returned', () => {
			expect(result).toBeNull();
		});
	});
});
