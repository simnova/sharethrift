import type { Meta, StoryObj } from '@storybook/react';
import { Button, Popconfirm } from 'antd';
import { expect, fn, within } from 'storybook/test';
import {
	triggerPopconfirmAnd,
	clickCancelThenConfirm,
	getLoadingIndicators,
} from './popconfirm-test-utils.ts';

/**
 * Demo component that wraps a button with a Popconfirm for testing purposes.
 * This component is used to test the popconfirm-test-utils helper functions.
 */
const PopconfirmDemo = ({
	onConfirm,
	onCancel,
	buttonLabel = 'Cancel',
	title = 'Confirm Action',
	description = 'Are you sure you want to proceed?',
	loading = false,
}: {
	onConfirm?: () => void;
	onCancel?: () => void;
	buttonLabel?: string;
	title?: string;
	description?: string;
	loading?: boolean;
}) => (
	<Popconfirm
		title={title}
		description={description}
		onConfirm={onConfirm}
		onCancel={onCancel}
		okText="Yes"
		cancelText="No"
		okButtonProps={{ loading }}
	>
		<Button type="primary">{buttonLabel}</Button>
	</Popconfirm>
);

/**
 * Multi-button demo to test triggerButtonIndex option
 */
const MultiButtonPopconfirmDemo = ({
	onConfirm,
	onCancel,
}: {
	onConfirm?: () => void;
	onCancel?: () => void;
}) => (
	<div style={{ display: 'flex', gap: '8px' }}>
		<Button>First Button</Button>
		<Popconfirm
			title="Confirm Action"
			description="Are you sure?"
			onConfirm={onConfirm}
			onCancel={onCancel}
			okText="Yes"
			cancelText="No"
		>
			<Button type="primary">Cancel</Button>
		</Popconfirm>
		<Button>Third Button</Button>
	</div>
);

const meta: Meta<typeof PopconfirmDemo> = {
	title: 'Test Utils/PopconfirmTestUtils',
	component: PopconfirmDemo,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PopconfirmDemo>;

/**
 * Tests triggerPopconfirmAnd with 'confirm' action using triggerButtonLabel option.
 * This covers the triggerButtonLabel path and expectedTitle/expectedDescription assertions.
 */
export const TriggerPopconfirmAndConfirm: Story = {
	args: {
		onConfirm: fn(),
		onCancel: fn(),
		buttonLabel: 'Cancel',
		title: 'Confirm Action',
		description: 'Are you sure you want to proceed?',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /Cancel/i,
			expectedTitle: 'Confirm Action',
			expectedDescription: 'Are you sure',
		});

		expect(args.onConfirm).toHaveBeenCalled();
		expect(args.onCancel).not.toHaveBeenCalled();
	},
};

/**
 * Tests triggerPopconfirmAnd with 'cancel' action.
 * This covers the cancel action path where onConfirm should NOT be called.
 */
export const TriggerPopconfirmAndCancel: Story = {
	args: {
		onConfirm: fn(),
		onCancel: fn(),
		buttonLabel: 'Cancel',
		title: 'Confirm Action',
		description: 'Are you sure you want to proceed?',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'cancel', {
			triggerButtonLabel: /Cancel/i,
		});

		expect(args.onConfirm).not.toHaveBeenCalled();
	},
};

/**
 * Tests triggerPopconfirmAnd using triggerButtonIndex option (default behavior).
 * This covers the path where no triggerButtonLabel is provided.
 */
export const TriggerPopconfirmByIndex: StoryObj<
	typeof MultiButtonPopconfirmDemo
> = {
	render: (args) => <MultiButtonPopconfirmDemo {...args} />,
	args: {
		onConfirm: fn(),
		onCancel: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Use index 1 to click the second button (the one with Popconfirm)
		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonIndex: 1,
		});

		expect(args.onConfirm).toHaveBeenCalled();
	},
};

/**
 * Tests clickCancelThenConfirm helper function.
 * This covers the entire clickCancelThenConfirm flow.
 */
export const ClickCancelThenConfirmFlow: Story = {
	args: {
		onConfirm: fn(),
		onCancel: fn(),
		buttonLabel: 'Cancel',
		title: 'Confirm Action',
		description: 'Are you sure you want to proceed?',
	},
	play: async ({ canvasElement, args }) => {
		await clickCancelThenConfirm(canvasElement);

		expect(args.onConfirm).toHaveBeenCalled();
	},
};

/**
 * Tests getLoadingIndicators helper function.
 * This covers the loading indicator detection utility.
 */
export const LoadingIndicatorDetection: Story = {
	args: {
		onConfirm: fn(),
		buttonLabel: 'Cancel',
		loading: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Click button to open popconfirm
		const button = canvas.getByRole('button', { name: /Cancel/i });
		const { userEvent } = await import('storybook/test');
		await userEvent.click(button);

		// Use getLoadingIndicators helper to find loading buttons
		const loadingIndicators = getLoadingIndicators(document.body);
		expect(loadingIndicators.length).toBeGreaterThan(0);
	},
};

/**
 * Tests triggerPopconfirmAnd without optional parameters.
 * This covers the default options path and ensures basic functionality works.
 */
export const TriggerPopconfirmDefaultOptions: Story = {
	args: {
		onConfirm: fn(),
		onCancel: fn(),
		buttonLabel: 'Cancel',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Call with no options to test default behavior
		await triggerPopconfirmAnd(canvas, 'confirm');

		expect(args.onConfirm).toHaveBeenCalled();
	},
};

/**
 * Tests getPopconfirmElements indirectly through the confirm flow.
 * This validates that all popconfirm elements are found correctly.
 */
export const PopconfirmElementsValidation: Story = {
	args: {
		onConfirm: fn(),
		buttonLabel: 'Cancel',
		title: 'Test Title',
		description: 'Test Description',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /Cancel/i,
			expectedTitle: 'Test Title',
			expectedDescription: 'Test Description',
		});

		expect(args.onConfirm).toHaveBeenCalled();
	},
};
