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

	const allRequests = data?.myListingsRequests ?? [];

	// Client-side filtering and sorting
	let filteredRequests = allRequests;

	// Apply search filter
	if (searchText) {
		const lowerSearch = searchText.toLowerCase();
		filteredRequests = filteredRequests.filter(
			(req) => {
				const title = req.listing?.title?.toLowerCase() ?? '';
				const reserver = req.reserver?.__typename === 'PersonalUser' ? req.reserver : null;
				const firstName = reserver?.account?.profile?.firstName?.toLowerCase() ?? '';
				const lastName = reserver?.account?.profile?.lastName?.toLowerCase() ?? '';
				return title.includes(lowerSearch) || firstName.includes(lowerSearch) || lastName.includes(lowerSearch);
			}
		);
	}

	// Apply status filter
	if (statusFilters.length > 0) {
		filteredRequests = filteredRequests.filter((req) =>
			statusFilters.includes(req.state ?? ''),
		);
	}

	// Apply sorting
	if (sorter.field && sorter.order) {
		filteredRequests = [...filteredRequests].sort((a, b) => {
			const aVal = a[sorter.field as keyof typeof a];
			const bVal = b[sorter.field as keyof typeof b];
			const comparison =
				typeof aVal === 'string' && typeof bVal === 'string'
					? aVal.localeCompare(bVal)
					: 0;
			return sorter.order === 'ascend' ? comparison : -comparison;
		});
	}

	const total = filteredRequests.length;

	// Apply pagination
	const startIndex = (currentPage - 1) * pageSize;
	const requests = filteredRequests.slice(startIndex, startIndex + pageSize);

	// Transform domain fields to UI format
	const transformedRequests = requests.map((request) => {
		const reserver = request.reserver?.__typename === 'PersonalUser' ? request.reserver : null;
		const firstName = reserver?.account?.profile?.firstName ?? '';
		const lastName = reserver?.account?.profile?.lastName ?? '';
		const requestedBy = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';
		
		const start = request.reservationPeriodStart ? new Date(request.reservationPeriodStart) : null;
		const end = request.reservationPeriodEnd ? new Date(request.reservationPeriodEnd) : null;
		const reservationPeriod = start && end 
			? `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
			: '';
		
		return {
			id: request.id,
			title: request.listing?.title ?? 'Unknown',
			image: request.listing?.images?.[0] ?? null,
			requestedBy,
			requestedOn: request.createdAt ?? null,
			reservationPeriod,
			status: request.state ?? 'Unknown',
		};
	});

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
			hasData={allRequests.length > 0 ? allRequests : null}
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
