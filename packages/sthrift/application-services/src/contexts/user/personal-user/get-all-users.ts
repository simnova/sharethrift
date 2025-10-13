import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';

export interface GetAllUsersCommand {
	page: number;
	pageSize: number;
	searchText?: string | undefined;
	statusFilters?: string[] | undefined;
	sorter?: { field: string; order: string } | undefined;
}

export interface PersonalUserPageResult {
	items: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[];
	total: number;
	page: number;
	pageSize: number;
}

export const getAllUsers = (datasources: DataSources) => {
	return async (
		command: GetAllUsersCommand,
	): Promise<PersonalUserPageResult> => {
		// Get ALL users first (no limit/skip yet)
		let users = await datasources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getAll();
		
		// Apply search filter if provided
		if (command.searchText && command.searchText.trim() !== '') {
			const searchLower = command.searchText.toLowerCase();
			users = users.filter((user) => {
				const email = user.account?.email?.toLowerCase() || '';
				const username = user.account?.username?.toLowerCase() || '';
				const firstName = user.account?.profile?.firstName?.toLowerCase() || '';
				const lastName = user.account?.profile?.lastName?.toLowerCase() || '';
				
				return (
					email.includes(searchLower) ||
					username.includes(searchLower) ||
					firstName.includes(searchLower) ||
					lastName.includes(searchLower)
				);
			});
		}
		
		// Apply status filters if provided
		if (command.statusFilters && command.statusFilters.length > 0) {
			users = users.filter((user) => {
				// Map filters like "Active"/"Blocked" to isBlocked boolean
				const isActive = command.statusFilters?.includes('Active');
				const isBlocked = command.statusFilters?.includes('Blocked');
				
				if (isActive && !isBlocked) {
					return !user.isBlocked;
				}
				if (isBlocked && !isActive) {
					return user.isBlocked;
				}
				return true; // Both selected or other filters
			});
		}
		
		// Apply sorting if provided
		if (command.sorter?.field && command.sorter?.order) {
			const { field, order } = command.sorter;
			const direction = order === 'ascend' ? 1 : -1;
			
			users.sort((a, b) => {
				let aVal: string | number;
				let bVal: string | number;
				
				switch (field) {
					case 'email':
						aVal = a.account?.email || '';
						bVal = b.account?.email || '';
						break;
					case 'username':
						aVal = a.account?.username || '';
						bVal = b.account?.username || '';
						break;
					case 'firstName':
						aVal = a.account?.profile?.firstName || '';
						bVal = b.account?.profile?.firstName || '';
						break;
					case 'lastName':
						aVal = a.account?.profile?.lastName || '';
						bVal = b.account?.profile?.lastName || '';
						break;
					case 'accountCreated':
					case 'createdAt':
						aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
						bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
						break;
					case 'status':
						aVal = a.isBlocked ? 1 : 0;
						bVal = b.isBlocked ? 1 : 0;
						break;
					default:
						return 0;
				}
				
				if (typeof aVal === 'string' && typeof bVal === 'string') {
					return aVal.localeCompare(bVal) * direction;
				}
				
				let comparison = 0;
				if (aVal < bVal) {
					comparison = -1;
				} else if (aVal > bVal) {
					comparison = 1;
				}
				return comparison * direction;
			});
		}
		
		// Count TOTAL after filtering but BEFORE pagination
		const total = users.length;
		
		// Apply pagination (slice the array)
		const skip = (command.page - 1) * command.pageSize;
		const paginatedUsers = users.slice(skip, skip + command.pageSize);
		
		return {
			items: paginatedUsers,
			total: total, // Total count BEFORE pagination
			page: command.page,
			pageSize: command.pageSize,
		};
	};
};