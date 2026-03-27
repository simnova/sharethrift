import { spawn, type ChildProcess } from 'node:child_process';

// Base class for portless servers (probes, spawns, waits for ready)
export abstract class PortlessServer {
	private process: ChildProcess | null = null;
	private startedByUs = false;

	protected abstract get probeUrl(): string; // URL to probe
	protected abstract get readyMarker(): string; // Ready marker in stdout
	protected abstract get serverName(): string; // Name for error messages
	protected abstract get startupTimeoutMs(): number; // Startup timeout (ms)
	protected abstract get spawnArgs(): string[]; // Portless spawn args
	protected abstract get cwd(): string; // Working directory
	protected get extraEnv(): Record<string, string> { // Extra env vars
		return {};
	}

	// Probe if server is already accepting requests
	async isAlreadyRunning(): Promise<boolean> {
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 3_000);
			const res = await fetch(this.probeUrl, { signal: controller.signal });
			clearTimeout(timeout);
			return res.status < 500;
		} catch {
			return false;
		}
	}

	async start(): Promise<void> {
		if (this.process || this.startedByUs) return;
		if (await this.isAlreadyRunning()) return;

		this.process = spawn('portless', this.spawnArgs, {
			cwd: this.cwd,
			env: { ...process.env, ...this.extraEnv },
			stdio: ['ignore', 'pipe', 'pipe'],
		});
		this.startedByUs = true;

		await this.waitForReady();
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
}
