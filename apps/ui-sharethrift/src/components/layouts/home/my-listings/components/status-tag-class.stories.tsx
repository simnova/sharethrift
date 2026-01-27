import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import type React from 'react';
import { getStatusTagClass } from './status-tag-class.ts';

type ListingStatus =
	| 'Active'
	| 'Paused'
	| 'Reserved'
	| 'Expired'
	| 'Draft'
	| 'Blocked'
	| 'Cancelled';

const StatusTagClassTest = (): React.ReactElement => {
	const statuses: ListingStatus[] = [
		'Active',
		'Paused',
		'Reserved',
		'Expired',
		'Draft',
		'Blocked',
		'Cancelled',
	];

	return (
		<div style={{ padding: '20px' }}>
			<h2>Status Tag Class Utility Test</h2>
			<table data-testid="status-table">
				<thead>
					<tr>
						<th>Status</th>
						<th>CSS Class</th>
					</tr>
				</thead>
				<tbody>
					{statuses.map((status) => (
						<tr key={status}>
							<td>{status}</td>
							<td data-testid={`class-${status}`}>{getStatusTagClass(status)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const meta: Meta<typeof StatusTagClassTest> = {
	title: 'Components/Layouts/Home/MyListings/Utilities/StatusTagClass',
	component: StatusTagClassTest,
	parameters: {
		layout: 'centered',
	},
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof StatusTagClassTest>;

export const AllStatusClasses: Story = {
	play: ({ canvasElement }) => {
		expect(getStatusTagClass('Active')).toBe('activeTag');
		expect(getStatusTagClass('Paused')).toBe('pausedTag');
		expect(getStatusTagClass('Reserved')).toBe('reservedTag');
		expect(getStatusTagClass('Expired')).toBe('expiredTag');
		expect(getStatusTagClass('Draft')).toBe('draftTag');
		expect(getStatusTagClass('Blocked')).toBe('blockedTag');
		expect(getStatusTagClass('Cancelled')).toBe('cancelledTag');

		const statusTable = canvasElement.querySelector(
			'[data-testid="status-table"]',
		);
		expect(statusTable).toBeTruthy();
	},
};

export const UnknownStatus: Story = {
	play: ({ canvasElement }) => {
		expect(getStatusTagClass('Unknown')).toBe('');
		expect(getStatusTagClass('')).toBe('');
		expect(getStatusTagClass('InvalidStatus')).toBe('');
		expect(getStatusTagClass('active')).toBe('');
		expect(getStatusTagClass('ACTIVE')).toBe('');

		expect(canvasElement).toBeTruthy();
	},
};
