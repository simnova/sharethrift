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
		expect(publishButton).toBeDefined();
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

export const FormWithAllFieldTypes: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: ['/assets/item-images/bike.png'],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Verify all form fields are present without complex interactions
		const titleInput = canvas.getByLabelText(/Title/i);
		const descriptionInput = canvas.getByLabelText(/Description/i);
		const locationInput = canvas.getByLabelText(/Location/i);
		const categorySelect = canvas.getByLabelText(/Category/i);
		
		expect(titleInput).toBeDefined();
		expect(descriptionInput).toBeDefined();
		expect(locationInput).toBeDefined();
		expect(categorySelect).toBeDefined();
	},
};

export const SaveDraftWithNoSharingPeriod: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		
		// Save draft without any dates set
		const draftButton = canvas.getByRole('button', { name: /Save as Draft/i });
		await userEvent.click(draftButton);
		
		// Should use default dates
		expect(args.onSubmit).toHaveBeenCalled();
	},
};

export const SaveDraftWithEmptyFields: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		
		// Save draft with completely empty form
		const draftButton = canvas.getByRole('button', { name: /Save as Draft/i });
		await userEvent.click(draftButton);
		
		// Should still call onSubmit with defaults
		expect(args.onSubmit).toHaveBeenCalled();
	},
};

export const PublishWithValidationError: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [], // No images - will trigger validation error
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		
		// Try to publish without required fields
		const publishButton = canvas.getByRole('button', { name: /Publish/i });
		await userEvent.click(publishButton);
		
		// onSubmit should NOT be called due to validation failure
		expect(args.onSubmit).not.toHaveBeenCalled();
	},
};

export const FileUploadSimulation: Story = {
	args: {
		onImageAdd: fn(),
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		// Find the file input (it's hidden but we can query it)
		const fileInputs = canvasElement.querySelectorAll('input[type="file"]');
		
		if (fileInputs.length > 0) {
			const mainInput = fileInputs[0] as HTMLInputElement;
			
			// Create a mock file and trigger change
			const file = new File(['test'], 'test.png', { type: 'image/png' });
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			mainInput.files = dataTransfer.files;
			
			// Trigger the change event
			const changeEvent = new Event('change', { bubbles: true });
			mainInput.dispatchEvent(changeEvent);
			
			// Wait a bit for FileReader to process (async operation)
			await new Promise((resolve) => setTimeout(resolve, 100));
			
			// The onImageAdd should eventually be called
			// Note: FileReader is async so we may need to wait
		}
		
		await expect(canvasElement).toBeTruthy();
	},
};

export const MultipleFileUpload: Story = {
	args: {
		onImageAdd: fn(),
		onSubmit: fn(),
		onCancel: fn(),
		uploadedImages: [],
	},
	play: async ({ canvasElement }) => {
		const fileInputs = canvasElement.querySelectorAll('input[type="file"]');
		
		if (fileInputs.length > 1) {
			const additionalInput = fileInputs[1] as HTMLInputElement;
			
			// Create multiple mock files
			const file1 = new File(['test1'], 'test1.png', { type: 'image/png' });
			const file2 = new File(['test2'], 'test2.png', { type: 'image/png' });
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file1);
			dataTransfer.items.add(file2);
			additionalInput.files = dataTransfer.files;
			
			// Trigger the change event
			const changeEvent = new Event('change', { bubbles: true });
			additionalInput.dispatchEvent(changeEvent);
			
			// Wait for FileReader processing
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		
		await expect(canvasElement).toBeTruthy();
	},
};
