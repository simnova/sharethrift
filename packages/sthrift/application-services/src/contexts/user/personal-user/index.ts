import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { type PersonalUserQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	createIfNotExists,
	type PersonalUserCreateCommand,
} from './create-if-not-exists.ts';
import {
	queryByEmail,
	type PersonalUserQueryByEmailCommand,
} from './query-by-email.ts';
import {
	getAllUsers,
	type GetAllUsersCommand,
	type PersonalUserPageResult,
} from './get-all-users.ts';
import { update, type PersonalUserUpdateCommand } from './update.ts';
import {
type PaymentResponse,
	type ProcessPaymentCommand,
	processPayment,
} from './process-payment.ts';

export interface PersonalUserApplicationService {
	createIfNotExists: (
		command: PersonalUserCreateCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
	queryById: (
		command: PersonalUserQueryByIdCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
	update: (
		command: PersonalUserUpdateCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
	queryByEmail: (
		email: PersonalUserQueryByEmailCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
	getAllUsers: (command: GetAllUsersCommand) => Promise<PersonalUserPageResult>;
	processPayment: (command: ProcessPaymentCommand) => Promise<PaymentResponse>;
}

export const PersonalUser = (
	dataSources: DataSources,
): PersonalUserApplicationService => {
	return {
		createIfNotExists: createIfNotExists(dataSources),
		queryById: queryById(dataSources),
		update: update(dataSources),
		queryByEmail: queryByEmail(dataSources),
		getAllUsers: getAllUsers(dataSources),
		processPayment: processPayment(dataSources),
	};
};

export type {
	GetAllUsersCommand,
	PersonalUserPageResult,
} from './get-all-users.ts';

export type { PaymentResponse } from './process-payment.ts';