import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { ReservationsTable } from '../components/reservations-table.tsx';
import {
	reservationStoryMocks,
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from './reservation-story-mocks.ts';

const defaultActions = {
	onCancel: (id: string) => console.log('Cancel clicked', id),
	onClose: (id: string) => console.log('Close clicked', id),
	onMessage: (id: string) => console.log('Message clicked', id),
};

const meta: Meta<typeof ReservationsTable> = {
	title: 'Organisms/ReservationsTable',
	component: ReservationsTable,
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
	args: defaultActions,
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
type Story = StoryObj<typeof ReservationsTable>;

export const AllReservations: Story = {
	args: { reservations: storyReservationsAll },
};

export const ActiveReservations: Story = {
	args: {
		reservations: storyReservationsActive,
		emptyText: 'No active reservations found',
	},
};

export const HistoryReservations: Story = {
	args: {
		reservations: storyReservationsPast,
		showActions: false,
		emptyText: 'No reservation history found',
	},
};

export const Empty: Story = {
	args: { reservations: [], emptyText: 'No reservations found' },
};

export const LoadingStates: Story = {
	args: { reservations: storyReservationsActive, cancelLoading: true },
};
