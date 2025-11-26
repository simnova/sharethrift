import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, fn, userEvent } from 'storybook/test';
import { StatusFilter } from '../admin-listings-table.status-filter.tsx';

const meta: Meta<typeof StatusFilter> = {
	title: 'Admin/ListingsTable/StatusFilter',
	component: StatusFilter,
	parameters: {
		layout: 'centered',
	},
	args: {
		statusFilters: [],
		onStatusFilter: fn(),
		confirm: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof StatusFilter>;

export const NoFilters: Story = {
	args: {
		statusFilters: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('Filter by Status')).toBeTruthy();
		expect(canvas.getByText('Appealed')).toBeTruthy();
		expect(canvas.getByText('Blocked')).toBeTruthy();
	},
};

export const WithAppealedFilter: Story = {
	args: {
		statusFilters: ['Appeal Requested'],
	},
	play: async ({ canvasElement }) => {
		const checkboxes = canvasElement.querySelectorAll('input[type="checkbox"]');
		expect(checkboxes.length).toBe(2);
	},
};

export const WithBothFilters: Story = {
	args: {
		statusFilters: ['Appeal Requested', 'Blocked'],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('Appealed')).toBeTruthy();
		expect(canvas.getByText('Blocked')).toBeTruthy();
	},
};

export const ClickingFilter: Story = {
	args: {
		statusFilters: [],
		onStatusFilter: fn(),
		confirm: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const appealedCheckbox = canvas.getByText('Appealed');
		await userEvent.click(appealedCheckbox);
		expect(args.onStatusFilter).toHaveBeenCalled();
		expect(args.confirm).toHaveBeenCalled();
	},
};
