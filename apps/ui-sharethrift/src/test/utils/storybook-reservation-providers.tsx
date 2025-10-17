import type React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { reservationStoryMocks } from '../../components/layouts/home/my-reservations/stories/reservation-story-mocks.ts';

/**
 * Shared Storybook providers and decorators for reservation-related stories
 * Centralizes MockedProvider setup and default action handlers to reduce duplication
 */

/**
 * Default action handlers for reservation stories
 */
export const defaultReservationActions = {
	onCancel: (id: string) => console.log('Cancel clicked', id),
	onClose: (id: string) => console.log('Close clicked', id),
	onMessage: (id: string) => console.log('Message clicked', id),
};

/**
 * Default argTypes for reservation stories
 */
export const defaultReservationArgTypes = {
	cancelLoading: {
		control: 'boolean',
	},
	closeLoading: {
		control: 'boolean',
	},
	showActions: {
		control: 'boolean',
	},
};

/**
 * Global decorator for MockedProvider with reservation mocks
 * Use this in story meta.decorators to provide Apollo Client mocks
 */
export const withReservationMocks = (Story: React.ComponentType) => (
	<MockedProvider mocks={reservationStoryMocks}>
		<Story />
	</MockedProvider>
);

/**
 * Higher-order decorator that allows merging additional mocks
 * Use this when you need to add story-specific mocks to the default ones
 */
export const withReservationMocksAndCustom =
	(customMocks: MockedResponse[] = []) =>
	(Story: React.ComponentType) => (
		<MockedProvider mocks={[...reservationStoryMocks, ...customMocks]}>
			<Story />
		</MockedProvider>
	);
