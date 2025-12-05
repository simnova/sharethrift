import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { UserAppealRequestRepository } from '../../../domain/appeal-request/user-appeal-request/user-appeal-request.repository.ts';
import { UserAppealRequestConverter } from '../../../domain/appeal-request/user-appeal-request/user-appeal-request.domain-adapter.ts';
import { InProcEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { Types } from 'mongoose';
import type { ClientSession } from 'mongoose';

interface UserAppealRequestPageResult {
	items: Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

export interface UserAppealRequestReadRepository {
	getById: (
		id: string,
	) => Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference | null>;

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
	const placeholderSession = {
		_id: new Types.ObjectId('000000000000000000000000'),
	} as unknown as ClientSession;
	const repository = new UserAppealRequestRepository(
		passport,
		models.AppealRequest.UserAppealRequest,
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
