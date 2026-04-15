import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export function createTempWorkspace(): string {
	return fs.mkdtempSync(path.join(os.tmpdir(), 'sthrift-arch-tests-'));
}

export function removeTempWorkspace(workspacePath: string): void {
	fs.rmSync(workspacePath, { recursive: true, force: true });
}

export function writeFile(
	workspacePath: string,
	relativePath: string,
	content = '',
): string {
	const filePath = path.join(workspacePath, relativePath);
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, content);
	return filePath;
}
