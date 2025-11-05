import type { Meta, StoryObj } from '@storybook/react';
import { RequestsCard } from '../components/requests-card.tsx';

const MOCK_REQUEST = {
	id: '1',
	title: 'Cordless Drill',
	image: '/assets/item-images/projector.png',
	requestedOn: '2025-12-23',
	reservationPeriod: '2020-11-08 - 2020-12-23',
	status: 'Pending',
	requestedBy: 'John Doe',
};

const meta: Meta<typeof RequestsCard> = {
	title: 'My Listings/Requests Card',
	component: RequestsCard,
	args: {
		listing: MOCK_REQUEST,
		onAction: (action: string, id: string) =>
			console.log('Action:', action, 'Request ID:', id),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
	args: {
		listing: { ...MOCK_REQUEST, status: 'Pending' },
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
