import type { ApiContextSpec } from '@sthrift/api-context-spec';
import { Domain } from '@sthrift/api-domain';
import {
	User,
	type UserContextApplicationService,
} from './contexts/user/index.ts';

export interface ApplicationServices {
	User: UserContextApplicationService;
	get verifiedUser(): VerifiedUser | null;
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

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type PrincipalHints = {
	// memberId: string | undefined;
	// communityId: string | undefined;
};
 
export interface AppServicesHost<S> {
	forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
	// forSystem can be added later without breaking Cellix API:
	// forSystem?: (opts?: unknown) => Promise<S>;
}
 
export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;
 
export const buildApplicationServicesFactory = (
	infrastructureServicesRegistry: ApiContextSpec,
): ApplicationServicesFactory => {
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
			} else if (openIdConfigKey === 'StaffPortal') {
				const staffUser = undefined;
				// const staffUser = await readonlyDataSource.User.StaffUser.StaffUserReadRepo.getByExternalId(verifiedJwt.sub);
				if (staffUser) {
					// passport = Domain.PassportFactory.forStaffUser(staffUser);
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
		};
	};
 
	return {
		forRequest,
	};
};