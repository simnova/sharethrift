import { useQuery, useMutation } from '@apollo/client/react';
import { AdminAppealsTable } from './admin-appeals-table.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useState } from 'react';
import { message } from 'antd';
import {
	AdminAppealsTableContainerGetAllUserAppealRequestsDocument,
	AdminAppealsTableContainerUpdateUserAppealRequestStateDocument,
	AppealRequestState,
} from '../../../../../../generated.tsx';
import type { AdminAppealData } from './admin-appeals-table.types.ts';

export const AdminAppealsTableContainer: React.FC = () => {
	const [searchText, setSearchText] = useState('');
	const [statusFilters, setStatusFilters] = useState<string[]>([]);
	const [sorter, setSorter] = useState<{
		field: string;
		order: 'ascend' | 'descend';
	} | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const { data, loading, error, refetch } = useQuery(
		AdminAppealsTableContainerGetAllUserAppealRequestsDocument,
		{
			variables: {
				input: {
					page: currentPage,
					pageSize: pageSize,
					stateFilters: statusFilters.length > 0 ? statusFilters : undefined,
					sorter: sorter
						? {
								field: sorter.field,
								direction: sorter.order === 'ascend' ? 'ASC' : 'DESC',
							}
						: undefined,
				},
			},
		},
	);

	const [updateAppealState] = useMutation(
		AdminAppealsTableContainerUpdateUserAppealRequestStateDocument,
	);

	const handleSearch = (text: string) => {
		setSearchText(text);
		setCurrentPage(1);
	};

	const handleStatusFilter = (filters: string[]) => {
		setStatusFilters(filters);
		setCurrentPage(1);
	};

	const handleTableChange = (
		_pagination: unknown,
		filters: unknown,
		sorter: unknown,
	) => {
		// Handle sorting
		if (sorter && typeof sorter === 'object' && 'field' in sorter) {
			const { field, order } = sorter as {
				field: string;
				order?: 'ascend' | 'descend';
			};
			if (order) {
				setSorter({ field, order });
			} else {
				setSorter(null);
			}
		}
	};

	const handlePageChange = (page: number, pageSize: number) => {
		setCurrentPage(page);
		setPageSize(pageSize);
	};

	const handleAction = async (
		action: 'accept' | 'deny' | 'view-user',
		appealId: string,
	) => {
		if (action === 'view-user') {
			// Navigate to user profile
			console.log('Navigate to user:', appealId);
			return;
		}

		try {
			const newState =
				action === 'accept'
					? AppealRequestState.Accepted
					: AppealRequestState.Denied;

			await updateAppealState({
				variables: {
					input: {
						id: appealId,
						state: newState,
					},
				},
			});

			message.success(
				`Appeal ${action === 'accept' ? 'accepted' : 'denied'} successfully`,
			);
			refetch();
		} catch (error) {
			console.error(`Failed to ${action} appeal:`, error);
			message.error(`Failed to ${action} appeal. Please try again.`);
		}
	};

	const appealsList = data?.getAllUserAppealRequests?.items || [];

	// Filter by search text
	const filteredAppeals = searchText
		? appealsList.filter(
				(appeal) =>
					appeal.user.account?.profile?.firstName
						?.toLowerCase()
						.includes(searchText.toLowerCase()) ||
					appeal.user.account?.profile?.lastName
						?.toLowerCase()
						.includes(searchText.toLowerCase()) ||
					appeal.user.account?.email
						?.toLowerCase()
						.includes(searchText.toLowerCase()),
			)
		: appealsList;

	const appealsData: AdminAppealData[] = filteredAppeals.map((appeal) => ({
		id: appeal.id,
		userId: appeal.user.id,
		userName: `${appeal.user.account?.profile?.firstName || ''} ${appeal.user.account?.profile?.lastName || ''}`.trim(),
		userEmail: appeal.user.account?.email || '',
		reason: appeal.reason,
		state: appeal.state as 'REQUESTED' | 'ACCEPTED' | 'DENIED',
		type: appeal.type as 'USER' | 'LISTING',
		createdAt: appeal.createdAt,
		updatedAt: appeal.updatedAt,
	}));

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={!!data?.getAllUserAppealRequests}
			hasDataComponent={
				<AdminAppealsTable
					data={appealsData}
					searchText={searchText}
					statusFilters={statusFilters}
					sorter={sorter || undefined}
					currentPage={currentPage}
					pageSize={pageSize}
					total={data?.getAllUserAppealRequests?.total || 0}
					loading={loading}
					onSearch={handleSearch}
					onStatusFilter={handleStatusFilter}
					onTableChange={handleTableChange}
					onPageChange={handlePageChange}
					onAction={handleAction}
				/>
			}
		/>
	);
};
