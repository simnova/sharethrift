import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface PersonalUserUpdateCommand {
	id: string;
	isBlocked?: boolean;
	account?: {
		accountType?: string;
		username?: string;
		profile?: {
			firstName?: string;
			lastName?: string;

			location?: {
				address1: string;
				address2?: string | undefined;
				city: string;
				state: string;
				country: string;
				zipCode: string;
			};

            billing?: {
				subscriptionId: string;
				cybersourceCustomerId: string;
			};
		};

		// TBD: Billing info
	};
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
				if (!command.id) {
					throw new Error('personal user id is required');
				}
				const existingPersonalUser = await repo.getById(command.id);
				if (!existingPersonalUser) {
					throw new Error('personal user not found');
				}

				if (command.isBlocked !== undefined) {
					existingPersonalUser.isBlocked = command.isBlocked;
				}

				if (command.account) {
					existingPersonalUser.account.accountType =
						command.account.accountType ??
						existingPersonalUser.account.accountType;
					existingPersonalUser.account.username =
						command.account.username ?? existingPersonalUser.account.username;
				}

				if (command.account?.profile) {
					existingPersonalUser.account.profile.firstName =
						command.account.profile.firstName ??
						existingPersonalUser.account.profile.firstName;
					existingPersonalUser.account.profile.lastName =
						command.account.profile.lastName ??
						existingPersonalUser.account.profile.lastName;
				}
				if (command.account?.profile?.location) {
					existingPersonalUser.account.profile.location.address1 =
						command.account.profile.location.address1;
					existingPersonalUser.account.profile.location.address2 =
						command.account.profile.location.address2 ?? '';
					existingPersonalUser.account.profile.location.city =
						command.account.profile.location.city;
					existingPersonalUser.account.profile.location.state =
						command.account.profile.location.state;
					existingPersonalUser.account.profile.location.country =
						command.account.profile.location.country;
					existingPersonalUser.account.profile.location.zipCode =
						command.account.profile.location.zipCode;
				}

                if (command.account?.profile?.billing) {
                    existingPersonalUser.account.profile.billing.subscriptionId =
                        command.account.profile.billing.subscriptionId;
                    existingPersonalUser.account.profile.billing.cybersourceCustomerId =
                        command.account.profile.billing.cybersourceCustomerId;
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
