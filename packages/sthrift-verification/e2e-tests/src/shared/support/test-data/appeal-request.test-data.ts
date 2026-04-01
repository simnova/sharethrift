import type { Domain } from '@sthrift/domain';

const listingAppeals = new Map<string, Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference>();
const userAppeals = new Map<string, Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference>();

let listingAppealCounter = 1;
let userAppealCounter = 1;

export function createMockListingAppeal(): Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference {
	const appeal = {
		id: `listing-appeal-${listingAppealCounter}`,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference;
	listingAppeals.set(appeal.id, appeal);
	listingAppealCounter++;
	return appeal;
}

export function createMockUserAppeal(): Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference {
	const appeal = {
		id: `user-appeal-${userAppealCounter}`,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference;
	userAppeals.set(appeal.id, appeal);
	userAppealCounter++;
	return appeal;
}

export function getAllMockListingAppeals(): Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference[] {
	return Array.from(listingAppeals.values());
}

export function getAllMockUserAppeals(): Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference[] {
	return Array.from(userAppeals.values());
}
