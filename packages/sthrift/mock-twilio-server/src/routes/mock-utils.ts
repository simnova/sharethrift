import type { Request, Response, Router } from 'express';
import { store } from '../store.ts';
import { seedMockData } from '../seed/seed-data.ts';

/**
 * Utility routes for managing the mock server
 */
export function setupMockUtilRoutes(router: Router): void {
	/**
	 * Reset all mock data
	 * POST /mock/reset
	 */
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

	/**
	 * Reseed mock data
	 * POST /mock/seed
	 */
	router.post('/mock/seed', (_req: Request, res: Response) => {
		try {
			store.reset();
			seedMockData();
			const stats = store.getStats();
			
			return res.status(200).json({
				message: 'Mock data seeded successfully',
				...stats,
			});
		} catch (error) {
			console.error('Error seeding mock data:', error);
			return res.status(500).json({
				status: 500,
				message: 'Internal server error',
			});
		}
	});

	/**
	 * Get statistics about mock data
	 * GET /mock/stats
	 */
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
