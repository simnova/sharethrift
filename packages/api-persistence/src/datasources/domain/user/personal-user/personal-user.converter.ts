import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';

export class PersonalUserConverter 
	extends MongooseSeedwork.MongoTypeConverter<
		Domain.Contexts.User.PersonalUser.PersonalUserProps, 
		Models.User.PersonalUser
	> 
{
	toDomain(doc: Models.User.PersonalUser): Domain.Contexts.User.PersonalUser.PersonalUserProps {
		return {
			id: doc._id?.toString() || doc.id,
			userType: doc.userType,
			isBlocked: doc.isBlocked,
			schemaVersion: doc.schemaVersion,
			account: {
				accountType: doc.account.accountType,
				email: doc.account.email,
				username: doc.account.username,
				profile: {
					firstName: doc.account.profile.firstName,
					lastName: doc.account.profile.lastName,
					location: {
						address1: doc.account.profile.location.address1,
						address2: doc.account.profile.location.address2,
						city: doc.account.profile.location.city,
						state: doc.account.profile.location.state,
						country: doc.account.profile.location.country,
						zipCode: doc.account.profile.location.zipCode,
					},
					billing: doc.account.profile.billing ? {
						subscriptionId: doc.account.profile.billing.subscriptionId,
						cybersourceCustomerId: doc.account.profile.billing.cybersourceCustomerId,
					} : undefined,
				},
			},
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}

	toPersistence(domain: Domain.Contexts.User.PersonalUser.PersonalUserProps): Models.User.PersonalUser {
		return {
			_id: domain.id as unknown as Models.User.PersonalUser['_id'],
			userType: domain.userType,
			isBlocked: domain.isBlocked,
			schemaVersion: domain.schemaVersion,
			account: {
				accountType: domain.account.accountType,
				email: domain.account.email,
				username: domain.account.username,
				profile: {
					firstName: domain.account.profile.firstName,
					lastName: domain.account.profile.lastName,
					location: {
						address1: domain.account.profile.location.address1,
						address2: domain.account.profile.location.address2,
						city: domain.account.profile.location.city,
						state: domain.account.profile.location.state,
						country: domain.account.profile.location.country,
						zipCode: domain.account.profile.location.zipCode,
					},
					billing: domain.account.profile.billing ? {
						subscriptionId: domain.account.profile.billing.subscriptionId,
						cybersourceCustomerId: domain.account.profile.billing.cybersourceCustomerId,
					} : undefined,
				},
			},
			createdAt: domain.createdAt,
			updatedAt: domain.updatedAt,
		} as Models.User.PersonalUser;
	}
}