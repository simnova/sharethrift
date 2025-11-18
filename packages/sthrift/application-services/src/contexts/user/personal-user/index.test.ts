import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DataSources } from '@sthrift/persistence';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { PersonalUser } from './index.ts';

vi.mock('./create-if-not-exists.ts');
vi.mock('./query-by-id.ts');
vi.mock('./update.ts');
vi.mock('./query-by-email.ts');
vi.mock('./get-all-users.ts');

import { createIfNotExists } from './create-if-not-exists.ts';
import { queryById } from './query-by-id.ts';
import { update } from './update.ts';
import { queryByEmail } from './query-by-email.ts';
import { getAllUsers } from './get-all-users.ts';

// @ts-expect-error - Required for Vitest Cucumber syntax support
const _test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, './features/index.feature'),
);

describeFeature(feature, ({ Scenario, BeforeEachScenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let service: any;
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockCreateIfNotExistsFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryByIdFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockUpdateFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryByEmailFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockGetAllUsersFn: any;

	BeforeEachScenario(() => {
		vi.clearAllMocks();

		mockCreateIfNotExistsFn = vi.fn();
		mockQueryByIdFn = vi.fn();
		mockUpdateFn = vi.fn();
		mockQueryByEmailFn = vi.fn();
		mockGetAllUsersFn = vi.fn();

		vi.mocked(createIfNotExists).mockReturnValue(mockCreateIfNotExistsFn);
		vi.mocked(queryById).mockReturnValue(mockQueryByIdFn);
		vi.mocked(update).mockReturnValue(mockUpdateFn);
		vi.mocked(queryByEmail).mockReturnValue(mockQueryByEmailFn);
		vi.mocked(getAllUsers).mockReturnValue(mockGetAllUsersFn);

		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		mockDataSources = {} as any;
		service = PersonalUser(mockDataSources);
	});

	Scenario(
		'Creating a personal user if not exists through the application service',
		({ Given, When, Then }) => {
			Given('a personal user application service', () => {
				expect(service).toBeDefined();
			});

			When('I create a personal user if not exists', async () => {
				await service.createIfNotExists({});
			});

			Then('it should delegate to the createIfNotExists function', () => {
				expect(mockCreateIfNotExistsFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying a personal user by ID through the application service',
		({ Given, When, Then }) => {
			Given('a personal user application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for personal user with id "user-123"', async () => {
				await service.queryById({ id: 'user-123' });
			});

			Then('it should delegate to the queryById function', () => {
				expect(mockQueryByIdFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Updating a personal user through the application service',
		({ Given, When, Then }) => {
			Given('a personal user application service', () => {
				expect(service).toBeDefined();
			});

			When('I update personal user "user-123"', async () => {
				await service.update({ id: 'user-123' });
			});

			Then('it should delegate to the update function', () => {
				expect(mockUpdateFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying a personal user by email through the application service',
		({ Given, When, Then }) => {
			Given('a personal user application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for personal user with email "test@example.com"', async () => {
				await service.queryByEmail({ email: 'test@example.com' });
			});

			Then('it should delegate to the queryByEmail function', () => {
				expect(mockQueryByEmailFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Getting all personal users through the application service',
		({ Given, When, Then }) => {
			Given('a personal user application service', () => {
				expect(service).toBeDefined();
			});

			When('I get all personal users', async () => {
				await service.getAllUsers({ page: 1, pageSize: 10 });
			});

			Then('it should delegate to the getAllUsers function', () => {
				expect(mockGetAllUsersFn).toHaveBeenCalled();
			});
		},
	);
});
