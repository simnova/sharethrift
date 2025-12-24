import type { Meta, StoryObj } from '@storybook/react';
import { RequestsCard } from '../components/requests-card.tsx';

const MOCK_REQUEST = {
	id: '1',
	title: 'Cordless Drill',
	image: '/assets/item-images/projector.png',
	requestedOn: '2025-12-23',
	reservationPeriod: '2020-11-08 - 2020-12-23',
	status: 'Requested',
	requestedBy: 'John Doe',
};

const meta: Meta<typeof RequestsCard> = {
	title: 'My Listings/Requests Card',
	component: RequestsCard,
	args: {
		listing: MOCK_REQUEST,
		onAccept: async (id: string) => console.log('Accept:', id),
		onReject: (id: string) => console.log('Reject:', id),
		onClose: (id: string) => console.log('Close:', id),
		onDelete: (id: string) => console.log('Delete:', id),
		onMessage: (id: string) => console.log('Message:', id),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Requested: Story = {
	args: {
		listing: { ...MOCK_REQUEST, status: 'Requested' },
	},
};

export const Accepted: Story = {
	args: {
		listing: { ...MOCK_REQUEST, status: 'Accepted' },
	},
};

export const Rejected: Story = {
	args: {
		listing: { ...MOCK_REQUEST, status: 'Rejected' },
	},
};

export const Closed: Story = {
	args: {
		listing: { ...MOCK_REQUEST, status: 'Closed' },
	},
};

export const Expired: Story = {
	args: {
		listing: { ...MOCK_REQUEST, status: 'Expired' },
	},
};
