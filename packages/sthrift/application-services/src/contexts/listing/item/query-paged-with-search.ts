import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import { ItemListingSearchIndexSpec } from '@sthrift/domain';
import { queryPaged } from './query-paged.js';

export interface ItemListingQueryPagedWithSearchCommand {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sharerId?: string;
	sorter?: { field: string; order: 'ascend' | 'descend' };
}

/**
 * Query listings with search fallback to database
 * 
 * Tries cognitive search first if searchText is provided, then falls back
 * to database query if search fails or is not available.
 */
export const queryPagedWithSearchFallback = (
	dataSources: DataSources,
	searchService?: CognitiveSearchDomain,
) => {
	const dbQueryPaged = queryPaged(dataSources);

	return async (
		command: ItemListingQueryPagedWithSearchCommand,
	): Promise<{
		items: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}> => {
		const { searchText } = command;

		// If search text is provided and search service is available, try cognitive search
		if (searchText && searchText.trim() !== '' && searchService) {
			try {
				const options: Record<string, unknown> = {
					top: command.pageSize,
					skip: (command.page - 1) * command.pageSize,
					orderBy: command.sorter
						? [
							`${command.sorter.field} ${command.sorter.order === 'ascend' ? 'asc' : 'desc'}`,
						]
						: ['updatedAt desc'],
				};

			const filter: Record<string, unknown> = {};
			if (command.sharerId) {
				// biome-ignore lint/complexity/useLiteralKeys: filter is Record<string, unknown> requiring bracket notation
				filter['sharerId'] = [command.sharerId];
			}
			if (command.statusFilters) {
				// biome-ignore lint/complexity/useLiteralKeys: filter is Record<string, unknown> requiring bracket notation
				filter['state'] = command.statusFilters;
			}
			if (Object.keys(filter).length > 0) {
				// biome-ignore lint/complexity/useLiteralKeys: options is Record<string, unknown> requiring bracket notation
				options['filter'] = filter;
			}

				// Ensure the search index exists
				await searchService.createIndexIfNotExists(ItemListingSearchIndexSpec);

				const searchResult = await searchService.search(
					ItemListingSearchIndexSpec.name,
					searchText,
					options,
				);

				// Extract IDs from search results and fetch full entities from database
				// This ensures we return complete domain entities with all required fields
				const searchIds = searchResult.results.map(
					(result) => (result.document as { id: string }).id,
				);

				// Fetch full entities from database using the IDs from search results
				const items = await Promise.all(
					searchIds.map(async (id) => {
						const entity =
							await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
								id,
							);
						if (!entity) {
							console.error(
								`Search index consistency issue: Document ID "${id}" returned from search index but not found in database. ` +
								`This may indicate search index is out of sync with the database. ` +
								`Consider triggering a reindex or investigating why the entity was deleted without updating the search index.`
							);
							throw new Error(`Listing entity not found for ID: ${id}`);
						}
						return entity;
					}),
				);

				return {
					items,
					total: searchResult.count || 0,
					page: command.page,
					pageSize: command.pageSize,
				};
			} catch (error) {
				console.error(
					'Cognitive search failed, falling back to database query:',
					error,
				);
				// Fall through to database query
			}
		}

		// Fallback to database query
		return await dbQueryPaged(command);
	};
};

