import React, { type ReactNode } from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';

/**
 * Shared Storybook provider wrapper for Apollo Client with isolated cache
 */
export function createMockedProviderWrapper(
	mocks: MockedResponse[] = [],
	options: {
		cache?: InMemoryCache;
		addTypename?: boolean;
	} = {},
) {
	return function StoryWrapper({ children }: { children: ReactNode }) {
		return (
			<MockedProvider
				cache={options.cache || new InMemoryCache()}
				mocks={mocks}
				addTypename={options.addTypename ?? true}
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
			addTypename?: boolean;
		} = {},
	) =>
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
	addTypename: true,
} as const;
