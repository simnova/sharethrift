import type {
	ApplicationServices,
	ApplicationServicesFactory,
	VerifiedUser,
} from '@sthrift/application-services';
import type { Domain } from '@sthrift/domain';
import {
	users,
	getVerifiedUserFromMock,
} from '../test-data/user.test-data.ts';

type PersonalUserEntityReference = Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
import { createMockUserService } from './test-app-services/user.test-app-services.ts';
import { createMockListingService } from './test-app-services/listing.test-app-services.ts';
import { createMockReservationRequestService } from './test-app-services/reservation-request.test-app-services.ts';
import { createMockConversationService } from './test-app-services/conversation.test-app-services.ts';
import { createMockAccountPlanService } from './test-app-services/account-plan.test-app-services.ts';
import { createMockAppealRequestService } from './test-app-services/appeal-request.test-app-services.ts';

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
