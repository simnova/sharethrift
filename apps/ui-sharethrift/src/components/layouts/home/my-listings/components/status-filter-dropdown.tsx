import { Checkbox } from 'antd';

const STATUS_OPTIONS = [
	{ label: 'Active', value: 'Active' },
	{ label: 'Paused', value: 'Paused' },
	{ label: 'Reserved', value: 'Reserved' },
	{ label: 'Expired', value: 'Expired' },
	{ label: 'Draft', value: 'Draft' },
	{ label: 'Blocked', value: 'Blocked' },
	{ label: 'Cancelled', value: 'Cancelled' },
];

	readonly statusFilters: string[];
	readonly onStatusFilter: (checkedValues: string[]) => void;
	readonly confirm: () => void;
}

export function StatusFilterDropdown({
	statusFilters,
	onStatusFilter,
	confirm,
}: Readonly<StatusFilterDropdownProps>): React.ReactNode {
	return (
		<div style={{ padding: 16, width: 200 }}>
			<div style={{ marginBottom: 8, fontWeight: 500 }}>Filter by Status</div>
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
	);
}
