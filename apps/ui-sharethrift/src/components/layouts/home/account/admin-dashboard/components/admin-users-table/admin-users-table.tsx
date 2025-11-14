import { Input, Checkbox, Button, Tag, Modal, Form, Select } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Dashboard } from '@sthrift/ui-components';
import type {
	AdminUserData,
	AdminUsersTableProps,
} from './admin-users-table.types.ts';
import { AdminUsersCard } from './admin-users-card.tsx';
import { useState } from 'react';

const { Search, TextArea } = Input;

const STATUS_OPTIONS = [
	{ label: 'Active', value: 'Active' },
	{ label: 'Blocked', value: 'Blocked' },
];

const BLOCK_REASONS = [
	'Late Return',
	'Item Damage',
	'Policy Violation',
	'Inappropriate Behavior',
	'Other',
];

const BLOCK_DURATIONS = [
	{ label: '7 Days', value: '7' },
	{ label: '30 Days', value: '30' },
	{ label: 'Indefinite', value: 'indefinite' },
];

export const AdminUsersTable: React.FC<Readonly<AdminUsersTableProps>> = ({
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
	const [blockModalVisible, setBlockModalVisible] = useState(false);
	const [unblockModalVisible, setUnblockModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null);
	const [blockForm] = Form.useForm();

	const handleBlockUser = (user: AdminUserData) => {
		setSelectedUser(user);
		setBlockModalVisible(true);
	};

	const handleUnblockUser = (user: AdminUserData) => {
		setSelectedUser(user);
		setUnblockModalVisible(true);
	};

	const handleBlockConfirm = async () => {
		try {
			const values = await blockForm.validateFields();
			console.log('Block user with:', values);
			// Mutation is handled by the container via onAction
			onAction('block', selectedUser?.id ?? '');
			setBlockModalVisible(false);
			blockForm.resetFields();
		} catch (error) {
			console.error('Block validation failed:', error);
		}
	};

	const handleUnblockConfirm = () => {
		onAction('unblock', selectedUser?.id ?? '');
		setUnblockModalVisible(false);
	};

	const getActionButtons = (record: AdminUserData) => {
		const buttons = [];

		// View Profile action (always available)
		buttons.push(
			<Button
				key="view-profile"
				type="link"
				size="small"
				onClick={() => onAction('view-profile', record.id)}
			>
				View Profile
			</Button>,
		);

		// View Report action
		buttons.push(
			<Button
				key="view-report"
				type="link"
				size="small"
				onClick={() => onAction('view-report', record.id)}
			>
				View Report
			</Button>,
		);

		// Block or Unblock action based on status
		if (record.status === 'Blocked') {
			buttons.push(
				<Button
					key="unblock"
					type="link"
					size="small"
					onClick={() => handleUnblockUser(record)}
				>
					Unblock
				</Button>,
			);
		} else {
			buttons.push(
				<Button
					key="block"
					type="link"
					size="small"
					danger
					onClick={() => handleBlockUser(record)}
				>
					Block
				</Button>,
			);
		}

		return buttons;
	};

	const columns: TableProps<AdminUserData>['columns'] = [
		{
			title: 'Username',
			dataIndex: 'username',
			key: 'username',
			width: 150,
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
				<div style={{ padding: 8 }}>
					<Search
						placeholder="Search users"
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
			render: (username: string) => (
				<span style={{ fontWeight: 500 }}>{username || 'N/A'}</span>
			),
		},
		{
			title: 'First Name',
			dataIndex: 'firstName',
			key: 'firstName',
			sorter: true,
			sortOrder: sorter.field === 'firstName' ? sorter.order : null,
		},
		{
			title: 'Last Name',
			dataIndex: 'lastName',
			key: 'lastName',
			sorter: true,
			sortOrder: sorter.field === 'lastName' ? sorter.order : null,
		},
		{
			title: 'Account Creation',
			dataIndex: 'accountCreated',
			key: 'accountCreated',
			sorter: true,
			sortOrder: sorter.field === 'accountCreated' ? sorter.order : null,
			render: (date?: string | null) => {
				// Guard: handle missing/invalid dates gracefully
				if (!date) return <span>N/A</span>;

				const d = new Date(date);
				if (Number.isNaN(d.getTime())) {
					return <span>N/A</span>;
				}

				const yyyy = d.getFullYear();
				const mm = String(d.getMonth() + 1).padStart(2, '0');
				const dd = String(d.getDate()).padStart(2, '0');
				return (
					<span
						style={{
							fontVariantNumeric: 'tabular-nums',
							fontFamily: 'inherit',
						}}
					>
						{`${yyyy}-${mm}-${dd}`}
					</span>
				);
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
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
				<Tag color={status === 'Blocked' ? 'red' : 'green'}>{status}</Tag>
			),
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 300,
			render: (_: unknown, record: AdminUserData) => {
				const actions = getActionButtons(record);
				return (
					<div
						style={{
							display: 'flex',
							gap: 8,
							justifyContent: 'flex-start',
						}}
					>
						{actions}
					</div>
				);
			},
		},
	];

	return (
		<>
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
					<AdminUsersCard
						user={item}
						onAction={(action) => {
							if (action === 'block') {
								handleBlockUser(item);
							} else if (action === 'unblock') {
								handleUnblockUser(item);
							} else {
								onAction(action, item.id);
							}
						}}
					/>
				)}
			/>

			{/* Block User Modal */}
			<Modal
				title="Block User"
				open={blockModalVisible}
				onOk={handleBlockConfirm}
				onCancel={() => {
					setBlockModalVisible(false);
					blockForm.resetFields();
				}}
				okText="Block User"
				okButtonProps={{ danger: true }}
			>
				<p style={{ marginBottom: 16 }}>
					You are about to block <strong>{selectedUser?.username}</strong>. This
					will prevent them from creating listings or making reservations.
				</p>
				<Form form={blockForm} layout="vertical">
					<Form.Item
						name="reason"
						label="Reason for Block"
						rules={[{ required: true, message: 'Please select a reason' }]}
					>
						<Select placeholder="Select a reason">
							{BLOCK_REASONS.map((reason) => (
								<Select.Option key={reason} value={reason}>
									{reason}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name="duration"
						label="Block Duration"
						rules={[{ required: true, message: 'Please select a duration' }]}
					>
						<Select placeholder="Select duration">
							{BLOCK_DURATIONS.map((duration) => (
								<Select.Option key={duration.value} value={duration.value}>
									{duration.label}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
						rules={[
							{ required: true, message: 'Please provide a description' },
						]}
					>
						<TextArea
							rows={4}
							placeholder="This message will be shown to the user"
						/>
					</Form.Item>
				</Form>
			</Modal>

			{/* Unblock User Modal */}
			<Modal
				title="Unblock User"
				open={unblockModalVisible}
				onOk={handleUnblockConfirm}
				onCancel={() => setUnblockModalVisible(false)}
				okText="Unblock User"
			>
				<p>
					Are you sure you want to unblock{' '}
					<strong>{selectedUser?.username}</strong>?
				</p>
				<p style={{ color: '#666', fontSize: '14px' }}>
					This will restore their ability to create listings and make
					reservations.
				</p>
			</Modal>
		</>
	);
};
