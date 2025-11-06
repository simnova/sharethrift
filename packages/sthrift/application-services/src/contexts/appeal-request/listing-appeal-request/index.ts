import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { create, type CreateListingAppealRequestCommand } from './create.ts';
import { getById, type GetListingAppealRequestByIdCommand } from './get-by-id.ts';
import {
	getAll,
	type GetAllListingAppealRequestsCommand,
	type ListingAppealRequestPageResult,
} from './get-all.ts';
import {
	updateState,
	type UpdateListingAppealRequestStateCommand,
} from './update-state.ts';

export interface ListingAppealRequestApplicationService {
	create: (
		command: CreateListingAppealRequestCommand,
	) => Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference>;
	getById: (
		command: GetListingAppealRequestByIdCommand,
	) => Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference | null>;
	getAll: (
		command: GetAllListingAppealRequestsCommand,
	) => Promise<ListingAppealRequestPageResult>;
	updateState: (
		command: UpdateListingAppealRequestStateCommand,
	) => Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference>;
}

export const ListingAppealRequest = (
	dataSources: DataSources,
): ListingAppealRequestApplicationService => {
	return {
		create: create(dataSources),
		getById: getById(dataSources),
		getAll: getAll(dataSources),
		updateState: updateState(dataSources),
	};
};
