import type { Meta, StoryObj } from '@storybook/react';
import { ReservationActions } from '../components/reservation-actions.js';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
	canvasUtils,
	triggerPopconfirmAnd,
} from '../../../../../test-utils/popconfirm-test-utils.ts';

type Canvas = ReturnType<typeof within>;

const { getButtons, queryButtons, getFirstButton } = canvasUtils;

const expectNoButtons = (canvas: Canvas) => {
	const buttons = queryButtons(canvas);
	expect(buttons.length).toBe(0);
};

const playExpectNoButtons: Story['play'] = ({ canvasElement }) => {
	const canvas = within(canvasElement);
	expectNoButtons(canvas);
};

const playLoadingState: Story['play'] = ({ canvasElement }) => {
	const canvas = within(canvasElement);
	const buttons = getButtons(canvas);
	expect(buttons.length).toBeGreaterThan(0);

	// Verify buttons exist (loading state should still render buttons)
	const primaryButton = getFirstButton(canvas);
	expect(primaryButton).toBeTruthy();

	// Ant Design loading buttons have aria-busy attribute or loading class
	const loadingIndicators = canvasElement.querySelectorAll(
		'.ant-btn-loading, [aria-busy="true"]',
	);
	expect(loadingIndicators.length).toBeGreaterThan(0);
};

// Factory function for no-actions stories
const createNoActionsStory = (status: string): Story => ({
	args: {
		status,
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
	play: playExpectNoButtons,
});

// Factory function for loading state stories
const createLoadingStory = (
	status: string,
	loadingProp: 'cancelLoading' | 'closeLoading',
): Story => ({
	args: {
		status,
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
		[loadingProp]: true,
	},
	play: playLoadingState,
});

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

		// Verify action buttons are present
		const buttons = canvas.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);

		// Verify buttons are visible
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

		// Verify buttons are rendered for accepted state
		const buttons = canvas.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);
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

		// Guard against assumptions about button ordering by asserting count
		// and selecting the message button via its accessible name.
		const buttons = getButtons(canvas);
		expect(buttons.length).toBeGreaterThan(1);

		const messageButton = canvas.getByRole('button', { name: /message/i });
		await userEvent.click(messageButton);
		// Verify the message callback was called (message button doesn't have Popconfirm)
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

		await triggerPopconfirmAnd(canvas, 'cancel');

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

		// REJECTED status should have Cancel button (domain allows cancellation from Rejected state)
		const buttons = getButtons(canvas);
		expect(buttons.length).toBe(1);

		await triggerPopconfirmAnd(canvas, 'confirm', {
			expectedTitle: 'Cancel Reservation Request',
			expectedDescription: 'Are you sure',
		});

		expect(args.onCancel).toHaveBeenCalled();
	},
};

export const CancelledNoActions: Story = createNoActionsStory('CANCELLED');

export const ClosedNoActions: Story = createNoActionsStory('CLOSED');

export const AcceptedActions: Story = {
	args: {
		status: 'ACCEPTED',
		onClose: fn(),
		onMessage: fn(),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify actions are present for accepted status
		const buttons = getButtons(canvas);
		expect(buttons.length).toBeGreaterThan(0);

		// Should have Close and Message buttons
		expect(buttons.length).toBe(2);
	},
};

export const CancelLoadingState: Story = createLoadingStory(
	'REQUESTED',
	'cancelLoading',
);

export const CloseLoadingState: Story = createLoadingStory(
	'ACCEPTED',
	'closeLoading',
);
