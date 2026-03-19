import type { Request, Response, Router } from 'express';
import { store } from '../store.ts';
import type { ConversationsListResponse } from '../types.ts';

export function setupConversationRoutes(router: Router): void {
	router.post('/v1/Conversations', (req: Request, res: Response) => {
		try {
			const { DisplayName, UniqueName } = req.body;

			if (UniqueName) {
				const existing = store.getConversationByUniqueName(UniqueName);
				if (existing) {
					return res.status(409).json({
						status: 409,
						message: 'A conversation with this unique name already exists',
						code: 60201,
					});
				}
			}

			const conversation = store.createConversation(DisplayName, UniqueName);
			return res.status(201).json(conversation);
		} catch (error) {
			console.error('Error creating conversation:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});

	router.get('/v1/Conversations/:conversationId', (req: Request, res: Response) => {
		try {
			const { conversationId } = req.params as { conversationId: string };
			const conversation = store.getConversation(conversationId);

			if (!conversation) {
				return res.status(404).json({
					status: 404,
					message: 'The requested resource was not found',
					code: 20404,
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

	router.post('/v1/Conversations/:conversationId', (req: Request, res: Response) => {
		try {
			const { conversationId } = req.params as { conversationId: string };
			const { DisplayName, State } = req.body;

			const conversation = store.getConversation(conversationId);
			if (!conversation) {
				return res.status(404).json({
					status: 404,
					message: 'The requested resource was not found',
					code: 20404,
				});
			}

			const updates: Partial<typeof conversation> = {};
			if (DisplayName !== undefined) {
				updates.display_name = DisplayName;
			}
			if (State !== undefined) {
				updates.state = State;
			}

			const updated = store.updateConversation(conversationId, updates);
			return res.status(200).json(updated);
		} catch (error) {
			console.error('Error updating conversation:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});

	router.delete('/v1/Conversations/:conversationId', (req: Request, res: Response) => {
		try {
			const { conversationId } = req.params as { conversationId: string };
			const deleted = store.deleteConversation(conversationId);

			if (!deleted) {
				return res.status(404).json({
					status: 404,
					message: 'The requested resource was not found',
					code: 20404,
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
