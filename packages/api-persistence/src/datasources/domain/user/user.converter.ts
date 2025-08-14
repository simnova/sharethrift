import { Domain } from '@ocom/api-domain';
import type { UserModel } from '@ocom/api-data-sources-mongoose-models';
import * as ValueObjects from '@ocom/api-domain/dist/src/domain/contexts/user/user/user.value-objects.js';

/**
 * Converter functions between domain and data models
 */

/**
 * Converts User domain props to mongoose model
 */
export function toUserModel(props: Domain.Contexts.User.UserProps): Omit<UserModel, keyof import('@cellix/data-sources-mongoose').MongooseSeedwork.Base> {
	return {
		userType: props.userType,
		isBlocked: props.isBlocked,
		account: {
			accountType: props.account.accountType,
			email: props.account.email,
			username: props.account.username,
			profile: {
				firstName: props.account.profile.firstName,
				lastName: props.account.profile.lastName,
				location: {
					address1: props.account.profile.location.address1,
					address2: props.account.profile.location.address2,
					city: props.account.profile.location.city,
					state: props.account.profile.location.state,
					country: props.account.profile.location.country,
					zipCode: props.account.profile.location.zipCode
				},
				billing: props.account.profile.billing ? {
					subscriptionId: props.account.profile.billing.subscriptionId,
					cybersourceCustomerId: props.account.profile.billing.cybersourceCustomerId
				} : undefined
			}
		}
	};
}

/**
 * Converts mongoose model to User domain props
 */
export function toDomainProps(model: UserModel): Domain.Contexts.User.UserProps {
	return {
		id: model.id,
		schemaVersion: model.schemaVersion,
		userType: model.userType as ValueObjects.UserType,
		isBlocked: model.isBlocked,
		account: {
			accountType: model.account.accountType as ValueObjects.AccountType,
			email: model.account.email,
			username: model.account.username,
			profile: {
				firstName: model.account.profile.firstName,
				lastName: model.account.profile.lastName,
				location: {
					address1: model.account.profile.location.address1,
					address2: model.account.profile.location.address2,
					city: model.account.profile.location.city,
					state: model.account.profile.location.state,
					country: model.account.profile.location.country,
					zipCode: model.account.profile.location.zipCode
				},
				billing: model.account.profile.billing ? {
					subscriptionId: model.account.profile.billing.subscriptionId,
					cybersourceCustomerId: model.account.profile.billing.cybersourceCustomerId
				} : undefined
			}
		},
		createdAt: model.createdAt,
		updatedAt: model.updatedAt
	};
}