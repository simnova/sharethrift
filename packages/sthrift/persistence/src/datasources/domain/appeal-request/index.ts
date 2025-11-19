export * as ListingAppealRequest from './listing-appeal-request/index.ts';
export * as UserAppealRequest from './user-appeal-request/index.ts';

import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { getListingAppealRequestUnitOfWork } from './listing-appeal-request/index.ts';
import { getUserAppealRequestUnitOfWork } from './user-appeal-request/index.ts';

export const AppealRequestContextPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		ListingAppealRequest: {
			ListingAppealRequestUnitOfWork: getListingAppealRequestUnitOfWork(
				models.AppealRequest.ListingAppealRequest,
				passport,
			),
		},
		UserAppealRequest: {
			UserAppealRequestUnitOfWork: getUserAppealRequestUnitOfWork(
				models.AppealRequest.UserAppealRequest,
				passport,
			),
		},
	};
};
