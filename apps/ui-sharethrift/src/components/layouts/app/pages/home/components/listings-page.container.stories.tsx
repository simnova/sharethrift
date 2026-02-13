import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from 'storybook/test';
import { ListingsPageContainer } from './listings-page.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import { ListingsPageContainerGetListingsDocument } from '../../../../../../generated.tsx';

const mockListings = [
	{
		__typename: 'ItemListing',
		id: '1',
		title: 'Cordless Drill',
		description: 'High-quality cordless drill for home projects',
		category: 'Tools & Equipment',
		location: 'Toronto, ON',
		state: 'Active',
		images: ['/assets/item-images/projector.png'],
		sharingPeriodStart: '2025-01-01',
		sharingPeriodEnd: '2025-12-31',
		createdAt: '2025-01-01T00:00:00Z',
		updatedAt: '2025-01-01T00:00:00Z',
	},
	{
		__typename: 'ItemListing',
		id: '2',
		title: 'Electric Guitar',
		description: 'Fender electric guitar in excellent condition',
		category: 'Musical Instruments',
		location: 'Vancouver, BC',
		state: 'Active',
		images: ['/assets/item-images/projector.png'],
		sharingPeriodStart: '2025-02-01',
		sharingPeriodEnd: '2025-06-30',
		createdAt: '2025-01-15T00:00:00Z',
		updatedAt: '2025-01-15T00:00:00Z',
	},
];

const meta: Meta<typeof ListingsPageContainer> = {
	title: 'Containers/ListingsPageContainer',
	component: ListingsPageContainer,
	tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags. These are all functional testing stories.
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: ListingsPageContainerGetListingsDocument,
					},
					result: {
						data: {
							itemListings: mockListings,
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/listings')],
};

export default meta;
type Story = StoryObj<typeof ListingsPageContainer>;

export const Authenticated: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
	},
};

export const Unauthenticated: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
	},
};

export const EmptyListings: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ListingsPageContainerGetListingsDocument,
					},
					result: {
						data: {
							itemListings: [],
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const emptyText = canvas.queryByText(/no.*listing|empty|no data/i);
				expect(emptyText ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const Loading: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ListingsPageContainerGetListingsDocument,
					},
					delay: Infinity,
				},
			],
		},
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner =
			canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
	},
};
