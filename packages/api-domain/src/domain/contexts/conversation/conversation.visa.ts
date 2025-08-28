import type { ConversationDomainPermissions } from './conversation.domain-permissions.ts';

export interface ConversationVisa {
	determineIf(
		func: (permissions: Readonly<ConversationDomainPermissions>) => boolean,
	): boolean;
}
