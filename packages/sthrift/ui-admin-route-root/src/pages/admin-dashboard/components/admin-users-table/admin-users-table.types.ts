// Type definitions for Admin Users table

export interface AdminUserData {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	accountCreated: string;
	status: 'Active' | 'Blocked';
	isBlocked: boolean;
	email?: string;
	userType?: string;
	reportCount?: number;
}

export interface AdminUsersTableProps {
	data: AdminUserData[];
	searchText: string;
	statusFilters: string[];
	sorter: { field: string | null; order: 'ascend' | 'descend' | null };
	currentPage: number;
	pageSize: number;
	total: number;
	loading?: boolean;
	onSearch: (value: string) => void;
	onStatusFilter: (checkedValues: string[]) => void;
	onTableChange: (
		pagination: unknown,
		filters: unknown,
		sorter: unknown,
	) => void;
	onPageChange: (page: number) => void;
	onAction: (action: 'block' | 'unblock' | 'view-profile' | 'view-report', userId: string) => void;
}
