import type { ApiContextSpec } from '@ocom/api-context-spec';
import { Domain } from '@ocom/api-domain';

interface JwtPayload {
	sub: string;
	email: string;
}

export interface ApplicationServices {
    context: ApiContextSpec;
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
	console.log(infrastructureServicesRegistry);
	const forRequest = async (
		rawAuthHeader?: string,
		hints?: PrincipalHints,
	): Promise<ApplicationServices> => {
		console.log('rawAuthHeader: ', rawAuthHeader);
		console.log('hints: ', hints);
		const access_token = rawAuthHeader?.replace('Bearer ', '');
		const tokenValidationResult =
			await infrastructureServicesRegistry.tokenValidationService.verifyJwt<JwtPayload>(
				access_token as string,
			);
		// const tokenValidationResult = { verifiedJwt: { sub: '123'}, openIdConfigKey: 'AccountPortal'};
		const passport = Domain.PassportFactory.forReadOnly();
		console.log(passport);
		if (tokenValidationResult !== null) {
			const { verifiedJwt, openIdConfigKey } = tokenValidationResult;
			if (openIdConfigKey === 'UserPortal') {
				// when datastore infra service is available, can query for actual documents here

				if ((verifiedJwt as { sub: string })?.sub) {
					// Query for end user document by externalId
					await Promise.resolve();
				}

				// const endUser = { id: '123' } as Domain.Contexts.User.EndUser.EndUserEntityReference;
				// const member = { id: '456', community: { id: '789'}, accounts: [{ user: { id: '123'} }]} as unknown as Domain.Contexts.Community.Member.MemberEntityReference;
				// const community = { id: '789'} as Domain.Contexts.Community.Community.CommunityEntityReference;
				// passport = Domain.PassportFactory.forMember(endUser, member, community);
			} else if (openIdConfigKey === 'StaffPortal') {
				// const staffUser = {} as Domain.Contexts.User.StaffUser.StaffUserEntityReference;
				// passport = Domain.PassportFactory.forStaffUser(staffUser);
			}
		}

        return {
            context: infrastructureServicesRegistry, // Expose the context
        }
    }

	return {
		forRequest,
	};
};
