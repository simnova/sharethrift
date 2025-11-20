import { store } from "../store.js";
export function setupMessageRoutes(router) {
    router.post('/v1/Conversations/:conversationId/Messages', (req, res) => {
        try {
            const { conversationId } = req.params;
            const { Body, Author, ParticipantId } = req.body;
            if (!Body) {
                return res.status(400).json({
                    status: 400,
                    message: 'Body is required',
                    code: 20001,
                });
            }
            const conversation = store.getConversation(conversationId);
            if (!conversation) {
                return res.status(404).json({
                    status: 404,
                    message: 'The requested resource was not found',
                    code: 20404,
                });
            }
            const message = store.createMessage(conversationId, Body, Author, ParticipantId);
            return res.status(201).json(message);
        }
        catch (error) {
            console.error('Error creating message:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    });
    router.get('/v1/Conversations/:conversationId/Messages', (req, res) => {
        try {
            const { conversationId } = req.params;
            // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
            const page = Number.parseInt(req.query['Page'] ?? '0', 10) || 0;
            // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
            const pageSize = Number.parseInt(req.query['PageSize'] ?? '50', 10) || 50;
            const conversation = store.getConversation(conversationId);
            if (!conversation) {
                return res.status(404).json({
                    status: 404,
                    message: 'The requested resource was not found',
                    code: 20404,
                });
            }
            const messages = store.getMessages(conversationId, page, pageSize);
            const totalCount = store.getMessageCount(conversationId);
            const hasNextPage = (page + 1) * pageSize < totalCount;
            const hasPreviousPage = page > 0;
            const response = {
                messages,
                meta: {
                    page,
                    page_size: pageSize,
                    first_page_url: `/v1/Conversations/${conversationId}/Messages?PageSize=${pageSize}&Page=0`,
                    url: `/v1/Conversations/${conversationId}/Messages?PageSize=${pageSize}&Page=${page}`,
                    key: 'messages',
                },
            };
            if (hasNextPage) {
                response.meta.next_page_url = `/v1/Conversations/${conversationId}/Messages?PageSize=${pageSize}&Page=${page + 1}`;
            }
            if (hasPreviousPage) {
                response.meta.previous_page_url = `/v1/Conversations/${conversationId}/Messages?PageSize=${pageSize}&Page=${page - 1}`;
            }
            return res.status(200).json(response);
        }
        catch (error) {
            console.error('Error listing messages:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    });
}
//# sourceMappingURL=messages.js.map