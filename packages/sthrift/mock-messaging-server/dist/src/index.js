import express from 'express';
import { config } from 'dotenv';
import { setupConversationRoutes } from "./routes/conversations.js";
import { setupMessageRoutes } from "./routes/messages.js";
import { setupParticipantRoutes } from "./routes/participants.js";
import { setupMockUtilRoutes } from "./routes/mock-utils.js";
import { seedMockData } from "./seed/seed-data.js";
config();
export function createApp() {
    const app = express();
    app.disable('x-powered-by');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
    app.get('/', (_req, res) => {
        res.json({
            service: 'Mock Twilio Server',
            status: 'running',
            version: '1.0.0',
            endpoints: {
                conversations: '/v1/Conversations',
                messages: '/v1/Conversations/:conversationSid/Messages',
                participants: '/v1/Conversations/:conversationSid/Participants',
                mockUtils: '/mock/*',
            },
        });
    });
    const router = express.Router();
    setupConversationRoutes(router);
    setupMessageRoutes(router);
    setupParticipantRoutes(router);
    setupMockUtilRoutes(router);
    app.use(router);
    app.use((_req, res) => {
        res.status(404).json({
            status: 404,
            message: 'The requested resource was not found',
            code: 20404,
            more_info: 'https://www.twilio.com/docs/errors/20404',
        });
    });
    app.use((err, _req, res) => {
        console.error('Unhandled error:', err);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: err.message,
        });
    });
    return app;
}
export function startServer(port = 10000, seedData = false) {
    return new Promise((resolve) => {
        const app = createApp();
        const server = app.listen(port, () => {
            console.log(`Mock Twilio Server listening on port ${port}`);
            if (seedData) {
                seedMockData();
            }
            else {
                console.log('Starting with empty data store (set seedData=true to seed)');
            }
            resolve(server);
        });
    });
}
export function stopServer(server) {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log('Mock Twilio Server stopped');
                resolve();
            }
        });
    });
}
// Start server when run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
    // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
    const port = Number(process.env['PORT'] ?? 10000);
    // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
    const shouldSeed = process.env['SEED_DATA'] === 'true';
    startServer(port, shouldSeed);
}
//# sourceMappingURL=index.js.map