import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { useRef, useState, useEffect } from 'react';
import { useFileLimit } from './use-file-limit.ts';

const createMockFile = (name: string): File => {
	return new File(['test content'], name, { type: 'image/png' });
};

const FileLimitTestComponent = ({
	maxCount = 5,
	initialCount = 0,
}: { maxCount?: number; initialCount?: number }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [fileCount, setFileCount] = useState(initialCount);

	useFileLimit(inputRef, fileCount, maxCount);

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

	useFileLimit(inputRef, fileCount, maxCount);

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

const meta: Meta = {
	title: 'Hooks/useFileLimit',
	component: FileLimitTestComponent,
	parameters: {
		layout: 'centered',
	},
  tags: ["!dev"], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HookTest: Story = {
	render: () => <FileLimitTestComponent />,
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(typeof useFileLimit).toBe('function');
		const container = canvas.getByTestId('file-limit-container');
		expect(container).toBeInTheDocument();
	},
};

export const WithZeroFiles: Story = {
	render: () => <FileLimitTestComponent maxCount={5} initialCount={0} />,
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const countElement = canvas.getByTestId('current-count');
		expect(countElement).toHaveTextContent('Current count: 0');
		const maxElement = canvas.getByTestId('max-count');
		expect(maxElement).toHaveTextContent('Max allowed: 5');
	},
};

export const NearMaxLimit: Story = {
	render: () => <FileLimitTestComponent maxCount={5} initialCount={4} />,
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const countElement = canvas.getByTestId('current-count');
		expect(countElement).toHaveTextContent('Current count: 4');
		const input = canvas.getByTestId('file-input');
		expect(input).toBeInTheDocument();
	},
};

export const AtMaxLimit: Story = {
	render: () => <FileLimitTestComponent maxCount={5} initialCount={5} />,
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const countElement = canvas.getByTestId('current-count');
		expect(countElement).toHaveTextContent('Current count: 5');
	},
};

export const CustomMaxLimit: Story = {
	render: () => <FileLimitTestComponent maxCount={10} initialCount={3} />,
	play: ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
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
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await new Promise((resolve) => setTimeout(resolve, 100));
		const triggered = canvas.getByTestId('triggered');
		expect(triggered).toHaveTextContent('Triggered: yes');
	},
};
