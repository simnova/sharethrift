import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Checkbox, Input } from 'antd';

const { Search } = Input;

const STATUS_OPTIONS = [
	{ label: 'Active', value: 'Active' },
	{ label: 'Paused', value: 'Paused' },
	{ label: 'Reserved', value: 'Reserved' },
	{ label: 'Expired', value: 'Expired' },
	{ label: 'Draft', value: 'Draft' },
	{ label: 'Blocked', value: 'Blocked' },
	{ label: 'Cancelled', value: 'Cancelled' },
];

export function ListingTitleFilterDropdown({
	onSearch,
	searchText,
	setSelectedKeys,
	selectedKeys,
	confirm,
}: {
	onSearch: (value: string) => void;
	searchText: string;
	setSelectedKeys: (selectedKeys: React.Key[]) => void;
	selectedKeys: React.Key[];
	confirm: () => void;
}): React.ReactNode {
	return (
		<div style={{ padding: 8 }}>
			<Search
				placeholder="Search listings"
				value={selectedKeys.length ? (selectedKeys[0] as string) : searchText}
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
	);
}

export function ListingTitleFilterIcon({
	filtered,
}: {
	filtered: boolean;
}): React.ReactNode {
	return <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
}

export function StatusFilterDropdown({
	statusFilters,
	onStatusFilter,
	confirm,
}: {
	statusFilters: string[];
	onStatusFilter: (checkedValues: string[]) => void;
	confirm: () => void;
}): React.ReactNode {
	return (
		<div style={{ padding: 16, width: 200 }}>
			<div style={{ marginBottom: 8, fontWeight: 500 }}>Filter by Status</div>
			<Checkbox.Group
				options={STATUS_OPTIONS}
				value={statusFilters}
				onChange={(checkedValues) => {
					onStatusFilter(checkedValues as string[]);
					confirm();
				}}
				style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
			/>
		</div>
	);
}

export function StatusFilterIcon({
	filtered,
}: {
	filtered: boolean;
}): React.ReactNode {
	return <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
}
