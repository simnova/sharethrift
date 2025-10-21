import type { ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReservationCard } from '../components/reservation-card.tsx';
import { MockedProvider } from '@apollo/client/testing';
import {
	reservationStoryMocks,
	storyReservationsActive,
	storyReservationsPast,
} from './reservation-story-mocks.ts';

const meta: Meta<typeof ReservationCard> = {
	title: 'Molecules/ReservationCard',
	component: ReservationCard,
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

const wrapWithProvider = (
	node: ReactElement,
	mocks = reservationStoryMocks,
) => <MockedProvider mocks={mocks}>{node}</MockedProvider>;

const activeReservations = storyReservationsActive;
const pastReservations = storyReservationsPast;

const requireReservation = (
	collection: typeof storyReservationsActive,
	index: number,
	label: string,
) => {
	const reservation = collection[index];
	if (!reservation) {
		throw new Error(`Reservation story data missing: ${label}`);
	}
	return reservation;
};

const firstActive = requireReservation(activeReservations, 0, 'active[0]');
const secondActive = requireReservation(activeReservations, 1, 'active[1]');
const firstPast = requireReservation(pastReservations, 0, 'past[0]');
const secondPast = requireReservation(pastReservations, 1, 'past[1]');
const thirdPast = requireReservation(pastReservations, 2, 'past[2]');

export const Requested: Story = {
	render: () =>
		wrapWithProvider(
			<ReservationCard
				reservation={firstActive}
				onCancel={() => console.log('Cancel clicked for:', firstActive.id)}
				onClose={() => console.log('Close clicked for:', firstActive.id)}
				onMessage={() => console.log('Message clicked for:', firstActive.id)}
			/>,
		),
};

export const Accepted: Story = {
	render: () =>
		wrapWithProvider(
			<ReservationCard
				reservation={secondActive}
				onCancel={() => console.log('Cancel clicked for:', secondActive.id)}
				onClose={() => console.log('Close clicked for:', secondActive.id)}
				onMessage={() => console.log('Message clicked for:', secondActive.id)}
			/>,
		),
};

export const Rejected: Story = {
	render: () =>
		wrapWithProvider(
			<ReservationCard
				reservation={firstPast}
				onCancel={() => console.log('Cancel clicked for:', firstPast.id)}
				onClose={() => console.log('Close clicked for:', firstPast.id)}
				onMessage={() => console.log('Message clicked for:', firstPast.id)}
			/>,
		),
};

export const Cancelled: Story = {
	render: () =>
		wrapWithProvider(
			<ReservationCard
				reservation={secondPast}
				onCancel={() => console.log('Cancel clicked for:', secondPast.id)}
				onClose={() => console.log('Close clicked for:', secondPast.id)}
				onMessage={() => console.log('Message clicked for:', secondPast.id)}
			/>,
		),
};

export const Closed: Story = {
	render: () =>
		wrapWithProvider(
			<ReservationCard
				reservation={thirdPast}
				onCancel={() => console.log('Cancel clicked for:', thirdPast.id)}
				onClose={() => console.log('Close clicked for:', thirdPast.id)}
				onMessage={() => console.log('Message clicked for:', thirdPast.id)}
			/>,
		),
};

export const WithoutActions: Story = {
	render: () =>
		wrapWithProvider(
			<ReservationCard
				reservation={firstActive}
				onCancel={() => console.log('Cancel clicked for:', firstActive.id)}
				onClose={() => console.log('Close clicked for:', firstActive.id)}
				onMessage={() => console.log('Message clicked for:', firstActive.id)}
				showActions={false}
			/>,
		),
};

export const LoadingStates: Story = {
	render: () =>
		wrapWithProvider(
			<ReservationCard
				reservation={firstActive}
				onCancel={() => console.log('Cancel clicked for:', firstActive.id)}
				onClose={() => console.log('Close clicked for:', firstActive.id)}
				onMessage={() => console.log('Message clicked for:', firstActive.id)}
				cancelLoading
			/>,
		),
};
