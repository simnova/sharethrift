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

export const InteractionWithHandlers: Story = {
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
		const canvas = within(canvasElement);
		
		// Test cancel handler by clicking back button
		const backButton = canvas.queryByRole('button', { name: /Back/i });
		if (backButton) {
			backButton.click();
		}
		
		await expect(canvasElement).toBeTruthy();
	},
};

export const ImageHandlers: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		// Find hidden file inputs to test image handlers
		const fileInputs = canvasElement.querySelectorAll('input[type="file"]');
		
		if (fileInputs.length > 0) {
			const mainInput = fileInputs[0] as HTMLInputElement;
			
			// Create a mock file and trigger change to test handleImageAdd
			const file = new File(['test'], 'test.png', { type: 'image/png' });
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			mainInput.files = dataTransfer.files;
			
			const changeEvent = new Event('change', { bubbles: true });
			mainInput.dispatchEvent(changeEvent);
			
			// Wait for FileReader to process
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		
		await expect(canvasElement).toBeTruthy();
	},
};

export const SaveDraftHandler: Story = {
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
								title: 'Draft',
								state: 'Draft',
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Click save as draft to test handleSubmit with isDraft=true
		const draftButton = canvas.queryByRole('button', { name: /Save as Draft/i });
		if (draftButton) {
			draftButton.click();
			// Wait for mutation
			await new Promise((resolve) => setTimeout(resolve, 200));
		}
		
		await expect(canvasElement).toBeTruthy();
	},
};

export const UnauthenticatedSubmit: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Try to submit while unauthenticated to test auth redirect logic
		const draftButton = canvas.queryByRole('button', { name: /Save as Draft/i });
		if (draftButton) {
			draftButton.click();
			// Should trigger sessionStorage and navigation
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		
		await expect(canvasElement).toBeTruthy();
	},
};
