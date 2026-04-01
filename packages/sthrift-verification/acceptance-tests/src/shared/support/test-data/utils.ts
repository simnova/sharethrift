import { randomBytes } from 'node:crypto';

export function generateObjectId(): string {
	const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
	const random = randomBytes(8).toString('hex');
	return (timestamp + random).substring(0, 24);
}
