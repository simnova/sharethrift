import { useMutation, useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { App } from 'antd';
import { useState } from 'react';
import {
	HomeRequestsTableContainerAcceptReservationRequestDocument,
	HomeRequestsTableContainerMyListingsRequestsDocument,
} from '../../../../../generated.tsx';
import { RequestsTable } from './requests-table.tsx';

interface RequestsTableContainerProps {
	currentPage: number;
	onPageChange: (page: number) => void;
	sharerId: string;
}

export const RequestsTableContainer: React.FC<RequestsTableContainerProps> = ({
	currentPage,
	onPageChange,
	sharerId,
}) => {
	const { message } = App.useApp();
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
				void refetch();
				message.success('Request accepted successfully');
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
					onAccept={async (requestId: string) => {
						await acceptRequest({ variables: { input: { id: requestId } } });
					}}
					onReject={(_requestId: string) => {
						// TODO: Implement reject mutation when GraphQL schema is ready
						message.info('Reject functionality coming soon');
					}}
					onClose={(_requestId: string) => {
						// TODO: Implement close mutation when GraphQL schema is ready
						message.info('Close functionality coming soon');
					}}
					onDelete={(_requestId: string) => {
						// TODO: Implement delete mutation when GraphQL schema is ready
						message.info('Delete functionality coming soon');
					}}
					onMessage={(_requestId: string) => {
						// TODO: Implement navigation to messages view
						message.info('Messaging functionality coming soon');
					}}
					loading={loading}
				/>
			}
		/>
	);
};
