import type { PersonalUserUpdateInput } from '@sthrift/api-graphql';
import type { DataSources } from '@sthrift/api-persistence';
import type { Domain } from '@sthrift/api-domain';

export interface PersonalUserUpdateCommand {
	personalUserUpdateInput: PersonalUserUpdateInput;
}

export const update = (datasources: DataSources) => {
	return async (
		command: PersonalUserUpdateCommand,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> => {
		let personalUserToReturn:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| undefined;
		await datasources.domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withScopedTransaction(
			async (repo) => {
				if (!command.personalUserUpdateInput.id) {
					throw new Error('personal user id is required');
				}
				const existingPersonalUser = await repo.getById(
					command.personalUserUpdateInput.id,
				);
				if (!existingPersonalUser) {
					throw new Error('personal user not found');
				}
				if (command.personalUserUpdateInput.account?.profile?.firstName) {
					existingPersonalUser.account.profile.firstName =
						command.personalUserUpdateInput.account.profile.firstName;
				}
				if (command.personalUserUpdateInput.account?.profile?.lastName) {
					existingPersonalUser.account.profile.lastName =
						command.personalUserUpdateInput.account.profile.lastName;
				}
				personalUserToReturn = await repo.save(existingPersonalUser);
			},
		);
		if (!personalUserToReturn) {
			throw new Error('personal user update failed');
		}
		return personalUserToReturn;
	};
};
