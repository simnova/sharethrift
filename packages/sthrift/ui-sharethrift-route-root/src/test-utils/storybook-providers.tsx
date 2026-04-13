import type React from 'react';
import { MockedProvider } from '@apollo/client/testing/react';
import { reservationStoryMocks } from '../components/pages/my-reservations/utils/reservation-story-mocks.ts';

export const defaultReservationActions = {
	onCancel: (id: string) => console.log('Cancel clicked', id),
	onClose: (id: string) => console.log('Close clicked', id),
	onMessage: (id: string) => console.log('Message clicked', id),
};

export const withReservationMocks = (
	Story: React.ComponentType,
): React.JSX.Element => (
	<MockedProvider mocks={reservationStoryMocks}>
		<Story />
	</MockedProvider>
);
