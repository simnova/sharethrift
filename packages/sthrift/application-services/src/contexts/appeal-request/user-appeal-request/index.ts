import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { create, type CreateUserAppealRequestCommand } from './create.ts';
import { getById, type GetUserAppealRequestByIdCommand } from './get-by-id.ts';
import {
	getAll,
	type GetAllUserAppealRequestsCommand,
	type UserAppealRequestPageResult,
} from './get-all.ts';
import {
	updateState,
	type UpdateUserAppealRequestStateCommand,
} from './update-state.ts';

export interface UserAppealRequestApplicationService {
	create: (
		command: CreateUserAppealRequestCommand,
	) => Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference>;
	getById: (
		command: GetUserAppealRequestByIdCommand,
	) => Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference | null>;
	getAll: (
		command: GetAllUserAppealRequestsCommand,
	) => Promise<UserAppealRequestPageResult>;
	updateState: (
		command: UpdateUserAppealRequestStateCommand,
	) => Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference>;
}

export const UserAppealRequest = (
	dataSources: DataSources,
): UserAppealRequestApplicationService => {
	return {
		create: create(dataSources),
		getById: getById(dataSources),
		getAll: getAll(dataSources),
		updateState: updateState(dataSources),
	};
};
