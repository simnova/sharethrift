import { Footer } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Footer> = {
  title: 'Molecules/Footer',
  component: Footer,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => <Footer />,
};
