import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.join(process.cwd(), './assets/email-templates');

export const readHtmlFile = (fileName: string): string => {
	const ext = path.extname(fileName);
	if (ext && ext !== '.json') {
		throw new Error('Template must be in HTML format');
	}
	if (!ext) {
		fileName += '.json';
	}
	const files = fs.readdirSync(baseDir);
	const matchedFile = files.find(
		(f) => f.toLowerCase() === fileName.toLowerCase(),
	);
	if (!matchedFile) {
		throw new Error(`File not found: ${fileName}`);
	}
	const filePath = path.join(baseDir, matchedFile);
	return fs.readFileSync(filePath, 'utf-8');
};
