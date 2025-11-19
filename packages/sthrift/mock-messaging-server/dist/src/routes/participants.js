import { store } from "../store.js";
export function setupParticipantRoutes(router) {
    router.post('/v1/Conversations/:conversationSid/Participants', (req, res) => {
        try {
            const { conversationSid } = req.params;
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
            const participant = store.addParticipant(conversationSid, Identity, MessagingBinding);
            return res.status(201).json(participant);
        }
        catch (error) {
            console.error('Error adding participant:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    });
    router.get('/v1/Conversations/:conversationSid/Participants/:participantSid', (req, res) => {
        try {
            const { conversationSid, participantSid } = req.params;
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
        }
        catch (error) {
            console.error('Error fetching participant:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    });
    router.get('/v1/Conversations/:conversationSid/Participants', (req, res) => {
        try {
            const { conversationSid } = req.params;
            // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
            const page = Number.parseInt(req.query['Page'] ?? '0', 10) || 0;
            // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
            const pageSize = Number.parseInt(req.query['PageSize'] ?? '50', 10) || 0;
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
            const response = {
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
        }
        catch (error) {
            console.error('Error listing participants:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    });
    router.delete('/v1/Conversations/:conversationSid/Participants/:participantSid', (req, res) => {
        try {
            const { conversationSid, participantSid } = req.params;
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
        }
        catch (error) {
            console.error('Error deleting participant:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    });
}
//# sourceMappingURL=participants.js.map