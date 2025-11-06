import type { Request, Response, Router } from 'express';
import { store } from '../store.ts';

export function setupMockUtilRoutes(router: Router): void {
	router.post('/mock/reset', (_req: Request, res: Response) => {
		try {
			store.reset();
			return res.status(200).json({
				message: 'Mock data reset successfully',
			});
		} catch (error) {
			console.error('Error resetting mock data:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});

	router.get('/mock/stats', (_req: Request, res: Response) => {
		try {
			const stats = store.getStats();
			return res.status(200).json(stats);
		} catch (error) {
			console.error('Error getting stats:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});
}
