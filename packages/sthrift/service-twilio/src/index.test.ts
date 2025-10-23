import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AxiosInstance } from 'axios';

// Import modules for mocking
import axios from 'axios';
import { Twilio } from 'twilio';

// Mock the external dependencies
vi.mock('twilio');
vi.mock('axios');

import { ServiceTwilio } from './index.ts';
import type { ConversationInstance, MessageInstance } from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/service-twilio.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario, AfterEachScenario }) => {
	let service: ServiceTwilio;
	let originalEnv: NodeJS.ProcessEnv;
	let logSpy: ReturnType<typeof vi.spyOn>;
	let mockAxiosInstance: AxiosInstance;
	let mockTwilioClient: any;

	BeforeEachScenario(() => {
		// Save original environment
		originalEnv = { ...process.env };

		// Setup mock axios instance
		mockAxiosInstance = {
			get: vi.fn(),
			post: vi.fn(),
			delete: vi.fn(),
		} as unknown as AxiosInstance;

		// Setup mock Twilio client
		mockTwilioClient = {
			conversations: {
				v1: {
					conversations: vi.fn(),
				},
			},
		};

		// Mock axios.create
		vi.mocked(axios.create).mockReturnValue(mockAxiosInstance);

		// Mock Twilio constructor
		(vi.mocked(Twilio) as any).mockImplementation(() => mockTwilioClient);

		// Setup console.log spy
		logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	AfterEachScenario(() => {
		// Restore environment
		process.env = originalEnv;
		logSpy.mockRestore();
		vi.clearAllMocks();
	});

	Scenario('Initializing ServiceTwilio in mock mode', ({ Given, When, Then }) => {
		Given('TWILIO_USE_MOCK and TWILIO_MOCK_URL are set', () => {
			process.env['TWILIO_USE_MOCK'] = 'true';
			process.env['TWILIO_MOCK_URL'] = 'http://localhost:10000';
		});

		When('the ServiceTwilio instance is created', () => {
			service = new ServiceTwilio();
		});

		Then('it should set useMock to true and use configured mock URL', () => {
			expect(service['useMock']).toBe(true);
			expect(service['mockBaseUrl']).toBe('http://localhost:10000');
		});
	});

	Scenario('Initializing ServiceTwilio in real mode', ({ Given, When, Then }) => {
		Given('TWILIO_USE_MOCK is set to false and credentials are set', () => {
			process.env['TWILIO_USE_MOCK'] = 'false';
			process.env['TWILIO_ACCOUNT_SID'] = 'AC123';
			process.env['TWILIO_AUTH_TOKEN'] = 'test_token';
		});

		When('the ServiceTwilio instance is created', () => {
			service = new ServiceTwilio();
		});

		Then('it should set useMock to false', () => {
			expect(service['useMock']).toBe(false);
		});
	});

	Scenario('Starting up ServiceTwilio in mock mode', ({ Given, When, Then }) => {
		Given('a ServiceTwilio instance configured for mock mode', () => {
			process.env['TWILIO_USE_MOCK'] = 'true';
			process.env['TWILIO_MOCK_URL'] = 'http://localhost:10000';
			service = new ServiceTwilio();
		});

		When('startUp is called', async () => {
			await service.startUp();
		});

		Then('it should create a MockTwilioAPI adapter', () => {
			expect(service['api']).toBeDefined();
			expect(service['mockClient']).toBeDefined();
		});

		Then('it should log "ServiceTwilio started in MOCK mode"', () => {
			expect(logSpy).toHaveBeenCalledWith(
				'ServiceTwilio started in MOCK mode (http://localhost:10000)',
			);
		});

		Then('it should return the service instance', () => {
			expect(service).toBeInstanceOf(ServiceTwilio);
		});
	});

	Scenario('Starting up ServiceTwilio in real mode', ({ Given, When, Then }) => {
		Given('a ServiceTwilio instance configured for real mode', () => {
			process.env['TWILIO_USE_MOCK'] = 'false';
			process.env['TWILIO_ACCOUNT_SID'] = 'AC123';
			process.env['TWILIO_AUTH_TOKEN'] = 'test_token';
			service = new ServiceTwilio();
		});

		When('startUp is called', async () => {
			await service.startUp();
		});

		Then('it should create a RealTwilioAPI adapter', () => {
			expect(service['api']).toBeDefined();
			expect(service['client']).toBeDefined();
		});

		Then('it should log "ServiceTwilio started with real Twilio client"', () => {
			expect(logSpy).toHaveBeenCalledWith(
				'ServiceTwilio started with real Twilio client',
			);
		});

		Then('it should return the service instance', () => {
			expect(service).toBeInstanceOf(ServiceTwilio);
		});
	});

	Scenario(
		'Starting up ServiceTwilio when already started',
		({ Given, When, Then }) => {
			Given('a ServiceTwilio instance that has been started', async () => {
				process.env['TWILIO_USE_MOCK'] = 'true';
				service = new ServiceTwilio();
				await service.startUp();
			});

			When('startUp is called again', () => {
				// Setup for the Then assertion
			});

			Then('it should throw an error "ServiceTwilio is already started"', async () => {
				await expect(service.startUp()).rejects.toThrow(
					'ServiceTwilio is already started',
				);
			});
		},
	);

	Scenario(
		'Starting up in real mode without credentials',
		({ Given, When, Then }) => {
			Given('TWILIO_USE_MOCK is set to "false"', () => {
				process.env['TWILIO_USE_MOCK'] = 'false';
			});

			Given('TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN are not set', () => {
				delete process.env['TWILIO_ACCOUNT_SID'];
				delete process.env['TWILIO_AUTH_TOKEN'];
				service = new ServiceTwilio();
			});

			When('startUp is called', () => {
				// Setup for the Then assertion
			});

			Then('it should throw an error about missing credentials', async () => {
				await expect(service.startUp()).rejects.toThrow(
					'TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment variables',
				);
			});
		},
	);

	Scenario(
		'Shutting down ServiceTwilio when started',
		({ Given, When, Then }) => {
			Given('a started ServiceTwilio instance', async () => {
				process.env['TWILIO_USE_MOCK'] = 'true';
				service = new ServiceTwilio();
				await service.startUp();
			});

			When('shutDown is called', async () => {
				await service.shutDown();
			});

			Then('it should clear the client and mockClient', () => {
				expect(service['client']).toBeUndefined();
				expect(service['mockClient']).toBeUndefined();
			});

			Then('it should log "ServiceTwilio stopped"', () => {
				expect(logSpy).toHaveBeenCalledWith('ServiceTwilio stopped');
			});
		},
	);

	Scenario(
		'Shutting down ServiceTwilio when not started',
		({ Given, When, Then }) => {
			Given('a ServiceTwilio instance that has not been started', () => {
				process.env['TWILIO_USE_MOCK'] = 'true';
				service = new ServiceTwilio();
			});

			When('shutDown is called', () => {
				// Setup for the Then assertion
			});

			Then(
				'it should throw an error "ServiceTwilio is not started - shutdown cannot proceed"',
				async () => {
					await expect(service.shutDown()).rejects.toThrow(
						'ServiceTwilio is not started - shutdown cannot proceed',
					);
				},
			);
		},
	);

	Scenario(
		'Accessing service property in mock mode',
		({ Given, When, Then }) => {
			Given('a started ServiceTwilio instance in mock mode', async () => {
				process.env['TWILIO_USE_MOCK'] = 'true';
				service = new ServiceTwilio();
				await service.startUp();
			});

			When('the service property is accessed', () => {
				// Setup for the Then assertion
			});

			Then('it should return undefined (since mock uses HTTP client)', () => {
				expect(service.service).toBeUndefined();
			});
		},
	);

	Scenario(
		'Accessing service property when not started',
		({ Given, When, Then }) => {
			Given('a ServiceTwilio instance that has not been started', () => {
				process.env['TWILIO_USE_MOCK'] = 'true';
				service = new ServiceTwilio();
			});

			When('the service property is accessed', () => {
				// Setup for the Then assertion
			});

			Then(
				'it should throw an error "ServiceTwilio is not started - cannot access service"',
				() => {
					expect(() => service.service).toThrow(
						'ServiceTwilio is not started - cannot access service',
					);
				},
			);
		},
	);

	Scenario('Getting a conversation via mock API', ({ Given, When, Then }) => {
		let result: ConversationInstance;
		const mockConversation = {
			sid: 'CH123',
			friendly_name: 'Test Conversation',
			date_created: '2025-10-23T10:00:00Z',
			date_updated: '2025-10-23T10:00:00Z',
		};

		Given('a started ServiceTwilio instance in mock mode', async () => {
			process.env['TWILIO_USE_MOCK'] = 'true';
			service = new ServiceTwilio();
			await service.startUp();
		});

		Given('a conversation exists with ID "CH123"', () => {
			vi.mocked(mockAxiosInstance.get).mockResolvedValue({
				data: mockConversation,
			});
		});

		When('getConversation is called with "CH123"', async () => {
			result = await service.getConversation('CH123');
		});

		Then('it should delegate to the mock adapter', () => {
			expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/Conversations/CH123');
		});

		Then('it should return the conversation data', () => {
			expect(result).toEqual({
				sid: 'CH123',
				friendlyName: 'Test Conversation',
				dateCreated: new Date('2025-10-23T10:00:00Z'),
				dateUpdated: new Date('2025-10-23T10:00:00Z'),
			});
		});
	});

	Scenario('Sending a message via mock API', ({ Given, When, Then }) => {
		let result: MessageInstance;
		const mockMessage = {
			sid: 'IM123',
			body: 'Test message',
			author: 'user@example.com',
			date_created: '2025-10-23T10:00:00Z',
		};

		Given('a started ServiceTwilio instance in mock mode', async () => {
			process.env['TWILIO_USE_MOCK'] = 'true';
			service = new ServiceTwilio();
			await service.startUp();
		});

		Given('a conversation exists with ID "CH123"', () => {
			vi.mocked(mockAxiosInstance.post).mockResolvedValue({
				data: mockMessage,
			});
		});

		When('sendMessage is called with conversation ID, body, and author', async () => {
			result = await service.sendMessage('CH123', 'Test message', 'user@example.com');
		});

		Then('it should delegate to the mock adapter', () => {
			expect(mockAxiosInstance.post).toHaveBeenCalledWith(
				'/v1/Conversations/CH123/Messages',
				{ Body: 'Test message', Author: 'user@example.com' },
			);
		});

		Then('it should return the created message data', () => {
			expect(result).toEqual({
				sid: 'IM123',
				body: 'Test message',
				author: 'user@example.com',
				dateCreated: new Date('2025-10-23T10:00:00Z'),
			});
		});
	});

	Scenario('Deleting a conversation via mock API', ({ Given, When, Then }) => {
		Given('a started ServiceTwilio instance in mock mode', async () => {
			process.env['TWILIO_USE_MOCK'] = 'true';
			service = new ServiceTwilio();
			await service.startUp();
		});

		Given('a conversation exists with ID "CH123"', () => {
			vi.mocked(mockAxiosInstance.delete).mockResolvedValue({});
		});

		When('deleteConversation is called with "CH123"', async () => {
			await service.deleteConversation('CH123');
		});

		Then('it should delegate to the mock adapter', () => {
			expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
				'/v1/Conversations/CH123',
			);
		});

		Then('the conversation should be removed', () => {
			expect(mockAxiosInstance.delete).toHaveBeenCalledTimes(1);
		});
	});

	Scenario('Listing conversations via mock API', ({ Given, When, Then }) => {
		let result: ConversationInstance[];
		const mockConversations = {
			conversations: [
				{
					sid: 'CH123',
					friendly_name: 'Conversation 1',
					date_created: '2025-10-23T10:00:00Z',
				},
				{
					sid: 'CH456',
					friendly_name: 'Conversation 2',
					date_created: '2025-10-23T11:00:00Z',
				},
			],
		};

		Given('a started ServiceTwilio instance in mock mode', async () => {
			process.env['TWILIO_USE_MOCK'] = 'true';
			service = new ServiceTwilio();
			await service.startUp();
		});

		Given('multiple conversations exist', () => {
			vi.mocked(mockAxiosInstance.get).mockResolvedValue({
				data: mockConversations,
			});
		});

		When('listConversations is called', async () => {
			result = await service.listConversations();
		});

		Then('it should delegate to the mock adapter', () => {
			expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/Conversations');
		});

		Then('it should return an array of conversations', () => {
			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				sid: 'CH123',
				friendlyName: 'Conversation 1',
				dateCreated: new Date('2025-10-23T10:00:00Z'),
			});
		});
	});

	Scenario('Creating a conversation via mock API', ({ Given, When, Then }) => {
		let result: ConversationInstance;
		const mockConversation = {
			sid: 'CH789',
			friendly_name: 'New Conversation',
			date_created: '2025-10-23T12:00:00Z',
		};

		Given('a started ServiceTwilio instance in mock mode', async () => {
			process.env['TWILIO_USE_MOCK'] = 'true';
			service = new ServiceTwilio();
			await service.startUp();
		});

		When('createConversation is called with friendlyName and uniqueName', async () => {
			vi.mocked(mockAxiosInstance.post).mockResolvedValue({
				data: mockConversation,
			});
			result = await service.createConversation('New Conversation', 'unique-123');
		});

		Then('it should delegate to the mock adapter', () => {
			expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v1/Conversations', {
				FriendlyName: 'New Conversation',
				UniqueName: 'unique-123',
			});
		});

		Then('it should return the created conversation data', () => {
			expect(result).toEqual({
				sid: 'CH789',
				friendlyName: 'New Conversation',
				dateCreated: new Date('2025-10-23T12:00:00Z'),
			});
		});
	});
});
