import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface CreateUserAppealRequestCommand {
	userId: string;
	reason: string;
	blockerId: string;
}

export const create = (dataSources: DataSources) => {
	return async (
		command: CreateUserAppealRequestCommand,
	): Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference> => {
		let appealRequestToReturn:
			| Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference
			| undefined;
		await dataSources.domainDataSource.AppealRequest.UserAppealRequest.UserAppealRequestUnitOfWork.withScopedTransaction(
			async (repo) => {
				const newAppealRequest = await repo.getNewInstance(
					command.userId,
					command.reason,
					command.blockerId,
				);
				appealRequestToReturn = await repo.save(newAppealRequest);
			},
		);
		if (!appealRequestToReturn) {
			throw new Error('Failed to create user appeal request');
		}
		return appealRequestToReturn;
	};
};
