import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import { RequestsTable } from './requests-table.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { 
	HomeRequestsTableContainerMyListingsRequestsDocument,
	HomeRequestsTableContainerAcceptReservationRequestDocument
} from '../../../../../generated.tsx';

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

	const { data, loading, error, refetch } = useQuery(
		HomeRequestsTableContainerMyListingsRequestsDocument,
		{
			variables: {
				page: currentPage,
				pageSize: pageSize,
				searchText: searchText,
				statusFilters: statusFilters,
				sorter: { field: sorter.field ?? '', order: sorter.order ?? '' },
                sharerId: '6324a3f1e3e4e1e6a8e1d8b1'
			},
			fetchPolicy: 'network-only',
		},
	);

	const [acceptReservationRequest] = useMutation(
		HomeRequestsTableContainerAcceptReservationRequestDocument
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

	const handleAction = async (action: string, requestId: string) => {
		try {
			if (action === 'accept') {
				// Use the real GraphQL mutation to accept the reservation request
				await acceptReservationRequest({
					variables: {
						reservationRequestId: requestId,
					},
				});
				
				// Refetch the data to update the UI with the new status
				await refetch();
				
				// TODO: Add user-facing success notification
			} else {
				// TODO: Implement other actions (reject, close, message) in future PRs
				console.log(`Action: ${action}, Request ID: ${requestId}`);
			}
		} catch (error) {
			console.error('Error handling action:', error);
			// TODO: Add user-facing error notification
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
}
