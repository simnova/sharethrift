export interface AdminAppealData {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	reason: string;
	state: 'requested' | 'accepted' | 'denied';
	type: 'user' | 'listing';
	createdAt: string;
	updatedAt: string;
}

export interface AdminAppealsTableProps {
	data: AdminAppealData[];
	searchText: string;
	statusFilters: string[];
	sorter?: {
		field: string;
		order: 'ascend' | 'descend';
	};
	currentPage: number;
	pageSize: number;
	total: number;
	loading?: boolean;
	onSearch: (text: string) => void;
	onStatusFilter: (filters: string[]) => void;
	onTableChange: (pagination: unknown, filters: unknown, sorter: unknown) => void;
	onPageChange: (page: number, pageSize: number) => void;
	onAction: (action: 'accept' | 'deny' | 'view-user', appealId: string) => void;
}
