import type { ConversationDomainPermissions } from './conversation.domain-permissions.js';

export interface ConversationVisa {
	determineIf(
		func: (permissions: Readonly<ConversationDomainPermissions>) => boolean,
	): boolean;
}
