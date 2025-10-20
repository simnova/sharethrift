import type { Meta, StoryObj } from '@storybook/react';
import { ReservationsTable } from '../components/reservations-table.tsx';
import {
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from './reservation-story-mocks.ts';
import {
	defaultReservationActions,
	withReservationMocks,
} from '../../../../../test/utils/storybook-reservation-providers.tsx';

const meta: Meta<typeof ReservationsTable> = {
	title: 'Organisms/ReservationsTable',
	component: ReservationsTable,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	// Global decorator for MockedProvider
	decorators: [withReservationMocks],
	args: defaultReservationActions,
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
