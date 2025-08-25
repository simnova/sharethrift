import type { ApiContextSpec } from '@sthrift/api-context-spec';
import { Domain } from '@sthrift/api-domain';
import type { DomainDataSource } from '@sthrift/api-domain';

interface JwtPayload {
	sub: string;
	email: string;
}

export interface ApplicationServices {
	domainDataSource: DomainDataSource;
}

export type PrincipalHints = {
	// placeholder for future hint fields (memberId, communityId, etc.)
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
		const passport = Domain.PassportFactory.forReadOnly();
		console.log(passport);
		if (tokenValidationResult !== null) {
			const { verifiedJwt, openIdConfigKey } = tokenValidationResult;
			if (openIdConfigKey === 'UserPortal') {
				if ((verifiedJwt as { sub: string })?.sub) {
					await Promise.resolve();
				}
			} else if (openIdConfigKey === 'StaffPortal') {
				// staff portal specific logic could go here
			}
		}

		return {
			// expose domain data source so GraphQL resolvers can access repositories / UoWs
			domainDataSource: infrastructureServicesRegistry.dataSources.domainDataSource,
		};
	};

	return {
		forRequest,
	};
};
