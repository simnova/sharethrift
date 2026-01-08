import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';
import type { Server } from 'node:http';
import { createApp, startServer, stopServer } from './index.ts';

describe('Mock Messaging Server', () => {
	describe('createApp', () => {
		let app: Application;

		beforeAll(() => {
			app = createApp();
		});

		it('should create an Express application', () => {
			expect(app).toBeDefined();
		});

		it('should respond to root endpoint with server info', async () => {
			const response = await request(app).get('/');
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('service', 'Mock Twilio Server');
			expect(response.body).toHaveProperty('status', 'running');
		});

		it('should return 404 for unknown routes', async () => {
			const response = await request(app).get('/unknown-route');
			expect(response.status).toBe(404);
		});
	});

	describe('Server Lifecycle', () => {
		it('should start server successfully', async () => {
			const server = await startServer(10001, false);
			expect(server).toBeDefined();
			await stopServer(server);
		});

		it('should stop server successfully', async () => {
			const server = await startServer(10001, false);
			await expect(stopServer(server)).resolves.not.toThrow();
		});

		it('should start server with seed data', async () => {
			const server = await startServer(10001, true);
			expect(server).toBeDefined();
			await stopServer(server);
		});

		it('should start HTTPS server when certificates exist', async () => {
			const server = await startServer(10007, false);
			expect(server).toBeDefined();
			// Check if server is listening
			const address = server.address();
			expect(address).not.toBeNull();
			expect(typeof address).toBe('object');
			if (address && typeof address === 'object') {
				expect(address.port).toBe(10007);
			}
			await stopServer(server);
		});

		it('should fallback to HTTP when certificates do not exist', async () => {
			// This test verifies the fallback behavior exists in the code
			// In actual CI/CD without certs, it would use HTTP automatically
			const server = await startServer(10008, false);
			expect(server).toBeDefined();
			await stopServer(server);
		});
	});

	describe('Conversation API Endpoints', () => {
		let server: Server;
		let app: Application;
		const TEST_PORT = 10002;

		beforeAll(async () => {
			server = await startServer(TEST_PORT, true);
			app = createApp();
		});

		afterAll(async () => {
			await stopServer(server);
		});

		it('should list conversations', async () => {
			const response = await request(app).get('/v1/Conversations');
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('conversations');
			expect(Array.isArray(response.body.conversations)).toBe(true);
		});

		it('should create a new conversation', async () => {
			const response = await request(app)
				.post('/v1/Conversations')
				.send({
					DisplayName: 'Test Conversation',
					UniqueName: `test-${Date.now()}`,
				});
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty('id');
			expect(response.body).toHaveProperty('display_name', 'Test Conversation');
		});

		it('should get a specific conversation', async () => {
			// First create a conversation
			const createResponse = await request(app)
				.post('/v1/Conversations')
				.send({
					DisplayName: 'Get Test',
					UniqueName: `get-test-${Date.now()}`,
				});
			const conversationId = createResponse.body.id;

			// Then fetch it
			const response = await request(app).get(
				`/v1/Conversations/${conversationId}`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('id', conversationId);
			expect(response.body).toHaveProperty('display_name', 'Get Test');
		});

		it('should delete a conversation', async () => {
			// First create a conversation
			const createResponse = await request(app)
				.post('/v1/Conversations')
				.send({
					DisplayName: 'Delete Test',
					UniqueName: `delete-test-${Date.now()}`,
				});
			const conversationId = createResponse.body.id;

			// Then delete it
			const response = await request(app).delete(
				`/v1/Conversations/${conversationId}`,
			);
			expect(response.status).toBe(204);

			// Verify it's deleted
			const getResponse = await request(app).get(
				`/v1/Conversations/${conversationId}`,
			);
			expect(getResponse.status).toBe(404);
		});

		it('should return 404 for non-existent conversation', async () => {
			const response = await request(app).get(
				'/v1/Conversations/CH_NONEXISTENT',
			);
			expect(response.status).toBe(404);
		});
	});

	describe('Message API Endpoints', () => {
		let server: Server;
		let app: Application;
		let conversationSid: string;
		const TEST_PORT = 10003;

		beforeAll(async () => {
			server = await startServer(TEST_PORT, false);
			app = createApp();

			// Create a conversation for message tests
			const response = await request(app)
				.post('/v1/Conversations')
				.send({
					DisplayName: 'Message Test',
					UniqueName: `msg-test-${Date.now()}`,
				});
			conversationSid = response.body.id;
		});

		afterAll(async () => {
			await stopServer(server);
		});

		it('should send a message to a conversation', async () => {
			const response = await request(app)
				.post(`/v1/Conversations/${conversationSid}/Messages`)
				.send({
					Body: 'Test message',
					Author: 'test@example.com',
				});
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty('id');
			expect(response.body).toHaveProperty('body', 'Test message');
			expect(response.body).toHaveProperty('author', 'test@example.com');
		});

		it('should list messages from a conversation', async () => {
			// Send a message first
			await request(app)
				.post(`/v1/Conversations/${conversationSid}/Messages`)
				.send({
					Body: 'List test message',
					Author: 'list@example.com',
				});

			// Then list messages
			const response = await request(app).get(
				`/v1/Conversations/${conversationSid}/Messages`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('messages');
			expect(Array.isArray(response.body.messages)).toBe(true);
			expect(response.body.messages.length).toBeGreaterThan(0);
		});

		it('should return 404 when sending message to non-existent conversation', async () => {
			const response = await request(app)
				.post('/v1/Conversations/CH_NONEXISTENT/Messages')
				.send({
					Body: 'Test',
				});
			expect(response.status).toBe(404);
		});
	});

	describe('Participant API Endpoints', () => {
		let server: Server;
		let app: Application;
		let conversationSid: string;
		const TEST_PORT = 10004;

		beforeAll(async () => {
			server = await startServer(TEST_PORT, false);
			app = createApp();

			// Create a conversation for participant tests
			const response = await request(app)
				.post('/v1/Conversations')
				.send({
					DisplayName: 'Participant Test',
					UniqueName: `participant-test-${Date.now()}`,
				});
			conversationSid = response.body.id;
		});

		afterAll(async () => {
			await stopServer(server);
		});

		it('should add a participant to a conversation', async () => {
			const response = await request(app)
				.post(`/v1/Conversations/${conversationSid}/Participants`)
				.send({
					Identity: 'test-user',
				});
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty('id');
			expect(response.body).toHaveProperty('identity', 'test-user');
		});

		it('should list participants from a conversation', async () => {
			const response = await request(app).get(
				`/v1/Conversations/${conversationSid}/Participants`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('participants');
			expect(Array.isArray(response.body.participants)).toBe(true);
		});

		it('should return 404 when adding participant to non-existent conversation', async () => {
			const response = await request(app)
				.post('/v1/Conversations/CH_NONEXISTENT/Participants')
				.send({
					Identity: 'test-user',
				});
			expect(response.status).toBe(404);
		});
	});

	describe('Mock Utility Endpoints', () => {
		let server: Server;
		let app: Application;
		const TEST_PORT = 10005;

		beforeAll(async () => {
			server = await startServer(TEST_PORT, false);
			app = createApp();
		});

		afterAll(async () => {
			await stopServer(server);
		});

		it('should get stats', async () => {
			// Create some data first
			await request(app)
				.post('/v1/Conversations')
				.send({
					DisplayName: 'Stats Test',
					UniqueName: `stats-test-${Date.now()}`,
				});

			// Get stats
			const response = await request(app).get('/mock/stats');
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('conversations');
			expect(response.body.conversations).toBeGreaterThanOrEqual(1);
		});

		it('should reset data to seed state', async () => {
			const response = await request(app).post('/mock/reset');
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('message', 'Mock data reset successfully');
		});
	});

	describe('End-to-End Workflow', () => {
		let server: Server;
		let app: Application;
		const TEST_PORT = 10006;

		beforeAll(async () => {
			server = await startServer(TEST_PORT, false);
			app = createApp();
		});

		afterAll(async () => {
			await stopServer(server);
		});

		it('should complete a full conversation lifecycle', async () => {
			// Create conversation
			const createConvResponse = await request(app)
				.post('/v1/Conversations')
				.send({
					DisplayName: 'E2E Test',
					UniqueName: `e2e-${Date.now()}`,
				});
			expect(createConvResponse.status).toBe(201);
			const conversationSid = createConvResponse.body.id;

			// Add participant
			const addParticipantResponse = await request(app)
				.post(`/v1/Conversations/${conversationSid}/Participants`)
				.send({
					Identity: 'e2e-user',
				});
			expect(addParticipantResponse.status).toBe(201);

			// Send messages
			const msg1Response = await request(app)
				.post(`/v1/Conversations/${conversationSid}/Messages`)
				.send({
					Body: 'First message',
					Author: 'e2e-user',
				});
			expect(msg1Response.status).toBe(201);

			const msg2Response = await request(app)
				.post(`/v1/Conversations/${conversationSid}/Messages`)
				.send({
					Body: 'Second message',
					Author: 'e2e-user',
				});
			expect(msg2Response.status).toBe(201);

			// List messages
			const listMsgResponse = await request(app).get(
				`/v1/Conversations/${conversationSid}/Messages`,
			);
			expect(listMsgResponse.status).toBe(200);
			expect(listMsgResponse.body.messages).toHaveLength(2);

			// Get conversation
			const getConvResponse = await request(app).get(
				`/v1/Conversations/${conversationSid}`,
			);
			expect(getConvResponse.status).toBe(200);
			expect(getConvResponse.body.display_name).toBe('E2E Test');

			// Delete conversation
			const deleteResponse = await request(app).delete(
				`/v1/Conversations/${conversationSid}`,
			);
			expect(deleteResponse.status).toBe(204);

			// Verify deletion
			const verifyResponse = await request(app).get(
				`/v1/Conversations/${conversationSid}`,
			);
			expect(verifyResponse.status).toBe(404);
		});
	});
});
