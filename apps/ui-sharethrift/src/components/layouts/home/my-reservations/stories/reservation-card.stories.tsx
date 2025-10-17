import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { action } from '@storybook/addon-actions';
import { ReservationCard } from '../components/reservation-card.tsx';
import {
	reservationStoryMocks,
	storyReservationsActive,
	storyReservationsPast,
} from './reservation-story-mocks.ts';

const meta: Meta<typeof ReservationCard> = {
	title: 'Molecules/ReservationCard',
	component: ReservationCard,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	// Global decorator for MockedProvider
	decorators: [
		(Story) => (
			<MockedProvider mocks={reservationStoryMocks}>
				<Story />
			</MockedProvider>
		),
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
type Story = StoryObj<typeof meta>;

// Single Template
const Template: Story = (args) => <ReservationCard {...args} />;

// Bind stories with minimal boilerplate
export const Requested = Template.bind({});
Requested.args = { reservation: storyReservationsActive[0] };

export const Accepted = Template.bind({});
Accepted.args = { reservation: storyReservationsActive[1] };

export const Rejected = Template.bind({});
Rejected.args = { reservation: storyReservationsPast[0] };

export const Cancelled = Template.bind({});
Cancelled.args = { reservation: storyReservationsPast[1] };

export const Closed = Template.bind({});
Closed.args = { reservation: storyReservationsPast[2] };

export const WithoutActions = Template.bind({});
WithoutActions.args = {
	reservation: storyReservationsActive[0],
	showActions: false,
};

export const LoadingStates = Template.bind({});
LoadingStates.args = {
	reservation: storyReservationsActive[0],
	cancelLoading: true,
};
