import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, Popconfirm, Space } from 'antd';
import type React from 'react';
import {
	canvasUtils,
	waitForPopconfirm,
	getPopconfirmElements,
	confirmPopconfirm,
	cancelPopconfirm,
	triggerPopconfirmAnd,
	POPCONFIRM_SELECTORS,
} from './popconfirm-test-utils.ts';

interface PopconfirmTestProps {
	onConfirm?: () => void;
	onCancel?: () => void;
	showMultipleButtons?: boolean;
}

const PopconfirmTestComponent: React.FC<PopconfirmTestProps> = ({
	onConfirm,
	onCancel,
	showMultipleButtons = false,
}) => (
	<Space>
		<Popconfirm
			title="Test Confirmation"
			description="Are you sure you want to proceed?"
			onConfirm={onConfirm}
			onCancel={onCancel}
			okText="Yes"
			cancelText="No"
		>
			<Button>Trigger Popconfirm</Button>
		</Popconfirm>
		{showMultipleButtons && (
			<>
				<Button onClick={onConfirm}>Secondary Button</Button>
				<Button onClick={onCancel}>Third Button</Button>
			</>
		)}
	</Space>
);

const meta: Meta<typeof PopconfirmTestComponent> = {
	title: 'Test Utilities/PopconfirmTestUtils',
	component: PopconfirmTestComponent,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CanvasUtilsGetButtons: Story = {
	args: {
		showMultipleButtons: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvasUtils.getButtons(canvas);
		expect(buttons.length).toBe(3);
	},
};

export const CanvasUtilsQueryButtons: Story = {
	args: {
		showMultipleButtons: false,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvasUtils.queryButtons(canvas);
		expect(buttons.length).toBe(1);
	},
};

export const CanvasUtilsGetFirstButton: Story = {
	args: {
		showMultipleButtons: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const firstButton = canvasUtils.getFirstButton(canvas);
		expect(firstButton).toBeTruthy();
		expect(firstButton.textContent).toBe('Trigger Popconfirm');
	},
};

export const CanvasUtilsAssertButtonCount: Story = {
	args: {
		showMultipleButtons: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		canvasUtils.assertButtonCount(canvas, 3);
	},
};

export const CanvasUtilsAssertHasButtons: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		canvasUtils.assertHasButtons(canvas);
	},
};

export const WaitForPopconfirmSuccess: Story = {
	args: {
		onConfirm: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const triggerButton = canvasUtils.getFirstButton(canvas);
		await userEvent.click(triggerButton);

		const title = await waitForPopconfirm();
		expect(title).toBeTruthy();
		expect(title.textContent).toContain('Test Confirmation');
	},
};

export const GetPopconfirmElementsSuccess: Story = {
	args: {
		onConfirm: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const triggerButton = canvasUtils.getFirstButton(canvas);
		await userEvent.click(triggerButton);
		await waitForPopconfirm();

		const elements = getPopconfirmElements();
		expect(elements.title?.textContent).toContain('Test Confirmation');
		expect(elements.description?.textContent).toContain('Are you sure');
		expect(elements.confirmButton).toBeTruthy();
		expect(elements.cancelButton).toBeTruthy();
	},
};

export const ConfirmPopconfirmSuccess: Story = {
	args: {
		onConfirm: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		const triggerButton = canvasUtils.getFirstButton(canvas);
		await userEvent.click(triggerButton);
		await waitForPopconfirm();

		await confirmPopconfirm();
		expect(args.onConfirm).toHaveBeenCalled();
	},
};

export const CancelPopconfirmSuccess: Story = {
	args: {
		onCancel: fn(),
		onConfirm: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		const triggerButton = canvasUtils.getFirstButton(canvas);
		await userEvent.click(triggerButton);
		await waitForPopconfirm();

		await cancelPopconfirm();
		// onConfirm should NOT be called when cancelling
		expect(args.onConfirm).not.toHaveBeenCalled();
	},
};

export const TriggerPopconfirmAndConfirm: Story = {
	args: {
		onConfirm: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			expectedTitle: 'Test Confirmation',
			expectedDescription: 'Are you sure',
		});

		expect(args.onConfirm).toHaveBeenCalled();
	},
};

export const TriggerPopconfirmAndCancel: Story = {
	args: {
		onConfirm: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'cancel', {
			expectedTitle: 'Test Confirmation',
		});

		expect(args.onConfirm).not.toHaveBeenCalled();
	},
};

export const PopconfirmSelectorsExist: Story = {
	args: {},
	play: () => {
		// Verify all selectors are defined
		expect(POPCONFIRM_SELECTORS.title).toBe('.ant-popconfirm-title');
		expect(POPCONFIRM_SELECTORS.description).toBe(
			'.ant-popconfirm-description',
		);
		expect(POPCONFIRM_SELECTORS.confirmButton).toBe(
			'.ant-popconfirm-buttons .ant-btn-primary',
		);
		expect(POPCONFIRM_SELECTORS.cancelButton).toBe(
			'.ant-popconfirm-buttons .ant-btn:not(.ant-btn-primary)',
		);
	},
};

export const ConfirmPopconfirmWhenNoButton: Story = {
	args: {},
	play: async () => {
		// Call confirmPopconfirm when no popconfirm is open
		const result = await confirmPopconfirm();
		expect(result).toBeNull();
	},
};

export const CancelPopconfirmWhenNoButton: Story = {
	args: {},
	play: async () => {
		// Call cancelPopconfirm when no popconfirm is open
		const result = await cancelPopconfirm();
		expect(result).toBeNull();
	},
};

export const TriggerPopconfirmWithButtonIndex: Story = {
	args: {
		onConfirm: fn(),
		showMultipleButtons: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Trigger the first button (index 0) which has the Popconfirm
		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonIndex: 0,
		});

		expect(args.onConfirm).toHaveBeenCalled();
	},
};
