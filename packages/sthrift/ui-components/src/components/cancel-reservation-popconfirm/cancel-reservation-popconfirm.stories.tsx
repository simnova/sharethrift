import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'antd';
import { expect, fn, within } from 'storybook/test';
import { CancelReservationPopconfirm } from './cancel-reservation-popconfirm.tsx';
import {
	triggerPopconfirmAnd,
	getLoadingIndicators,
	clickCancelThenConfirm,
} from '../../test-utils/popconfirm-test-utils.ts';

const meta: Meta<typeof CancelReservationPopconfirm> = {
	title: 'Components/CancelReservationPopconfirm',
	component: CancelReservationPopconfirm,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		onConfirm: { action: 'confirmed' },
		loading: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof CancelReservationPopconfirm>;

/**
 * Default state - shows the popconfirm with a trigger button.
 * Covers lines: component declaration, interface, basic rendering.
 */
export const Default: Story = {
	args: {
		onConfirm: fn(),
		loading: false,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /Cancel Reservation/i });
		expect(button).toBeVisible();
	},
};

/**
 * Tests clicking the popconfirm trigger and confirming.
 * Covers lines: handleConfirm function, onConfirm callback invocation.
 */
export const ConfirmCancellation: Story = {
	args: {
		onConfirm: fn(),
		loading: false,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /Cancel Reservation/i,
			expectedTitle: 'Cancel Reservation Request',
			expectedDescription: 'Are you sure you want to cancel this request?',
		});

		expect(args.onConfirm).toHaveBeenCalled();
	},
};

/**
 * Tests clicking the popconfirm trigger and then clicking 'No' to cancel.
 * Covers lines: Popconfirm rendering with okText/cancelText props.
 */
export const CancelPopconfirm: Story = {
	args: {
		onConfirm: fn(),
		loading: false,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'cancel', {
			triggerButtonLabel: /Cancel Reservation/i,
		});

		expect(args.onConfirm).not.toHaveBeenCalled();
	},
};

/**
 * Tests the loading state which should prevent handleConfirm from executing.
 * Covers lines: loading prop, early return in handleConfirm when loading is true.
 */
export const LoadingState: Story = {
	args: {
		onConfirm: fn(),
		loading: true,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /Cancel Reservation/i,
		});

		// onConfirm should NOT be called because loading is true
		expect(args.onConfirm).not.toHaveBeenCalled();
	},
};

/**
 * Tests without onConfirm callback (optional prop).
 * Covers lines: optional chaining onConfirm?.().
 */
export const NoConfirmCallback: Story = {
	args: {
		loading: false,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Should not throw even without onConfirm handler
		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /Cancel Reservation/i,
		});

		// Expect no errors - the component handles missing callback gracefully
		expect(canvas.getByRole('button')).toBeVisible();
	},
};

/**
 * Tests with different children (text instead of button).
 * Covers lines: children prop rendering.
 */
export const WithTextChild: Story = {
	args: {
		onConfirm: fn(),
		loading: false,
		children: (
			<span style={{ cursor: 'pointer', color: 'red' }}>Click to cancel</span>
		),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/Click to cancel/i)).toBeVisible();
	},
};

/**
 * Tests that loading prop is passed to okButtonProps.
 * Covers lines: okButtonProps={{ loading }}.
 */
export const LoadingButtonState: Story = {
	args: {
		onConfirm: fn(),
		loading: true,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const { userEvent, waitFor } = await import('storybook/test');

		// Click to open popconfirm
		const button = canvas.getByRole('button', { name: /Cancel Reservation/i });
		await userEvent.click(button);

		// Wait for popconfirm to appear and check for loading state on OK button
		await waitFor(() => {
			const okButton = document.querySelector(
				'.ant-popconfirm-buttons .ant-btn-primary',
			);
			expect(okButton).toBeTruthy();
			// The OK button should have loading state
			const loadingIndicator = document.querySelector(
				'.ant-popconfirm-buttons .ant-btn-loading',
			);
			expect(loadingIndicator).toBeTruthy();
		});
	},
};

/**
 * Tests the getLoadingIndicators utility function.
 * Covers lines: getLoadingIndicators function in test-utils.
 */
export const TestGetLoadingIndicators: Story = {
	args: {
		onConfirm: fn(),
		loading: true,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const { userEvent, waitFor } = await import('storybook/test');

		const button = canvas.getByRole('button', { name: /Cancel Reservation/i });
		await userEvent.click(button);

		await waitFor(() => {
			const loadingIndicators = getLoadingIndicators(document.body);
			expect(loadingIndicators.length).toBeGreaterThan(0);
		});
	},
};

/**
 * Tests the clickCancelThenConfirm utility function.
 * Covers lines: clickCancelThenConfirm function in test-utils.
 */
export const TestClickCancelThenConfirm: Story = {
	args: {
		onConfirm: fn(),
		loading: false,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement, args }) => {
		await clickCancelThenConfirm(canvasElement);
		expect(args.onConfirm).toHaveBeenCalled();
	},
};

/**
 * Tests triggerPopconfirmAnd with button index instead of label.
 * Covers lines: triggerButtonIndex branch in test-utils.
 */
export const TestTriggerByIndex: Story = {
	args: {
		onConfirm: fn(),
		loading: false,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonIndex: 0,
		});

		expect(args.onConfirm).toHaveBeenCalled();
	},
};

/**
 * Tests triggerPopconfirmAnd without options.
 * Covers lines: default options branch in test-utils.
 */
export const TestTriggerWithoutOptions: Story = {
	args: {
		onConfirm: fn(),
		loading: false,
		children: <Button danger>Cancel Reservation</Button>,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'confirm');

		expect(args.onConfirm).toHaveBeenCalled();
	},
};
