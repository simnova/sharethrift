import type { Meta, StoryObj } from '@storybook/react';
import { ReservationCard } from '../components/reservation-card.tsx';
import {
	storyReservationsActive,
	storyReservationsPast,
} from '../utils/reservation-story-mocks.ts';
import {
	defaultReservationActions,
	withReservationMocks,
} from '../../../../../test/utils/storybook-providers.tsx';
const meta: Meta<typeof ReservationCard> = {
	title: 'Molecules/ReservationCard',
	component: ReservationCard,
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
type Story = StoryObj<typeof meta>;

export const Requested: Story = {
	args: { reservation: storyReservationsActive[0] }};

export const Accepted: Story = {
	args: { reservation: storyReservationsActive[1] },
};

export const Rejected: Story = {
	args: { reservation: storyReservationsPast[0] },
};

export const Cancelled: Story = {
	args: { reservation: storyReservationsPast[1] },
};

export const Closed: Story = {
	args: { reservation: storyReservationsPast[2] },
};

export const WithoutActions: Story = {
	args: {
		reservation: storyReservationsActive[0],
		showActions: false,
	},
};

export const LoadingStates: Story = {
	args: {
		reservation: storyReservationsActive[0],
		cancelLoading: true,
	},
};
