import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Dashboard } from '@sthrift/ui-components';
import type { TableProps } from 'antd';
import { Badge, Button, Checkbox, Image, Input, Popconfirm, Tag } from 'antd';
import type { HomeAllListingsTableContainerListingFieldsFragment } from '../../../../../generated.tsx';
import { AllListingsCard } from './all-listings-card.tsx';
import { getStatusTagClass } from './status-tag-class.ts';

const { Search } = Input;

export interface AllListingsTableProps {
	data: HomeAllListingsTableContainerListingFieldsFragment[];
	searchText: string;
	statusFilters: string[];
	sorter: { field: string | null; order: 'ascend' | 'descend' | null };
	currentPage: number;
	pageSize: number;
	total: number;
	loading?: boolean;
	onSearch: (value: string) => void;
	onStatusFilter: (checkedValues: string[]) => void;
	onTableChange: TableProps<HomeAllListingsTableContainerListingFieldsFragment>['onChange'];
	onPageChange: (page: number) => void;
	onAction: (action: string, listingId: string) => void;
	onViewAllRequests: (listingId: string) => void;
}

const STATUS_OPTIONS = [
	{ label: 'Published', value: 'Published' },
	{ label: 'Paused', value: 'Paused' },
	{ label: 'Reserved', value: 'Reserved' },
	{ label: 'Expired', value: 'Expired' },
	{ label: 'Draft', value: 'Draft' },
	{ label: 'Blocked', value: 'Blocked' },
	{ label: 'Cancelled', value: 'Cancelled' },
];

// getStatusTagClass moved to shared helper status-tag-class.ts

export const AllListingsTable: React.FC<AllListingsTableProps> = ({
	data,
	searchText,
	statusFilters,
	sorter,
	currentPage,
	pageSize,
	total,
	loading = false,
	onSearch,
	onStatusFilter,
	onTableChange,
	onPageChange,
	onAction,
	onViewAllRequests,
}) => {
	const getActionButtons = (
		record: HomeAllListingsTableContainerListingFieldsFragment,
	) => {
		const buttons = [];

		const status = record.state ?? 'Unknown';

		// Conditional actions based on status
		if (status === 'Published' || status === 'Reserved') {
			buttons.push(
				<Button
					key="pause"
					type="link"
					size="small"
					onClick={() => onAction('pause', record.id)}
				>
					Pause
				</Button>
			);
		}

		if (status === 'Paused' || status === 'Expired') {
			buttons.push(
				<Button
					key="reinstate"
					type="link"
					size="small"
					onClick={() => onAction('reinstate', record.id)}
				>
					Reinstate
				</Button>,
			);
		}

		if (status === 'Blocked') {
			buttons.push(
				<Popconfirm
					key="appeal"
					title="Appeal this listing?"
					description="Are you sure you want to appeal the block on this listing?"
					onConfirm={() => onAction('appeal', record.id)}
					okText="Yes"
					cancelText="No"
				>
					<Button type="link" size="small">
						Appeal
					</Button>
				</Popconfirm>,
			);
		}

		if (status === 'Draft') {
			buttons.push(
				<Button
					key="publish"
					type="link"
					size="small"
					onClick={() => onAction('publish', record.id)}
				>
					Publish
				</Button>,
			);
		}

		// Cancel button for Published listings
		if (status === 'Published' || status === 'Paused') {
			buttons.push(
				<Popconfirm
					key="cancel"
					title="Cancel this listing?"
					description="Are you sure you want to cancel this listing? It will be removed from search results and marked as inactive."
					onConfirm={() => onAction('cancel', record.id)}
					okText="Yes"
					cancelText="No"
				>
					<Button type="link" size="small" danger>
						Cancel
					</Button>
				</Popconfirm>,
			);
		}

		// Always available actions
		buttons.push(
			<Button
				key="edit"
				type="link"
				size="small"
				onClick={() => onAction('edit', record.id)}
			>
				Edit
			</Button>,
		);

		buttons.push(
			<Popconfirm
				key="delete"
				title="Delete this listing?"
				description="Are you sure you want to delete this listing? This action cannot be undone."
				onConfirm={() => onAction('delete', record.id)}
				okText="Yes"
				cancelText="No"
			>
				<Button type="link" size="small" danger>
					Delete
				</Button>
			</Popconfirm>,
		);

        console.log("here it is: ", status)

		return buttons;
	};

	const columns: TableProps<HomeAllListingsTableContainerListingFieldsFragment>['columns'] =
		[
			{
				title: 'Listing',
				dataIndex: 'title',
				key: 'title',
				width: 300,
				filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
					<div style={{ padding: 8 }}>
						<Search
							placeholder="Search listings"
							value={
								selectedKeys.length ? (selectedKeys[0] as string) : searchText
							}
							onChange={(e) => {
								setSelectedKeys(e.target.value ? [e.target.value] : []);
							}}
							onSearch={(value) => {
								confirm();
								onSearch(value);
							}}
							style={{ width: 200 }}
							allowClear
						/>
					</div>
				),
				filterIcon: (filtered: boolean) => (
					<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
				),
				render: (
					title: string,
					record: HomeAllListingsTableContainerListingFieldsFragment,
				) => (
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<Image
							src={record.images?.[0] ?? ''}
							alt={title}
							width={72}
							height={72}
							style={{ objectFit: 'cover', borderRadius: 4 }}
							preview={false}
						/>
						<span>{title}</span>
					</div>
				),
			},
			{
				title: 'Published At',
				dataIndex: 'createdAt',
				key: 'createdAt',
				sorter: true,
				sortOrder: sorter.field === 'createdAt' ? sorter.order : null,
				render: (date?: string) => {
					if (!date) {
						return 'N/A';
					}
					// Format as yyyy-mm-dd and align digits
					const d = new Date(date);
					const yyyy = d.getFullYear();
					const mm = String(d.getMonth() + 1).padStart(2, '0');
					const dd = String(d.getDate()).padStart(2, '0');
					const formatted = `${yyyy}-${mm}-${dd}`;
					return (
						<span
							style={{
								fontVariantNumeric: 'tabular-nums',
								fontFamily: 'inherit',
								minWidth: 100,
								display: 'inline-block',
								textAlign: 'left',
							}}
						>
							{formatted}
						</span>
					);
				},
			},
			{
				title: 'Reservation Period',
				key: 'reservationPeriod',
				sorter: true,
				sortOrder: sorter.field === 'reservationPeriod' ? sorter.order : null,
				render: (
					_: unknown,
					record: HomeAllListingsTableContainerListingFieldsFragment,
				) => {
					const startDate = record.sharingPeriodStart;
					const endDate = record.sharingPeriodEnd;

					if (!startDate || !endDate) {
						return 'N/A';
					}

					// Format dates as yyyy-mm-dd
					const start =
						typeof startDate === 'string'
							? startDate.slice(0, 10)
							: new Date(startDate).toISOString().slice(0, 10);
					const end =
						typeof endDate === 'string'
							? endDate.slice(0, 10)
							: new Date(endDate).toISOString().slice(0, 10);
					const period = `${start} - ${end}`;

					return (
						<span
							style={{
								fontVariantNumeric: 'tabular-nums',
								fontFamily: 'inherit',
								minWidth: 200,
								display: 'inline-block',
								textAlign: 'left',
							}}
						>
							{period}
						</span>
					);
				},
			},
			{
				title: 'Status',
				dataIndex: 'state',
				key: 'state',
				filterDropdown: ({ confirm }) => (
					<div style={{ padding: 16, width: 200 }}>
						<div style={{ marginBottom: 8, fontWeight: 500 }}>
							Filter by Status
						</div>
						<Checkbox.Group
							options={STATUS_OPTIONS}
							value={statusFilters}
							onChange={(checkedValues) => {
								onStatusFilter(checkedValues);
								confirm();
							}}
							style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
						/>
					</div>
				),
				filterIcon: (filtered: boolean) => (
					<FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
				),
				render: (status: string) => (
					<Tag className={getStatusTagClass(status)}>{status}</Tag>
				),
			},
			{
				title: 'Actions',
				key: 'actions',
				width: 200,
				render: (
					_: unknown,
					record: HomeAllListingsTableContainerListingFieldsFragment,
				) => {
					const actions = getActionButtons(record);
					// Ensure at least 3 slots for alignment (first, middle, last)
					const minActions = 3;
					const paddedActions = [
						...actions,
						...Array(Math.max(0, minActions - actions.length)).fill(null),
					];
					return (
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								width: '100%',
								minWidth: 220,
								gap: 0,
							}}
						>
							{paddedActions.map((btn, idx) => (
								<div
									key={btn?.key || idx}
									style={{
										flex: 1,
										display: 'flex',
										justifyContent:
											idx === 0
												? 'flex-start'
												: idx === paddedActions.length - 1
													? 'flex-end'
													: 'center',
										minWidth: 60,
										maxWidth: 100,
									}}
								>
									{btn}
								</div>
							))}
						</div>
					);
				},
			},
			{
				title: 'Pending Requests',
				key: 'pendingRequestsCount',
				sorter: true,
				sortOrder:
					sorter.field === 'pendingRequestsCount' ? sorter.order : null,
				render: (
					_: unknown,
					record: HomeAllListingsTableContainerListingFieldsFragment,
				) => {
					const count = 0; // TODO: implement in future
					return (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								minHeight: 60,
							}}
						>
							<Badge count={count} showZero />
							{count > 0 && (
								<Button
									type="link"
									size="small"
									onClick={() => onViewAllRequests(record.id)}
									style={{ marginTop: 4 }}
								>
									View All
								</Button>
							)}
						</div>
					);
				},
			},
		];

	return (
		<Dashboard
			data={data}
			columns={columns}
			loading={loading}
			currentPage={currentPage}
			pageSize={pageSize}
			total={total}
			onPageChange={onPageChange}
			showPagination={true}
			onChange={onTableChange}
			renderGridItem={(item) => (
				<AllListingsCard
					listing={item}
					onViewPendingRequests={onViewAllRequests}
					onAction={onAction}
				/>
			)}
		/>
	);
};
