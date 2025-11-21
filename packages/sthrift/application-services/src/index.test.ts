import type { ApiContextSpec } from '@sthrift/context-spec';
import { expect, vi } from 'vitest';
import { describe, it, beforeEach } from 'vitest';
import { buildApplicationServicesFactory } from './index.ts';

describe('Application Services Factory', () => {
	let mockInfrastructureServices: ApiContextSpec;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockDataSources: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadonlyDataSource: any;

	beforeEach(() => {
		mockReadonlyDataSource = {
			User: {
				PersonalUser: {
					PersonalUserReadRepo: {
						getByEmail: vi.fn().mockResolvedValue(null),
					},
				},
				AdminUser: {
					AdminUserReadRepo: {
						getByEmail: vi.fn().mockResolvedValue(null),
					},
				},
			},
		};

		mockDataSources = {
			domainDataSource: {},
			readonlyDataSource: mockReadonlyDataSource,
		};

		mockInfrastructureServices = {
			paymentService: {
				processPayment: vi.fn(),
				refundPayment: vi.fn(),
			},
			tokenValidationService: {
				verifyJwt: vi.fn(),
			},
			dataSourcesFactory: {
				withSystemPassport: vi.fn().mockReturnValue({
					readonlyDataSource: mockReadonlyDataSource,
				}),
				withPassport: vi.fn().mockReturnValue(mockDataSources),
			},
			messagingService: {},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;
	});

	it('should export buildApplicationServicesFactory function', () => {
		expect(buildApplicationServicesFactory).toBeDefined();
		expect(typeof buildApplicationServicesFactory).toBe('function');
	});

	it('should create an application services factory', () => {
		const factory = buildApplicationServicesFactory(mockInfrastructureServices);

		expect(factory).toBeDefined();
		expect(factory.forRequest).toBeDefined();
		expect(typeof factory.forRequest).toBe('function');
	});

	it('should create application services for guest user without auth header', async () => {
		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		const services = await factory.forRequest();

		expect(services).toBeDefined();
		expect(services.User).toBeDefined();
		expect(services.Payment).toBeDefined();
		expect(services.Conversation).toBeDefined();
		expect(services.Listing).toBeDefined();
		expect(services.ReservationRequest).toBeDefined();
		expect(services.AppealRequest).toBeDefined();
		expect(services.verifiedUser).toEqual({ hints: undefined });
	});

	it('should create application services for guest user with invalid token', async () => {
		mockInfrastructureServices.tokenValidationService.verifyJwt.mockResolvedValue(
			null,
		);

		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		const services = await factory.forRequest('Bearer invalid-token');

		expect(services).toBeDefined();
		expect(services.verifiedUser).toEqual({ hints: undefined });
		expect(
			mockInfrastructureServices.tokenValidationService.verifyJwt,
		).toHaveBeenCalledWith('invalid-token');
	});

	it('should create application services for personal user with valid UserPortal token', async () => {
		const mockVerifiedJwt = {
			given_name: 'John',
			family_name: 'Doe',
			email: 'john@example.com',
			sub: 'user-123',
		};

		mockInfrastructureServices.tokenValidationService.verifyJwt.mockResolvedValue(
			{
				verifiedJwt: mockVerifiedJwt,
				openIdConfigKey: 'UserPortal',
			},
		);

		const mockPersonalUser = {
			id: 'user-123',
			account: { email: 'john@example.com' },
		};

		mockReadonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
			mockPersonalUser,
		);

		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		const services = await factory.forRequest('Bearer valid-token');

		expect(services).toBeDefined();
		expect(services.verifiedUser).not.toBeNull();
		expect(services.verifiedUser?.verifiedJwt).toEqual(mockVerifiedJwt);
		expect(services.verifiedUser?.openIdConfigKey).toBe('UserPortal');
		expect(
			mockReadonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail,
		).toHaveBeenCalledWith('john@example.com');
	});

	it('should create application services for admin user with valid AdminPortal token', async () => {
		const mockVerifiedJwt = {
			given_name: 'Admin',
			family_name: 'User',
			email: 'admin@example.com',
			sub: 'admin-123',
		};

		mockInfrastructureServices.tokenValidationService.verifyJwt.mockResolvedValue(
			{
				verifiedJwt: mockVerifiedJwt,
				openIdConfigKey: 'AdminPortal',
			},
		);

		const mockAdminUser = {
			id: 'admin-123',
			account: { email: 'admin@example.com' },
		};

		mockReadonlyDataSource.User.AdminUser.AdminUserReadRepo.getByEmail.mockResolvedValue(
			mockAdminUser,
		);

		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		const services = await factory.forRequest('Bearer admin-token');

		expect(services).toBeDefined();
		expect(services.verifiedUser).not.toBeNull();
		expect(services.verifiedUser?.verifiedJwt).toEqual(mockVerifiedJwt);
		expect(services.verifiedUser?.openIdConfigKey).toBe('AdminPortal');
		expect(
			mockReadonlyDataSource.User.AdminUser.AdminUserReadRepo.getByEmail,
		).toHaveBeenCalledWith('admin@example.com');
	});

	it('should handle valid token but user not found in UserPortal', async () => {
		const mockVerifiedJwt = {
			given_name: 'New',
			family_name: 'User',
			email: 'newuser@example.com',
			sub: 'new-123',
		};

		mockInfrastructureServices.tokenValidationService.verifyJwt.mockResolvedValue(
			{
				verifiedJwt: mockVerifiedJwt,
				openIdConfigKey: 'UserPortal',
			},
		);

		mockReadonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
			null,
		);

		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		const services = await factory.forRequest('Bearer token-without-user');

		expect(services).toBeDefined();
		expect(services.verifiedUser).not.toBeNull();
		// User should have verifiedJwt but passport should be guest
		expect(services.verifiedUser?.verifiedJwt).toEqual(mockVerifiedJwt);
	});

	it('should handle valid token but admin not found in AdminPortal', async () => {
		const mockVerifiedJwt = {
			given_name: 'New',
			family_name: 'Admin',
			email: 'newadmin@example.com',
			sub: 'new-admin-123',
		};

		mockInfrastructureServices.tokenValidationService.verifyJwt.mockResolvedValue(
			{
				verifiedJwt: mockVerifiedJwt,
				openIdConfigKey: 'AdminPortal',
			},
		);

		mockReadonlyDataSource.User.AdminUser.AdminUserReadRepo.getByEmail.mockResolvedValue(
			null,
		);

		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		const services = await factory.forRequest('Bearer token-without-admin');

		expect(services).toBeDefined();
		expect(services.verifiedUser).not.toBeNull();
		expect(services.verifiedUser?.verifiedJwt).toEqual(mockVerifiedJwt);
	});

	it('should include hints in verifiedUser', async () => {
		const mockVerifiedJwt = {
			given_name: 'Test',
			family_name: 'User',
			email: 'test@example.com',
			sub: 'test-123',
		};

		mockInfrastructureServices.tokenValidationService.verifyJwt.mockResolvedValue(
			{
				verifiedJwt: mockVerifiedJwt,
				openIdConfigKey: 'UserPortal',
			},
		);

		const hints = { customData: 'test-value' };

		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		const services = await factory.forRequest('Bearer token', hints);

		expect(services).toBeDefined();
		expect(services.verifiedUser).not.toBeNull();
		expect(services.verifiedUser?.hints).toEqual(hints);
	});

	it('should strip Bearer prefix from auth header', async () => {
		mockInfrastructureServices.tokenValidationService.verifyJwt.mockResolvedValue(
			null,
		);

		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		await factory.forRequest('Bearer   token-with-spaces  ');

		expect(
			mockInfrastructureServices.tokenValidationService.verifyJwt,
		).toHaveBeenCalledWith('token-with-spaces');
	});

	it('should handle unknown openIdConfigKey', async () => {
		const mockVerifiedJwt = {
			given_name: 'Unknown',
			family_name: 'Portal',
			email: 'unknown@example.com',
			sub: 'unknown-123',
		};

		mockInfrastructureServices.tokenValidationService.verifyJwt.mockResolvedValue(
			{
				verifiedJwt: mockVerifiedJwt,
				openIdConfigKey: 'UnknownPortal',
			},
		);

		const factory = buildApplicationServicesFactory(mockInfrastructureServices);
		const services = await factory.forRequest('Bearer unknown-portal-token');

		expect(services).toBeDefined();
		expect(services.verifiedUser).not.toBeNull();
		// Should use guest passport since portal is unknown
		expect(services.verifiedUser?.openIdConfigKey).toBe('UnknownPortal');
	});
});
