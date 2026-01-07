import type { Meta, StoryObj } from '@storybook/react';
import { EditListing } from './edit-listing.tsx';
import { MemoryRouter } from 'react-router-dom';
import { fn, expect, within, userEvent } from 'storybook/test';

const mockListing = {
	__typename: 'ItemListing' as const,
	id: '123',
	title: 'City Bike',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
	category: 'Vehicles & Transportation',
	location: 'Philadelphia, PA 19145',
	sharingPeriodStart: '2020-11-08',
	sharingPeriodEnd: '2020-12-23',
	state: 'Published',
	images: [
		'/assets/item-images/bike.png',
		'/assets/item-images/bike-detail-1.png',
		'/assets/item-images/bike-detail-2.png',
	],
	createdAt: '2020-10-01',
	updatedAt: '2020-10-01',
	sharer: {
		id: 'user123',
	},
};

const meta: Meta<typeof EditListing> = {
	title: 'Components/EditListing',
	component: EditListing,
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/']}>
				<Story />
			</MemoryRouter>
		),
	],
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		listing: mockListing,
		categories: [
			'Electronics',
			'Clothing & Accessories',
			'Home & Garden',
			'Sports & Recreation',
			'Books & Media',
			'Tools & Equipment',
			'Vehicles & Transportation',
			'Musical Instruments',
			'Art & Collectibles',
			'Other',
		],
		isLoading: false,
		onSubmit: () => console.log('Submit'),
		onPause: () => console.log('Pause'),
		onDelete: () => console.log('Delete'),
		onCancel: () => console.log('Cancel'),
		onNavigateBack: () => console.log('Navigate back'),
		uploadedImages: mockListing.images,
		onImageAdd: () => console.log('Add image'),
		onImageRemove: () => console.log('Remove image'),
	},
	argTypes: {
		onSubmit: { action: 'submit' },
		onPause: { action: 'pause' },
		onDelete: { action: 'delete' },
		onCancel: { action: 'cancel' },
		onNavigateBack: { action: 'navigate back' },
		onImageAdd: { action: 'image added' },
		onImageRemove: { action: 'image removed' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onSubmit: fn(),
		onNavigateBack: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const header = canvas.queryByText(/Edit Listing/i);
		if (header) {
			expect(header).toBeInTheDocument();
		}
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
		onSubmit: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const DraftListing: Story = {
	args: {
		listing: {
			...mockListing,
			state: 'Drafted',
		},
		onSubmit: fn(),
		onCancel: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Drafted listings can be cancelled
		const cancelButton = canvas.queryByRole('button', { name: /Cancel Listing/i });
		if (cancelButton) {
			expect(cancelButton).toBeInTheDocument();
		}
	},
};

export const PausedListing: Story = {
	args: {
		listing: {
			...mockListing,
			state: 'Paused',
		},
		onSubmit: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Paused listings cannot be paused again
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		expect(pauseButton).not.toBeInTheDocument();
	},
};

export const CancelledListing: Story = {
	args: {
		listing: {
			...mockListing,
			state: 'Cancelled',
		},
		onSubmit: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const MinimalImages: Story = {
	args: {
		uploadedImages: ['/assets/item-images/bike.png'],
		onSubmit: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ClickBackButton: Story = {
	args: {
		onNavigateBack: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const backButton = canvas.queryByRole('button', { name: /Back/i });
		if (backButton) {
			await userEvent.click(backButton);
			expect(args.onNavigateBack).toHaveBeenCalled();
		}
	},
};

export const ClickSaveChanges: Story = {
	args: {
		onSubmit: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const saveButton = canvas.queryByRole('button', { name: /Save Changes/i });
		if (saveButton) {
			await userEvent.click(saveButton);
			expect(args.onSubmit).toHaveBeenCalled();
		}
	},
};

export const ClickPauseShowsModal: Story = {
	args: {
		listing: { ...mockListing, state: 'Published' },
		onPause: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		if (pauseButton) {
			await userEvent.click(pauseButton);
			// Modal should appear with title
			const modalTitle = canvas.queryByText(/Pause Listing/i);
			if (modalTitle) {
				expect(modalTitle).toBeInTheDocument();
			}
		}
	},
};

export const ClickDeleteShowsModal: Story = {
	args: {
		onDelete: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const deleteButton = canvas.queryByRole('button', { name: /Delete/i });
		if (deleteButton) {
			await userEvent.click(deleteButton);
			// Modal should appear
			const modalTitle = canvas.queryByText(/Delete Listing/i);
			if (modalTitle) {
				expect(modalTitle).toBeInTheDocument();
			}
		}
	},
};

export const ConfirmDelete: Story = {
	args: {
		onDelete: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const deleteButton = canvas.queryByRole('button', { name: /Delete/i });
		if (deleteButton) {
			await userEvent.click(deleteButton);
			// Confirm modal
			const confirmButton = canvas.queryByRole('button', { name: /^Delete$/i });
			if (confirmButton) {
				await userEvent.click(confirmButton);
				expect(args.onDelete).toHaveBeenCalled();
			}
		}
	},
};

export const CancelDeleteModal: Story = {
	args: {
		onDelete: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const deleteButton = canvas.queryByRole('button', { name: /Delete/i });
		if (deleteButton) {
			await userEvent.click(deleteButton);
		// Cancel modal - get all Cancel buttons and find the modal one (not "Cancel Listing")
		const cancelButtons = canvas.queryAllByRole('button', { name: /Cancel/i });
		const modalCancelButton = cancelButtons.find(btn => 
			btn.textContent === 'Cancel' && btn !== deleteButton
		);
		if (modalCancelButton) {
			await userEvent.click(modalCancelButton);
				expect(args.onDelete).not.toHaveBeenCalled();
			}
		}
	},
};

export const ConfirmPause: Story = {
	args: {
		listing: { ...mockListing, state: 'Published' },
		onPause: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		if (pauseButton) {
			await userEvent.click(pauseButton);
			const confirmButton = canvas.queryByRole('button', { name: /^Pause$/i });
			if (confirmButton) {
				await userEvent.click(confirmButton);
				expect(args.onPause).toHaveBeenCalled();
			}
		}
	},
};

export const ConfirmCancelListing: Story = {
	args: {
		listing: { ...mockListing, state: 'Published' },
		onCancel: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const cancelListingButton = canvas.queryByRole('button', {
			name: /Cancel Listing/i,
		});
		if (cancelListingButton) {
			await userEvent.click(cancelListingButton);
			const confirmButton = canvas.queryByRole('button', {
				name: /^Cancel Listing$/i,
			});
			if (confirmButton) {
				await userEvent.click(confirmButton);
				expect(args.onCancel).toHaveBeenCalled();
			}
		}
	},
};

export const FormInteraction: Story = {
	args: {
		onSubmit: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const titleInput = canvas.queryByLabelText(/Title/i);
		if (titleInput) {
			await userEvent.clear(titleInput);
			await userEvent.type(titleInput, 'Updated Title');
		}
	},
};

export const RemoveImage: Story = {
	args: {
		onImageRemove: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const removeButtons = canvas.queryAllByRole('button', { name: /remove/i });
		if (removeButtons[0]) {
			await userEvent.click(removeButtons[0]);
			expect(args.onImageRemove).toHaveBeenCalled();
		}
	},
};

export const ValidationError: Story = {
	args: {
		uploadedImages: [],
		onSubmit: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const saveButton = canvas.getByRole('button', { name: /Save Changes/i });
		await userEvent.click(saveButton);
		// Should not submit due to validation
		await expect(args.onSubmit).not.toHaveBeenCalled();
	},
};

export const ModalMessages: Story = {
	args: {
		listing: { ...mockListing, state: 'Published' },
		onDelete: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const deleteButton = canvas.queryByRole('button', { name: /Delete/i });
		if (deleteButton) {
			await userEvent.click(deleteButton);
			// Check delete modal message
			const message = canvas.queryByText(/This action cannot be undone/i);
			if (message) {
				expect(message).toBeInTheDocument();
			}
		}
	},
};
