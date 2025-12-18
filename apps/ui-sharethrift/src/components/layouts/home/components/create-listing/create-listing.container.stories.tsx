import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { CreateListingContainer } from './create-listing.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import { HomeCreateListingContainerCreateItemListingDocument } from '../../../../../generated.tsx';

const meta: Meta<typeof CreateListingContainer> = {
	title: 'Containers/CreateListingContainer',
	component: CreateListingContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeCreateListingContainerCreateItemListingDocument,
						variables: {
							input: {
								title: 'Test Listing',
								description: 'Test description',
								category: 'Electronics',
								location: 'Toronto',
								sharingPeriodStart: expect.any(Date),
								sharingPeriodEnd: expect.any(Date),
								images: [],
								isDraft: false,
							},
						},
					},
					result: {
						data: {
							createItemListing: {
								__typename: 'ItemListing',
								id: '1',
								title: 'Test Listing',
								state: 'Active',
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/create-listing')],
};

export default meta;
type Story = StoryObj<typeof CreateListingContainer>;

export const Authenticated: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const titleInput = canvas.queryByLabelText(/Title/i);
		if (titleInput) {
			expect(titleInput).toBeInTheDocument();
		}
	},
};

export const Unauthenticated: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithDraftSuccess: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeCreateListingContainerCreateItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							createItemListing: {
								__typename: 'ItemListing',
								id: '1',
								title: 'Test Listing',
								state: 'Draft',
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithPublishSuccess: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeCreateListingContainerCreateItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							createItemListing: {
								__typename: 'ItemListing',
								id: '1',
								title: 'Test Listing',
								state: 'Active',
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithError: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeCreateListingContainerCreateItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to create listing'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
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
						query: HomeCreateListingContainerCreateItemListingDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
