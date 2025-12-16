/** biome-ignore-all lint/suspicious/noExplicitAny: GraphQL resolver helper utilities require flexible typing for generic field resolution */

import type { Domain } from '@sthrift/domain';
import type {
	FragmentDefinitionNode,
	GraphQLResolveInfo,
	SelectionSetNode,
} from 'graphql';
import { isValidObjectId } from 'mongoose';
import type { GraphContext } from '../init/context.ts';

export const getUserByEmail = async (
	email: string,
	context: GraphContext,
): Promise<
	| Domain.Contexts.User.AdminUser.AdminUserEntityReference
	| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
	| null
> => {
	// Try AdminUser first
	try {
		const adminUser =
			await context.applicationServices.User.AdminUser.queryByEmail({ email });
		if (adminUser) {
			return adminUser;
		}
	} catch {
		// AdminUser not found, continue to PersonalUser
	}

	// Try PersonalUser
	try {
		const personalUser =
			await context.applicationServices.User.PersonalUser.queryByEmail({
				email,
			});
		if (personalUser) {
			return personalUser;
		}
	} catch {
		// PersonalUser not found
	}

	return null;
};

// Boolean check if the current viewer is an admin user
export const currentViewerIsAdmin = async (
	context: GraphContext,
): Promise<boolean> => {
	const currentUserEmail =
		context.applicationServices.verifiedUser?.verifiedJwt?.email;
	if (!currentUserEmail) {
		return false;
	}

	const currentUser = await getUserByEmail(currentUserEmail, context);
	const isAdmin =
		currentUser &&
		'role' in currentUser &&
		currentUser.userType === 'admin-user';

	return !!isAdmin;
};

/**
 * Helper to ensure user is authenticated and throw consistent error if not.
 * Use this in all resolvers requiring authentication for consistent error handling.
 */
export const requireAuthentication = (context: GraphContext): void => {
	if (!context.applicationServices.verifiedUser?.verifiedJwt) {
		throw new Error('Unauthorized: Authentication required');
	}
};

/**
 * Validates and extracts user profile data from JWT with safe fallbacks.
 * Returns sanitized firstName/lastName with defaults for missing values.
 */
export const extractUserProfileFromJwt = (context: GraphContext): {
	email: string;
	firstName: string;
	lastName: string;
} => {
	const jwt = context.applicationServices.verifiedUser?.verifiedJwt;
	if (!jwt?.email) {
		throw new Error(
			'Invalid JWT: email is required but missing from verified token',
		);
	}

	// Provide sensible defaults for missing name fields to avoid database constraint violations
	// B2C tokens may not always include given_name/family_name depending on configuration
	const firstName = jwt.given_name?.trim() || 'User';
	const lastName = jwt.family_name?.trim() || '';

	return {
		email: jwt.email,
		firstName,
		lastName,
	};
};

/**
 * Helper function to populate a User field (PersonalUser or AdminUser) by ID.
 * Used for GraphQL field resolvers that need to resolve User union types.
 */
export const PopulateUserFromField = (fieldName: string) => {
	return async (parent: any, _: unknown, context: GraphContext) => {
		const existingValue = parent[fieldName];
		const existingUserType = existingValue?.userType;

		// Only return early if we have BOTH userType AND a valid id
		if (existingUserType && existingValue?.id) {
			return existingValue;
		}

		let userId: string | undefined;
		if (typeof existingValue === 'string') {
			userId = existingValue;
		} else if (existingValue && typeof existingValue === 'object') {
			if (typeof existingValue.id === 'string') {
				userId = existingValue.id;
			}
		}

		if (!userId && parent[fieldName]) {
			const maybeId = parent[fieldName].toString?.();
			if (typeof maybeId === 'string') {
				userId = maybeId;
			}
		}

		if (userId && isValidObjectId(userId)) {
			// Try AdminUser first
			try {
				const adminUser =
					await context.applicationServices.User.AdminUser.queryById({
						id: userId,
					});
				console.log('[PopulateUserFromField] AdminUser query result:', { 
					userId, 
					adminUser,
					id: adminUser?.id,
					userType: adminUser?.userType
				});
				if (adminUser) {
					// Access properties from the domain entity
					const userData = {
						id: adminUser.id,
						userType: adminUser.userType || 'admin-user',
						account: adminUser.account,
						role: adminUser.role,
						schemaVersion: adminUser.schemaVersion,
						createdAt: adminUser.createdAt,
						updatedAt: adminUser.updatedAt,
					};
					console.log('[PopulateUserFromField] Returning userData:', userData);
					return userData;
				}
			} catch (error) {
				console.log('[PopulateUserFromField] AdminUser query error:', error);
				// AdminUser not found, try PersonalUser
			}

			// Try PersonalUser
			try {
				const personalUser =
					await context.applicationServices.User.PersonalUser.queryById({
						id: userId,
					});
				console.log('[PopulateUserFromField] PersonalUser query result:', { 
					userId, 
					personalUser,
					id: personalUser?.id,
					userType: personalUser?.userType 
				});
				if (personalUser) {
					// Access properties from the domain entity
					const userData = {
						id: personalUser.id,
						userType: personalUser.userType || 'personal-user',
						isBlocked: personalUser.isBlocked,
						hasCompletedOnboarding: personalUser.hasCompletedOnboarding,
						account: personalUser.account,
						schemaVersion: personalUser.schemaVersion,
						createdAt: personalUser.createdAt,
						updatedAt: personalUser.updatedAt,
					};
					console.log('[PopulateUserFromField] Returning userData:', userData);
					return userData;
				}
			} catch (error) {
				console.log('[PopulateUserFromField] PersonalUser query error:', error);
				// PersonalUser not found
			}
		}

		// If we couldn't resolve a user, return null
		console.log('[PopulateUserFromField] Returning null for userId:', userId, 'existingValue:', existingValue);
		return null;
	};
};

export const PopulateItemListingFromField = (fieldName: string) => {
	return async (parent: any, _: unknown, context: GraphContext) => {
		if (parent[fieldName] && isValidObjectId(parent[fieldName].id)) {
			return await context.applicationServices.Listing.ItemListing.queryById({
				id: parent[fieldName].id,
			});
		}
		return parent[fieldName];
	};
};

export function getRequestedFieldPaths(info: GraphQLResolveInfo): string[] {
	const out = new Set<string>();
	const node = info.fieldNodes[0];
	collectFieldPaths(node?.selectionSet, info.fragments, out);
	return Array.from(out);
}

/**
 * Recursively collects all leaf field paths from a GraphQL selection set.
 * Delegates handling of each selection type to specialized helper functions for maintainability.
 *
 * Args:
 *   selectionSet: The current selection set node.
 *   fragments: A map of fragment definitions.
 *   out: A set to accumulate the resulting field paths.
 *   parentPath: The current dot-separated path prefix.
 */
function collectFieldPaths(
	selectionSet: SelectionSetNode | undefined,
	fragments: Record<string, FragmentDefinitionNode>,
	out: Set<string>,
	parentPath = '',
) {
	if (!selectionSet) {
		return;
	}

	for (const selection of selectionSet.selections) {
		switch (selection.kind) {
			case 'Field':
				handleFieldSelection(selection, fragments, out, parentPath);
				break;
			case 'FragmentSpread':
				handleFragmentSpread(selection, fragments, out, parentPath);
				break;
			case 'InlineFragment':
				handleInlineFragment(selection, fragments, out, parentPath);
				break;
		}
	}
}

/**
 * Handles a Field selection node, recursing into sub-selections or adding leaf paths.
 */
function handleFieldSelection(
	selection: Extract<SelectionSetNode['selections'][number], { kind: 'Field' }>,
	fragments: Record<string, FragmentDefinitionNode>,
	out: Set<string>,
	parentPath: string,
) {
	const name = selection.name.value;
	if (name === '__typename') {
		return;
	}

	const path = parentPath ? `${parentPath}.${name}` : name;

	if (selection.selectionSet) {
		collectFieldPaths(selection.selectionSet, fragments, out, path);
	} else {
		out.add(path);
	}
}

/**
 * Handles a FragmentSpread selection node by recursing into the referenced fragment.
 */
function handleFragmentSpread(
	selection: Extract<
		SelectionSetNode['selections'][number],
		{ kind: 'FragmentSpread' }
	>,
	fragments: Record<string, FragmentDefinitionNode>,
	out: Set<string>,
	parentPath: string,
) {
	const fragment = fragments[selection.name.value];
	if (fragment) {
		collectFieldPaths(fragment.selectionSet, fragments, out, parentPath);
	}
}

/**
 * Handles an InlineFragment selection node by recursing into its selection set.
 */
function handleInlineFragment(
	selection: Extract<
		SelectionSetNode['selections'][number],
		{ kind: 'InlineFragment' }
	>,
	fragments: Record<string, FragmentDefinitionNode>,
	out: Set<string>,
	parentPath: string,
) {
	collectFieldPaths(selection.selectionSet, fragments, out, parentPath);
}
