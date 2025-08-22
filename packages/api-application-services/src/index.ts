import type { ApiContextSpec } from '@sthrift/api-context-spec';
import { Domain } from '@sthrift/api-domain';
import { 
	MyListingsAllQuery, 
	MyListingsRequestsQuery,
	PauseListingMutation,
	ReinstateListingMutation,
	AppealListingMutation,
	PublishListingMutation,
	EditListingMutation,
	DeleteListingMutation,
	AcceptRequestMutation,
	RejectRequestMutation,
	CloseRequestMutation,
	MessageRequesterMutation,
	DeleteRequestMutation
} from './listing/index.ts';

// Re-export types for external use
export type {
	ListingAllDTO,
	ListingRequestDTO,
	ListingStatus,
	RequestStatus,
	ListingAllPage,
	ListingRequestPage,
	MyListingsAllQueryInput,
	MyListingsRequestsQueryInput
} from './listing/index.ts';

interface JwtPayload {
	sub: string;
	email: string;
}

export interface ApplicationServices {
	// My Listings queries
	myListingsAllQuery: MyListingsAllQuery;
	myListingsRequestsQuery: MyListingsRequestsQuery;
	
	// Listing action mutations (placeholder implementations)
	pauseListingMutation: PauseListingMutation;
	reinstateListingMutation: ReinstateListingMutation;
	appealListingMutation: AppealListingMutation;
	publishListingMutation: PublishListingMutation;
	editListingMutation: EditListingMutation;
	deleteListingMutation: DeleteListingMutation;
	
	// Request action mutations (placeholder implementations)
	acceptRequestMutation: AcceptRequestMutation;
	rejectRequestMutation: RejectRequestMutation;
	closeRequestMutation: CloseRequestMutation;
	messageRequesterMutation: MessageRequesterMutation;
	deleteRequestMutation: DeleteRequestMutation;
}

// biome-ignore lint/complexity/noBannedTypes: temporary type for principal hints
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
			// My Listings queries
			myListingsAllQuery: new MyListingsAllQuery(),
			myListingsRequestsQuery: new MyListingsRequestsQuery(),
			
			// Listing action mutations (placeholder implementations)
			pauseListingMutation: new PauseListingMutation(),
			reinstateListingMutation: new ReinstateListingMutation(),
			appealListingMutation: new AppealListingMutation(),
			publishListingMutation: new PublishListingMutation(),
			editListingMutation: new EditListingMutation(),
			deleteListingMutation: new DeleteListingMutation(),
			
			// Request action mutations (placeholder implementations)
			acceptRequestMutation: new AcceptRequestMutation(),
			rejectRequestMutation: new RejectRequestMutation(),
			closeRequestMutation: new CloseRequestMutation(),
			messageRequesterMutation: new MessageRequesterMutation(),
			deleteRequestMutation: new DeleteRequestMutation(),
		};
	};

	return {
		forRequest,
	};
};
