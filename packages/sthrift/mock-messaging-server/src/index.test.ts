import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';
import type { Server } from 'node:http';
import { createApp, startServer, stopServer } from './index.ts';
import fs from 'node:fs';

// Valid self-signed cert and key for testing
const MOCK_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFSYieiqhnLDww
8PNRgxYqntovNdGLVrqFvBT7yNQjTMrdAx6WD4Zq66/m6FYhENHU+KRV1k5HK32z
HcIjte5+Vo1OjonXaZFmiwHfxwfK6dLcuzKJiswi4S/kr8AmXyN1clusYcQfS3JJ
ytl4leeuZC0dZOUWrFKVfOdYRnGx+74MzNQjjemhooiso8p4EjoOv6XrLap7CJrr
KTz40/UcXSdYpK2VCuqIsxB6+GHOoklDsngyFpS4XUJxo60ANvR23NUU1gfdFyXo
JqqOWvCDIYu+INSxxSdRcdXFHGqd5O5E1E5cfbxzjwD9CLcYutueG3TOQ7eX2pZ+
B/VRRZXvAgMBAAECggEADP7cBf2CPFGYoWytynfFFQejvapg5DnRTY/nHfLLrouX
bVmQQThClXZy/tXdHo56E/pQ8OqN+3gs7oiOSkXosN/IrR0MjWkBz+xmMjRtGfuv
DSUzngXLjpygyAKfuKdZsZnX2hISljElFSFMk/nj6gPlSONlh8nQItK4doMlaCDc
Vr/yuzyvmNoGKICYDdWE1elXlhVqaxapQgTSfVocJCiQcuSbo7zocbxUStUdv+Vf
8bIb4hJmQnFx1/KOx3PAhzjlwzGPDCaU8Iu7ZGfWwVFBk4EDt2KmO0lcL6Mf0kDj
1OZ/71b/HVrwm0oWel3udHrcLWVy0ttxONg7KTy9iQKBgQD2nY7JfWHlr2bVwts1
t3aWOcVKjYVWZOqQA4cj1OQ6qzZweD35Comt+nMbBYP85LAkIU2RuN4WW8eoF3TT
stE+R2hryBJSlZvLf6gqBuXMBKziKneQ2oxufqSs7Gfh4ZRn2loilx9RFU+nnykj
pJINF1KRXU9P9xWyBC0rXHz7UwKBgQDMy3AA2oJtDdSTKAEe5aMDR7a5kan1iBaM
2d7pCZJNBEsHjq6LuMk3auuSmGruT+9tPVA6uo2R8KzU6viLvJ0KRmD2MTrjQRlx
WZHloNMQnnovBFs2akPVeCe+Gxpxw5D6xpxHS79ocQre1qCNrLUuc0GVzT+Vr7Jy
AlZe5CBDdQKBgCBar17z2iIeDunAdK3pcd9nmOCdDH83Iiber54d0gt4Zt3+iHLh
1QpEL1G+OYC2J/21eM3DaS+ZvunomeUkMptvFt39E5pOEnByQQeye/d2LZBGbgVN
BtuANe6R3VcfFy9A0E51cSBcIWUmVmlcr+STyLtVeJBPJEOElMB5k9QNAoGBAMcl
5arO0hoeYuMe+cgD4vtjl2rpHW9ogRVDIKNY7W37iMK2m0G/1dwQGziZAxLvpJKE
FyqlEtoiQs9iF4Q7TDMbsVp3ER7AxW8WfOvh8p2snoBuKgzGVWSWzX7ueE68sJVM
4dfq7x0vIDUGXWan1iBvcA2uY/C5xDtdzoPELyOpAoGBAIxe6FdBNySitlAQp5OT
xixJoyBv+uHeg09uQ222qVSXU1TCkBp0Id6Fn0iBdg1GDCj0Gq08Mb3Q9P8tpMmp
z0PNSIe/ZK8Om8Rc6942eIx0e7rgN3fAbTrmP6l3Gl46DNtlb8JH+GOmtICut05M
BEg7ggPvvZ7wHxBYPFeY9/cK
-----END PRIVATE KEY-----`;

const MOCK_CERT = `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIUVgWCVfLx1ArPfZmUbfoeyLD34wkwDQYJKoZIhvcNAQEL
BQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTI2MDEwODE4NDcyNFoXDTI3MDEw
ODE4NDcyNFowFDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAxUmInoqoZyw8MPDzUYMWKp7aLzXRi1a6hbwU+8jUI0zK
3QMelg+Gauuv5uhWIRDR1PikVdZORyt9sx3CI7XuflaNTo6J12mRZosB38cHyunS
3LsyiYrMIuEv5K/AJl8jdXJbrGHEH0tyScrZeJXnrmQtHWTlFqxSlXznWEZxsfu+
DMzUI43poaKIrKPKeBI6Dr+l6y2qewia6yk8+NP1HF0nWKStlQrqiLMQevhhzqJJ
Q7J4MhaUuF1CcaOtADb0dtzVFNYH3Rcl6CaqjlrwgyGLviDUscUnUXHVxRxqneTu
RNROXH28c48A/Qi3GLrbnht0zkO3l9qWfgf1UUWV7wIDAQABo1MwUTAdBgNVHQ4E
FgQU6Ooc/GJXV9mXVTn7LVvWqD43gRQwHwYDVR0jBBgwFoAU6Ooc/GJXV9mXVTn7
LVvWqD43gRQwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAVEva
cdM/DaEiLWX3m2TYOpU/Qxw1njhuetBBK0ILzKF6rz3A0RkCsDON41vKPNTAcx3u
DE/Ynelt+HcIjmAoHBHV3hEoXQAhyDNjUQLJOhnxDOcoC2Y4Xl8lKWj/JuuX1iBs
6TMCuAXj4con/MLG28d++1HyjLl7mT79nUzv30ZSXWReXGSyOZYJT/wTIcpuapoq
pCtKd7I3v4hIKNSDpsLlDN3lGOg4vj488qfvzC9Zf07jEYk8ywHM67OrQPArncsI
rRuhZXNd608lqMHzCBLOFI+l0D/PHccjUtAZltBS2wwb8Q+P85HSAbYmCYb3enjQ
fp5DXVuJr+fl+MyXqg==
-----END CERTIFICATE-----`;

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
            // Mock fs.existsSync to return true for certs
            const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
            const readFileSyncSpy = vi.spyOn(fs, 'readFileSync')
                .mockImplementation((path) => {
                    if (path.toString().includes('-key.pem')) {
                        return Buffer.from(MOCK_KEY);
                    }
                    return Buffer.from(MOCK_CERT);
                });

            const server = await startServer(10007, false);
            expect(server).toBeDefined();
            
            const address = server.address();
            expect(address).not.toBeNull();
            expect(typeof address).toBe('object');
            if (address && typeof address === 'object') {
                expect(address.port).toBe(10007);
            }
            
            await stopServer(server);
            
            existsSyncSpy.mockRestore();
            readFileSyncSpy.mockRestore();
        });

        it('should fallback to HTTP when certificates do not exist', async () => {
            // Mock fs.existsSync to return false for certs
            const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(false);

            const server = await startServer(10008, false);
            expect(server).toBeDefined();
            
            const address = server.address();
            expect(address).not.toBeNull();
            expect(typeof address).toBe('object');
            if (address && typeof address === 'object') {
                expect(address.port).toBe(10008);
            }
            
            await stopServer(server);
            
            existsSyncSpy.mockRestore();
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