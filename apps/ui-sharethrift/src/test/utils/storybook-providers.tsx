import type React from 'react';
import { MockedProvider } from '@apollo/client/testing/react';
import { reservationStoryMocks } from '../../components/layouts/home/my-reservations/stories/reservation-story-mocks.ts';

/**
 * Default action handlers for reservation stories
 */
export const defaultReservationActions = {
	onCancel: (id: string) => console.log('Cancel clicked', id),
	onClose: (id: string) => console.log('Close clicked', id),
	onMessage: (id: string) => console.log('Message clicked', id),
};

/**
 * Global decorator for MockedProvider with reservation mocks
 * Use this in story meta.decorators to provide Apollo Client mocks
 */
export const withReservationMocks = (
	Story: React.ComponentType,
): React.JSX.Element => (
	<MockedProvider mocks={reservationStoryMocks}>
		<Story />
	</MockedProvider>
);
