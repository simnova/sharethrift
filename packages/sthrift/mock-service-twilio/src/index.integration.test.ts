import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';
import { MockServiceTwilio } from './index.ts';
import { startServer, stopServer } from '@sthrift/mock-twilio-server';

/**
 * Integration Tests for MockServiceTwilio with Mock Server
 * 
 * These tests automatically start and stop the mock Twilio server.
 */

describe('MockServiceTwilio Integration Tests', () => {
	let service: MockServiceTwilio;
	let mockServer: Server;
	const originalEnv = { ...process.env };
	const MOCK_SERVER_PORT = 10000;
	const MOCK_SERVER_URL = `http://localhost:${MOCK_SERVER_PORT}`;

	beforeAll(async () => {
		// Configure for mock mode
		process.env['TWILIO_MOCK_URL'] = MOCK_SERVER_URL;
		
		// Start the mock server with seeded data
		mockServer = await startServer(MOCK_SERVER_PORT, true);
		
		// Wait for server to be fully ready
		await new Promise((resolve) => setTimeout(resolve, 500));
	}, 15000);

	afterAll(async () => {
		// Stop the mock server
		if (mockServer) {
			await stopServer(mockServer);
		}
		
		// Restore original environment
		process.env = originalEnv;
	}, 10000);

	describe('Service Lifecycle', () => {
		it('should start up successfully in mock mode', async () => {
			service = new MockServiceTwilio(MOCK_SERVER_URL);
			await service.startUp();
			expect(service).toBeDefined();
			await service.shutDown();
		});

		it('should throw error when starting up twice', async () => {
			service = new MockServiceTwilio(MOCK_SERVER_URL);
			await service.startUp();
			await expect(service.startUp()).rejects.toThrow(
				'MockServiceTwilio is already started',
			);
			await service.shutDown();
		});

		it('should throw error when shutting down without starting', async () => {
			service = new MockServiceTwilio(MOCK_SERVER_URL);
			await expect(service.shutDown()).rejects.toThrow(
				'MockServiceTwilio is not started - shutdown cannot proceed',
			);
		});
	});

	describe('Conversation Operations - Seeded Data', () => {
		let conversationId: string;

		beforeAll(async () => {
			service = new MockServiceTwilio(MOCK_SERVER_URL);
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
			service = new MockServiceTwilio(MOCK_SERVER_URL);
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
			service = new MockServiceTwilio(MOCK_SERVER_URL);
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
			service = new MockServiceTwilio(MOCK_SERVER_URL);
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
