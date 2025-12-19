import type { Meta, StoryObj } from '@storybook/react';
import { ReservationActions } from '../components/reservation-actions.js';
import { expect, fn, within } from 'storybook/test';
import {
	canvasUtils,
	triggerPopconfirmAnd,
} from '../../../../../test-utils/popconfirm-test-utils.ts';
import type { ReservationActionStatus } from '../utils/reservation-status.utils.ts';

type Canvas = ReturnType<typeof within>;

const { getButtons, assertNoButtons, assertHasButtons, assertButtonCount } =
	canvasUtils;

// Shared helper for button visibility assertions
const expectButtonsVisible = (canvas: Canvas, expectedCount?: number) => {
	const buttons = getButtons(canvas);
	expect(buttons.length).toBeGreaterThan(0);
	if (expectedCount !== undefined) {
		expect(buttons.length).toBe(expectedCount);
	}
	for (const button of buttons) {
		expect(button).toBeVisible();
	}
};

// Shared helper for popconfirm cancel flow
type PopconfirmExpectation = {
	kind: 'confirm' | 'cancel';
	expectedTitle?: string;
	expectedDescription?: string;
	assertCalled: (args: Record<string, unknown>) => void;
};

const runCancelPopconfirmFlow = async (
	canvas: Canvas,
	args: Record<string, unknown>,
	{
		kind,
		expectedTitle,
		expectedDescription,
		assertCalled,
	}: PopconfirmExpectation,
) => {
	await triggerPopconfirmAnd(canvas, kind, {
		triggerButtonLabel: /cancel/i,
		expectedTitle,
		expectedDescription,
	});
	assertCalled(args);
};

const playExpectNoButtons: Story['play'] = ({ canvasElement }) => {
	const canvas = within(canvasElement);
	assertNoButtons(canvas);
};

const playLoadingState: Story['play'] = ({ canvasElement }) => {
	const canvas = within(canvasElement);
	assertHasButtons(canvas);

	// Ant Design loading buttons have aria-busy attribute or loading class
	const loadingIndicators = canvasElement.querySelectorAll(
		'.ant-btn-loading, [aria-busy="true"]',
	);
	expect(loadingIndicators.length).toBeGreaterThan(0);
};

// Factory function for no-actions stories
const createNoActionsStory = (status: ReservationActionStatus): Story => ({
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
	status: ReservationActionStatus,
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
		expectButtonsVisible(canvas);
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
		expectButtonsVisible(canvas);
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
		assertButtonCount(canvas, 2);

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
		await runCancelPopconfirmFlow(canvas, args, {
			kind: 'confirm',
			expectedTitle: 'Cancel Reservation Request',
			expectedDescription: 'Are you sure',
			assertCalled: (a) => expect(a['onCancel']).toHaveBeenCalled(),
		});
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
		await runCancelPopconfirmFlow(canvas, args, {
			kind: 'cancel',
			assertCalled: (a) => expect(a['onCancel']).not.toHaveBeenCalled(),
		});
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
		assertButtonCount(canvas, 1);

		await runCancelPopconfirmFlow(canvas, args, {
			kind: 'confirm',
			expectedTitle: 'Cancel Reservation Request',
			expectedDescription: 'Are you sure',
			assertCalled: (a) => expect(a['onCancel']).toHaveBeenCalled(),
		});
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
		expectButtonsVisible(canvas, 2);
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
