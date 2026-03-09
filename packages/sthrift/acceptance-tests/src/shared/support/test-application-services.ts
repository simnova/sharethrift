import type {
	ApplicationServices,
	ApplicationServicesFactory,
	VerifiedUser,
} from '@sthrift/application-services';
import {
	aliceUser,
	clearUsers,
	getVerifiedUserFromMock,
} from './test-data/user.test-data.js';
import {
	clearMockListings,
} from './test-data/listing.test-data.js';
import {
	clearMockReservationRequests,
} from './test-data/reservation-request.test-data.js';
import {
	clearMockAppeals,
} from './test-data/appeal-request.test-data.js';
import {
	clearMockConversations,
} from './test-data/conversation.test-data.js';
import {
	clearMockAccountPlans,
} from './test-data/account-plan.test-data.js';
import {
	createMockUserService,
	createMockListingService,
	createMockReservationRequestService,
	createMockConversationService,
	createMockAccountPlanService,
	createMockAppealRequestService,
} from './test-app-services/index.js';

export function createTestApplicationServicesFactory(): ApplicationServicesFactory {
	return {
		forRequest: (): Promise<ApplicationServices> => {
			return Promise.resolve({
				User: createMockUserService(),
				Conversation: createMockConversationService(),
				AccountPlan: createMockAccountPlanService(),
				AppealRequest: createMockAppealRequestService(),
				ReservationRequest: createMockReservationRequestService(),
				Listing: createMockListingService(),
				get verifiedUser(): VerifiedUser | null {
					return getVerifiedUserFromMock(aliceUser);
				},
			} as ApplicationServices);
		},
	};
}

export function clearAllTestData(): void {
	clearUsers();
	clearMockListings();
	clearMockReservationRequests();
	clearMockAppeals();
	clearMockConversations();
	clearMockAccountPlans();
}
