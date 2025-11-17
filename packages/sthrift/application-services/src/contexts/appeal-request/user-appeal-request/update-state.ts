import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface UpdateUserAppealRequestStateCommand {
	id: string;
	state: 'requested' | 'denied' | 'accepted';
}

export const updateState = (datasources: DataSources) => {
	return async (
		command: UpdateUserAppealRequestStateCommand,
	): Promise<Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference> => {
		let appealRequestToReturn:
			| Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference
			| undefined;
		await datasources.domainDataSource.AppealRequest.UserAppealRequest.UserAppealRequestUnitOfWork.withScopedTransaction(
			async (repo) => {
				if (!command.id) {
					throw new Error('appeal request id is required');
				}
				const existingAppealRequest = await repo.getById(command.id);
				if (!existingAppealRequest) {
					throw new Error('appeal request not found');
				}

				existingAppealRequest.state = command.state;

				appealRequestToReturn = await repo.save(existingAppealRequest);
			},
		);
		if (!appealRequestToReturn) {
			throw new Error('appeal request state update failed');
		}
		return appealRequestToReturn;
	};
};
