import { execFileSync } from 'node:child_process';

let resolvedPath: string | undefined;

export function getPortlessPath(): string {
	if (!resolvedPath) {
		resolvedPath = execFileSync('/usr/bin/which', ['portless'], {
			encoding: 'utf-8',
			timeout: 5_000,
		}).trim();
		if (!resolvedPath) {
			throw new Error('Could not find portless binary on PATH');
		}
	}
	return resolvedPath;
}
