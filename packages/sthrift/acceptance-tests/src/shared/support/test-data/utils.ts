export function generateObjectId(): string {
	const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
	const random = Math.random().toString(16).substring(2, 18).padStart(16, '0');
	return (timestamp + random).substring(0, 24);
}
