import type { ComponentProps, ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { ReservationsTable } from '../components/reservations-table.tsx';
import {
	reservationStoryMocks,
	storyReservationsActive,
	storyReservationsAll,
	storyReservationsPast,
} from './reservation-story-mocks.ts';

const meta: Meta<typeof ReservationsTable> = {
	title: 'Organisms/ReservationsTable',
	component: ReservationsTable,
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

const wrapTableWithProvider = (
	component: ReactElement,
	mocks = reservationStoryMocks,
) => <MockedProvider mocks={mocks}>{component}</MockedProvider>;

const renderTable = (props: ComponentProps<typeof ReservationsTable>) =>
	wrapTableWithProvider(<ReservationsTable {...props} />);

export const AllReservations: Story = {
	render: () =>
		renderTable({
			reservations: storyReservationsAll,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
		}),
};

export const ActiveReservations: Story = {
	render: () =>
		renderTable({
			reservations: storyReservationsActive,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
			emptyText: 'No active reservations found',
		}),
};

export const HistoryReservations: Story = {
	render: () =>
		renderTable({
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
		renderTable({
			reservations: [],
			emptyText: 'No reservations found',
		}),
};

export const LoadingStates: Story = {
	render: () =>
		renderTable({
			reservations: storyReservationsActive,
			onCancel: (id: string) => console.log('Cancel clicked for:', id),
			onClose: (id: string) => console.log('Close clicked for:', id),
			onMessage: (id: string) => console.log('Message clicked for:', id),
			cancelLoading: true,
		}),
};
