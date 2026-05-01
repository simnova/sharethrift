import { type ChildProcess, spawn } from 'node:child_process';
import { getPortlessPath } from './resolve-portless.ts';

// Base class for portless-proxied servers
export abstract class PortlessServer {
	private process: ChildProcess | null = null;
	private startedByUs = false;
	private static readonly maxStartupAttempts = 3;

	protected abstract get probeUrl(): string;
	protected abstract get readyMarker(): string;
	protected abstract get serverName(): string;
	protected abstract get startupTimeoutMs(): number;
	protected abstract get spawnArgs(): string[];
	protected abstract get cwd(): string;
	protected get shouldWaitForProbe(): boolean {
		return true;
	}
	protected get extraEnv(): Record<string, string> {
		return {};
	}

	async isAlreadyRunning(): Promise<boolean> {
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 3_000);
			const res = await fetch(this.probeUrl, { signal: controller.signal });
			clearTimeout(timeout);
			return res.ok;
		} catch {
			return false;
		}
	}

	async start(): Promise<void> {
		if (this.process || this.startedByUs) return;
		if (await this.isAlreadyRunning()) return;

		for (
			let attempt = 1;
			attempt <= PortlessServer.maxStartupAttempts;
			attempt++
		) {
			this.process = spawn(getPortlessPath(), this.spawnArgs, {
				cwd: this.cwd,
				env: {
					...process.env,
					...this.extraEnv,
				},
				stdio: ['ignore', 'pipe', 'pipe'],
			});
			this.startedByUs = true;

			try {
				await this.waitForReady();
				if (this.shouldWaitForProbe) {
					await this.waitForProbe();
				}
				return;
			} catch (error) {
				if (
					error instanceof Error &&
					error.message.includes('already registered by a running process')
				) {
					this.process = null;
					this.startedByUs = false;
					return;
				}

				if (
					attempt < PortlessServer.maxStartupAttempts &&
					error instanceof Error &&
					error.message.includes('Port') &&
					error.message.includes('is unavailable')
				) {
					this.process = null;
					this.startedByUs = false;
					await new Promise((resolve) => setTimeout(resolve, 250));
					continue;
				}

				throw error;
			}
		}
	}

	async stop(): Promise<void> {
		if (!this.process || !this.startedByUs) return;

		const proc = this.process;
		this.process = null;
		this.startedByUs = false;

		proc.kill('SIGTERM');

		await new Promise<void>((resolve) => {
			const timeout = setTimeout(() => {
				proc.kill('SIGKILL');
				resolve();
			}, 10_000);

			proc.on('exit', () => {
				clearTimeout(timeout);
				resolve();
			});
		});
	}

	isRunning(): boolean {
		return this.process !== null;
	}

	private waitForReady(): Promise<void> {
		return new Promise((resolve, reject) => {
			const proc = this.process;
			if (!proc) {
				reject(new Error(`${this.serverName} process not started`));
				return;
			}

			const timeout = setTimeout(() => {
				reject(
					new Error(
						`${this.serverName} did not start within ${this.startupTimeoutMs}ms`,
					),
				);
			}, this.startupTimeoutMs);

			let stderrOutput = '';

			proc.stdout?.on('data', (data: Buffer) => {
				if (data.toString().includes(this.readyMarker)) {
					clearTimeout(timeout);
					resolve();
				}
			});

			proc.stderr?.on('data', (data: Buffer) => {
				stderrOutput += data.toString();
			});

			proc.on('error', (err) => {
				clearTimeout(timeout);
				reject(new Error(`${this.serverName} failed to start: ${err.message}`));
			});

			proc.on('exit', (code) => {
				clearTimeout(timeout);
				reject(
					new Error(
						`${this.serverName} exited unexpectedly (code: ${code}). stderr: ${stderrOutput.slice(-500)}`,
					),
				);
			});
		});
	}

	private async waitForProbe(): Promise<void> {
		const deadline = Date.now() + this.startupTimeoutMs;

		while (Date.now() < deadline) {
			if (!this.process) {
				throw new Error(`${this.serverName} stopped before becoming reachable`);
			}

			try {
				const controller = new AbortController();
				const timeout = setTimeout(() => controller.abort(), 3_000);
				const res = await fetch(this.probeUrl, { signal: controller.signal });
				clearTimeout(timeout);
				if (res.ok) {
					return;
				}
			} catch {
				// Retry until timeout; portless route registration can lag behind startup logs.
			}

			await new Promise((resolve) => setTimeout(resolve, 250));
		}

		throw new Error(
			`${this.serverName} did not become reachable at ${this.probeUrl} within ${this.startupTimeoutMs}ms`,
		);
	}
}
