import type React from 'react';
import type { ReactNode } from 'react';
import { MockedProvider } from '@apollo/client/testing/react';
import { InMemoryCache } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import { reservationStoryMocks } from '../../components/layouts/home/my-reservations/stories/reservation-story-mocks.ts';

/**
 * Shared Storybook provider wrapper for Apollo Client with isolated cache
 */
export function createMockedProviderWrapper(
	mocks: MockedResponse[] = [],
	options: {
		cache?: InMemoryCache;
	} = {},
): React.ComponentType<{ children: ReactNode }> {
	return function StoryWrapper({ children }: { children: ReactNode }) {
		return (
			<MockedProvider
				cache={options.cache || new InMemoryCache()}
				mocks={mocks}
			>
				{children}
			</MockedProvider>
		);
	};
}

/**
 * Creates a decorator for Storybook stories that provides Apollo Client mocks
 */
export const withApolloMocks =
	(
		mocks: MockedResponse[],
		options: {
			cache?: InMemoryCache;
		} = {},
	): ((Story: React.ComponentType) => React.JSX.Element) =>
	(Story: React.ComponentType) => {
		const Wrapper = createMockedProviderWrapper(mocks, options);
		return (
			<Wrapper>
				<Story />
			</Wrapper>
		);
	};

/**
 * Default Apollo Client configuration for Storybook
 */
export const defaultApolloOptions = {
	cache: new InMemoryCache(),
} as const;

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

/**
 * Higher-order decorator that allows merging additional mocks
 * Use this when you need to add story-specific mocks to the default ones
 */
export const withReservationMocksAndCustom =
	(
		customMocks: MockedResponse[] = [],
	): ((Story: React.ComponentType) => React.JSX.Element) =>
	(Story: React.ComponentType) => (
		<MockedProvider mocks={[...reservationStoryMocks, ...customMocks]}>
			<Story />
		</MockedProvider>
	);
