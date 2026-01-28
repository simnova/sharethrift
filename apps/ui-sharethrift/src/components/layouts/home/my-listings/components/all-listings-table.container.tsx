import { useMutation, useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { message } from 'antd';
import { useState } from 'react';
import {
	HomeAllListingsTableContainerCancelItemListingDocument,
	HomeAllListingsTableContainerDeleteListingDocument,
	HomeAllListingsTableContainerMyListingsAllDocument,
	HomeAllListingsTableContainerPauseItemListingDocument,
} from '../../../../../generated.tsx';
import { AllListingsTable } from './all-listings-table.tsx';

interface AllListingsTableContainerProps {
	currentPage: number;
	onPageChange: (page: number) => void;
}

export const AllListingsTableContainer: React.FC<
	AllListingsTableContainerProps
> = ({ currentPage, onPageChange }) => {
	const [searchText, setSearchText] = useState('');
	const [statusFilters, setStatusFilters] = useState<string[]>([]);
	const [sorter, setSorter] = useState<{
		field: string | null;
		order: 'ascend' | 'descend' | null;
	}>({ field: null, order: null });
	const pageSize = 6;

	const { data, loading, error, refetch } = useQuery(
		HomeAllListingsTableContainerMyListingsAllDocument,
		{
			variables: {
				page: currentPage,
				pageSize: pageSize,
				searchText: searchText,
				statusFilters: statusFilters,
				sorter:
					sorter.field && sorter.order
						? { field: sorter.field, order: sorter.order }
						: undefined,
			},
			fetchPolicy: 'network-only',
		},
	);

	const [cancelListing] = useMutation(
		HomeAllListingsTableContainerCancelItemListingDocument,
		{
			onCompleted: (data) => {
				if (data.cancelItemListing?.status?.success) {
					message.success('Listing cancelled successfully');
					refetch();
				} else {
					message.error(
						`Failed to cancel listing: ${data.cancelItemListing?.status?.errorMessage ?? 'Unknown error'}`,
					);
				}
			},
			onError: (error) => {
				message.error(`Failed to cancel listing: ${error.message}`);
			},
		},
	);

	const [pauseListing] = useMutation(
		HomeAllListingsTableContainerPauseItemListingDocument,
		{
			onCompleted: () => {
				message.success('Listing paused successfully');
				refetch();
			},
			onError: (error) => {
				message.error(`Failed to pause listing: ${error.message}`);
			},
		},
	);

	const [deleteListing] = useMutation(
		HomeAllListingsTableContainerDeleteListingDocument,
		{
			onCompleted: (data) => {
				if (data.deleteItemListing?.status?.success) {
					message.success('Listing deleted successfully');
					refetch();
				} else {
					message.error(
						`Failed to delete listing: ${data.deleteItemListing?.status?.errorMessage ?? 'Unknown error'}`,
					);
				}
			},
			onError: (error) => {
				message.error(`Failed to delete listing: ${error.message}`);
			},
		},
	);

	const listings = data?.myListingsAll?.items ?? [];
	console.log('Listings data:', data);
	const total = data?.myListingsAll?.total ?? 0;

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

	const handleAction = async (action: string, listingId: string) => {
		if (action === 'cancel') {
			await cancelListing({ variables: { id: listingId } });
		} else if (action === 'pause') {
			await pauseListing({ variables: { id: listingId } });
		} else if (action === 'delete') {
			await deleteListing({ variables: { id: listingId } });
		} else {
			message.info(`Action "${action}" for listing ${listingId} coming soon.`);
		}
	};

	const handleViewAllRequests = (listingId: string) => {
		// TODO: Open requests modal or navigate to requests view
		console.log(`View all requests for listing: ${listingId}`);
	};

	if (error) return <p>Error: {error.message}</p>;

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data?.myListingsAll}
			hasDataComponent={
				<AllListingsTable
					data={listings}
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
					onViewAllRequests={handleViewAllRequests}
					loading={loading}
				/>
			}
		/>
	);
};
