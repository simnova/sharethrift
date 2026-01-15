import type { Meta, StoryObj } from '@storybook/react';
import { ReservationsGrid } from '../components/reservations-grid.tsx';
import {
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from '../utils/reservation-story-mocks.ts';
import {
	defaultReservationActions,
	withReservationMocks,
} from '../../../../../test/utils/storybook-providers.tsx';
const meta: Meta<typeof ReservationsGrid> = {
	title: 'Organisms/ReservationsGrid',
	component: ReservationsGrid,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	// Global decorator for MockedProvider
	decorators: [withReservationMocks],
	args: defaultReservationActions, // apply to all stories by default
	argTypes: {
		onCancel: { action: 'cancel clicked' },
		onClose: { action: 'close clicked' },
		onMessage: { action: 'message clicked' },
	},
};
export default meta;

type Story = StoryObj<typeof ReservationsGrid>;

export const AllReservations: Story = {
	args: { reservations: storyReservationsAll }};

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
