import type { ComponentProps, ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
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

const wrapViewWithProvider = (
	component: ReactElement,
	mocks = reservationStoryMocks,
) => <MockedProvider mocks={mocks}>{component}</MockedProvider>;

const renderView = (props: ComponentProps<typeof ReservationsView>) =>
	wrapViewWithProvider(<ReservationsView {...props} />);

export const AllReservations: Story = {
	render: () =>
		renderView({
			reservations: storyReservationsAll,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
		}),
};

export const ActiveReservations: Story = {
	render: () =>
		renderView({
			reservations: storyReservationsActive,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
			emptyText: 'No active reservations found',
		}),
};

export const HistoryReservations: Story = {
	render: () =>
		renderView({
			reservations: storyReservationsPast,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
			showActions: false,
			emptyText: 'No reservation history found',
		}),
};

export const Empty: Story = {
	render: () =>
		renderView({
			reservations: [],
			emptyText: 'No reservations found',
		}),
};

export const LoadingStates: Story = {
	render: () =>
		renderView({
			reservations: storyReservationsActive,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
			cancelLoading: true,
		}),
};
