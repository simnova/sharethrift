import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface PersonalUserCreateCommand {
	firstName: string;
	lastName: string;
	email: string;
}

export const createIfNotExists = (dataSources: DataSources) => {
	return async (
		command: PersonalUserCreateCommand,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> => {
		const existingPersonalUser =
			await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail(
				command.email,
			);
		if (existingPersonalUser) {
			return existingPersonalUser;
		}
		let PersonalUserToReturn:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| undefined;
		await dataSources.domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withScopedTransaction(
			async (repo) => {
				const newPersonalUser = await repo.getNewInstance(
					command.email,
					command.firstName,
					command.lastName,
				);
				PersonalUserToReturn = await repo.save(newPersonalUser);
			},
		);
		if (!PersonalUserToReturn) {
			throw new Error('personal user not found');
		}
		return PersonalUserToReturn;
	};
};
