import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ServiceTwilio } from './index.ts';

/**
 * Integration Tests for ServiceTwilio with Mock Server
 * 
 * These tests require the mock-twilio-server to be running.
 * Start it with: pnpm --filter @sthrift/mock-twilio-server run dev
 * 
 * Set SEED_DATA=true to use pre-seeded conversations
 * Set SEED_DATA=false to test with a fresh (empty) server
 */

describe('ServiceTwilio Integration Tests - Mock Server', () => {
	let service: ServiceTwilio;
	const originalEnv = { ...process.env };

	beforeAll(() => {
		// Configure for mock mode
		process.env['TWILIO_USE_MOCK'] = 'true';
		process.env['TWILIO_MOCK_URL'] = 'http://localhost:10000';
	});

	afterAll(() => {
		// Restore original environment
		process.env = originalEnv;
	});

	describe('Service Lifecycle', () => {
		it('should start up successfully in mock mode', async () => {
			service = new ServiceTwilio();
			await service.startUp();
			expect(service).toBeDefined();
			await service.shutDown();
		});

		it('should throw error when starting up twice', async () => {
			service = new ServiceTwilio();
			await service.startUp();
			await expect(service.startUp()).rejects.toThrow(
				'ServiceTwilio is already started',
			);
			await service.shutDown();
		});

		it('should throw error when shutting down without starting', async () => {
			service = new ServiceTwilio();
			await expect(service.shutDown()).rejects.toThrow(
				'ServiceTwilio is not started - shutdown cannot proceed',
			);
		});
	});

	describe('Conversation Operations - Seeded Data', () => {
		let conversationId: string;

		beforeAll(async () => {
			service = new ServiceTwilio();
			await service.startUp();
		});

		afterAll(async () => {
			await service.shutDown();
		});

		it('should list conversations from seeded data', async () => {
			const conversations = await service.listConversations();
			expect(Array.isArray(conversations)).toBe(true);
			expect(conversations.length).toBeGreaterThan(0);

			// Verify structure of first conversation
			const firstConv = conversations[0];
			if (!firstConv) {
				throw new Error('No conversations found in seed data');
			}
			expect(firstConv).toHaveProperty('sid');
			expect(firstConv).toHaveProperty('friendlyName');
			expect(typeof firstConv.sid).toBe('string');
		});

		it('should get a specific conversation by ID', async () => {
			// First get a list to find a valid ID
			const conversations = await service.listConversations();
			expect(conversations.length).toBeGreaterThan(0);
			const firstConv = conversations[0];
			if (!firstConv) {
				throw new Error('No conversations found');
			}
			conversationId = firstConv.sid;

			const conversation = await service.getConversation(conversationId);
			expect(conversation).toBeDefined();
			expect(conversation.sid).toBe(conversationId);
			expect(conversation).toHaveProperty('friendlyName');
		});

		it('should send a message to an existing conversation', async () => {
			// Use conversation from previous test
			const conversations = await service.listConversations();
			const firstConv = conversations[0];
			if (!firstConv) {
				throw new Error('No conversations found');
			}
			const testConvId = firstConv.sid;

			const message = await service.sendMessage(
				testConvId,
				'Integration test message',
				'test@example.com',
			);

			expect(message).toBeDefined();
			expect(message).toHaveProperty('sid');
			expect(message.body).toBe('Integration test message');
			expect(message.author).toBe('test@example.com');
		});
	});

	describe('Conversation Operations - Create and Delete', () => {
		let createdConversationId: string;

		beforeAll(async () => {
			service = new ServiceTwilio();
			await service.startUp();
		});

		afterAll(async () => {
			await service.shutDown();
		});

		it('should create a new conversation', async () => {
			const uniqueName = `test-conv-${Date.now()}`;
			const conversation = await service.createConversation(
				'Test Conversation',
				uniqueName,
			);

			expect(conversation).toBeDefined();
			expect(conversation).toHaveProperty('sid');
			expect(conversation.friendlyName).toBe('Test Conversation');
			expect(conversation).toHaveProperty('dateCreated');

			createdConversationId = conversation.sid;
		});

		it('should delete a conversation', async () => {
			// Delete the conversation created in previous test
			await expect(
				service.deleteConversation(createdConversationId),
			).resolves.not.toThrow();

			// Verify it's deleted by trying to get it (should fail)
			await expect(service.getConversation(createdConversationId)).rejects.toThrow();
		});
	});

	describe('End-to-End Workflow', () => {
		beforeAll(async () => {
			service = new ServiceTwilio();
			await service.startUp();
		});

		afterAll(async () => {
			await service.shutDown();
		});

		it('should complete a full conversation lifecycle', async () => {
			// 1. Create a conversation
			const uniqueName = `e2e-test-${Date.now()}`;
			const conversation = await service.createConversation(
				'E2E Test Conversation',
				uniqueName,
			);
			expect(conversation.sid).toBeDefined();

			// 2. Send a message
			const message1 = await service.sendMessage(
				conversation.sid,
				'First message',
				'user1@example.com',
			);
			expect(message1.body).toBe('First message');

			// 3. Send another message
			const message2 = await service.sendMessage(
				conversation.sid,
				'Second message',
				'user2@example.com',
			);
			expect(message2.body).toBe('Second message');
			expect(message2.author).toBe('user2@example.com');

			// 4. Get the conversation and verify it exists
			const fetchedConv = await service.getConversation(conversation.sid);
			expect(fetchedConv.sid).toBe(conversation.sid);
			expect(fetchedConv.friendlyName).toBe('E2E Test Conversation');

			// 5. Delete the conversation
			await service.deleteConversation(conversation.sid);

			// 6. Verify deletion
			await expect(service.getConversation(conversation.sid)).rejects.toThrow();
		});
	});

	describe('Error Handling', () => {
		beforeAll(async () => {
			service = new ServiceTwilio();
			await service.startUp();
		});

		afterAll(async () => {
			await service.shutDown();
		});

		it('should handle getting a non-existent conversation', async () => {
			await expect(service.getConversation('CH_NONEXISTENT')).rejects.toThrow();
		});

		it('should handle sending a message to non-existent conversation', async () => {
			await expect(
				service.sendMessage('CH_NONEXISTENT', 'test message'),
			).rejects.toThrow();
		});

		it('should handle deleting a non-existent conversation', async () => {
			await expect(service.deleteConversation('CH_NONEXISTENT')).rejects.toThrow();
		});
	});
});

describe('ServiceTwilio Integration Tests - Real Twilio (Optional)', () => {
	/**
	 * These tests are skipped by default. To run them:
	 * 1. Set TWILIO_USE_MOCK=false
	 * 2. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
	 * 3. Run: SKIP_REAL_TESTS=false pnpm test
	 */
	const skipRealTests = process.env['SKIP_REAL_TESTS'] !== 'false';

	describe.skipIf(skipRealTests)('Real Twilio API', () => {
		let service: ServiceTwilio;
		const originalEnv = { ...process.env };

		beforeAll(() => {
			process.env['TWILIO_USE_MOCK'] = 'false';
		});

		afterAll(() => {
			process.env = originalEnv;
		});

		it('should start up with real Twilio credentials', async () => {
			service = new ServiceTwilio();
			await service.startUp();
			expect(service).toBeDefined();
			expect(service.service).toBeDefined(); // Real client should be available
			await service.shutDown();
		});

		it('should list real conversations', async () => {
			service = new ServiceTwilio();
			await service.startUp();
			const conversations = await service.listConversations();
			expect(Array.isArray(conversations)).toBe(true);
			await service.shutDown();
		});
	});
});
