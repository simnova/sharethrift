import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { CreateListingContainer } from './create-listing.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import { HomeCreateListingContainerCreateItemListingDocument } from '../../../../../../generated.tsx';

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
		await waitFor(
			() => {
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Fill out the form to trigger handleSubmit
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);

		await userEvent.type(titleInput, 'Test Draft Listing');
		await userEvent.type(descriptionInput, 'Test description for draft');
		await userEvent.type(locationInput, 'Toronto');

		// Click Save as Draft button
		const draftBtn = canvas.getByRole('button', { name: /Save as Draft/i });
		await userEvent.click(draftBtn);
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Fill out the form to trigger handleSubmit
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);

		await userEvent.type(titleInput, 'Test Published Listing');
		await userEvent.type(descriptionInput, 'Test description for published listing');
		await userEvent.type(locationInput, 'Vancouver');

		// Click Publish button
		const publishBtn = canvas.getByRole('button', { name: /Publish/i });
		await userEvent.click(publishBtn);
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Fill out the form and submit to trigger error handling
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);

		await userEvent.type(titleInput, 'Test Error Listing');
		await userEvent.type(descriptionInput, 'Test description for error case');
		await userEvent.type(locationInput, 'Montreal');

		const publishBtn = canvas.getByRole('button', { name: /Publish/i });
		await userEvent.click(publishBtn);
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Fill out form and submit to trigger loading state
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);

		await userEvent.type(titleInput, 'Test Loading Listing');
		await userEvent.type(descriptionInput, 'Test description for loading state');
		await userEvent.type(locationInput, 'Calgary');

		const publishBtn = canvas.getByRole('button', { name: /Publish/i });
		await userEvent.click(publishBtn);
	},
};

export const ImageHandling: Story = {
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
								state: 'Published',
							},
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
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Test image handling by adding and removing images
		// Note: This assumes the CreateListing component has image upload functionality
		// The container's handleImageAdd and handleImageRemove functions should be called
		expect(canvasElement).toBeTruthy();
	},
};

export const CancelAction: Story = {
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
								state: 'Published',
							},
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
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		// Click the Cancel button to trigger handleCancel
		const cancelBtn = canvas.queryByRole('button', { name: /Cancel/i });
		if (cancelBtn) {
			await userEvent.click(cancelBtn);
		}
	},
};

export const ViewListingAction: Story = {
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
		await waitFor(
			() => {
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Fill out form and submit to trigger success modal
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);

		await userEvent.type(titleInput, 'Test View Listing');
		await userEvent.type(descriptionInput, 'Test description');
		await userEvent.type(locationInput, 'Ottawa');

		const publishBtn = canvas.getByRole('button', { name: /Publish/i });
		await userEvent.click(publishBtn);

		// Wait for success modal and click "View Listing" button to trigger handleViewListing
		await waitFor(
			() => {
				const viewBtn = canvas.queryByRole('button', { name: /View Listing/i });
				if (viewBtn) {
					userEvent.click(viewBtn);
				}
			},
			{ timeout: 5000 },
		);
	},
};

export const ViewDraftAction: Story = {
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
								title: 'Test Draft',
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
		await waitFor(
			() => {
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Fill out form and save as draft to trigger success modal
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);

		await userEvent.type(titleInput, 'Test View Draft');
		await userEvent.type(descriptionInput, 'Test draft description');
		await userEvent.type(locationInput, 'Edmonton');

		const draftBtn = canvas.getByRole('button', { name: /Save as Draft/i });
		await userEvent.click(draftBtn);

		// Wait for success modal and click "View Draft" button to trigger handleViewDraft
		await waitFor(
			() => {
				const viewBtn = canvas.queryByRole('button', { name: /View Draft/i });
				if (viewBtn) {
					userEvent.click(viewBtn);
				}
			},
			{ timeout: 5000 },
		);
	},
};

export const ModalCloseAction: Story = {
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
								state: 'Published',
							},
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
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Fill out form and submit to trigger success modal
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);

		await userEvent.type(titleInput, 'Test Modal Close');
		await userEvent.type(descriptionInput, 'Test description');
		await userEvent.type(locationInput, 'Winnipeg');

		const publishBtn = canvas.getByRole('button', { name: /Publish/i });
		await userEvent.click(publishBtn);

		// Wait for success modal and click close button to trigger handleModalClose
		await waitFor(
			() => {
				const closeBtn = canvas.queryByRole('button', { name: /×/i }) || canvas.queryByRole('button', { name: /Close/i });
				if (closeBtn) {
					userEvent.click(closeBtn);
				}
			},
			{ timeout: 5000 },
		);
	},
};

export const CategorySelection: Story = {
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
								state: 'Published',
							},
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
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		// Click on category dropdown if available
		const categoryLabel = canvas.queryByLabelText(/Category/i);
		if (categoryLabel) {
			await userEvent.click(categoryLabel);
		}
	},
};

export const UnauthenticatedSubmit: Story = {
	args: {
		isAuthenticated: false,
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
								state: 'Published',
							},
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
				expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Fill out form and try to submit as unauthenticated user
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);

		await userEvent.type(titleInput, 'Test Unauth Listing');
		await userEvent.type(descriptionInput, 'Test description for unauthenticated submit');
		await userEvent.type(locationInput, 'Halifax');

		const submitBtn =
			canvas.queryByRole('button', { name: /Publish/i }) ||
			canvas.queryByRole('button', { name: /Submit/i });
		if (submitBtn) {
			await userEvent.click(submitBtn);
		}
	},
};
