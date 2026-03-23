type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
	silent: 4,
};

function getLogLevel(): number {
	const level = (process.env['LOG_LEVEL'] ?? 'info').toLowerCase() as LogLevel;
	return LOG_LEVELS[level] ?? LOG_LEVELS.info;
}

export const logger = {
	debug(...args: unknown[]): void {
		if (getLogLevel() <= LOG_LEVELS.debug) {
			console.log(...args);
		}
	},
	info(...args: unknown[]): void {
		if (getLogLevel() <= LOG_LEVELS.info) {
			console.log(...args);
		}
	},
	warn(...args: unknown[]): void {
		if (getLogLevel() <= LOG_LEVELS.warn) {
			console.warn(...args);
		}
	},
	error(...args: unknown[]): void {
		if (getLogLevel() <= LOG_LEVELS.error) {
			console.error(...args);
		}
	},
};
