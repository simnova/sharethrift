import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import type React from 'react';
import {
	ACTIVE_RESERVATION_STATES,
	INACTIVE_RESERVATION_STATES,
	isActiveReservationState,
	isInactiveReservationState,
} from '../constants/reservation-state-utils.ts';

const ReservationStateUtilsTest = (): React.ReactElement => {
	return (
		<div style={{ padding: '20px' }}>
			<h2>Reservation State Utilities Test</h2>
			<div data-testid="active-states">
				<h3>Active States:</h3>
				<ul>
					{ACTIVE_RESERVATION_STATES.map((state) => (
						<li key={state}>{state}</li>
					))}
				</ul>
			</div>
			<div data-testid="inactive-states">
				<h3>Inactive States:</h3>
				<ul>
					{INACTIVE_RESERVATION_STATES.map((state) => (
						<li key={state}>{state}</li>
					))}
				</ul>
			</div>
		</div>
	);
};

const meta: Meta<typeof ReservationStateUtilsTest> = {
	title: 'Components/Layouts/Home/MyReservations/Utilities/ReservationStateUtils',
	component: ReservationStateUtilsTest,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof ReservationStateUtilsTest>;

export const Constants: Story = {
	play: ({ canvasElement }) => {
		expect(ACTIVE_RESERVATION_STATES).toContain('Accepted');
		expect(ACTIVE_RESERVATION_STATES).toContain('Requested');
		expect(ACTIVE_RESERVATION_STATES.length).toBe(2);

		expect(INACTIVE_RESERVATION_STATES).toContain('Cancelled');
		expect(INACTIVE_RESERVATION_STATES).toContain('Closed');
		expect(INACTIVE_RESERVATION_STATES).toContain('Rejected');
		expect(INACTIVE_RESERVATION_STATES.length).toBe(3);

		const activeStates = canvasElement.querySelector(
			'[data-testid="active-states"]',
		);
		expect(activeStates).toBeTruthy();
	},
};

export const ActiveStateChecker: Story = {
	play: ({ canvasElement }) => {
		expect(isActiveReservationState('Accepted')).toBe(true);
		expect(isActiveReservationState('Requested')).toBe(true);

		expect(isActiveReservationState('Cancelled')).toBe(false);
		expect(isActiveReservationState('Closed')).toBe(false);
		expect(isActiveReservationState('Rejected')).toBe(false);
		expect(isActiveReservationState('Unknown')).toBe(false);
		expect(isActiveReservationState('')).toBe(false);

		expect(canvasElement).toBeTruthy();
	},
};

export const InactiveStateChecker: Story = {
	play: ({ canvasElement }) => {
		expect(isInactiveReservationState('Cancelled')).toBe(true);
		expect(isInactiveReservationState('Closed')).toBe(true);
		expect(isInactiveReservationState('Rejected')).toBe(true);

		expect(isInactiveReservationState('Accepted')).toBe(false);
		expect(isInactiveReservationState('Requested')).toBe(false);
		expect(isInactiveReservationState('Unknown')).toBe(false);
		expect(isInactiveReservationState('')).toBe(false);

		expect(canvasElement).toBeTruthy();
	},
};
