import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import { AdminRoleRepository } from './admin-role.repository.ts';
import {
	AdminRoleConverter,
	type AdminRoleDomainAdapter,
} from './admin-role.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role.repository.feature'),
);

function makeAdminRoleDoc(): AdminRoleDomainAdapter {
	const mockDoc = {
		_id: 'role-1',
		roleName: 'Admin',
		roleType: 'admin',
		isDefault: false,
		permissions: {},
		set: vi.fn(),
	};

	return vi.mocked({
		doc: mockDoc,
		id: 'role-1',
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
		roleName: 'Admin',
		roleType: 'admin',
		isDefault: false,
		permissions: {},
	} as unknown as AdminRoleDomainAdapter);
}

function makePassport(): Domain.Passport {
	return vi.mocked({
		role: {
			forAdminRole: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: AdminRoleRepository;
	let mockDoc: AdminRoleDomainAdapter;
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

		mockDoc = makeAdminRoleDoc();

		repository = new AdminRoleRepository(
			makePassport(),
			mockModel as unknown as never,
			new AdminRoleConverter(),
			{} as unknown as never,
			{} as unknown as never,
		);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'an AdminRoleRepository instance with a working Mongoose model, type converter, and passport',
			() => {
				// Repository initialized in BeforeEachScenario
			},
		);
		And('valid AdminRole documents exist in the database', () => {
			// Mock documents set up in BeforeEachScenario
		});
	});

	Scenario('Getting an admin role by ID', ({ Given, When, Then }) => {
		Given('an AdminRole document with id "role-1"', () => {
			// mockDoc already has id 'role-1' from makeAdminRoleDoc
		});

		When('I call getById with "role-1"', async () => {
			try {
				result = await repository.getById('role-1');
			} catch (error) {
				result = error;
			}
		});

		Then('I should receive an AdminRole domain object', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario(
		'Getting an admin role by a nonexistent ID',
		({ When, Then }) => {
			When('I call getById with "nonexistent-id"', async () => {
				// Mock findById to return null
			const mockModel = repository['model'] as unknown as {
					findById: ReturnType<typeof vi.fn>;
				};
				mockModel.findById = vi.fn(() => ({
					exec: vi.fn(() => Promise.resolve(null)),
				}));

				try {
					result = await repository.getById('nonexistent-id');
				} catch (error) {
					result = error;
				}
			});

			Then(
				'an error should be thrown indicating the admin role was not found',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toContain('not found');
				},
			);
		},
	);

	Scenario('Creating a new admin role instance', ({ When, Then }) => {
		When('I call getNewInstance', async () => {
			try {
				result = await repository.getNewInstance('Test Role', false);
			} catch (error) {
				result = error;
			}
		});

		Then('I should receive a new AdminRole domain object', () => {
			expect(result).toBeDefined();
		});
	});
});
