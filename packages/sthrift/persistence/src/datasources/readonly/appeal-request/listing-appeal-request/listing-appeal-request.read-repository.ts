import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { ListingAppealRequestRepository } from '../../../domain/appeal-request/listing-appeal-request/listing-appeal-request.repository.ts';
import { ListingAppealRequestConverter } from '../../../domain/appeal-request/listing-appeal-request/listing-appeal-request.domain-adapter.ts';
import { InProcEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { Types } from 'mongoose';
import type { ClientSession } from 'mongoose';

interface ListingAppealRequestPageResult {
	items: Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

export interface ListingAppealRequestReadRepository {
	getById: (
		id: string,
	) => Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference | null>;

	getAll: (args: {
		page: number;
		pageSize: number;
		stateFilters?: string[];
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}) => Promise<ListingAppealRequestPageResult>;
}

export const getListingAppealRequestReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
): ListingAppealRequestReadRepository => {
	const converter = new ListingAppealRequestConverter();
	const placeholderSession = {
		_id: new Types.ObjectId('000000000000000000000000'),
	} as unknown as ClientSession;
	const repository = new ListingAppealRequestRepository(
		passport,
		models.AppealRequest.ListingAppealRequest,
		converter,
		InProcEventBusInstance,
		placeholderSession,
	);

	return {
		getById: (id: string) => {
			return repository.getById(id).then((result) => result ?? null);
		},

		getAll: (args) => {
			// TODO: Implement pagination and filtering
			// For now, return empty result
			return Promise.resolve({
				items: [],
				total: 0,
				page: args.page,
				pageSize: args.pageSize,
			});
		},
	};
};
