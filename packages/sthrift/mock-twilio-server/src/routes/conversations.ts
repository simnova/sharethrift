import type { Request, Response, Router } from 'express';
import { store } from '../store.ts';
import type { ConversationsListResponse } from '../types.ts';

export function setupConversationRoutes(router: Router): void {
	/**
	 * Create a new conversation
	 * POST /v1/Conversations
	 */
	router.post('/v1/Conversations', (req: Request, res: Response) => {
		try {
			const { FriendlyName, UniqueName } = req.body;

			// Check if unique name already exists
			if (UniqueName) {
				const existing = store.getConversationByUniqueName(UniqueName);
				if (existing) {
					return res.status(409).json({
						status: 409,
						message: 'A conversation with this unique name already exists',
						code: 60201,
						more_info: 'https://www.twilio.com/docs/errors/60201',
					});
				}
			}

			const conversation = store.createConversation(FriendlyName, UniqueName);
			return res.status(201).json(conversation);
		} catch (error) {
			console.error('Error creating conversation:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});

	/**
	 * Get a conversation by SID
	 * GET /v1/Conversations/:conversationSid
	 */
	router.get('/v1/Conversations/:conversationSid', (req: Request, res: Response) => {
		try {
			const { conversationSid } = req.params as { conversationSid: string };
			const conversation = store.getConversation(conversationSid);

			if (!conversation) {
				return res.status(404).json({
					status: 404,
					message: 'The requested resource was not found',
					code: 20404,
					more_info: 'https://www.twilio.com/docs/errors/20404',
				});
			}

			return res.status(200).json(conversation);
		} catch (error) {
			console.error('Error fetching conversation:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});

	/**
	 * List conversations
	 * GET /v1/Conversations
	 */
	router.get('/v1/Conversations', (req: Request, res: Response) => {
		try {
			// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
			const page = Number.parseInt((req.query['Page'] as string) ?? '0', 10) || 0;
			// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
			const pageSize = Number.parseInt((req.query['PageSize'] as string) ?? '50', 10) || 50;

			const conversations = store.listConversations(page, pageSize);
			const totalCount = store.getConversationCount();
			const hasNextPage = (page + 1) * pageSize < totalCount;
			const hasPreviousPage = page > 0;

			const response: ConversationsListResponse = {
				conversations,
				meta: {
					page,
					page_size: pageSize,
					first_page_url: `/v1/Conversations?PageSize=${pageSize}&Page=0`,
					url: `/v1/Conversations?PageSize=${pageSize}&Page=${page}`,
					key: 'conversations',
				},
			};

			if (hasNextPage) {
				response.meta.next_page_url = `/v1/Conversations?PageSize=${pageSize}&Page=${page + 1}`;
			}

			if (hasPreviousPage) {
				response.meta.previous_page_url = `/v1/Conversations?PageSize=${pageSize}&Page=${page - 1}`;
			}

			return res.status(200).json(response);
		} catch (error) {
			console.error('Error listing conversations:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});

	/**
	 * Update a conversation
	 * POST /v1/Conversations/:conversationSid
	 */
	router.post('/v1/Conversations/:conversationSid', (req: Request, res: Response) => {
		try {
			const { conversationSid } = req.params as { conversationSid: string };
			const { FriendlyName, State } = req.body;

			const conversation = store.getConversation(conversationSid);
			if (!conversation) {
				return res.status(404).json({
					status: 404,
					message: 'The requested resource was not found',
					code: 20404,
					more_info: 'https://www.twilio.com/docs/errors/20404',
				});
			}

			const updates: Partial<typeof conversation> = {};
			if (FriendlyName !== undefined) {
				updates.friendly_name = FriendlyName;
			}
			if (State !== undefined) {
				updates.state = State;
			}

			const updated = store.updateConversation(conversationSid, updates);
			return res.status(200).json(updated);
		} catch (error) {
			console.error('Error updating conversation:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});

	/**
	 * Delete a conversation
	 * DELETE /v1/Conversations/:conversationSid
	 */
	router.delete('/v1/Conversations/:conversationSid', (req: Request, res: Response) => {
		try {
			const { conversationSid } = req.params as { conversationSid: string };
			const deleted = store.deleteConversation(conversationSid);

			if (!deleted) {
				return res.status(404).json({
					status: 404,
					message: 'The requested resource was not found',
					code: 20404,
					more_info: 'https://www.twilio.com/docs/errors/20404',
				});
			}

			return res.status(204).send();
		} catch (error) {
			console.error('Error deleting conversation:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});
}
