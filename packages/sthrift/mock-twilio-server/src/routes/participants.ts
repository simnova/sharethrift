import type { Request, Response, Router } from 'express';
import { store } from '../store.ts';
import type { ParticipantsListResponse } from '../types.ts';

export function setupParticipantRoutes(router: Router): void {
	/**
	 * Add a participant to a conversation
	 * POST /v1/Conversations/:conversationSid/Participants
	 */
	router.post(
		'/v1/Conversations/:conversationSid/Participants',
		(req: Request, res: Response) => {
			try {
				const { conversationSid } = req.params as { conversationSid: string };
				const { Identity, MessagingBinding } = req.body;

				const conversation = store.getConversation(conversationSid);
				if (!conversation) {
					return res.status(404).json({
						status: 404,
						message: 'The requested resource was not found',
						code: 20404,
						more_info: 'https://www.twilio.com/docs/errors/20404',
					});
				}

				const participant = store.addParticipant(
					conversationSid,
					Identity,
					MessagingBinding,
				);

				return res.status(201).json(participant);
			} catch (error) {
				console.error('Error adding participant:', error);
				return res.status(500).json({
					status: 500,
					message: 'Internal server error',
				});
			}
		},
	);

	/**
	 * Get a specific participant
	 * GET /v1/Conversations/:conversationSid/Participants/:participantSid
	 */
	router.get(
		'/v1/Conversations/:conversationSid/Participants/:participantSid',
		(req: Request, res: Response) => {
			try {
				const { conversationSid, participantSid } = req.params as { conversationSid: string; participantSid: string };

				const conversation = store.getConversation(conversationSid);
				if (!conversation) {
					return res.status(404).json({
						status: 404,
						message: 'Conversation not found',
						code: 20404,
					});
				}

				const participant = store.getParticipant(conversationSid, participantSid);
				if (!participant) {
					return res.status(404).json({
						status: 404,
						message: 'Participant not found',
						code: 20404,
					});
				}

				return res.status(200).json(participant);
			} catch (error) {
				console.error('Error fetching participant:', error);
				return res.status(500).json({
					status: 500,
					message: 'Internal server error',
				});
			}
		},
	);

	/**
	 * List participants in a conversation
	 * GET /v1/Conversations/:conversationSid/Participants
	 */
	router.get(
		'/v1/Conversations/:conversationSid/Participants',
		(req: Request, res: Response) => {
			try {
				const { conversationSid } = req.params as { conversationSid: string };
				// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
				const page = Number.parseInt((req.query['Page'] as string) ?? '0', 10) || 0;
				// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
				const pageSize = Number.parseInt((req.query['PageSize'] as string) ?? '50', 10) || 0;

				const conversation = store.getConversation(conversationSid);
				if (!conversation) {
					return res.status(404).json({
						status: 404,
						message: 'The requested resource was not found',
						code: 20404,
						more_info: 'https://www.twilio.com/docs/errors/20404',
					});
				}

				const participants = store.getParticipants(conversationSid, page, pageSize);
				const totalCount = store.getParticipantCount(conversationSid);
				const hasNextPage = (page + 1) * pageSize < totalCount;
				const hasPreviousPage = page > 0;

				const response: ParticipantsListResponse = {
					participants,
					meta: {
						page,
						page_size: pageSize,
						first_page_url: `/v1/Conversations/${conversationSid}/Participants?PageSize=${pageSize}&Page=0`,
						url: `/v1/Conversations/${conversationSid}/Participants?PageSize=${pageSize}&Page=${page}`,
						key: 'participants',
					},
				};

				if (hasNextPage) {
					response.meta.next_page_url = `/v1/Conversations/${conversationSid}/Participants?PageSize=${pageSize}&Page=${page + 1}`;
				}

				if (hasPreviousPage) {
					response.meta.previous_page_url = `/v1/Conversations/${conversationSid}/Participants?PageSize=${pageSize}&Page=${page - 1}`;
				}

				return res.status(200).json(response);
			} catch (error) {
				console.error('Error listing participants:', error);
				return res.status(500).json({
					status: 500,
					message: 'Internal server error',
				});
			}
		},
	);

	/**
	 * Remove a participant from a conversation
	 * DELETE /v1/Conversations/:conversationSid/Participants/:participantSid
	 */
	router.delete(
		'/v1/Conversations/:conversationSid/Participants/:participantSid',
		(req: Request, res: Response) => {
			try {
				const { conversationSid, participantSid } = req.params as { conversationSid: string; participantSid: string };

				const conversation = store.getConversation(conversationSid);
				if (!conversation) {
					return res.status(404).json({
						status: 404,
						message: 'Conversation not found',
						code: 20404,
					});
				}

				const deleted = store.removeParticipant(conversationSid, participantSid);
				if (!deleted) {
					return res.status(404).json({
						status: 404,
						message: 'Participant not found',
						code: 20404,
					});
				}

				return res.status(204).send();
			} catch (error) {
				console.error('Error deleting participant:', error);
				return res.status(500).json({
					status: 500,
					message: 'Internal server error',
				});
			}
		},
	);
}
