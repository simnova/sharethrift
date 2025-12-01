import { useMutation, useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { message } from 'antd';
import { useState } from 'react';
import {
	HomeRequestsTableContainerAcceptReservationRequestDocument,
	HomeRequestsTableContainerMyListingsRequestsDocument,
} from '../../../../../generated.tsx';
import { RequestsTable } from './requests-table.tsx';

export interface RequestsTableContainerProps {
	currentPage: number;
	onPageChange: (page: number) => void;
	sharerId: string;
}

export const RequestsTableContainer: React.FC<RequestsTableContainerProps> = ({
	currentPage,
	onPageChange,
	sharerId,
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
				sorter: {
					field: sorter.field || '',
					order: sorter.order || '',
				},
				sharerId: sharerId,
			},
			fetchPolicy: 'network-only',
		},
	);

	const [acceptRequest] = useMutation(
		HomeRequestsTableContainerAcceptReservationRequestDocument,
		{
			onCompleted: () => {
				message.success('Request accepted successfully');
				refetch();
			},
			onError: (error) => {
				message.error(`Failed to accept request: ${error.message}`);
			},
		},
	);

	const requests = data?.myListingsRequests?.items ?? [];

	const total = data?.myListingsRequests?.total ?? 0;

	// Transform domain fields to UI format
	const transformedRequests = requests.map((request) => ({
		id: request.id,
		title: request.title,
		image: request.image ?? null,
		requestedBy: request.requestedBy ?? 'Unknown',
		requestedOn: request.requestedOn ?? null,
		reservationPeriod: request.reservationPeriod ?? '',
		status: request.status ?? 'Unknown',
	}));

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
			if (action === 'approve' || action === 'accept') {
				await acceptRequest({ variables: { input: { id: requestId } } });
			}
		} catch (error) {
			console.error(`${action} request error:`, error);
		}
	};

	if (error) {
		console.error('Query error:', error);
		return null;
	}

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data?.myListingsRequests ?? null}
			hasDataComponent={
				<RequestsTable
					data={transformedRequests}
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
