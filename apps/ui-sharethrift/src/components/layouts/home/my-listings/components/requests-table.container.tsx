import { useState } from 'react';
import { useQuery } from "@apollo/client/react";
import { RequestsTable } from './requests-table.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { HomeRequestsTableContainerMyListingsRequestsDocument } from '../../../../../generated.tsx';

export interface RequestsTableContainerProps {
	currentPage: number;
	onPageChange: (page: number) => void;
}

export function RequestsTableContainer({
	currentPage,
	onPageChange,
}: RequestsTableContainerProps) {
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
                sharerId: '6324a3f1e3e4e1e6a8e1d8b1'
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
		// TODO: Implement actual actions in future PRs
		console.log(`Action: ${action}, Request ID: ${requestId}`);
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
