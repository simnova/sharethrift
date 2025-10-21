import type { ComponentProps, ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { ReservationsGrid } from '../components/reservations-grid.tsx';
import {
	reservationStoryMocks,
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from './reservation-story-mocks.ts';

const meta: Meta<typeof ReservationsGrid> = {
	title: 'Organisms/ReservationsGrid',
	component: ReservationsGrid,
	parameters: {
		layout: 'padded',
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

const wrapGridWithProvider = (
	component: ReactElement,
	mocks = reservationStoryMocks,
) => <MockedProvider mocks={mocks}>{component}</MockedProvider>;

const renderGrid = (props: ComponentProps<typeof ReservationsGrid>) =>
	wrapGridWithProvider(<ReservationsGrid {...props} />);

export const AllReservations: Story = {
	render: () =>
		renderGrid({
			reservations: storyReservationsAll,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
		}),
};

export const ActiveReservations: Story = {
	render: () =>
		renderGrid({
			reservations: storyReservationsActive,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
			emptyText: 'No active reservations found',
		}),
};

export const HistoryReservations: Story = {
	render: () =>
		renderGrid({
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
		renderGrid({
			reservations: [],
			emptyText: 'No reservations found',
		}),
};

export const LoadingStates: Story = {
	render: () =>
		renderGrid({
			reservations: storyReservationsActive,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
			cancelLoading: true,
		}),
};
