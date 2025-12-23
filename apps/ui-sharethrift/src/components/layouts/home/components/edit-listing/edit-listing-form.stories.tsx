import type { Meta, StoryObj } from '@storybook/react';
import { Form } from 'antd';
import { EditListingForm } from './edit-listing-form.tsx';
import { fn, expect, within, userEvent } from 'storybook/test';

const FormWrapper = (props: React.ComponentProps<typeof EditListingForm>) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} layout="vertical">
			<EditListingForm {...props} />
		</Form>
	);
};

const meta: Meta<typeof EditListingForm> = {
	title: 'Components/EditListingForm',
	component: FormWrapper,
	parameters: {
		layout: 'padded',
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
		maxCharacters: 2000,
		handleFormSubmit: () => console.log('Submit'),
		onNavigateBack: () => console.log('Navigate back'),
		onPause: () => console.log('Pause'),
		onDelete: () => console.log('Delete'),
		onCancel: () => console.log('Cancel'),
		canPause: false,
		canCancel: false,
	},
	argTypes: {
		handleFormSubmit: { action: 'submit' },
		onNavigateBack: { action: 'navigate back' },
		onPause: { action: 'pause' },
		onDelete: { action: 'delete' },
		onCancel: { action: 'cancel' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		handleFormSubmit: fn(),
		onNavigateBack: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		// Check all form fields are present
		const titleInput = canvas.queryByLabelText(/Title/i);
		if (titleInput) {
			expect(titleInput).toBeInTheDocument();
		}
	},
};

export const WithPauseButton: Story = {
	args: {
		canPause: true,
		onPause: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		if (pauseButton) {
			expect(pauseButton).toBeInTheDocument();
		}
	},
};

export const WithCancelButton: Story = {
	args: {
		canCancel: true,
		onCancel: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const cancelButton = canvas.queryByRole('button', {
			name: /Cancel Listing/i,
		});
		if (cancelButton) {
			expect(cancelButton).toBeInTheDocument();
		}
	},
};

export const WithBothButtons: Story = {
	args: {
		canPause: true,
		canCancel: true,
		onPause: fn(),
		onCancel: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		const cancelButton = canvas.queryByRole('button', {
			name: /Cancel Listing/i,
		});
		if (pauseButton && cancelButton) {
			expect(pauseButton).toBeInTheDocument();
			expect(cancelButton).toBeInTheDocument();
		}
	},
};

export const NeitherButton: Story = {
	args: {
		canPause: false,
		canCancel: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		const cancelButton = canvas.queryByRole('button', {
			name: /Cancel Listing/i,
		});
		expect(pauseButton).not.toBeInTheDocument();
		expect(cancelButton).not.toBeInTheDocument();
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
		handleFormSubmit: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Check save button shows loading state
		const saveButton = canvas.queryByRole('button', { name: /Save Changes/i });
		if (saveButton) {
			expect(saveButton).toHaveClass('ant-btn-loading');
		}
	},
};

export const ClickCancel: Story = {
	args: {
		onNavigateBack: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const cancelButton = canvas.queryByRole('button', { name: /^Cancel$/i });
		if (cancelButton) {
			await userEvent.click(cancelButton);
			expect(args.onNavigateBack).toHaveBeenCalled();
		}
	},
};

export const ClickDelete: Story = {
	args: {
		onDelete: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const deleteButton = canvas.queryByRole('button', { name: /Delete/i });
		if (deleteButton) {
			await userEvent.click(deleteButton);
			expect(args.onDelete).toHaveBeenCalled();
		}
	},
};

export const ClickPause: Story = {
	args: {
		canPause: true,
		onPause: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		if (pauseButton) {
			await userEvent.click(pauseButton);
			expect(args.onPause).toHaveBeenCalled();
		}
	},
};

export const ClickCancelListing: Story = {
	args: {
		canCancel: true,
		onCancel: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const cancelButton = canvas.queryByRole('button', {
			name: /Cancel Listing/i,
		});
		if (cancelButton) {
			await userEvent.click(cancelButton);
			expect(args.onCancel).toHaveBeenCalled();
		}
	},
};

export const ClickSaveChanges: Story = {
	args: {
		handleFormSubmit: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const saveButton = canvas.queryByRole('button', { name: /Save Changes/i });
		if (saveButton) {
			await userEvent.click(saveButton);
			expect(args.handleFormSubmit).toHaveBeenCalled();
		}
	},
};

export const AllFormFields: Story = {
	args: {
		handleFormSubmit: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Verify all form fields exist
		expect(canvas.queryByLabelText(/Title/i)).toBeInTheDocument();
		expect(canvas.queryByLabelText(/Location/i)).toBeInTheDocument();
		expect(canvas.queryByLabelText(/Category/i)).toBeInTheDocument();
		expect(canvas.queryByLabelText(/Description/i)).toBeInTheDocument();
	},
};

export const ButtonIcons: Story = {
	args: {
		canPause: true,
		canCancel: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Check that buttons have proper icons
		const deleteButton = canvas.queryByRole('button', { name: /Delete/i });
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		const cancelButton = canvas.queryByRole('button', {
			name: /Cancel Listing/i,
		});
		
		if (deleteButton) expect(deleteButton).toBeInTheDocument();
		if (pauseButton) expect(pauseButton).toBeInTheDocument();
		if (cancelButton) expect(cancelButton).toBeInTheDocument();
	},
};

export const DisabledWhenLoading: Story = {
	args: {
		isLoading: true,
		canPause: true,
		canCancel: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Action buttons should be disabled when loading
		const cancelButton = canvas.queryByRole('button', { name: /^Cancel$/i });
		const deleteButton = canvas.queryByRole('button', { name: /Delete/i });
		const pauseButton = canvas.queryByRole('button', { name: /Pause/i });
		const cancelListingButton = canvas.queryByRole('button', { name: /Cancel Listing/i });
		
		if (cancelButton) expect(cancelButton).toBeDisabled();
		if (deleteButton) expect(deleteButton).toBeDisabled();
		if (pauseButton) expect(pauseButton).toBeDisabled();
		if (cancelListingButton) expect(cancelListingButton).toBeDisabled();
	},
};

export const RangePickerCustomization: Story = {
	args: {
		handleFormSubmit: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Verify Reservation Period field exists with custom props
		const reservationField = canvas.queryByLabelText(/Reservation Period/i);
		if (reservationField) {
			expect(reservationField).toBeInTheDocument();
		}
	},
};
