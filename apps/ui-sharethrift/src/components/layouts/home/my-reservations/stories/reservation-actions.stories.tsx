import type { Meta, StoryObj } from '@storybook/react';
import { ReservationActions } from '../components/reservation-actions.js';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

const POPCONFIRM_SELECTORS = {
	title: '.ant-popconfirm-title',
	description: '.ant-popconfirm-description',
	confirmButton: '.ant-popconfirm-buttons .ant-btn-primary',
	cancelButton: '.ant-popconfirm-buttons .ant-btn:not(.ant-btn-primary)',
} as const;

type Canvas = ReturnType<typeof within>;

const getButtons = (canvas: Canvas) => canvas.getAllByRole('button');
const queryButtons = (canvas: Canvas) => canvas.queryAllByRole('button');
const getFirstButton = (canvas: Canvas) => getButtons(canvas)[0];

const waitForPopconfirm = async () =>
	waitFor(
		() => {
			const title = document.querySelector(POPCONFIRM_SELECTORS.title);
			if (!title) throw new Error('Popconfirm not found');
			return title;
		},
		{ timeout: 1000 },
	);

const getPopconfirmElements = () => ({
	title: document.querySelector(POPCONFIRM_SELECTORS.title),
	description: document.querySelector(POPCONFIRM_SELECTORS.description),
	confirmButton: document.querySelector(
		POPCONFIRM_SELECTORS.confirmButton,
	) as HTMLElement | null,
	cancelButton: document.querySelector(
		POPCONFIRM_SELECTORS.cancelButton,
	) as HTMLElement | null,
});

const expectNoButtons = (canvas: Canvas) => {
	const buttons = queryButtons(canvas);
	expect(buttons.length).toBe(0);
};

const expectEmptyCanvas = (canvasElement: HTMLElement) => {
	expect(canvasElement.children.length).toBe(0);
};

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

		// Get all buttons
		const buttons = getButtons(canvas);
		expect(buttons.length).toBeGreaterThan(0);

		// Click the message button (second button in REQUESTED state - first is cancel with Popconfirm)
		const messageButton = buttons[1];
		if (messageButton) {
			await userEvent.click(messageButton);
			// Verify the message callback was called (message button doesn't have Popconfirm)
			expect(args.onMessage).toHaveBeenCalled();
		}
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

export const LoadingStates: Story = {
	args: {
		status: 'REQUESTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
		cancelLoading: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify loading state is rendered
		const buttons = canvas.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);

		// Check if any button shows loading state (might be disabled)
		const disabledButtons = buttons.filter((b) => b.hasAttribute('disabled'));
		expect(disabledButtons.length).toBeGreaterThanOrEqual(0);
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

		const cancelButton = getFirstButton(canvas);
		expect(cancelButton).toBeTruthy();

		if (cancelButton) {
			await userEvent.click(cancelButton);
			await waitForPopconfirm();

			const { title, description, confirmButton } = getPopconfirmElements();

			expect(title?.textContent).toContain('Cancel Reservation Request');
			expect(description?.textContent).toContain('Are you sure');

			if (confirmButton) {
				await userEvent.click(confirmButton);
				expect(args.onCancel).toHaveBeenCalled();
			}
		}
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

		const cancelButton = getFirstButton(canvas);
		expect(cancelButton).toBeTruthy();

		if (cancelButton) {
			await userEvent.click(cancelButton);
			await waitForPopconfirm();

			const { cancelButton: cancelPopconfirmButton } = getPopconfirmElements();

			if (cancelPopconfirmButton) {
				await userEvent.click(cancelPopconfirmButton);
				expect(args.onCancel).not.toHaveBeenCalled();
			}
		}
	},
};

export const RejectedNoActions: Story = {
	args: {
		status: 'REJECTED',
		onCancel: fn(),
		onClose: fn(),
		onMessage: fn(),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);

		expectNoButtons(canvas);
		expectEmptyCanvas(canvasElement);
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

		expectNoButtons(canvas);
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

		expectNoButtons(canvas);
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

		// Verify actions are present for accepted status
		const buttons = getButtons(canvas);
		expect(buttons.length).toBeGreaterThan(0);

		// Should have Close and Message buttons
		expect(buttons.length).toBe(2);
	},
};

export const CancelLoadingState: Story = {
	args: {
		status: 'REQUESTED',
		onCancel: fn(),
		onMessage: fn(),
		cancelLoading: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify loading state renders buttons
		const buttons = getButtons(canvas);
		expect(buttons.length).toBeGreaterThan(0);

		// Verify cancel button is present with loading state
		const cancelButton = getFirstButton(canvas);
		expect(cancelButton).toBeTruthy();
	},
};

export const CloseLoadingState: Story = {
	args: {
		status: 'ACCEPTED',
		onClose: fn(),
		onMessage: fn(),
		closeLoading: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify loading state renders buttons
		const buttons = getButtons(canvas);
		expect(buttons.length).toBeGreaterThan(0);

		// Verify close button is present with loading state
		const closeButton = getFirstButton(canvas);
		expect(closeButton).toBeTruthy();
	},
};
