import { expect, userEvent, waitFor, within } from 'storybook/test';

export const POPCONFIRM_SELECTORS = {
	title: '.ant-popconfirm-title',
	description: '.ant-popconfirm-description',
	confirmButton: '.ant-popconfirm-buttons .ant-btn-primary',
	cancelButton: '.ant-popconfirm-buttons .ant-btn:not(.ant-btn-primary)',
} as const;

type Canvas = ReturnType<typeof within>;
type PopconfirmAction = 'confirm' | 'cancel';

export const canvasUtils = {
	getButtons: (canvas: Canvas) => canvas.getAllByRole('button'),
	queryButtons: (canvas: Canvas) => canvas.queryAllByRole('button'),
	getFirstButton: (canvas: Canvas) => canvas.getAllByRole('button')[0],
	assertNoButtons: (canvas: Canvas) =>
		expect(canvas.queryAllByRole('button').length).toBe(0),
	assertButtonCount: (canvas: Canvas, count: number) =>
		expect(canvas.getAllByRole('button').length).toBe(count),
	assertHasButtons: (canvas: Canvas) =>
		expect(canvas.getAllByRole('button').length).toBeGreaterThan(0),
};

export const waitForPopconfirm = async () =>
	waitFor(
		() => {
			const title = document.querySelector(POPCONFIRM_SELECTORS.title);
			if (!title) throw new Error('Popconfirm not found');
			return title;
		},
		{ timeout: 1000 },
	);

export const getPopconfirmElements = () => ({
	title: document.querySelector(POPCONFIRM_SELECTORS.title),
	description: document.querySelector(POPCONFIRM_SELECTORS.description),
	confirmButton: document.querySelector(
		POPCONFIRM_SELECTORS.confirmButton,
	) as HTMLElement | null,
	cancelButton: document.querySelector(
		POPCONFIRM_SELECTORS.cancelButton,
	) as HTMLElement | null,
});

export const confirmPopconfirm = async () => {
	const confirmButton = document.querySelector(
		POPCONFIRM_SELECTORS.confirmButton,
	) as HTMLElement | null;
	if (confirmButton) {
		await userEvent.click(confirmButton);
	}
	return confirmButton;
};

export const cancelPopconfirm = async () => {
	const cancelButton = document.querySelector(
		POPCONFIRM_SELECTORS.cancelButton,
	) as HTMLElement | null;
	if (cancelButton) {
		await userEvent.click(cancelButton);
	}
	return cancelButton;
};

export const triggerPopconfirmAnd = async (
	canvas: Canvas,
	action: PopconfirmAction,
	options?: {
		triggerButtonIndex?: number;
		expectedTitle?: string;
		expectedDescription?: string;
	},
) => {
	const {
		triggerButtonIndex = 0,
		expectedTitle,
		expectedDescription,
	} = options ?? {};

	const buttons = canvas.getAllByRole('button');
	const triggerButton = buttons[triggerButtonIndex];
	expect(triggerButton).toBeTruthy();

	if (!triggerButton) return;

	await userEvent.click(triggerButton);
	await waitForPopconfirm();

	const { title, description, confirmButton, cancelButton } =
		getPopconfirmElements();

	if (expectedTitle) {
		expect(title?.textContent).toContain(expectedTitle);
	}
	if (expectedDescription) {
		expect(description?.textContent).toContain(expectedDescription);
	}

	const target = action === 'confirm' ? confirmButton : cancelButton;

	if (target) {
		await userEvent.click(target);
	}
};

export const clickCancelThenConfirm = async (canvasElement: HTMLElement) => {
	const canvas = within(canvasElement);

	const cancelButton = await waitFor(
		() => {
			const btn = canvas.queryByRole('button', { name: /Cancel/i });
			if (!btn) throw new Error('Cancel button not found yet');
			return btn;
		},
		{ timeout: 1000 },
	);

	await userEvent.click(cancelButton);

	const confirmButton = await waitFor(
		() => {
			const btn = document.querySelector(
				POPCONFIRM_SELECTORS.confirmButton,
			) as HTMLElement | null;
			if (!btn) throw new Error('Confirm button not found yet');
			return btn;
		},
		{ timeout: 1000 },
	);

	await userEvent.click(confirmButton);
};
