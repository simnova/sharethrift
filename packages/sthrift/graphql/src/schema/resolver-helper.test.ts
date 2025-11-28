import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	parse,
	type FieldNode,
	type FragmentDefinitionNode,
	type OperationDefinitionNode,
} from 'graphql';
import type { GraphContext } from '../init/context.ts';
import {
	PopulateItemListingFromField,
	PopulateUserFromField,
	getRequestedFieldPaths,
} from './resolver-helper.ts';

const validObjectId = '507f1f77bcf86cd799439011';

function createGraphContext() {
	const adminUserQueries = {
		queryById: vi.fn(),
		queryByEmail: vi.fn(),
	};
	const personalUserQueries = {
		queryById: vi.fn(),
		queryByEmail: vi.fn(),
	};
	const listingQueries = {
		queryById: vi.fn(),
	};

	const context = {
		applicationServices: {
			User: {
				AdminUser: adminUserQueries,
				PersonalUser: personalUserQueries,
			},
			Listing: {
				ItemListing: listingQueries,
			},
		},
	} as unknown as GraphContext;

	return { context, adminUserQueries, personalUserQueries, listingQueries };
}

function buildResolveInfo(query: string) {
	const documentNode = parse(query);
	const operation = documentNode.definitions.find(
		(definition): definition is OperationDefinitionNode =>
			definition.kind === 'OperationDefinition',
	);
	if (!operation) {
		throw new Error('OperationDefinitionNode not found in query');
	}
	const fieldNode = operation.selectionSet.selections.find(
		(selection): selection is FieldNode =>
			selection.kind === 'Field' && selection.name.value === 'listing',
	);
	if (!fieldNode) {
		throw new Error('FieldNode "listing" not found');
	}

	const fragments = Object.fromEntries(
		documentNode.definitions
			.filter(
				(definition): definition is FragmentDefinitionNode =>
					definition.kind === 'FragmentDefinition',
			)
			.map((fragment) => [fragment.name.value, fragment]),
	);

	return {
		fieldNodes: [fieldNode],
		fragments,
	} as unknown as Parameters<typeof getRequestedFieldPaths>[0];
}

describe('PopulateUserFromField', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('returns the existing value when a userType is already present', async () => {
		const { context, adminUserQueries, personalUserQueries } =
			createGraphContext();
		const parent = {
			owner: {
				id: validObjectId,
				userType: 'personal-users',
			},
		};

		const resolver = PopulateUserFromField('owner');
		const result = await resolver(parent, {}, context);

		expect(result).toBe(parent.owner);
		expect(adminUserQueries.queryById).not.toHaveBeenCalled();
		expect(personalUserQueries.queryById).not.toHaveBeenCalled();
	});

	it('fetches the admin user when the field contains an ObjectId string', async () => {
		const { context, adminUserQueries } = createGraphContext();
		const parent = { owner: validObjectId };
		adminUserQueries.queryById.mockResolvedValue({
			id: validObjectId,
			userType: 'admin-user',
		});

		const resolver = PopulateUserFromField('owner');
		const result = await resolver(parent, {}, context);

		expect(adminUserQueries.queryById).toHaveBeenCalledWith({
			id: validObjectId,
		});
		expect(result).toEqual({ id: validObjectId, userType: 'admin-user' });
	});

	it('falls back to personal user lookup when admin lookup has no match', async () => {
		const { context, adminUserQueries, personalUserQueries } =
			createGraphContext();
		const parent = { owner: validObjectId };
		adminUserQueries.queryById.mockResolvedValue(null);
		personalUserQueries.queryById.mockResolvedValue({
			id: validObjectId,
			userType: 'personal-users',
		});

		const resolver = PopulateUserFromField('owner');
		const result = await resolver(parent, {}, context);

		expect(adminUserQueries.queryById).toHaveBeenCalled();
		expect(personalUserQueries.queryById).toHaveBeenCalledWith({
			id: validObjectId,
		});
		expect(result).toEqual({ id: validObjectId, userType: 'personal-users' });
	});

	it('returns the existing object with a null userType when the value is not resolvable', async () => {
		const { context } = createGraphContext();
		const parent = {
			owner: {
				id: 'not-a-mongo-id',
				name: 'Fallback User',
			},
		};

		const resolver = PopulateUserFromField('owner');
		const result = await resolver(parent, {}, context);

		expect(result).toEqual({
			id: 'not-a-mongo-id',
			name: 'Fallback User',
			userType: null,
		});
	});
});

describe('PopulateItemListingFromField', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('loads the listing by id when the parent field holds an ObjectId string', async () => {
		const { context, listingQueries } = createGraphContext();
		listingQueries.queryById.mockResolvedValue({
			id: validObjectId,
			title: 'Listing',
		});
		const parent = { listing: validObjectId };

		const resolver = PopulateItemListingFromField('listing');
		const result = await resolver(parent, {}, context);

		expect(listingQueries.queryById).toHaveBeenCalledWith({
			id: validObjectId,
		});
		expect(result).toEqual({ id: validObjectId, title: 'Listing' });
	});

	it('returns the original value when the field is already an object', async () => {
		const { context, listingQueries } = createGraphContext();
		const listingObject = { id: 'not-an-object-id', title: 'Existing Listing' };
		const parent = { listing: listingObject };

		const resolver = PopulateItemListingFromField('listing');
		const result = await resolver(parent, {}, context);

		expect(listingQueries.queryById).not.toHaveBeenCalled();
		expect(result).toBe(listingObject);
	});
});

describe('getRequestedFieldPaths', () => {
	it('collects nested selections, fragments, and inline fragments', () => {
		const info = buildResolveInfo(`
			query {
				listing {
					id
					sharer {
						id
						profile {
							firstName
						}
					}
					...ListingExtra
					... on ItemListing {
						reports {
							id
						}
					}
					__typename
				}
			}

			fragment ListingExtra on ItemListing {
				state
				category
			}
		`);

		const fields = getRequestedFieldPaths(info);

		expect(fields).toEqual(
			expect.arrayContaining([
				'id',
				'sharer.id',
				'sharer.profile.firstName',
				'state',
				'category',
				'reports.id',
			]),
		);
		expect(fields).not.toContain('__typename');
	});
});
