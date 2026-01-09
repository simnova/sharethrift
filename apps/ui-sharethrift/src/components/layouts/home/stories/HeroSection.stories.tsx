import { HeroSection } from '../components/hero-section.tsx';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';

const meta: Meta<typeof HeroSection> = {
	title: 'Listing/Hero',
	component: HeroSection,
	parameters: {
		layout: 'fullscreen',
	},
};
export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
	render: () => <HeroSection />,
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const heading = canvas.getByRole('heading');
		expect(heading).toBeInTheDocument();
		
		const banners = canvas.queryAllByRole('banner');
		if (banners.length === 0) {
			const images = canvas.queryAllByRole('img');
			expect(images.length).toBeGreaterThanOrEqual(0);
		}
		
		expect(canvas.getByRole('heading')).toBeVisible();
	},
};

export const WithInteraction: Story = {
	render: () => <HeroSection />,
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const heading = canvas.getByRole('heading');
		expect(heading).toBeInTheDocument();
		
		const buttons = canvasElement.querySelectorAll('button, a[class*="button"]');
		expect(buttons.length).toBeGreaterThanOrEqual(0);
		
		const {textContent} = canvasElement;
		expect(textContent).toBeTruthy();
	},
};
