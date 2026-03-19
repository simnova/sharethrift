import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface PersonalUserUpdateCommand {
	id: string;
	isBlocked?: boolean;
	hasCompletedOnboarding?: boolean;
	account?: {
		accountType?: string;
		username?: string;
		profile?: {
			firstName?: string;
			lastName?: string;
			aboutMe?: string;

			location?: {
				address1: string;
				address2?: string | undefined;
				city: string;
				state: string;
				country: string;
				zipCode: string;
			};

			billing?: {
				cybersourceCustomerId?: string | undefined;
				subscription?: {
					subscriptionId: string;
					planCode: string;
					status: string;
					startDate: Date;
				};
				transactions?:
					| {
							transactionId: string;
							amount: number;
							referenceId: string;
							status: string;
							completedAt: Date;
					  }[]
					| undefined;
			};
		};
	};
}

export const update = (dataSources: DataSources) => {
	return async (
		command: PersonalUserUpdateCommand,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> => {
		let personalUserToReturn:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| undefined;
		await dataSources.domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withScopedTransaction(
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
						existingPersonalUser.account.accountType; // could be replaced by plan code
					existingPersonalUser.account.username =
						command.account.username ?? existingPersonalUser.account.username;
				}

				if (command.account?.profile) {
					console.log('about me', command.account?.profile.aboutMe);
					existingPersonalUser.account.profile.firstName =
						command.account.profile.firstName ??
						existingPersonalUser.account.profile.firstName;
					existingPersonalUser.account.profile.lastName =
						command.account.profile.lastName ??
						existingPersonalUser.account.profile.lastName;
					existingPersonalUser.account.profile.aboutMe =
						command.account.profile.aboutMe ??
						existingPersonalUser.account.profile.aboutMe;
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

				if (command.hasCompletedOnboarding !== undefined) {
					existingPersonalUser.hasCompletedOnboarding =
						command.hasCompletedOnboarding;
				}

				// update transactions if provided

				personalUserToReturn = await repo.save(existingPersonalUser);
			},
		);
		if (!personalUserToReturn) {
			throw new Error('personal user update failed');
		}
		return personalUserToReturn;
	};
};
