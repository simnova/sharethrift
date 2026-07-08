import { clearMockListings, clearMockReservationRequests } from '@sthrift-verification/verification-shared/test-data';

export const infrastructure = {
	ensureStarted: () => Promise.resolve(),
	getState: () => ({}),
	resetScenarioState: () => {
		clearMockListings();
		clearMockReservationRequests();
		return Promise.resolve();
	},
	stopAll: () => Promise.resolve(),
};
