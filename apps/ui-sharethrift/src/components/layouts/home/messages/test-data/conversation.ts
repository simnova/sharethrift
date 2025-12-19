/**
 * Reusable mock builders for conversation and send-message test cases
 * This centralizes mock structure to avoid copy-pasting in each story
 */

import type { Conversation } from '../../../../../generated.tsx';

/**
 * Creates a reusable conversation mock with customizable properties
 * @param overrides - Optional overrides for conversation properties
 * @returns A standardized conversation object for testing
 */
export const buildConversationMock = (
	overrides?: Partial<Conversation> & { messages?: Conversation['messages'] },
): Conversation => {
	const defaultConversation: Conversation = {
		__typename: 'Conversation',
		id: 'conv-1',
		messagingConversationId: 'CH123',
		schemaVersion: '1',
		listing: {
			__typename: 'ItemListing',
			id: 'listing-1',
			title: 'Cordless Drill',
			description: 'High-quality drill',
			category: 'Tools',
			location: 'Toronto',
			images: ['/assets/item-images/projector.png'],
			listingType: 'Item',
			sharingPeriodStart: '2025-01-15',
			sharingPeriodEnd: '2025-12-31',
		},
		sharer: {
			__typename: 'PersonalUser',
			id: 'user-1',
			account: {
				__typename: 'PersonalUserAccount',
				username: 'john_doe',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'John',
					lastName: 'Doe',
				},
			},
		},
		reserver: {
			__typename: 'PersonalUser',
			id: 'user-2',
			account: {
				__typename: 'PersonalUserAccount',
				username: 'jane_smith',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'Jane',
					lastName: 'Smith',
				},
			},
		},
		messages: [
			{
				__typename: 'Message',
				id: 'msg-1',
				messagingMessageId: 'SM001',
				content: 'Hi, is this still available?',
				createdAt: '2025-01-15T10:00:00Z',
				authorId: 'user-2',
			},
		],
		createdAt: '2025-01-15T09:00:00Z',
		updatedAt: '2025-01-15T10:00:00Z',
	};

	return {
		...defaultConversation,
		...overrides,
		messages: overrides?.messages ?? defaultConversation.messages,
	};
};

/**
 * Creates a reusable send-message mock with different response modes
 * @param mode - The response mode: success, error, or networkError
 * @param messageContent - Optional message content (defaults to 'Test message')
 * @returns A standardized send-message mutation result
 */
export const buildSendMessageMock = (
	mode: 'success' | 'error' | 'networkError',
	messageContent: string = 'Test message',
) => {
	const content = messageContent;

	if (mode === 'networkError') {
		return { error: new Error('Network error') };
	}

	const baseResponse = {
		__typename: 'SendMessageMutationResult' as const,
		status: {
			__typename: 'MutationStatus' as const,
			success: mode === 'success',
			errorMessage: mode === 'error' ? 'Failed to send message' : null,
		},
		message:
			mode === 'success'
				? {
						__typename: 'Message' as const,
						id: 'msg-new',
						messagingMessageId: 'SM999',
						content,
						createdAt: new Date().toISOString(),
						authorId: 'user-1',
				  }
				: null,
	};

	return { data: { sendMessage: baseResponse } };
};
