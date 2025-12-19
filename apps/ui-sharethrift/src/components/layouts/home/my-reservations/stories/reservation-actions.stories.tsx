import type { Meta, StoryObj } from '@storybook/react';
import { ReservationActions } from '../components/reservation-actions.js';
import { expect, fn, within } from 'storybook/test';
import { triggerPopconfirmAnd } from '../../../../../test-utils/popconfirm-test-utils.ts';

const meta: Meta<typeof ReservationActions> = {
	title: 'Molecules/ReservationActions',
	component: ReservationActions,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		status: {
			control: 'select',
			options: ['REQUESTED', 'ACCEPTED', 'REJECTED', 'CLOSED', 'CANCELLED'],
		},
		cancelLoading: {
			control: 'boolean',
		},
		closeLoading: {
			control: 'boolean',
		},
		onCancel: { action: 'cancel clicked' },
		onClose: { action: 'close clicked' },
		onMessage: { action: 'message clicked' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Requested: Story = {
	args: {
		status: 'REQUESTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvas.getAllByRole('button');

		expect(buttons.length).toBeGreaterThan(0);
		for (const button of buttons) {
			expect(button).toBeVisible();
		}
	},
};

export const Accepted: Story = {
	args: {
		status: 'ACCEPTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvas.getAllByRole('button');

		expect(buttons.length).toBeGreaterThan(0);
		for (const button of buttons) {
			expect(button).toBeVisible();
		}
	},
};

export const ButtonInteraction: Story = {
	args: {
		status: 'REQUESTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		expect(canvas.getAllByRole('button').length).toBe(2);

		const messageButton = canvas.getByRole('button', { name: /message/i });
		const { userEvent } = await import('storybook/test');
		await userEvent.click(messageButton);
		expect(args.onMessage).toHaveBeenCalled();
	},
};

export const Rejected: Story = {
	args: {
		status: 'REJECTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
};

export const Cancelled: Story = {
	args: {
		status: 'CANCELLED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
};

export const RequestedWithPopconfirm: Story = {
	args: {
		status: 'REQUESTED',
		onCancel: fn(),
		onMessage: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /cancel/i,
			expectedTitle: 'Cancel Reservation Request',
			expectedDescription: 'Are you sure',
		});

		expect(args.onCancel).toHaveBeenCalled();
	},
};

export const PopconfirmCancelAction: Story = {
	args: {
		status: 'REQUESTED',
		onCancel: fn(),
		onMessage: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await triggerPopconfirmAnd(canvas, 'cancel', {
			triggerButtonLabel: /cancel/i,
		});

		expect(args.onCancel).not.toHaveBeenCalled();
	},
};

export const RejectedWithCancel: Story = {
	args: {
		status: 'REJECTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		expect(canvas.getAllByRole('button').length).toBe(1);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /cancel/i,
			expectedTitle: 'Cancel Reservation Request',
			expectedDescription: 'Are you sure',
		});

		expect(args.onCancel).toHaveBeenCalled();
	},
};

export const CancelledNoActions: Story = {
	args: {
		status: 'CANCELLED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.queryAllByRole('button').length).toBe(0);
	},
};

export const ClosedNoActions: Story = {
	args: {
		status: 'CLOSED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.queryAllByRole('button').length).toBe(0);
	},
};

export const AcceptedActions: Story = {
	args: {
		status: 'ACCEPTED',
		onClose: fn(),
		onMessage: fn(),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvas.getAllByRole('button');

		expect(buttons.length).toBe(2);
		for (const button of buttons) {
			expect(button).toBeVisible();
		}
	},
};

export const CancelLoadingState: Story = {
	args: {
		status: 'REQUESTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
		cancelLoading: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvas.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);

		// Ant Design loading buttons have aria-busy attribute or loading class
		const loadingIndicators = canvasElement.querySelectorAll(
			'.ant-btn-loading, [aria-busy="true"]',
		);
		expect(loadingIndicators.length).toBeGreaterThan(0);
	},
};

export const CloseLoadingState: Story = {
	args: {
		status: 'ACCEPTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
		closeLoading: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const buttons = canvas.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);

		// Ant Design loading buttons have aria-busy attribute or loading class
		const loadingIndicators = canvasElement.querySelectorAll(
			'.ant-btn-loading, [aria-busy="true"]',
		);
		expect(loadingIndicators.length).toBeGreaterThan(0);
	},
};

// Test that loading state prevents double-submit (covers lines 16-17 in reservation-actions.tsx)
export const CancelLoadingPreventsDoubleSubmit: Story = {
	args: {
		status: 'REQUESTED',
		onCancel: fn(),
		onMessage: fn(),
		cancelLoading: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Trigger the popconfirm and click confirm while loading
		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /cancel/i,
		});

		// The callback should NOT be called because loading is true
		expect(args.onCancel).not.toHaveBeenCalled();
	},
};
