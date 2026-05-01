// Re-export public API from modular files

export { buildTokenResponse } from './jwt.ts';
export { createMockOAuth2Manager } from './manager.ts';
export { startMockOAuth2Server } from './server.ts';
export type {
	MockOAuth2Manager,
	MockOAuth2PortalConfig,
	MockOAuth2Registration,
	MockOAuth2ServerConfig,
	MockOAuth2ServerHandle,
	MockOAuth2UserProfile,
	MockOAuth2UserProfileRequestContext,
} from './types.ts';
export {
	normalizeBaseUrl,
	normalizeOrigin,
	normalizeUrl,
	SAFE_NAME_RE,
} from './utils.ts';
