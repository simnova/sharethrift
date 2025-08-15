import { ThemeDemo } from './ThemeDemo.tsx';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ThemeDemo> = {
  title: 'Theme/ThemeDemo',
  component: ThemeDemo,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof ThemeDemo>;

export const Default: Story = {
  render: () => <ThemeDemo />,
};
