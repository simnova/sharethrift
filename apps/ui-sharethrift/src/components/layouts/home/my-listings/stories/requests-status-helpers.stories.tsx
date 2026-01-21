import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, fn, userEvent } from 'storybook/test';
import type React from 'react';
import { getStatusTagClass, getActionButtons } from '../components/requests-status-helpers.tsx';
import type { ListingRequestData } from '../components/my-listings-dashboard.types.ts';

const RequestsHelpersTest = (): React.ReactElement => {
	const statuses = ['Accepted', 'Rejected', 'Closed', 'Pending', 'Closing', 'Unknown'];
	
	return (
		<div style={{ padding: '20px' }}>
			<h2>Requests Status Helpers</h2>
			<h3>getStatusTagClass</h3>
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

const meta: Meta<typeof RequestsHelpersTest> = {
	title: 'Components/Layouts/Home/MyListings/Utilities/RequestsHelpers',
	component: RequestsHelpersTest,
	parameters: {
		layout: 'centered',
	},
  tags: ['!dev'], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags

};

export default meta;
type Story = StoryObj<typeof RequestsHelpersTest>;

export const StatusTagClasses: Story = {
	play: ({ canvasElement }) => {
		expect(getStatusTagClass('Accepted')).toBe('requestAcceptedTag');
		expect(getStatusTagClass('Rejected')).toBe('requestRejectedTag');
		expect(getStatusTagClass('Closed')).toBe('expiredTag');
		expect(getStatusTagClass('Pending')).toBe('pendingTag');
		expect(getStatusTagClass('Closing')).toBe('closingTag');
		expect(getStatusTagClass('Unknown')).toBe('');
		expect(getStatusTagClass('')).toBe('');

		const table = canvasElement.querySelector('[data-testid="status-table"]');
		expect(table).toBeTruthy();
	},
};

const ActionButtonsTest = () => {
	const mockOnAction = (action: string, requestId: string) => {
		console.log(`Action: ${action}, Request: ${requestId}`);
	};

	const pendingRequest: ListingRequestData = {
		id: 'req-1',
		status: 'Pending',
		title: 'Test Listing',
		requestedBy: 'John Doe',
		requestedOn: '2024-01-15',
		reservationPeriod: '2024-02-01 - 2024-02-15',
	};

	const acceptedRequest: ListingRequestData = {
		id: 'req-2',
		status: 'Accepted',
		title: 'Test Listing',
		requestedBy: 'Jane Smith',
		requestedOn: '2024-01-10',
		reservationPeriod: '2024-02-01 - 2024-02-15',
	};

	const closedRequest: ListingRequestData = {
		id: 'req-3',
		status: 'Closed',
		title: 'Test Listing',
		requestedBy: 'Bob Wilson',
		requestedOn: '2024-01-05',
		reservationPeriod: '2024-02-01 - 2024-02-15',
	};

	const rejectedRequest: ListingRequestData = {
		id: 'req-4',
		status: 'Rejected',
		title: 'Test Listing',
		requestedBy: 'Alice Brown',
		requestedOn: '2024-01-01',
		reservationPeriod: '2024-02-01 - 2024-02-15',
	};

	return (
		<div style={{ padding: '20px' }}>
			<h2>Action Buttons by Status</h2>
			<div data-testid="pending-buttons">
				<h3>Pending Request</h3>
				<div style={{ display: 'flex', gap: '8px' }}>
					{getActionButtons(pendingRequest, mockOnAction)}
				</div>
			</div>
			<div data-testid="accepted-buttons">
				<h3>Accepted Request</h3>
				<div style={{ display: 'flex', gap: '8px' }}>
					{getActionButtons(acceptedRequest, mockOnAction)}
				</div>
			</div>
			<div data-testid="closed-buttons">
				<h3>Closed Request</h3>
				<div style={{ display: 'flex', gap: '8px' }}>
					{getActionButtons(closedRequest, mockOnAction)}
				</div>
			</div>
			<div data-testid="rejected-buttons">
				<h3>Rejected Request</h3>
				<div style={{ display: 'flex', gap: '8px' }}>
					{getActionButtons(rejectedRequest, mockOnAction)}
				</div>
			</div>
		</div>
	);
};

export const ActionButtons: Story = {
	render: () => <ActionButtonsTest />,
	play: ({ canvasElement }) => {
		const pendingSection = canvasElement.querySelector('[data-testid="pending-buttons"]');
		expect(pendingSection?.textContent).toContain('Accept');
		expect(pendingSection?.textContent).toContain('Reject');

		const acceptedSection = canvasElement.querySelector('[data-testid="accepted-buttons"]');
		expect(acceptedSection?.textContent).toContain('Message');
		expect(acceptedSection?.textContent).toContain('Close');

		const closedSection = canvasElement.querySelector('[data-testid="closed-buttons"]');
		expect(closedSection?.textContent).toContain('Message');

		const rejectedSection = canvasElement.querySelector('[data-testid="rejected-buttons"]');
		expect(rejectedSection?.textContent).toContain('Delete');
	},
};

const ActionButtonsInteractive = () => {
	const onAction = fn();
	
	const pendingRequest: ListingRequestData = {
		id: 'req-1',
		status: 'Pending',
		title: 'Test Listing',
		requestedBy: 'John Doe',
		requestedOn: '2024-01-15',
		reservationPeriod: '2024-02-01 - 2024-02-15',
	};

	return (
		<div style={{ padding: '20px' }} data-testid="interactive-test">
			<h2>Interactive Action Buttons</h2>
			<div style={{ display: 'flex', gap: '8px' }}>
				{getActionButtons(pendingRequest, onAction)}
			</div>
		</div>
	);
};

export const ClickAcceptButton: Story = {
	render: () => <ActionButtonsInteractive />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const acceptBtn = canvas.getByText('Accept');
		await userEvent.click(acceptBtn);
		
		expect(acceptBtn).toBeTruthy();
	},
};
