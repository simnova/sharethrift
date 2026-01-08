import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { formatDate } from '../admin-listings-table.utils.ts';

// Test component that displays format date results
const FormatDateTest = (): React.JSX.Element => {
	const testCases = [
		{ input: '2024-01-15T10:30:00Z', label: 'Valid ISO date' },
		{ input: '2024-12-25', label: 'Valid date string' },
		{ input: undefined, label: 'Undefined' },
		{ input: '', label: 'Empty string' },
	];

	return (
		<div style={{ padding: '20px' }}>
			<h2>Format Date Utility Test</h2>
			<table data-testid="format-date-table">
				<thead>
					<tr>
						<th>Input</th>
						<th>Output</th>
					</tr>
				</thead>
				<tbody>
					{testCases.map((tc) => (
						<tr key={tc.label}>
							<td>{tc.label}: {tc.input || 'N/A'}</td>
						<td data-testid={`result-${tc.label.replaceAll(' ', '-')}`}>
								{formatDate(tc.input)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const meta: Meta<typeof FormatDateTest> = {
	title: 'Admin/Utilities/FormatDate',
	component: FormatDateTest,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof FormatDateTest>;

export const Default: Story = {
	play:  ({ canvasElement }) => {
		// Test valid date formatting with ISO strings (includes timezone)
		expect(formatDate('2024-01-15T10:30:00Z')).toBe('2024-01-15');
		expect(formatDate('2024-12-25T12:00:00Z')).toBe('2024-12-25');

		// Test undefined returns 'N/A'
		expect(formatDate()).toBe('N/A');

		// Verify the component rendered
		const table = canvasElement.querySelector('[data-testid="format-date-table"]');
		expect(table).toBeTruthy();
	},
};
