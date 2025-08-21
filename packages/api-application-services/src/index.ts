import type { ApiContextSpec } from '@sthrift/api-context-spec';
import { Domain } from '@sthrift/api-domain';
import type { ItemListingRepository, ItemListingProps } from '@sthrift/api-domain';
import { MyListingsAllQuery, MyListingsRequestsQuery, MockListingService } from './listing/index.ts';

interface JwtPayload {
	sub: string;
	email: string;
}

export interface ApplicationServices {
	readonly myListingsAllQuery: MyListingsAllQuery;
	readonly myListingsRequestsQuery: MyListingsRequestsQuery;
}

// biome-ignore lint/complexity/noBannedTypes: empty object type for future extension
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

		// Initialize listing services with mock data
		const mockListingService = new MockListingService();
		const itemListingRepository = {} as ItemListingRepository<ItemListingProps>; // TODO: Get from infrastructure services registry
		
		const myListingsAllQuery = new MyListingsAllQuery(itemListingRepository, mockListingService);
		const myListingsRequestsQuery = new MyListingsRequestsQuery(itemListingRepository, mockListingService);

		return {
			myListingsAllQuery,
			myListingsRequestsQuery,
		};
	};

	return {
		forRequest,
	};
};
