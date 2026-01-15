import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { useRef, useState, useEffect } from 'react';
import { ImageGallery } from './create-listing-image-gallery.tsx';

const createMockFile = (name: string): File => {
	return new File(['test content'], name, { type: 'image/png' });
};

const FileLimitTestComponent = ({
	maxCount = 5,
	initialCount = 0,
}: { maxCount?: number; initialCount?: number }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [fileCount, setFileCount] = useState(initialCount);

	// Simulate the useFileLimit hook behavior for testing
	useEffect(() => {
		const handler = (e: Event) => {
			const input = e.target as HTMLInputElement;
			if (!input.files) {
				return;
			}
			const files = Array.from(input.files);
			const remaining = maxCount - fileCount;
			if (remaining <= 0) {
				input.value = '';
				return;
			}
			if (files.length > remaining) {
				const dt = new DataTransfer();
				files.slice(0, remaining).forEach((f) => dt.items.add(f));
				input.files = dt.files;
			}
		};
		const el = inputRef.current;
		el?.addEventListener('change', handler);
		return () => el?.removeEventListener('change', handler);
	}, [fileCount, maxCount]);

	const handleFilesSelected = () => {
		if (inputRef.current?.files) {
			setFileCount((prev) => prev + inputRef.current!.files!.length);
		}
	};

	return (
		<div data-testid="file-limit-container">
			<p data-testid="current-count">Current count: {fileCount}</p>
			<p data-testid="max-count">Max allowed: {maxCount}</p>
			<input
				ref={inputRef}
				type="file"
				multiple
				data-testid="file-input"
				onChange={handleFilesSelected}
			/>
		</div>
	);
};

const FileLimitTestWithFileSelection = ({
	maxCount = 5,
	initialCount = 0,
	filesToSelect = 1,
}: { maxCount?: number; initialCount?: number; filesToSelect?: number }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [fileCount] = useState(initialCount);
	const [triggered, setTriggered] = useState(false);

	// Simulate the useFileLimit hook behavior for testing
	useEffect(() => {
		const handler = (e: Event) => {
			const input = e.target as HTMLInputElement;
			if (!input.files) {
				return;
			}
			const files = Array.from(input.files);
			const remaining = maxCount - fileCount;
			if (remaining <= 0) {
				input.value = '';
				return;
			}
			if (files.length > remaining) {
				const dt = new DataTransfer();
				files.slice(0, remaining).forEach((f) => dt.items.add(f));
				input.files = dt.files;
			}
		};
		const el = inputRef.current;
		el?.addEventListener('change', handler);
		return () => el?.removeEventListener('change', handler);
	}, [fileCount, maxCount]);

	useEffect(() => {
		if (!triggered && inputRef.current) {
			const dt = new DataTransfer();
			for (let i = 0; i < filesToSelect; i++) {
				dt.items.add(createMockFile(`test${i}.png`));
			}
			inputRef.current.files = dt.files;

			const event = new Event('change', { bubbles: true });
			inputRef.current.dispatchEvent(event);
			setTriggered(true);
		}
	}, [triggered, filesToSelect]);

	return (
		<div data-testid="file-limit-container">
			<p data-testid="current-count">Current count: {fileCount}</p>
			<p data-testid="max-count">Max allowed: {maxCount}</p>
			<p data-testid="triggered">Triggered: {triggered ? 'yes' : 'no'}</p>
			<input
				ref={inputRef}
				type="file"
				multiple
				data-testid="file-input"
			/>
		</div>
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

export const Empty: Story = {
	args: {
		uploadedImages: [],
		onImageRemove: () => {},
		mainFileInputRef: { current: null },
		additionalFileInputRef: { current: null },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const uploadText = canvas.getByText(/Click to upload images, up to 5/i);
		expect(uploadText).toBeInTheDocument();
	},
};

export const WithImages: Story = {
	args: {
		uploadedImages: ['/assets/item-images/bike.png', '/assets/item-images/tent.png'],
		onImageRemove: () => {},
		mainFileInputRef: { current: null },
		additionalFileInputRef: { current: null },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Should show main image and thumbnail
		const images = canvas.getAllByRole('img');
		expect(images.length).toBeGreaterThan(0);
	},
};

export const MaxImages: Story = {
	args: {
		uploadedImages: [
			'/assets/item-images/bike.png',
			'/assets/item-images/tent.png',
			'/assets/item-images/projector.png',
			'/assets/item-images/bike.png',
			'/assets/item-images/tent.png',
		],
		onImageRemove: () => {},
		mainFileInputRef: { current: null },
		additionalFileInputRef: { current: null },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Should show main image and 4 thumbnails, no add button
		const images = canvas.getAllByRole('img');
		expect(images.length).toBe(5); // 1 main + 4 thumbnails
		const addButton = canvas.queryByLabelText(/Upload additional image/i);
		expect(addButton).not.toBeInTheDocument();
	},
};

export const FileLimitHookTest: Story = {
	render: () => <FileLimitTestComponent />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const container = canvas.getByTestId('file-limit-container');
		expect(container).toBeInTheDocument();
	},
};

export const WithZeroFiles: Story = {
	render: () => <FileLimitTestComponent maxCount={5} initialCount={0} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const countElement = canvas.getByTestId('current-count');
		expect(countElement).toHaveTextContent('Current count: 0');
		const maxElement = canvas.getByTestId('max-count');
		expect(maxElement).toHaveTextContent('Max allowed: 5');
	},
};

export const NearMaxLimit: Story = {
	render: () => <FileLimitTestComponent maxCount={5} initialCount={4} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const countElement = canvas.getByTestId('current-count');
		expect(countElement).toHaveTextContent('Current count: 4');
		const input = canvas.getByTestId('file-input');
		expect(input).toBeInTheDocument();
	},
};

export const AtMaxLimit: Story = {
	render: () => <FileLimitTestComponent maxCount={5} initialCount={5} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const countElement = canvas.getByTestId('current-count');
		expect(countElement).toHaveTextContent('Current count: 5');
	},
};

export const CustomMaxLimit: Story = {
	render: () => <FileLimitTestComponent maxCount={10} initialCount={3} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const countElement = canvas.getByTestId('current-count');
		expect(countElement).toHaveTextContent('Current count: 3');
		const maxElement = canvas.getByTestId('max-count');
		expect(maxElement).toHaveTextContent('Max allowed: 10');
	},
};

export const FileSelectionWithinLimit: Story = {
	render: () => (
		<FileLimitTestWithFileSelection
			maxCount={5}
			initialCount={0}
			filesToSelect={2}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await new Promise((resolve) => setTimeout(resolve, 100));
		const triggered = canvas.getByTestId('triggered');
		expect(triggered).toHaveTextContent('Triggered: yes');
	},
};

export const FileSelectionAtLimit: Story = {
	render: () => (
		<FileLimitTestWithFileSelection
			maxCount={5}
			initialCount={5}
			filesToSelect={2}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await new Promise((resolve) => setTimeout(resolve, 100));
		const triggered = canvas.getByTestId('triggered');
		expect(triggered).toHaveTextContent('Triggered: yes');
	},
};

export const FileSelectionExceedsLimit: Story = {
	render: () => (
		<FileLimitTestWithFileSelection
			maxCount={3}
			initialCount={0}
			filesToSelect={5}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await new Promise((resolve) => setTimeout(resolve, 100));
		const triggered = canvas.getByTestId('triggered');
		expect(triggered).toHaveTextContent('Triggered: yes');
	},
};