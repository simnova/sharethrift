import type { Request, Response, Router } from 'express';
import { store } from '../store.ts';

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
}
