import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { StatusTag } from '../admin-listings-table.status-tag.tsx';

const meta: Meta<typeof StatusTag> = {
	title: 'Admin/ListingsTable/StatusTag',
	component: StatusTag,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		status: {
			control: 'select',
			options: ['Blocked', 'Published', undefined],
		},
	},
};

export default meta;
type Story = StoryObj<typeof StatusTag>;

export const Blocked: Story = {
	args: {
		status: 'Blocked',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tag = canvas.getByText('Blocked');
		expect(tag).toBeTruthy();
	},
};

export const UndefinedStatus: Story = {
	args: {
		status: undefined,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tag = canvas.getByText('N/A');
		expect(tag).toBeTruthy();
	},
};

export const CustomStatus: Story = {
	args: {
		status: 'Published',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tag = canvas.getByText('Published');
		expect(tag).toBeTruthy();
	},
};
