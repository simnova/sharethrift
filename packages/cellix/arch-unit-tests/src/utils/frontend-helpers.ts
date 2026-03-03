import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Recursively get all files in a directory
 */
export function getAllFiles(
	dirPath: string,
	arrayOfFiles: string[] = [],
): string[] {
	if (!fs.existsSync(dirPath)) return arrayOfFiles;

	const files = fs.readdirSync(dirPath);

	for (const file of files) {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
		} else {
			arrayOfFiles.push(fullPath);
		}
	}

	return arrayOfFiles;
}

/**
 * Get immediate subdirectories of a path
 */
export function getDirectories(dirPath: string): string[] {
	if (!fs.existsSync(dirPath)) return [];
	return fs
		.readdirSync(dirPath)
		.filter((file) => fs.statSync(path.join(dirPath, file)).isDirectory());
}

/**
 * Check if a string follows kebab-case naming convention
 */
export function isKebabCase(str: string): boolean {
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str);
}
