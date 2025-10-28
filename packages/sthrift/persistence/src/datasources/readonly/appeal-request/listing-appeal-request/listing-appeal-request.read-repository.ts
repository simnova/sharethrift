import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { ListingAppealRequestRepository } from '../../../domain/appeal-request/listing-appeal-request/listing-appeal-request.repository.ts';
import { ListingAppealRequestConverter } from '../../../domain/appeal-request/listing-appeal-request/listing-appeal-request.domain-adapter.ts';
import { InProcEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { Types } from 'mongoose';

export interface ListingAppealRequestPageResult {
	items: Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

export interface ListingAppealRequestReadRepository {
	getById: (
		id: string,
	) => Promise<
		// biome-ignore lint/suspicious/noExplicitAny: Generic type parameter from domain aggregate
		Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequest<any> | null
	>;

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
	const repository = new ListingAppealRequestRepository(
		passport,
		models.AppealRequest.ListingAppealRequest,
		converter,
		InProcEventBusInstance,
		// biome-ignore lint/suspicious/noExplicitAny: Placeholder session for read-only repository
		new Types.ObjectId('000000000000000000000000') as any,
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
