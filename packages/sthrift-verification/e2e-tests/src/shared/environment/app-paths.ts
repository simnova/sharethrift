import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
export const appPaths = {
	apiDir: resolve(root, 'apps/api'),
	mongodbMemoryMockDir: resolve(root, 'apps/server-mongodb-memory-mock'),
	messagingMockDir: resolve(root, 'apps/server-messaging-mock'),
	oauth2MockDir: resolve(root, 'apps/server-oauth2-mock'),
	uiShareThriftDir: resolve(root, 'apps/ui-sharethrift'),
};
