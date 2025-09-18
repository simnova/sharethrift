import type { ApiContextSpec } from '@sthrift/api-context-spec';
import { Domain } from '@sthrift/api-domain';
import {
	User,
	type UserContextApplicationService,
} from './contexts/user/index.ts';
import type { PaymentApplicationService } from './payment-application-service.js';
import { DefaultPaymentApplicationService } from './payment-application-service.js';

import { 
    ReservationRequest, 
    type ReservationRequestContextApplicationService 
} from './contexts/reservation-request/index.ts';

export interface ApplicationServices {
	User: UserContextApplicationService;
	ReservationRequest: ReservationRequestContextApplicationService;
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

// biome-ignore lint/complexity/noBannedTypes: principal hints type configuration
export type PrincipalHints = {};

export interface AppServicesHost<S> {
	forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
}

export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;

export const buildApplicationServicesFactory = (
	infrastructureServicesRegistry: ApiContextSpec,
): ApplicationServicesFactory => {
    const paymentApplicationService = new DefaultPaymentApplicationService(infrastructureServicesRegistry.paymentService);

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
					passport = Domain.PassportFactory.forSystem(); // temporary create system passport, change to forPersonalUser when it is ready
				}
			}
		}

		const dataSources =
			infrastructureServicesRegistry.dataSourcesFactory.withPassport(passport);

		return {
			User: User(dataSources),
			get verifiedUser(): VerifiedUser | null {
				return { ...tokenValidationResult, hints: hints };
			},
            Payment: paymentApplicationService,
            ReservationRequest: ReservationRequest(dataSources),
		};
	};

	return {
		forRequest,
	};
};
