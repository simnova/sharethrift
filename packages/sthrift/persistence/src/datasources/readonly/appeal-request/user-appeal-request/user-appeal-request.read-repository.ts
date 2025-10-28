import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { UserAppealRequestRepository } from '../../../domain/appeal-request/user-appeal-request/user-appeal-request.repository.ts';
import { UserAppealRequestConverter } from '../../../domain/appeal-request/user-appeal-request/user-appeal-request.domain-adapter.ts';
import { InProcEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { Types } from 'mongoose';

export interface UserAppealRequestPageResult {
	items: Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

export interface UserAppealRequestReadRepository {
	getById: (
		id: string,
	) => Promise<
		// biome-ignore lint/suspicious/noExplicitAny: Generic type parameter from domain aggregate
		Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequest<any> | null
	>;

	getAll: (args: {
		page: number;
		pageSize: number;
		stateFilters?: string[];
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}) => Promise<UserAppealRequestPageResult>;
}

export const getUserAppealRequestReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
): UserAppealRequestReadRepository => {
	const converter = new UserAppealRequestConverter();
	const repository = new UserAppealRequestRepository(
		passport,
		models.AppealRequest.UserAppealRequest,
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
