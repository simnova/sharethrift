import type { ApiContextSpec } from '@sthrift/context-spec';
import { Domain } from '@sthrift/domain';
import {
	User,
	type UserContextApplicationService,
} from './contexts/user/index.ts';
import type { PaymentApplicationService } from './payment-application-service.js';
import { DefaultPaymentApplicationService } from './payment-application-service.js';

import {
	ReservationRequest,
	type ReservationRequestContextApplicationService,
} from './contexts/reservation-request/index.ts';

import {
	Conversation,
	type ConversationContextApplicationService,
} from './contexts/conversation/index.ts';

import {
	Listing,
	type ListingContextApplicationService,
} from './contexts/listing/index.ts';

import {
	AppealRequest,
	type AppealRequestContextApplicationService,
} from './contexts/appeal-request/index.ts';

export interface ApplicationServices {
	User: UserContextApplicationService;
	Conversation: ConversationContextApplicationService;
	Listing: ListingContextApplicationService;
	ReservationRequest: ReservationRequestContextApplicationService;
	AppealRequest: AppealRequestContextApplicationService;
	get verifiedUser(): VerifiedUser | null;
	Payment: PaymentApplicationService;
}

export interface VerifiedJwt {
	given_name: string;
	family_name: string;
	email: string;
	sub: string;
	oid?: string;
	unique_name?: string;
	roles?: string[];
}

export interface VerifiedUser {
	verifiedJwt?: VerifiedJwt | undefined;
	openIdConfigKey?: string | undefined;
	hints?: PrincipalHints | undefined;
}

export type PrincipalHints = Record<string, unknown>;

export interface AppServicesHost<S> {
	forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
}

export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;

export const buildApplicationServicesFactory = (
	infrastructureServicesRegistry: ApiContextSpec,
): ApplicationServicesFactory => {
	const paymentApplicationService = new DefaultPaymentApplicationService(
		infrastructureServicesRegistry.paymentService,
	);

	const forRequest = async (
		rawAuthHeader?: string,
		hints?: PrincipalHints,
	): Promise<ApplicationServices> => {
		const accessToken = rawAuthHeader?.replace(/^Bearer\s+/i, '').trim();
		const tokenValidationResult = accessToken
			? await infrastructureServicesRegistry.tokenValidationService.verifyJwt<VerifiedJwt>(
					accessToken,
				)
			: null;
		let passport = Domain.PassportFactory.forGuest();
		if (tokenValidationResult !== null) {
			const { verifiedJwt, openIdConfigKey } = tokenValidationResult;
			const { readonlyDataSource } =
				infrastructureServicesRegistry.dataSourcesFactory.withSystemPassport();
			if (openIdConfigKey === 'UserPortal') {
				const personalUser =
					await readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail(
						verifiedJwt.email,
					);

				if (personalUser) {
					console.log(passport);
					passport = Domain.PassportFactory.forPersonalUser(personalUser);
				}
			}
		}

		const dataSources =
			infrastructureServicesRegistry.dataSourcesFactory.withPassport(
				passport,
				infrastructureServicesRegistry.messagingService,
			);

		return {
			User: User(dataSources),
			get verifiedUser(): VerifiedUser | null {
				return { ...tokenValidationResult, hints: hints };
			},
			Payment: paymentApplicationService,
			ReservationRequest: ReservationRequest(dataSources),
			Listing: Listing(dataSources),
			Conversation: Conversation(dataSources),
			AppealRequest: AppealRequest(dataSources),
		};
	};

	return {
		forRequest,
	};
};

export type { PersonalUserUpdateCommand } from './contexts/user/personal-user/update.ts';
export { createOnAcceptance } from './contexts/conversation/conversation/create-on-acceptance.ts';
export type { ConversationCreateOnAcceptanceCommand } from './contexts/conversation/conversation/create-on-acceptance.ts';
