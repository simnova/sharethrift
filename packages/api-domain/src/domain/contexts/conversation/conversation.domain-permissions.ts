// Domain permissions for Conversation context
export interface ConversationDomainPermissions {
	canCreateConversation: boolean;
	canManageConversation: boolean;
	canViewConversation: boolean;
	isSystemAccount: boolean;
}
