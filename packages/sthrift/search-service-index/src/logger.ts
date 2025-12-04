/**
 * Simple logger utility with log-level gating for production environments
 * 
 * Log levels:
 * - error: Always logged (critical errors)
 * - warn: Logged unless LOG_LEVEL=error
 * - info: Logged in development or when LOG_LEVEL=info|debug
 * - debug: Only logged when LOG_LEVEL=debug
 * 
 * Environment variables:
 * - LOG_LEVEL: Set to 'error', 'warn', 'info', or 'debug'
 * - NODE_ENV: If 'production', defaults to 'error' level
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
};

class Logger {
	private level: LogLevel;

	constructor() {
		// Default to 'error' in production, 'info' in development
		const defaultLevel = process.env['NODE_ENV'] === 'production' ? 'error' : 'info';
		const configuredLevel = (process.env['LOG_LEVEL'] as LogLevel) || defaultLevel;
		this.level = configuredLevel;
	}

	private shouldLog(level: LogLevel): boolean {
		return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
	}

	error(message: string, ...args: unknown[]): void {
		if (this.shouldLog('error')) {
			console.error(`[ERROR] ${message}`, ...args);
		}
	}

	warn(message: string, ...args: unknown[]): void {
		if (this.shouldLog('warn')) {
			console.warn(`[WARN] ${message}`, ...args);
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.shouldLog('info')) {
			console.log(`[INFO] ${message}`, ...args);
		}
	}

	debug(message: string, ...args: unknown[]): void {
		if (this.shouldLog('debug')) {
			console.log(`[DEBUG] ${message}`, ...args);
		}
	}
}

export const logger = new Logger();

