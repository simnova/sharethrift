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

	// Transform domain fields to UI format (no client-side search/status filtering in this container)
	const transformedAllRequests = allRequests.map((request) => {
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

	let displayRequests = transformedAllRequests;

	// Apply sorting (keep existing behavior)
	if (sorter.field && sorter.order) {
		displayRequests = [...displayRequests].sort((a, b) => {
			const aVal = a[sorter.field as keyof typeof a];
			const bVal = b[sorter.field as keyof typeof b];
			const comparison =
				typeof aVal === 'string' && typeof bVal === 'string'
					? aVal.localeCompare(bVal)
					: 0;
			return sorter.order === 'ascend' ? comparison : -comparison;
		});
	}

	const total = displayRequests.length;

	// Apply pagination
	const startIndex = (currentPage - 1) * pageSize;
	const pagedRequests = displayRequests.slice(startIndex, startIndex + pageSize);

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

	const handleAccept = async (requestId: string) => {
		await acceptRequest({ variables: { input: { id: requestId } } });
	};

	const handleReject = (_requestId: string) => {
		message.info('Reject functionality coming soon');
	};

	const handleClose = (_requestId: string) => {
		message.info('Close functionality coming soon');
	};

	const handleDelete = (_requestId: string) => {
		message.info('Delete functionality coming soon');
	};

	const handleMessage = (_requestId: string) => {
		message.info('Messaging functionality coming soon');
	};

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={allRequests.length > 0 ? allRequests : null}
			hasDataComponent={
				<RequestsTable
						data={pagedRequests}
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
						onAccept={handleAccept}
						onReject={handleReject}
						onClose={handleClose}
						onDelete={handleDelete}
						onMessage={handleMessage}
					loading={loading}
				/>
			}
		/>
	);
};
