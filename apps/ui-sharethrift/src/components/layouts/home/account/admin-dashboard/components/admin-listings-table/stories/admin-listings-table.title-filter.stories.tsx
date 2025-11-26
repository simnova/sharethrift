import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, fn, userEvent } from 'storybook/test';
import { TitleFilter } from '../admin-listings-table.title-filter.tsx';

const meta: Meta<typeof TitleFilter> = {
	title: 'Admin/ListingsTable/TitleFilter',
	component: TitleFilter,
	parameters: {
		layout: 'centered',
	},
	args: {
		searchText: '',
		onSearch: fn(),
		setSelectedKeys: fn(),
		selectedKeys: [],
		confirm: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof TitleFilter>;

export const Empty: Story = {
	args: {
		searchText: '',
		selectedKeys: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Search listings');
		expect(input).toBeTruthy();
	},
};

export const WithSearchText: Story = {
	args: {
		searchText: 'bicycle',
		selectedKeys: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Search listings');
		expect(input).toBeTruthy();
	},
};

export const WithSelectedKeys: Story = {
	args: {
		searchText: '',
		selectedKeys: ['tent'],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Search listings');
		expect((input as HTMLInputElement).value).toBe('tent');
	},
};

export const TypingSearch: Story = {
	args: {
		searchText: '',
		selectedKeys: [],
		setSelectedKeys: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Search listings');
		await userEvent.type(input, 'bike');
		expect(args.setSelectedKeys).toHaveBeenCalled();
	},
};
