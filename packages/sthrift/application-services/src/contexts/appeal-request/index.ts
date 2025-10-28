import type { DataSources } from '@sthrift/persistence';
import {
	ListingAppealRequest as ListingAppealRequestApi,
	type ListingAppealRequestApplicationService,
} from './listing-appeal-request/index.ts';
import {
	UserAppealRequest as UserAppealRequestApi,
	type UserAppealRequestApplicationService,
} from './user-appeal-request/index.ts';

export interface AppealRequestContextApplicationService {
	ListingAppealRequest: ListingAppealRequestApplicationService;
	UserAppealRequest: UserAppealRequestApplicationService;
}

export const AppealRequest = (
	dataSources: DataSources,
): AppealRequestContextApplicationService => {
	return {
		ListingAppealRequest: ListingAppealRequestApi(dataSources),
		UserAppealRequest: UserAppealRequestApi(dataSources),
	};
};

export type {
	ListingAppealRequestPageResult,
	CreateListingAppealRequestCommand,
	GetListingAppealRequestByIdCommand,
	GetAllListingAppealRequestsCommand,
	UpdateListingAppealRequestStateCommand,
} from './listing-appeal-request/index.ts';

export type {
	UserAppealRequestPageResult,
	CreateUserAppealRequestCommand,
	GetUserAppealRequestByIdCommand,
	GetAllUserAppealRequestsCommand,
	UpdateUserAppealRequestStateCommand,
} from './user-appeal-request/index.ts';
