import type { Application } from 'express';
import type { Server } from 'node:http';
export declare function createApp(): Application;
export declare function startServer(port?: number, seedData?: boolean): Promise<Server>;
export declare function stopServer(server: Server): Promise<void>;
