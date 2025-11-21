import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ServiceMessagingTwilio } from './index';

// Mock the Twilio module
vi.mock('twilio', () => {
	// Mock data must be inside the factory
	const mockConversationData = {
		sid: 'CHtest123',
		accountSid: 'ACtest123',
		friendlyName: 'Test Conversation',
		uniqueName: 'test-conversation',
		dateCreated: new Date('2024-01-01'),
		dateUpdated: new Date('2024-01-02'),
		state: 'active',
	};

	const mockMessageData = {
		sid: 'IMtest123',
		body: 'Test message',
		author: 'test-user',
		dateCreated: new Date('2024-01-01'),
	};

	const mockConversationInstance = {
		fetch: vi.fn().mockResolvedValue(mockConversationData),
		remove: vi.fn().mockResolvedValue(true),
		messages: {
			create: vi.fn().mockResolvedValue(mockMessageData),
			list: vi.fn().mockResolvedValue([mockMessageData]),
		},
	};

	const mockConversationsApi = {
		list: vi.fn().mockResolvedValue([mockConversationData]),
		create: vi.fn().mockResolvedValue({
			...mockConversationData,
			sid: 'CHtest456',
			friendlyName: 'New Conversation',
		}),
	};

	const mockClient = {
		conversations: {
			v1: {
				conversations: Object.assign(
					vi.fn(() => mockConversationInstance),
					mockConversationsApi,
				),
			},
		},
	};

	const TwilioConstructor = vi.fn(() => mockClient);

	return {
		default: {
			Twilio: TwilioConstructor,
		},
		Twilio: TwilioConstructor,
	};
});

describe('ServiceMessagingTwilio', () => {
	const mockAccountSid = 'ACtest123';
	const mockAuthToken = 'test_token';
	let service: ServiceMessagingTwilio;

	beforeEach(() => {
		vi.clearAllMocks();
		process.env['TWILIO_ACCOUNT_SID'] = mockAccountSid;
		process.env['TWILIO_AUTH_TOKEN'] = mockAuthToken;
		process.env['NODE_ENV'] = 'development';
	});

	afterEach(() => {
		delete process.env['TWILIO_ACCOUNT_SID'];
		delete process.env['TWILIO_AUTH_TOKEN'];
		delete process.env['NODE_ENV'];
	});

	describe('Constructor', () => {
		it('should create instance with provided credentials', () => {
			service = new ServiceMessagingTwilio(mockAccountSid, mockAuthToken);
			expect(service).toBeDefined();
		});

		it('should create instance with empty credentials and warn', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();
			service = new ServiceMessagingTwilio('', '');
			expect(service).toBeDefined();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				'ServiceMessagingTwilio: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN not configured. Service will not function until credentials are provided.',
			);
			consoleWarnSpy.mockRestore();
		});
	});

	describe('Service Lifecycle', () => {
		beforeEach(() => {
			service = new ServiceMessagingTwilio(mockAccountSid, mockAuthToken);
		});

		it('should start up successfully in development mode', async () => {
			const result = await service.startUp();
			expect(result).toBe(service);
		});

		it('should not initialize client outside development mode', async () => {
			process.env['NODE_ENV'] = 'production';
			const result = await service.startUp();
			expect(result).toBe(service);
			// In production, client should not be initialized
		});

		it('should throw error if started twice', async () => {
			await service.startUp();
			try {
				await service.startUp();
				expect.fail('Should have thrown error');
			} catch (error) {
				expect((error as Error).message).toBe('ServiceMessagingTwilio is already started');
			}
		});

		it('should shut down successfully', async () => {
			await service.startUp();
			await expect(service.shutDown()).resolves.toBeUndefined();
		});
	});

	describe('Service Access', () => {
		beforeEach(() => {
			service = new ServiceMessagingTwilio(mockAccountSid, mockAuthToken);
		});

		it('should throw error when accessing service before startup', () => {
			expect(() => service.service).toThrow('ServiceMessagingTwilio is not started');
		});

		it('should provide access to Twilio client after startup', async () => {
			await service.startUp();
			expect(service.service).toBeDefined();
		});
	});

	describe('Conversation Operations', () => {
		beforeEach(async () => {
			service = new ServiceMessagingTwilio(mockAccountSid, mockAuthToken);
			await service.startUp();
		});

		it('should list conversations', async () => {
			const conversations = await service.listConversations();
			expect(conversations).toHaveLength(1);
			expect(conversations[0].id).toBe('CHtest123');
			expect(conversations[0].displayName).toBe('Test Conversation');
		});

		it('should create a conversation', async () => {
			const conversation = await service.createConversation('New Conversation', 'new-unique');
			expect(conversation).toBeDefined();
			expect(conversation.id).toBe('CHtest456');
			expect(conversation.displayName).toBe('New Conversation');
		});

		it('should get a conversation by ID', async () => {
			const conversation = await service.getConversation('CHtest123');
			expect(conversation).toBeDefined();
			expect(conversation.id).toBe('CHtest123');
			expect(conversation.displayName).toBe('Test Conversation');
		});

		it('should delete a conversation', async () => {
			await expect(service.deleteConversation('CHtest123')).resolves.toBeUndefined();
		});
	});

	describe('Message Operations', () => {
		beforeEach(async () => {
			service = new ServiceMessagingTwilio(mockAccountSid, mockAuthToken);
			await service.startUp();
		});

		it('should send a message', async () => {
			const message = await service.sendMessage('CHtest123', 'Test message', 'test-user');
			expect(message).toBeDefined();
			expect(message.id).toBe('IMtest123');
			expect(message.body).toBe('Test message');
			expect(message.author).toBe('test-user');
		});

		it('should get messages for a conversation', async () => {
			const messages = await service.getMessages('CHtest123');
			expect(messages).toHaveLength(1);
			expect(messages[0].id).toBe('IMtest123');
			expect(messages[0].body).toBe('Test message');
		});
	});


});
