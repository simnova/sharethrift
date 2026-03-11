import type {
	ApplicationServices,
	ApplicationServicesFactory,
	VerifiedUser,
} from '@sthrift/application-services';
import type { Domain } from '@sthrift/domain';
import {
	users,
	clearUsers,
	getVerifiedUserFromMock,
} from '../test-data/user.test-data.ts';

type PersonalUserEntityReference = Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
import { clearMockListings } from '../test-data/listing.test-data.ts';
import { clearMockReservationRequests } from '../test-data/reservation-request.test-data.ts';
import { clearMockAppeals } from '../test-data/appeal-request.test-data.ts';
import { clearMockConversations } from '../test-data/conversation.test-data.ts';
import { clearMockAccountPlans } from '../test-data/account-plan.test-data.ts';
import {
	createMockUserService,
	createMockListingService,
	createMockReservationRequestService,
	createMockConversationService,
	createMockAccountPlanService,
	createMockAppealRequestService,
} from './test-app-services/index.ts';

export function createTestApplicationServicesFactory(): ApplicationServicesFactory {
	const allUsers = Array.from(users.values());
	const alice = allUsers.find((u) => u.account.email === 'alice@example.com');
	const alicePersonal = alice?.userType === 'personal-user' ? (alice as PersonalUserEntityReference) : null;

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
					return alicePersonal ? getVerifiedUserFromMock(alicePersonal) : null;
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
