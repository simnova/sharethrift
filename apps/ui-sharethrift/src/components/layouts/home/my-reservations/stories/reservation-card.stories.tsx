import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { ReservationCard } from '../components/reservation-card.tsx';
import {
	reservationStoryMocks,
	storyReservationsActive,
	storyReservationsPast,
} from './reservation-story-mocks.ts';

const meta: Meta<typeof ReservationCard> = {
	title: 'Molecules/ReservationCard',
	component: ReservationCard,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	// Global decorator for MockedProvider
	decorators: [
		(Story) => (
			<MockedProvider mocks={reservationStoryMocks}>
				<Story />
			</MockedProvider>
		),
	],
	// Default event handlers
	args: {
		onCancel: (id: string) => console.log('Cancel clicked', id),
		onClose: (id: string) => console.log('Close clicked', id),
		onMessage: (id: string) => console.log('Message clicked', id),
	},
	argTypes: {
		cancelLoading: {
			control: 'boolean',
		},
		closeLoading: {
			control: 'boolean',
		},
		showActions: {
			control: 'boolean',
		},
	},
};
export default meta;
type Story = StoryObj<typeof meta>;

// Stories using modern Storybook syntax
export const Requested: Story = {
	args: { reservation: storyReservationsActive[0] },
};

export const Accepted: Story = {
	args: { reservation: storyReservationsActive[1] },
};

export const Rejected: Story = {
	args: { reservation: storyReservationsPast[0] },
};

export const Cancelled: Story = {
	args: { reservation: storyReservationsPast[1] },
};

export const Closed: Story = {
	args: { reservation: storyReservationsPast[2] },
};

export const WithoutActions: Story = {
	args: {
		reservation: storyReservationsActive[0],
		showActions: false,
	},
};

export const LoadingStates: Story = {
	args: {
		reservation: storyReservationsActive[0],
		cancelLoading: true,
	},
};
