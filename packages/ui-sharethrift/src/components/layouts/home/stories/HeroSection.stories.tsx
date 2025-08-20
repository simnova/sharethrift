import { HeroSection } from '../components/hero-section';
import type { Meta, StoryObj } from '@storybook/react';

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
};
