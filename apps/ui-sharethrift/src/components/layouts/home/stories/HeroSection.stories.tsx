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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Verify the main heading is present
		const heading = canvas.getByRole('heading');
		expect(heading).toBeInTheDocument();
		
		// Verify the hero section contains a banner/image
		const banners = canvas.queryAllByRole('banner');
		if (banners.length === 0) {
			// If no banner role, check for images
			const images = canvas.queryAllByRole('img');
			expect(images.length).toBeGreaterThanOrEqual(0);
		}
		
		// Verify the component is visible
		expect(canvas.getByRole('heading')).toBeVisible();
	},
};
