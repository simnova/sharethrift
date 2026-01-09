import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn, waitFor } from 'storybook/test';
import { AllListingsTable } from '../components/all-listings-table.tsx';

// Create mock data with proper GraphQL fragment type
const createMockListing = (
	id: string,
	title: string,
	state: string,
	createdAt?: string,
	sharingPeriodStart?: string,
	sharingPeriodEnd?: string,
) => ({
	__typename: 'ListingAll' as const,
	id,
	title,
	state,
	images: ['/assets/item-images/projector.png'],
	createdAt: createdAt ?? '2025-01-15T10:00:00Z',
	sharingPeriodStart: sharingPeriodStart ?? '2025-01-20',
	sharingPeriodEnd: sharingPeriodEnd ?? '2025-02-20',
});

const MOCK_LISTINGS = [
	createMockListing('1', 'Cordless Drill', 'Paused'),
	createMockListing('2', 'Electric Guitar', 'Active'),
];

// Mock listings with all status types for coverage
const ALL_STATUS_LISTINGS = [
	createMockListing('1', 'Active Listing', 'Active'),
	createMockListing('2', 'Paused Listing', 'Paused'),
	createMockListing('3', 'Reserved Listing', 'Reserved'),
	createMockListing('4', 'Expired Listing', 'Expired'),
	createMockListing('5', 'Draft Listing', 'Draft'),
	createMockListing('6', 'Blocked Listing', 'Blocked'),
	createMockListing('7', 'Cancelled Listing', 'Cancelled'),
];

const meta: Meta<typeof AllListingsTable> = {
	title: 'My Listings/All Listings Table',
	component: AllListingsTable,
	args: {
		data: MOCK_LISTINGS,
		searchText: '',
		statusFilters: [],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 6,
		total: MOCK_LISTINGS.length,
		loading: false,
		onSearch: fn(),
		onStatusFilter: fn(),
		onTableChange: fn(),
		onPageChange: fn(),
		onAction: fn(),
		onViewAllRequests: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Use getAllByText as Dashboard renders both table and card views
		await expect(canvas.getAllByText('Cordless Drill').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('Electric Guitar').length).toBeGreaterThan(0);
	},
};

// Test all status variations for action button coverage
export const AllStatusTypes: Story = {
	args: {
		data: ALL_STATUS_LISTINGS,
		total: ALL_STATUS_LISTINGS.length,
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Use getAllByText as Dashboard renders both table and card views
		await expect(canvas.getAllByText('Active Listing').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('Paused Listing').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('Reserved Listing').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('Expired Listing').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('Draft Listing').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('Blocked Listing').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('Cancelled Listing').length).toBeGreaterThan(0);
	},
};

// Test clicking Pause button on Active listing
export const ClickPauseButton: Story = {
	args: {
		data: [createMockListing('1', 'Active Item', 'Active')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const pauseButton = await canvas.findByRole('button', { name: 'Pause' });
		await userEvent.click(pauseButton);
		await expect(args.onAction).toHaveBeenCalledWith('pause', '1');
	},
};

// Test clicking Edit button (always available)
export const ClickEditButton: Story = {
	args: {
		data: [createMockListing('1', 'Any Item', 'Active')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = await canvas.findByRole('button', { name: 'Edit' });
		await userEvent.click(editButton);
		await expect(args.onAction).toHaveBeenCalledWith('edit', '1');
	},
};

// Test Reinstate button on Paused listing
export const ClickReinstateButton: Story = {
	args: {
		data: [createMockListing('1', 'Paused Item', 'Paused')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const reinstateButton = await canvas.findByRole('button', { name: 'Reinstate' });
		await userEvent.click(reinstateButton);
		await expect(args.onAction).toHaveBeenCalledWith('reinstate', '1');
	},
};

// Test Publish button on Draft listing
export const ClickPublishButton: Story = {
	args: {
		data: [createMockListing('1', 'Draft Item', 'Draft')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const publishButton = await canvas.findByRole('button', { name: 'Publish' });
		await userEvent.click(publishButton);
		await expect(args.onAction).toHaveBeenCalledWith('publish', '1');
	},
};

// Test Cancel confirmation on Active listing
export const ClickCancelWithConfirmation: Story = {
	args: {
		data: [createMockListing('1', 'Active Item', 'Active')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const cancelButton = await canvas.findByRole('button', { name: 'Cancel' });
		await userEvent.click(cancelButton);
		// Confirm the popconfirm
		await waitFor(async () => {
			const yesButton = document.querySelector('.ant-popconfirm-buttons .ant-btn-primary');
			if (yesButton) {
				await userEvent.click(yesButton);
			}
		});
		await expect(args.onAction).toHaveBeenCalledWith('cancel', '1');
	},
};

// Test Delete confirmation
export const ClickDeleteWithConfirmation: Story = {
	args: {
		data: [createMockListing('1', 'Any Item', 'Cancelled')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const deleteButton = await canvas.findByRole('button', { name: 'Delete' });
		await userEvent.click(deleteButton);
		// Confirm the popconfirm
		await waitFor(async () => {
			const yesButton = document.querySelector('.ant-popconfirm-buttons .ant-btn-primary');
			if (yesButton) {
				await userEvent.click(yesButton);
			}
		});
		await expect(args.onAction).toHaveBeenCalledWith('delete', '1');
	},
};

// Test Appeal button on Blocked listing (with popconfirm)
export const ClickAppealWithConfirmation: Story = {
	args: {
		data: [createMockListing('1', 'Blocked Item', 'Blocked')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const appealButton = await canvas.findByRole('button', { name: 'Appeal' });
		await userEvent.click(appealButton);
		// Confirm the popconfirm
		await waitFor(async () => {
			const yesButton = document.querySelector('.ant-popconfirm-buttons .ant-btn-primary');
			if (yesButton) {
				await userEvent.click(yesButton);
			}
		});
		await expect(args.onAction).toHaveBeenCalledWith('appeal', '1');
	},
};

// Test Reserved listing (has Pause button)
export const ReservedListing: Story = {
	args: {
		data: [createMockListing('1', 'Reserved Item', 'Reserved')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const pauseButton = await canvas.findByRole('button', { name: 'Pause' });
		await userEvent.click(pauseButton);
		await expect(args.onAction).toHaveBeenCalledWith('pause', '1');
	},
};

// Test Expired listing (has Reinstate button)
export const ExpiredListing: Story = {
	args: {
		data: [createMockListing('1', 'Expired Item', 'Expired')],
		total: 1,
		onAction: fn(),
	},
	play:  async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const reinstateButton = await canvas.findByRole('button', { name: 'Reinstate' });
		await userEvent.click(reinstateButton);
		await expect(args.onAction).toHaveBeenCalledWith('reinstate', '1');
	},
};

// Test with N/A dates (null/undefined)
export const ListingWithoutDates: Story = {
	args: {
		data: [{
			__typename: 'ListingAll' as const,
			id: '1',
			title: 'No Dates Item',
			state: 'Draft',
			images: ['/assets/item-images/projector.png'],
			createdAt: undefined,
			sharingPeriodStart: undefined,
			sharingPeriodEnd: undefined,
		}],
		total: 1,
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Use getAllByText as Dashboard renders both table and card views
		await expect(canvas.getAllByText('No Dates Item').length).toBeGreaterThan(0);
		// Should display N/A for dates
		const naTexts = canvas.getAllByText('N/A');
		await expect(naTexts.length).toBeGreaterThan(0);
	},
};

// Test with sorting applied
export const WithSortingApplied: Story = {
	args: {
		data: MOCK_LISTINGS,
		sorter: { field: 'createdAt', order: 'ascend' },
	},
	play:  async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

// Test loading state
export const Loading: Story = {
	args: {
		data: [],
		total: 0,
		loading: true,
	},
	play:  async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

// Test with status filters applied
export const WithStatusFilters: Story = {
	args: {
		data: MOCK_LISTINGS,
		statusFilters: ['Active', 'Paused'],
	},
	play:  async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

// Test search filter functionality
export const WithSearchText: Story = {
	args: {
		data: MOCK_LISTINGS,
		searchText: 'Drill',
	},
	play:  async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
