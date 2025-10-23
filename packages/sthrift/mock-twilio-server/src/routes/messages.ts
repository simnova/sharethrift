import type { Request, Response, Router } from 'express';
import { store } from '../store.ts';
import type { MessagesListResponse } from '../types.ts';

export function setupMessageRoutes(router: Router): void {
	/**
	 * Create a new message in a conversation
	 * POST /v1/Conversations/:conversationSid/Messages
	 */
	router.post(
		'/v1/Conversations/:conversationSid/Messages',
		(req: Request, res: Response) => {
		try {
			const { conversationSid } = req.params as { conversationSid: string };
			const { Body, Author, ParticipantSid } = req.body;				if (!Body) {
					return res.status(400).json({
						status: 400,
						message: 'Body is required',
						code: 20001,
						more_info: 'https://www.twilio.com/docs/errors/20001',
					});
				}

				const conversation = store.getConversation(conversationSid);
				if (!conversation) {
					return res.status(404).json({
						status: 404,
						message: 'The requested resource was not found',
						code: 20404,
						more_info: 'https://www.twilio.com/docs/errors/20404',
					});
				}

				const message = store.createMessage(
					conversationSid,
					Body,
					Author,
					ParticipantSid,
				);

				return res.status(201).json(message);
			} catch (error) {
				console.error('Error creating message:', error);
				return res.status(500).json({
					status: 500,
					message: 'Internal server error',
				});
			}
		},
	);

	/**
	 * Get a specific message
	 * GET /v1/Conversations/:conversationSid/Messages/:messageSid
	 */
	router.get(
		'/v1/Conversations/:conversationSid/Messages/:messageSid',
		(req: Request, res: Response) => {
		try {
			const { conversationSid, messageSid } = req.params as { conversationSid: string; messageSid: string };				const conversation = store.getConversation(conversationSid);
				if (!conversation) {
					return res.status(404).json({
						status: 404,
						message: 'Conversation not found',
						code: 20404,
					});
				}

				const message = store.getMessage(conversationSid, messageSid);
				if (!message) {
					return res.status(404).json({
						status: 404,
						message: 'Message not found',
						code: 20404,
					});
				}

				return res.status(200).json(message);
			} catch (error) {
				console.error('Error fetching message:', error);
				return res.status(500).json({
					status: 500,
					message: 'Internal server error',
				});
			}
		},
	);

	/**
	 * List messages in a conversation
	 * GET /v1/Conversations/:conversationSid/Messages
	 */
	router.get(
		'/v1/Conversations/:conversationSid/Messages',
		(req: Request, res: Response) => {
		try {
			const { conversationSid } = req.params as { conversationSid: string };
			// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
			const page = Number.parseInt((req.query['Page'] as string) ?? '0', 10) || 0;
			// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
			const pageSize = Number.parseInt((req.query['PageSize'] as string) ?? '50', 10) || 50;				const conversation = store.getConversation(conversationSid);
				if (!conversation) {
					return res.status(404).json({
						status: 404,
						message: 'The requested resource was not found',
						code: 20404,
						more_info: 'https://www.twilio.com/docs/errors/20404',
					});
				}

				const messages = store.getMessages(conversationSid, page, pageSize);
				const totalCount = store.getMessageCount(conversationSid);
				const hasNextPage = (page + 1) * pageSize < totalCount;
				const hasPreviousPage = page > 0;

				const response: MessagesListResponse = {
					messages,
					meta: {
						page,
						page_size: pageSize,
						first_page_url: `/v1/Conversations/${conversationSid}/Messages?PageSize=${pageSize}&Page=0`,
						url: `/v1/Conversations/${conversationSid}/Messages?PageSize=${pageSize}&Page=${page}`,
						key: 'messages',
					},
				};

				if (hasNextPage) {
					response.meta.next_page_url = `/v1/Conversations/${conversationSid}/Messages?PageSize=${pageSize}&Page=${page + 1}`;
				}

				if (hasPreviousPage) {
					response.meta.previous_page_url = `/v1/Conversations/${conversationSid}/Messages?PageSize=${pageSize}&Page=${page - 1}`;
				}

				return res.status(200).json(response);
			} catch (error) {
				console.error('Error listing messages:', error);
				return res.status(500).json({
					status: 500,
					message: 'Internal server error',
				});
			}
		},
	);
}
