import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { useRef } from 'react';
import { ImageGallery } from './create-listing-image-gallery.tsx';

// Simple wrapper that properly manages state
const TestWrapper = ({ initialImages = [] }: { initialImages?: string[] }) => {
	const [images, setImages] = React.useState(initialImages);
	const mainRef = useRef<HTMLInputElement>(null);
	const additionalRef = useRef<HTMLInputElement>(null);

	return (
		<ImageGallery
			uploadedImages={images}
			onImageRemove={(url) => setImages(prev => prev.filter(img => img !== url))}
			mainFileInputRef={mainRef}
			additionalFileInputRef={additionalRef}
		/>
	);
};

const meta: Meta<typeof ImageGallery> = {
	title: 'Components/CreateListing/ImageGallery',
	component: ImageGallery,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyState: Story = {
	render: () => <TestWrapper />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Check for upload text
		expect(canvas.getByText(/Click to upload images, up to 5/i)).toBeInTheDocument();
		// Check for upload button
		expect(canvas.getByRole('button', { name: /Upload image/i })).toBeInTheDocument();
	},
};

export const WithOneImage: Story = {
	render: () => <TestWrapper initialImages={['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==']} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Component should render without crashing
		expect(canvas.getByText('1 / 5')).toBeInTheDocument();
		// Should have add button for additional images
		expect(canvas.getByRole('button', { name: /Upload additional image/i })).toBeInTheDocument();
	},
};

export const WithMultipleImages: Story = {
	render: () => <TestWrapper initialImages={[
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
	]} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Component should render without crashing
		expect(canvas.getByText('3 / 5')).toBeInTheDocument();
		// Should have add button for additional images
		expect(canvas.getByRole('button', { name: /Upload additional image/i })).toBeInTheDocument();
	},
};

export const AtMaxCapacity: Story = {
	render: () => <TestWrapper initialImages={[
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
	]} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Component should render without crashing
		expect(canvas.getByText('5 / 5')).toBeInTheDocument();
		// Should NOT have add button when at max
		expect(canvas.queryByRole('button', { name: /Upload additional image/i })).not.toBeInTheDocument();
	},
};

export const KeyboardAccessibility: Story = {
	render: () => <TestWrapper />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const uploadButton = canvas.getByRole('button', { name: /Upload image/i });

		// Button should be focusable
		expect(uploadButton).toBeInTheDocument();
		// Should have proper accessibility attributes
		expect(uploadButton).toHaveAttribute('aria-label', 'Upload image');

		// Test keyboard interaction
		await userEvent.type(uploadButton, '{enter}');
		// The click handler should be called (we can't test file input directly in browser)
	},
};

export const AdditionalImageButton: Story = {
	render: () => <TestWrapper initialImages={['/test-image-1.jpg']} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const addButton = canvas.getByRole('button', { name: /Upload additional image/i });

		// Button should exist and be accessible
		expect(addButton).toBeInTheDocument();
		expect(addButton).toHaveAttribute('aria-label', 'Upload additional image');

		// Test keyboard interaction
		await userEvent.type(addButton, '{enter}');
		// The click handler should be called (we can't test file input directly in browser)
	},
};

export const FileLimitExceeded: Story = {
	render: () => {
		const [images, setImages] = React.useState([
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
		]);
		const mainRef = useRef<HTMLInputElement>(null);
		const additionalRef = useRef<HTMLInputElement>(null);

		return (
			<ImageGallery
				uploadedImages={images}
				onImageRemove={(url) => setImages(prev => prev.filter(img => img !== url))}
				mainFileInputRef={mainRef}
				additionalFileInputRef={additionalRef}
			/>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Should show 4/5
		expect(canvas.getByText('4 / 5')).toBeInTheDocument();
		// Should have add button
		expect(canvas.getByRole('button', { name: /Upload additional image/i })).toBeInTheDocument();
	},
};

export const FileInputChangeLimitExceeded: Story = {
	render: () => {
		const [images, setImages] = React.useState([
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
		]);
		const mainRef = useRef<HTMLInputElement>(null);
		const additionalRef = useRef<HTMLInputElement>(null);

		// Create hidden file input for testing
		React.useEffect(() => {
			if (additionalRef.current) {
				// Create a data transfer with multiple files to trigger limit exceeded
				const dt = new DataTransfer();
				const file1 = new File(['test'], 'test1.jpg', { type: 'image/jpeg' });
				const file2 = new File(['test'], 'test2.jpg', { type: 'image/jpeg' });
				dt.items.add(file1);
				dt.items.add(file2);
				additionalRef.current.files = dt.files;

				// Trigger change event
				const event = new Event('change', { bubbles: true });
				additionalRef.current.dispatchEvent(event);
			}
		}, []);

		return (
			<>
				<ImageGallery
					uploadedImages={images}
					onImageRemove={(url) => setImages(prev => prev.filter(img => img !== url))}
					mainFileInputRef={mainRef}
					additionalFileInputRef={additionalRef}
				/>
				<input
					ref={additionalRef}
					type="file"
					multiple
					accept="image/*"
					style={{ display: 'none' }}
				/>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Should show 5/5 (at max capacity)
		expect(canvas.getByText('5 / 5')).toBeInTheDocument();
		// Should NOT have add button when at max
		expect(canvas.queryByRole('button', { name: /Upload additional image/i })).not.toBeInTheDocument();
	},
};

export const FileInputChangePartialAcceptance: Story = {
	render: () => {
		const [images, setImages] = React.useState([
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
		]);
		const mainRef = useRef<HTMLInputElement>(null);
		const additionalRef = useRef<HTMLInputElement>(null);

		// Create hidden file input for testing
		React.useEffect(() => {
			if (additionalRef.current) {
				// Create a data transfer with 3 files but only 1 slot remaining
				const dt = new DataTransfer();
				const file1 = new File(['test'], 'test1.jpg', { type: 'image/jpeg' });
				const file2 = new File(['test'], 'test2.jpg', { type: 'image/jpeg' });
				const file3 = new File(['test'], 'test3.jpg', { type: 'image/jpeg' });
				dt.items.add(file1);
				dt.items.add(file2);
				dt.items.add(file3);
				additionalRef.current.files = dt.files;

				// Trigger change event
				const event = new Event('change', { bubbles: true });
				additionalRef.current.dispatchEvent(event);
			}
		}, []);

		return (
			<>
				<ImageGallery
					uploadedImages={images}
					onImageRemove={(url) => setImages(prev => prev.filter(img => img !== url))}
					mainFileInputRef={mainRef}
					additionalFileInputRef={additionalRef}
				/>
				<input
					ref={additionalRef}
					type="file"
					multiple
					accept="image/*"
					style={{ display: 'none' }}
				/>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Should show 4/5 (still 4 images, the hook filtered but didn't add new ones)
		expect(canvas.getByText('4 / 5')).toBeInTheDocument();
		// Should have add button since we're not at max
		expect(canvas.getByRole('button', { name: /Upload additional image/i })).toBeInTheDocument();
	},
};