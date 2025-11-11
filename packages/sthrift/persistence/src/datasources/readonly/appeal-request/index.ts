import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { getListingAppealRequestReadRepository } from './listing-appeal-request/listing-appeal-request.read-repository.ts';
import { getUserAppealRequestReadRepository } from './user-appeal-request/user-appeal-request.read-repository.ts';

export const AppealRequestContext = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		ListingAppealRequest: {
			ListingAppealRequestReadRepo: getListingAppealRequestReadRepository(
				models,
				passport,
			),
		},
		UserAppealRequest: {
			UserAppealRequestReadRepo: getUserAppealRequestReadRepository(
				models,
				passport,
			),
		},
	};
};
