import { store } from "../store.js";
export function setupMockUtilRoutes(router) {
    router.post('/mock/reset', (_req, res) => {
        try {
            store.reset();
            return res.status(200).json({
                message: 'Mock data reset successfully',
            });
        }
        catch (error) {
            console.error('Error resetting mock data:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    });
    router.get('/mock/stats', (_req, res) => {
        try {
            const stats = store.getStats();
            return res.status(200).json(stats);
        }
        catch (error) {
            console.error('Error getting stats:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    });
}
//# sourceMappingURL=mock-utils.js.map