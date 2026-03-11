import type { Domain } from '@sthrift/domain';
import {
	createMockListingAppeal,
	createMockUserAppeal,
	getAllMockListingAppeals,
	getAllMockUserAppeals,
} from '../../test-data/appeal-request.test-data.js';

interface MockAppealRequestContextApplicationService {
	ListingAppealRequest: {
		create: () => Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference>;
		getById: () => Promise<null>;
		getAll: () => Promise<{ items: Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference[]; total: number; page: number; pageSize: number }>;
		updateState: () => Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference>;
	};
	UserAppealRequest: {
		create: () => Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference>;
		getById: () => Promise<null>;
		getAll: () => Promise<{ items: Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference[]; total: number; page: number; pageSize: number }>;
		updateState: () => Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference>;
	};
}

export function createMockAppealRequestService(): MockAppealRequestContextApplicationService {
	return {
		ListingAppealRequest: {
			create: () => Promise.resolve(createMockListingAppeal()),
			getById: () => Promise.resolve(null),
			getAll: () => {
				const all = getAllMockListingAppeals();
				return Promise.resolve({ items: all, total: all.length, page: 1, pageSize: 10 });
			},
			updateState: () => Promise.resolve(createMockListingAppeal()),
		},
		UserAppealRequest: {
			create: () => Promise.resolve(createMockUserAppeal()),
			getById: () => Promise.resolve(null),
			getAll: () => {
				const all = getAllMockUserAppeals();
				return Promise.resolve({ items: all, total: all.length, page: 1, pageSize: 10 });
			},
			updateState: () => Promise.resolve(createMockUserAppeal()),
		},
	};
}
