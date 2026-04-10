import type { Meta, StoryObj } from '@storybook/react';
import { Thumbnail } from './thumbnail.tsx';
import { fn, expect, within, userEvent } from 'storybook/test';

const meta: Meta<typeof Thumbnail> = {
	title: 'Components/Thumbnail',
	component: Thumbnail,
	args: {
		src: '/assets/item-images/bike.png',
		onRemove: fn(),
	},
	argTypes: {
		onRemove: { action: 'remove' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onRemove: fn(),
	},
};

export const ClickRemove: Story = {
	args: {
		onRemove: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const removeBtn = canvas.getByRole('button');
		await userEvent.click(removeBtn);
		await expect(args.onRemove).toHaveBeenCalled();
	},
};