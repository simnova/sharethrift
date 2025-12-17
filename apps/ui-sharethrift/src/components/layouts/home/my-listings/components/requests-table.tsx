import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Dashboard } from '@sthrift/ui-components';
import type { TableProps } from 'antd';
import { Button, Checkbox, Image, Input, Popconfirm, Tag } from 'antd';
import type { ListingRequestData } from './my-listings-dashboard.types.tsx';
import { RequestsCard } from './requests-card.tsx';

const { Search } = Input;

interface RequestsTableProps {
	data: ListingRequestData[];
	searchText: string;
	statusFilters: string[];
	sorter: { field: string | null; order: 'ascend' | 'descend' | null };
	currentPage: number;
	pageSize: number;
	total: number;
	loading?: boolean;
	onSearch: (value: string) => void;
	onStatusFilter: (checkedValues: string[]) => void;
	onTableChange: TableProps<ListingRequestData>['onChange'];
	onPageChange: (page: number) => void;
	onAccept: (requestId: string) => Promise<void>;
	onReject: (requestId: string) => void;
	onClose: (requestId: string) => void;
	onDelete: (requestId: string) => void;
	onMessage: (requestId: string) => void;
}

const REQUEST_STATUS_OPTIONS = [
	{ label: 'Requested', value: 'Requested' },
	{ label: 'Accepted', value: 'Accepted' },
	{ label: 'Rejected', value: 'Rejected' },
	{ label: 'Closed', value: 'Closed' },
	{ label: 'Expired', value: 'Expired' },
];

export const RequestsTable: React.FC<RequestsTableProps> = ({
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
	onAccept,
	onReject,
	onClose,
	onDelete,
	onMessage,
}) => {
	const columns: TableProps<ListingRequestData>['columns'] = [
		{
			title: 'Listing',
			key: 'listing',
			width: 300,
			filterDropdown: ({
				setSelectedKeys,
				selectedKeys,
				confirm,
			}: {
				setSelectedKeys: (selectedKeys: React.Key[]) => void;
				selectedKeys: React.Key[];
				confirm: () => void;
			}) => (
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
			render: (_: unknown, record: ListingRequestData) => (
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<Image
						src={record.image ?? ''}
						alt={record.title}
						width={60}
						height={60}
						style={{ objectFit: 'cover', borderRadius: 4 }}
						preview={false}
					/>
					<span>{record.title}</span>
				</div>
			),
		},
		{
			title: 'Requested By',
			dataIndex: 'requestedBy',
			key: 'requestedBy',
			sorter: true,
			sortOrder: sorter.field === 'requestedBy' ? sorter.order : null,
			render: (username: string) => (
				<span style={{ fontWeight: 500, color: '#1890ff' }}>{username}</span>
			),
		},
		{
			title: 'Requested On',
			dataIndex: 'requestedOn',
			key: 'requestedOn',
			sorter: true,
			sortOrder: sorter.field === 'requestedOn' ? sorter.order : null,
			render: (date: string) => new Date(date).toISOString().slice(0, 10),
		},
		{
			title: 'Reservation Period',
			dataIndex: 'reservationPeriod',
			key: 'reservationPeriod',
			sorter: true,
			sortOrder: sorter.field === 'reservationPeriod' ? sorter.order : null,
			render: (period: string) => {
				if (!period) {
					return 'N/A';
				}
				// Expect format 'yyyy-mm-dd - yyyy-mm-dd' or similar
				// If not, try to parse and format
				let start = '',
					end = '';
				if (period.includes(' - ')) {
					const parts = period.split(' - ');
					start = parts[0] ?? '';
					end = parts[1] ?? '';
				} else {
					start = period ?? '';
				}
				// Try to format both as yyyy-mm-dd
				function formatDate(str: string) {
					const d = new Date(str);
					if (Number.isNaN(d.getTime())) {
						return str;
					}
					const yyyy = d.getFullYear();
					const mm = String(d.getMonth() + 1).padStart(2, '0');
					const dd = String(d.getDate()).padStart(2, '0');
					return `${yyyy}-${mm}-${dd}`;
				}
				const formattedStart = formatDate(start);
				const formattedEnd = end ? formatDate(end) : '';
				return (
					<span
						style={{
							fontVariantNumeric: 'tabular-nums',
							fontFamily: 'inherit',
							minWidth: 220,
							display: 'inline-block',
							textAlign: 'left',
						}}
					>
						{formattedStart}
						{formattedEnd ? ` - ${formattedEnd}` : ''}
					</span>
				);
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			filterDropdown: ({ confirm }: { confirm: () => void }) => (
				<div style={{ padding: 16, width: 200 }}>
					<div style={{ marginBottom: 8, fontWeight: 500 }}>
						Filter by Status
					</div>
					<Checkbox.Group
						options={REQUEST_STATUS_OPTIONS}
						value={statusFilters}
						onChange={(checkedValues) => {
							onStatusFilter(checkedValues as string[]);
							confirm();
						}}
						style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
					/>
				</div>
		),
		filterIcon: (filtered: boolean) => (
			<FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		render: (status: string) => {
			let statusClass = '';
			switch (status) {
				case 'Accepted':
					statusClass = 'requestAcceptedTag';
					break;
				case 'Rejected':
					statusClass = 'requestRejectedTag';
					break;
				case 'Closed':
					statusClass = 'expiredTag';
					break;
				case 'Pending':
				case 'Requested':
					statusClass = 'pendingTag';
					break;
				case 'Closing':
					statusClass = 'closingTag';
					break;
				case 'Expired':
					statusClass = 'expiredTag';
					break;
			}
			return <Tag className={statusClass}>{status}</Tag>;
		},
	},
	{
		title: 'Actions',
		key: 'actions',
		width: 200,
		render: (_: unknown, record: ListingRequestData) => {
			let actions: string[] = [];
			switch (record.status) {
				case 'Pending':
				case 'Requested':
					actions = ['accept', 'reject'];
					break;
				case 'Accepted':
					actions = ['close', 'message'];
					break;
				case 'Closed':
					actions = ['message'];
					break;
				case 'Rejected':
				case 'Expired':
				case 'Cancelled':
					actions = ['delete'];
					break;
			}

			const actionButtons = actions.map((action) => {
				if (action === 'accept') {
					return (
						<Button
							key="accept"
							type="link"
							size="small"
							onClick={() => onAccept(record.id)}
						>
							Accept
						</Button>
					);
				}
				if (action === 'reject') {
					return (
						<Button
							key="reject"
							type="link"
							size="small"
							onClick={() => onReject(record.id)}
						>
							Reject
						</Button>
					);
				}
				if (action === 'close') {
					return (
						<Popconfirm
							key="close"
							title="Close this request?"
							description="Are you sure you want to close this request?"
							onConfirm={() => onClose(record.id)}
							okText="Yes"
							cancelText="No"
						>
							<Button type="link" size="small">
								Close
							</Button>
						</Popconfirm>
					);
				}
				if (action === 'message') {
					return (
						<Button
							key="message"
							type="link"
							size="small"
							onClick={() => onMessage(record.id)}
						>
							Message
						</Button>
					);
				}
				if (action === 'delete') {
					return (
						<Popconfirm
							key="delete"
							title="Delete this request?"
							description="Are you sure you want to delete this request? This action cannot be undone."
							onConfirm={() => onDelete(record.id)}
							okText="Yes"
							cancelText="No"
						>
							<Button type="link" size="small" danger>
								Delete
							</Button>
						</Popconfirm>
					);
				}
				return null;
			});

			return (
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
					{actionButtons}
				</div>
			);
		},
	},
];	return (
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
			renderGridItem={(listing) => (
				<RequestsCard
					listing={listing}
					onAccept={onAccept}
					onReject={onReject}
					onClose={onClose}
					onDelete={onDelete}
					onMessage={onMessage}
				/>
			)}
		/>
	);
};
