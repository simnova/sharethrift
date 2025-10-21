import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { action } from '@storybook/addon-actions';
import { ReservationsView } from '../components/reservations-view.tsx';
import {
	reservationStoryMocks,
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from './reservation-story-mocks.ts';

const meta: Meta<typeof ReservationsView> = {
	title: 'Organisms/ReservationsView',
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
	// Global decorator for MockedProvider
	decorators: [
		(Story) => <MockedProvider mocks={reservationStoryMocks}><Story/></MockedProvider>,
	],
	// Default event handlers
	args: {
		onCancel: action('Cancel clicked'),
		onClose: action('Close clicked'),
		onMessage: action('Message clicked'),
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
type Story = StoryObj<typeof ReservationsView>;

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
