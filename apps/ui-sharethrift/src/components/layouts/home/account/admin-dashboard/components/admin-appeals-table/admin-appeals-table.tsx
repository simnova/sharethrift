import { Input, Checkbox, Button, Tag, Modal, Space } from 'antd';
import type { TableProps } from 'antd';
import {
	SearchOutlined,
	FilterOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Dashboard } from '@sthrift/ui-components';
import type {
	AdminAppealData,
	AdminAppealsTableProps,
} from './admin-appeals-table.types.ts';
import { useState } from 'react';

const { Search } = Input;

const STATUS_OPTIONS = [
	{ label: 'Requested', value: 'REQUESTED' },
	{ label: 'Accepted', value: 'ACCEPTED' },
	{ label: 'Denied', value: 'DENIED' },
];

export const AdminAppealsTable: React.FC<
	Readonly<AdminAppealsTableProps>
> = ({
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
}) => {
	const [acceptModalVisible, setAcceptModalVisible] = useState(false);
	const [denyModalVisible, setDenyModalVisible] = useState(false);
	const [selectedAppeal, setSelectedAppeal] = useState<AdminAppealData | null>(
		null,
	);
	const [viewModalVisible, setViewModalVisible] = useState(false);

	const handleAcceptAppeal = (appeal: AdminAppealData) => {
		setSelectedAppeal(appeal);
		setAcceptModalVisible(true);
	};

	const handleDenyAppeal = (appeal: AdminAppealData) => {
		setSelectedAppeal(appeal);
		setDenyModalVisible(true);
	};

	const handleViewDetails = (appeal: AdminAppealData) => {
		setSelectedAppeal(appeal);
		setViewModalVisible(true);
	};

	const handleAcceptConfirm = () => {
		if (selectedAppeal) {
			onAction('accept', selectedAppeal.id);
		}
		setAcceptModalVisible(false);
	};

	const handleDenyConfirm = () => {
		if (selectedAppeal) {
			onAction('deny', selectedAppeal.id);
		}
		setDenyModalVisible(false);
	};

	const getStateTag = (state: string) => {
		switch (state) {
			case 'REQUESTED':
				return (
					<Tag icon={<ExclamationCircleOutlined />} color="warning">
						Pending
					</Tag>
				);
			case 'ACCEPTED':
				return (
					<Tag icon={<CheckCircleOutlined />} color="success">
						Accepted
					</Tag>
				);
			case 'DENIED':
				return (
					<Tag icon={<CloseCircleOutlined />} color="error">
						Denied
					</Tag>
				);
			default:
				return null;
		}
	};

	const getActionButtons = (record: AdminAppealData) => {
		const commonActions = [
			<Button
				key="view-details"
				type="link"
				size="small"
				onClick={() => handleViewDetails(record)}
			>
				View Details
			</Button>,
			<Button
				key="view-user"
				type="link"
				size="small"
				onClick={() => onAction('view-user', record.userId)}
			>
				View User
			</Button>,
		];

		if (record.state === 'REQUESTED') {
			return [
				...commonActions,
				<Button
					key="accept"
					type="link"
					size="small"
					style={{ color: 'green' }}
					onClick={() => handleAcceptAppeal(record)}
				>
					Accept
				</Button>,
				<Button
					key="deny"
					type="link"
					size="small"
					danger
					onClick={() => handleDenyAppeal(record)}
				>
					Deny
				</Button>,
			];
		}

		return commonActions;
	};

	const columns: TableProps<AdminAppealData>['columns'] = [
		{
			title: 'User',
			dataIndex: 'userName',
			key: 'userName',
			sorter: true,
			sortOrder: sorter?.field === 'userName' ? sorter.order : undefined,
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
				<div style={{ padding: 8 }}>
					<Search
						placeholder="Search by user name or email"
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
						style={{ width: 250 }}
						allowClear
					/>
				</div>
			),
			filterIcon: (filtered: boolean) => (
				<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
			),
		},
		{
			title: 'Email',
			dataIndex: 'userEmail',
			key: 'userEmail',
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => (
				<Tag color={type === 'USER' ? 'blue' : 'purple'}>{type}</Tag>
			),
		},
		{
			title: 'Status',
			dataIndex: 'state',
			key: 'state',
			render: (state: string) => getStateTag(state),
			filters: STATUS_OPTIONS.map((opt) => ({
				text: opt.label,
				value: opt.value,
			})),
			filteredValue: statusFilters,
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
				<div style={{ padding: 8 }}>
					<Checkbox.Group
						options={STATUS_OPTIONS}
						value={selectedKeys as string[]}
						onChange={(values) => {
							setSelectedKeys(values);
							onStatusFilter(values as string[]);
							confirm();
						}}
					/>
				</div>
			),
			filterIcon: (filtered: boolean) => (
				<FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
			),
		},
		{
			title: 'Submitted',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: true,
			sortOrder: sorter?.field === 'createdAt' ? sorter.order : undefined,
			render: (date: string) =>
				new Date(date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				}),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: unknown, record: AdminAppealData) => (
				<Space size="small">{getActionButtons(record)}</Space>
			),
		},
	];

	return (
		<div>
			<Dashboard
				data={data}
				columns={columns}
				loading={loading}
				currentPage={currentPage}
				pageSize={pageSize}
				total={total}
				onPageChange={(page: number) => onPageChange(page, pageSize)}
				showPagination={true}
				onChange={onTableChange}
			/>

			{/* Accept Appeal Modal */}
			<Modal
				title="Accept Appeal"
				open={acceptModalVisible}
				onOk={handleAcceptConfirm}
				onCancel={() => setAcceptModalVisible(false)}
				okText="Accept Appeal"
				okButtonProps={{ style: { backgroundColor: 'green' } }}
			>
				<p>
					Are you sure you want to accept this appeal? The user's account will
					be unblocked.
				</p>
				{selectedAppeal && (
					<div style={{ marginTop: '1rem' }}>
						<strong>User:</strong> {selectedAppeal.userName}
						<br />
						<strong>Email:</strong> {selectedAppeal.userEmail}
					</div>
				)}
			</Modal>

			{/* Deny Appeal Modal */}
			<Modal
				title="Deny Appeal"
				open={denyModalVisible}
				onOk={handleDenyConfirm}
				onCancel={() => setDenyModalVisible(false)}
				okText="Deny Appeal"
				okButtonProps={{ danger: true }}
			>
				<p>
					Are you sure you want to deny this appeal? The user will remain
					blocked.
				</p>
				{selectedAppeal && (
					<div style={{ marginTop: '1rem' }}>
						<strong>User:</strong> {selectedAppeal.userName}
						<br />
						<strong>Email:</strong> {selectedAppeal.userEmail}
					</div>
				)}
			</Modal>

			{/* View Details Modal */}
			<Modal
				title="Appeal Details"
				open={viewModalVisible}
				onCancel={() => setViewModalVisible(false)}
				footer={[
					<Button key="close" onClick={() => setViewModalVisible(false)}>
						Close
					</Button>,
				]}
				width={600}
			>
				{selectedAppeal && (
					<div>
						<div style={{ marginBottom: '1rem' }}>
							<strong>User:</strong> {selectedAppeal.userName}
							<br />
							<strong>Email:</strong> {selectedAppeal.userEmail}
							<br />
							<strong>Status:</strong> {getStateTag(selectedAppeal.state)}
							<br />
							<strong>Type:</strong>{' '}
							<Tag
								color={selectedAppeal.type === 'USER' ? 'blue' : 'purple'}
							>
								{selectedAppeal.type}
							</Tag>
							<br />
							<strong>Submitted:</strong>{' '}
							{new Date(selectedAppeal.createdAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</div>
						<div>
							<strong>Appeal Reason:</strong>
							<p
								style={{
									marginTop: '0.5rem',
									padding: '1rem',
									backgroundColor: '#f5f5f5',
									borderRadius: '4px',
								}}
							>
								{selectedAppeal.reason}
							</p>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};
