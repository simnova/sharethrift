import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { spawn, type ChildProcess } from 'node:child_process';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const execAsync = promisify(exec);
import type { IWorld } from '@cucumber/cucumber';
import { ShareThriftWorld } from './world.js';

setDefaultTimeout(60000);

let mongoServerProcess: ChildProcess | undefined;
let graphqlServerProcess: ChildProcess | undefined;
let uiServerProcess: ChildProcess | undefined;
let serversStarted = false;

async function killProcessOnPort(port: number): Promise<void> {
	try {
		const { stdout } = await execAsync(`lsof -ti:${port}`);
		const pids = stdout.trim().split('\n').filter(Boolean);
		for (const pid of pids) {
			try {
				await execAsync(`kill -9 ${pid}`);
				console.log(`Killed process ${pid} on port ${port}`);
			} catch {
				// Process already dead
			}
		}
	} catch {
		// No process on port
	}
}

BeforeAll({ timeout: 60000 }, async function () {
	if (serversStarted) return;

	// Kill any existing processes on our ports
	await killProcessOnPort(50000); // MongoDB
	await killProcessOnPort(7071); // GraphQL API
	await killProcessOnPort(3000); // UI

	console.log('Starting MongoDB Memory Server...');
	mongoServerProcess = spawn('pnpm', ['--filter', '@sthrift/mock-mongodb-memory-server', 'start'], {
		cwd: process.cwd() + '/../..',
		stdio: 'pipe',
		env: {
			...process.env,
			PORT: '50000',
			DB_NAME: 'sharethrift-test',
			REPL_SET_NAME: 'rs0',
		},
	});

	let mongoReady = false;
	mongoServerProcess.stdout?.on('data', (data) => {
		const output = data.toString().trim();
		console.log(`[MongoDB] ${output}`);
		if (output.includes('MongoDB Memory Replica Set ready at:')) {
			mongoReady = true;
		}
	});

	mongoServerProcess.stderr?.on('data', (data) => {
		console.error(`[MongoDB Error] ${data.toString().trim()}`);
	});

	// Wait for MongoDB replica set to start (not collection seeding - API will create those)
	console.log('Waiting for MongoDB Memory Server to start...');
	while (!mongoReady) {
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
	console.log('MongoDB Memory Server started!');

	console.log('Starting Azure Functions (GraphQL API)...');
	graphqlServerProcess = spawn('pnpm', ['--filter', '@sthrift/api', 'start'], {
		cwd: process.cwd() + '/../..',
		stdio: 'pipe',
		env: {
			...process.env,
			DB_CONNECTION_STRING: 'mongodb://127.0.0.1:50000/sharethrift-test?replicaSet=rs0',
		},
	});

	graphqlServerProcess.stdout?.on('data', (data) => {
		console.log(`[GraphQL] ${data.toString().trim()}`);
	});

	graphqlServerProcess.stderr?.on('data', (data) => {
		console.error(`[GraphQL Error] ${data.toString().trim()}`);
	});

	// Wait for Azure Functions to be ready
	await new Promise<void>((resolve) => {
		const checkReady = (data: Buffer) => {
			const output = data.toString();
			if (output.includes('Host started') || output.includes('Worker process started')) {
				graphqlServerProcess?.stdout?.off('data', checkReady);
				graphqlServerProcess?.stderr?.off('data', checkReady);
				resolve();
			}
		};
		graphqlServerProcess?.stdout?.on('data', checkReady);
		graphqlServerProcess?.stderr?.on('data', checkReady);
	});

	// Give it a moment to fully initialize
	await new Promise((resolve) => setTimeout(resolve, 2000));

	serversStarted = true;
	console.log('All servers ready!');
});

AfterAll(async function () {
	console.log('Stopping servers...');

	if (graphqlServerProcess) {
		graphqlServerProcess.kill('SIGTERM');
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (!graphqlServerProcess.killed) {
			graphqlServerProcess.kill('SIGKILL');
		}
	}

	if (uiServerProcess) {
		uiServerProcess.kill('SIGTERM');
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (!uiServerProcess.killed) {
			uiServerProcess.kill('SIGKILL');
		}
	}

	if (mongoServerProcess) {
		mongoServerProcess.kill('SIGTERM');
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (!mongoServerProcess.killed) {
			mongoServerProcess.kill('SIGKILL');
		}
	}

	// Final cleanup
	await killProcessOnPort(7071);
	await killProcessOnPort(3000);
	await killProcessOnPort(50000);

	console.log('All servers stopped.');
});

/**
 * Reset domain state before each scenario
 */
Before(async function (this: IWorld) {
	const world = this as unknown as ShareThriftWorld;
	
	if (world.level === 'domain') {
		// TODO: Reset domain storage if needed
	}
});

/**
 * Clean up after each scenario
 */
After(async function (this: IWorld) {
	// Clear any stored errors
	(this as any).lastError = undefined;
	(this as any).lastListing = undefined;
});
