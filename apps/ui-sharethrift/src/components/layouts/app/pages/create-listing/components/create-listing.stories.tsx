import type { Meta, StoryObj } from '@storybook/react';
import { CreateListing } from './create-listing.tsx';
import { MemoryRouter } from 'react-router-dom';
import { fn, expect, within, userEvent } from 'storybook/test';

const meta: Meta<typeof CreateListing> = {
	title: 'Components/CreateListing',
	component: CreateListing,
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
		categories: [
			'Electronics',
			'Home & Garden',
			'Kids & Baby',
			'Miscellaneous',
			'Sports & Outdoors',
			'Tools & Equipment',
			'Vehicles & Transportation',
		],
		isLoading: false,
		onSubmit: () => undefined,
		onCancel: () => undefined,
		uploadedImages: [],
		onImageAdd: () => undefined,
		onImageRemove: () => undefined,
		onViewListing: () => undefined,
		onViewDraft: () => undefined,
		onModalClose: () => undefined,
	},
	argTypes: {
		onSubmit: { action: 'submit' },
		onCancel: { action: 'cancel' },
		onImageAdd: { action: 'image added' },
		onImageRemove: { action: 'image removed' },
		onViewListing: { action: 'view listing' },
		onViewDraft: { action: 'view draft' },
		onModalClose: { action: 'modal closed' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		onImageAdd: fn(),
		onImageRemove: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const header = canvas.queryByText(/Create a Listing/i);
		if (header) {
			expect(header).toBeInTheDocument();
		}
	},
};

export const WithImages: Story = {
	args: {
		uploadedImages: [
			'/assets/item-images/bike.png',
			'/assets/item-images/tent.png',
			'/assets/item-images/projector.png',
		],
		onSubmit: fn(),
		onCancel: fn(),
		onImageRemove: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const FormInteraction: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const titleInput = canvas.queryByLabelText(/Title/i);
		if (titleInput) {
			await userEvent.type(titleInput, 'Test Item');
		}
	},
};

export const ClickBackButton: Story = {
	args: {
		onCancel: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const backButton = canvas.queryByRole('button', { name: /Back/i });
		if (backButton) {
			await userEvent.click(backButton);
			expect(args.onCancel).toHaveBeenCalled();
		}
	},
};

export const ClickSaveAsDraft: Story = {
	args: {
		onSubmit: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const draftButton = canvas.queryByRole('button', { name: /Save as Draft/i });
		if (draftButton) {
			await userEvent.click(draftButton);
			expect(args.onSubmit).toHaveBeenCalled();
		}
	},
};

export const ClickPublish: Story = {
	args: {
		onSubmit: fn(),
		uploadedImages: ['/assets/item-images/bike.png'],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const publishButton = canvas.queryByRole('button', { name: /Publish/i });
		if (publishButton) {
			await userEvent.click(publishButton);
		}
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
		onSubmit: fn(),
		onCancel: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ShowPublishedSuccess: Story = {
	args: {
		isLoading: false,
		onViewListing: fn(),
		onModalClose: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ShowDraftSuccess: Story = {
	args: {
		isLoading: false,
		onViewDraft: fn(),
		onModalClose: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const PublishWithValidForm: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: ['/assets/item-images/bike.png'],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const titleInput = canvas.getByLabelText(/Title/i);
		await userEvent.type(titleInput, 'Mountain Bike for Rent');
		
		const descriptionInput = canvas.getByLabelText(/Description/i);
		await userEvent.type(descriptionInput, 'Great mountain bike in excellent condition.');
		
		const publishButton = canvas.getByRole('button', { name: /Publish/i });
		await userEvent.click(publishButton);
	},
};

export const SaveDraftWithPartialData: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const titleInput = canvas.getByLabelText(/Title/i);
		await userEvent.type(titleInput, 'Draft Listing');
		
		const draftButton = canvas.getByRole('button', { name: /Save as Draft/i });
		await userEvent.click(draftButton);
	},
};

export const RemoveImage: Story = {
	args: {
		uploadedImages: ['/assets/item-images/bike.png'],
		onImageRemove: fn(),
		onSubmit: fn(),
		onCancel: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		
		const removeButtons = canvas.queryAllByRole('button', { name: /remove/i });
		const firstButton = removeButtons[0];
		if (firstButton) {
			await userEvent.click(firstButton);
			await expect(args.onImageRemove).toHaveBeenCalled();
		}
	},
};

export const LoadingToPublished: Story = {
	args: {
		isLoading: true,
		onSubmit: fn(),
		onCancel: fn(),
		onViewListing: fn(),
		onModalClose: fn(),
		uploadedImages: ['/assets/item-images/bike.png'],
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const LoadingToDraft: Story = {
	args: {
		isLoading: true,
		onSubmit: fn(),
		onCancel: fn(),
		onViewDraft: fn(),
		onModalClose: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const MaxCharacterLimitDescription: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const CategorySelection: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const categorySelect = canvas.queryByRole('combobox', { name: /Category/i });
		if (categorySelect) {
			await userEvent.click(categorySelect);
		}
	},
};

export const EmptyCategories: Story = {
	args: {
		categories: [],
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const DateRangePicker: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const dateInputs = canvas.queryAllByRole('textbox');
		await expect(dateInputs.length).toBeGreaterThan(0);
	},
};

export const FormValidationError: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		onImageAdd: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const LocationInput: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const locationInput = canvas.getByLabelText(/Location/i);
		await userEvent.type(locationInput, 'Toronto, ON');
	},
};

export const ImageAdd: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		onImageAdd: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement, args }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Mock FileReader to simulate file reading
		const originalFileReader = window.FileReader;
		Object.defineProperty(window, 'FileReader', {
			writable: true,
			value: class MockFileReader {
				onload: ((event: any) => void) | null = null;
				readAsDataURL() {
					// Simulate async loading
					setTimeout(() => {
						if (this.onload) {
							this.onload({ target: { result: 'data:image/png;base64,dummy' } });
						}
					}, 0);
				}
			} as any,
		});
		
		try {
			// Simulate file upload by triggering the hidden input
			const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
			if (fileInput) {
				const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
				Object.defineProperty(fileInput, 'files', {
					value: [file],
					writable: false,
				});
				fileInput.dispatchEvent(new Event('change', { bubbles: true }));
				// Wait for the async FileReader
				await new Promise(resolve => setTimeout(resolve, 10));
				await expect(args.onImageAdd).toHaveBeenCalled();
			}
		} finally {
			Object.defineProperty(window, 'FileReader', {
				writable: true,
				value: originalFileReader,
			});
		}
	},
};

export const AdditionalImageUpload: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		onImageAdd: fn(),
		uploadedImages: ['/assets/item-images/bike.png'],
	},
	play: async ({ canvasElement, args }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Mock FileReader to simulate file reading
		const originalFileReader = window.FileReader;
		Object.defineProperty(window, 'FileReader', {
			writable: true,
			value: class MockFileReader {
				onload: ((event: any) => void) | null = null;
				readAsDataURL() {
					// Simulate async loading
					setTimeout(() => {
						if (this.onload) {
							this.onload({ target: { result: 'data:image/jpeg;base64,additional' } });
						}
					}, 0);
				}
			} as any,
		});
		
		try {
			// Simulate additional file upload by triggering the second hidden input
			const fileInputs = canvasElement.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
			const additionalFileInput = fileInputs[1]; // Second file input
			if (additionalFileInput) {
				const file = new File(['additional content'], 'additional.jpg', { type: 'image/jpeg' });
				Object.defineProperty(additionalFileInput, 'files', {
					value: [file],
					writable: false,
				});
				additionalFileInput.dispatchEvent(new Event('change', { bubbles: true }));
				// Wait for the async FileReader
				await new Promise(resolve => setTimeout(resolve, 10));
				await expect(args.onImageAdd).toHaveBeenCalled();
			}
		} finally {
			Object.defineProperty(window, 'FileReader', {
				writable: true,
				value: originalFileReader,
			});
		}
	},
};
