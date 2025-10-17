import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { action } from '@storybook/addon-actions';
import { ReservationsGrid } from '../components/reservations-grid.tsx';
import {
	reservationStoryMocks,
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from './reservation-story-mocks.ts';

const defaultHandlers = {
	onCancel: action('Cancel clicked'),
	onClose: action('Close clicked'),
	onMessage: action('Message clicked'),
};

const meta: Meta<typeof ReservationsGrid> = {
	title: 'Organisms/ReservationsGrid',
	component: ReservationsGrid,
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
	args: defaultHandlers, // apply to all stories by default
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

type Story = StoryObj<typeof ReservationsGrid>;

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
