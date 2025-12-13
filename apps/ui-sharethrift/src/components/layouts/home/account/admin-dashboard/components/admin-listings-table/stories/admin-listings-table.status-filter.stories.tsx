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
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('Filter by Status')).toBeTruthy();
		expect(canvas.getByText('Blocked')).toBeTruthy();
	},
};

export const WithBothFilters: Story = {
	args: {
		statusFilters: ['Blocked'],
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
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
		const blockedCheckbox = canvas.getByText('Blocked');
		await userEvent.click(blockedCheckbox);
		expect(args.onStatusFilter).toHaveBeenCalled();
		expect(args.confirm).toHaveBeenCalled();
	},
};
