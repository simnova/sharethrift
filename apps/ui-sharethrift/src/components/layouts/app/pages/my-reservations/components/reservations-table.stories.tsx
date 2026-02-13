import type { Meta, StoryObj } from '@storybook/react';
import { ReservationsTable } from '../components/reservations-table.tsx';
import {
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from '../utils/reservation-story-mocks.ts';
import {
	defaultReservationActions,
	withReservationMocks,
} from '../../../../../../test/utils/storybook-providers.tsx';
import { expect, within } from 'storybook/test';

const meta: Meta<typeof ReservationsTable> = {
	title: 'Components/Organisms/ReservationsTable',
	component: ReservationsTable,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	decorators: [withReservationMocks],
	args: defaultReservationActions,
	argTypes: {
		onCancel: { action: 'cancel clicked' },
		onClose: { action: 'close clicked' },
		onMessage: { action: 'message clicked' },
	},
};

export default meta;
type Story = StoryObj<typeof ReservationsTable>;

export const AllReservations: Story = {
	args: { reservations: storyReservationsAll },
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('table')).toBeInTheDocument();
	},
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
