import type { Meta, StoryObj } from '@storybook/react';
import { ReservationsView } from '../components/reservations-view.tsx';
import {
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from '../utils/reservation-story-mocks.ts';
import {
	defaultReservationActions,
	withReservationMocks,
} from '../../../../../../test/utils/storybook-providers.tsx';
const meta: Meta<typeof ReservationsView> = {
	title: 'Components/Organisms/ReservationsView',
	component: ReservationsView,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Responsive reservations view that shows table on desktop and cards on mobile.',
			},
		},
	},
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
type Story = StoryObj<typeof ReservationsView>;

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

export const LoadingSpinner: Story = {
	args: {
		reservations: [],
		loading: true,
	},
};

export const ErrorState: Story = {
	args: {
		reservations: [],
		error: new Error('Failed to load reservations'),
	},
};
