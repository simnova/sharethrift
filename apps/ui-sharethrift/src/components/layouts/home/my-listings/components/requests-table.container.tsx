import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useState } from 'react';
import { HomeRequestsTableContainerMyListingsRequestsDocument } from '../../../../../generated.tsx';
import { RequestsTable } from './requests-table.tsx';

export interface RequestsTableContainerProps {
	currentPage: number;
	onPageChange: (page: number) => void;
}

export const RequestsTableContainer: React.FC<RequestsTableContainerProps> = ({
	currentPage,
	onPageChange,
}) => {
	const [searchText, setSearchText] = useState('');
	const [statusFilters, setStatusFilters] = useState<string[]>([]);
	const [sorter, setSorter] = useState<{
		field: string | null;
		order: 'ascend' | 'descend' | null;
	}>({ field: null, order: null });
	const pageSize = 6;

	const { data, loading, error } = useQuery(
		HomeRequestsTableContainerMyListingsRequestsDocument,
		{
			variables: {
				page: currentPage,
				pageSize: pageSize,
				searchText: searchText,
				statusFilters: statusFilters,
				sorter: { field: sorter.field ?? '', order: sorter.order ?? '' },
				sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
			},
			fetchPolicy: 'network-only',
		},
	);

	const requests = data?.myListingsRequests?.items ?? [];
	const total = data?.myListingsRequests?.total ?? 0;

	const handleSearch = (value: string) => {
		setSearchText(value);
		onPageChange(1);
	};

	const handleStatusFilter = (checkedValues: string[]) => {
		setStatusFilters(checkedValues);
		onPageChange(1);
	};

	const handleTableChange = (
		_pagination: unknown,
		_filters: unknown,
		sorter: unknown,
	) => {
		const typedSorter = sorter as {
			field?: string;
			order?: 'ascend' | 'descend';
		};
		setSorter({
			field: typedSorter.field || null,
			order: typedSorter.order || null,
		});
		onPageChange(1);
	};

	const handleAction = (action: string, requestId: string) => {
		// Implement actions based on status
		switch (action) {
			case 'accept':
				// TODO: Call acceptReservationRequest mutation
				console.log(`Accepting request ${requestId}`);
				// Future: Trigger GraphQL mutation to accept reservation
				// This will also auto-reject overlapping pending requests
				break;
			case 'reject':
				// TODO: Call rejectReservationRequest mutation
				console.log(`Rejecting request ${requestId}`);
				// Future: Trigger GraphQL mutation to reject reservation
				break;
			case 'close':
				// TODO: Call closeReservation mutation (already exists)
				console.log(`Closing request ${requestId}`);
				// Future: Trigger GraphQL mutation to close reservation
				break;
			case 'message':
				// TODO: Navigate to messaging interface
				console.log(`Opening message interface for request ${requestId}`);
				// Future: Navigate to message page or open messaging modal
				break;
			case 'delete':
				// TODO: Call delete mutation (soft delete or remove from list)
				console.log(`Deleting request ${requestId}`);
				// Future: Trigger GraphQL mutation or local state update
				break;
			case 'archive':
				// TODO: Call archive mutation (move to archived state)
				console.log(`Archiving request ${requestId}`);
				// Future: Trigger GraphQL mutation to archive or hide request
				break;
			default:
				console.warn(`Unknown action: ${action}`);
		}
	};

	if (error) return <p>Error: {error.message}</p>;

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data?.myListingsRequests}
			hasDataComponent={
				<RequestsTable
					data={requests}
					searchText={searchText}
					statusFilters={statusFilters}
					sorter={sorter}
					currentPage={currentPage}
					pageSize={pageSize}
					total={total}
					onSearch={handleSearch}
					onStatusFilter={handleStatusFilter}
					onTableChange={handleTableChange}
					onPageChange={onPageChange}
					onAction={handleAction}
					loading={loading}
				/>
			}
		/>
	);
};
