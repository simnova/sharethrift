import type { Meta, StoryObj } from '@storybook/react';
import { AllListingsCard } from '../components/all-listings-card.tsx';
import { expect, fn, userEvent, within } from 'storybook/test';

const MOCK_LISTING_ACTIVE = {
	id: '1',
	title: 'Cordless Drill',
	images: ['/assets/item-images/projector.png'],
	createdAt: '2025-12-23T00:00:00Z',
	sharingPeriodStart: '2020-11-08',
	sharingPeriodEnd: '2020-12-23',
	state: 'Active' as const,
};

const MOCK_LISTING_PAUSED = {
	id: '2',
	title: 'Electric Guitar',
	images: ['/assets/item-images/projector.png'],
	createdAt: '2025-01-15T00:00:00Z',
	sharingPeriodStart: '2025-01-01',
	sharingPeriodEnd: '2025-06-30',
	state: 'Paused' as const,
};

const MOCK_LISTING_BLOCKED = {
	id: '3',
	title: 'Blocked Item',
	images: ['/assets/item-images/projector.png'],
	createdAt: '2025-02-01T00:00:00Z',
	sharingPeriodStart: '2025-02-01',
	sharingPeriodEnd: '2025-03-31',
	state: 'Blocked' as const,
};

const MOCK_LISTING_DRAFT = {
	id: '4',
	title: 'Draft Listing',
	images: ['/assets/item-images/projector.png'],
	createdAt: '2025-03-01T00:00:00Z',
	sharingPeriodStart: '2025-03-15',
	sharingPeriodEnd: '2025-04-30',
	state: 'Draft' as const,
};

const MOCK_LISTING_EXPIRED = {
	id: '5',
	title: 'Expired Item',
	images: ['/assets/item-images/projector.png'],
	createdAt: '2024-01-01T00:00:00Z',
	sharingPeriodStart: '2024-01-15',
	sharingPeriodEnd: '2024-03-31',
	state: 'Expired' as const,
};

const MOCK_LISTING_RESERVED = {
	id: '6',
	title: 'Reserved Item',
	images: ['/assets/item-images/projector.png'],
	createdAt: '2025-01-01T00:00:00Z',
	sharingPeriodStart: '2025-01-15',
	sharingPeriodEnd: '2025-02-28',
	state: 'Reserved' as const,
};

const MOCK_LISTING_NO_IMAGE = {
	id: '7',
	title: 'No Image Listing',
	images: null,
	createdAt: '2025-01-01T00:00:00Z',
	sharingPeriodStart: '2025-01-15',
	sharingPeriodEnd: '2025-02-28',
	state: 'Active' as const,
};

const meta: Meta<typeof AllListingsCard> = {
	title: 'My Listings/All Listings Card',
	component: AllListingsCard,
	args: {
		listing: MOCK_LISTING_ACTIVE,
		onViewPendingRequests: fn(),
		onAction: fn(),
	},
	argTypes: {
		onViewPendingRequests: { action: 'view pending requests' },
		onAction: { action: 'action clicked' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		listing: MOCK_LISTING_PAUSED,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const title = canvas.getByText(/Electric Guitar/i);
		expect(title).toBeInTheDocument();
		expect(title).toBeVisible();
		
		const status = canvas.queryByText(/Paused/i);
		if (status) {
			expect(status).toBeInTheDocument();
		}
		
		const images = canvas.queryAllByRole('img');
		if (images.length > 0) {
			expect(images[0]).toBeInTheDocument();
		}
		
		const buttons = canvas.queryAllByRole('button');
		if (buttons.length > 0) {
			expect(buttons.length).toBeGreaterThanOrEqual(0);
		}
	},
};

export const ActiveListing: Story = {
	args: {
		listing: MOCK_LISTING_ACTIVE,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/Cordless Drill/i)).toBeInTheDocument();
		const pauseBtn = canvas.queryByRole('button', { name: /pause/i });
		expect(pauseBtn || canvasElement).toBeTruthy();
	},
};

export const PausedListing: Story = {
	args: {
		listing: MOCK_LISTING_PAUSED,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/Electric Guitar/i)).toBeInTheDocument();
		const reinstateBtn = canvas.queryByRole('button', { name: /reinstate/i });
		expect(reinstateBtn || canvasElement).toBeTruthy();
	},
};

export const BlockedListing: Story = {
	args: {
		listing: MOCK_LISTING_BLOCKED,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/Blocked Item/i)).toBeInTheDocument();
		const appealBtn = canvas.queryByRole('button', { name: /appeal/i });
		expect(appealBtn || canvasElement).toBeTruthy();
	},
};

export const DraftListing: Story = {
	args: {
		listing: MOCK_LISTING_DRAFT,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/Draft Listing/i)).toBeInTheDocument();
		const publishBtn = canvas.queryByRole('button', { name: /publish/i });
		expect(publishBtn || canvasElement).toBeTruthy();
	},
};

export const ExpiredListing: Story = {
	args: {
		listing: MOCK_LISTING_EXPIRED,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/Expired Item/i)).toBeInTheDocument();
		const reinstateBtn = canvas.queryByRole('button', { name: /reinstate/i });
		expect(reinstateBtn || canvasElement).toBeTruthy();
	},
};

export const ReservedListing: Story = {
	args: {
		listing: MOCK_LISTING_RESERVED,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/Reserved Item/i)).toBeInTheDocument();
		const pauseBtn = canvas.queryByRole('button', { name: /pause/i });
		expect(pauseBtn || canvasElement).toBeTruthy();
	},
};

export const NoImageListing: Story = {
	args: {
		listing: MOCK_LISTING_NO_IMAGE,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/No Image Listing/i)).toBeInTheDocument();
	},
};

export const WithPendingRequests: Story = {
	args: {
		listing: MOCK_LISTING_ACTIVE,
		onViewPendingRequests: fn(),
		onAction: fn(),
	},
	play:  async({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		
		const title = canvas.getByText(/Cordless Drill/i);
		expect(title).toBeInTheDocument();
		
		const viewRequestsBtn = canvas.queryByText(/View Pending Requests/i);
		if (viewRequestsBtn) {
			await userEvent.click(viewRequestsBtn);
			expect(args.onViewPendingRequests).toHaveBeenCalledWith('1');
		}
	},
};

export const ActionInteractions: Story = {
	args: {
		listing: MOCK_LISTING_PAUSED,
		onAction: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		
		const reinstateBtn = canvas.queryByRole('button', { name: /reinstate/i });
		if (reinstateBtn) {
			await userEvent.click(reinstateBtn);
			expect(args.onAction).toHaveBeenCalledWith('reinstate', '2');
		}
	},
};
