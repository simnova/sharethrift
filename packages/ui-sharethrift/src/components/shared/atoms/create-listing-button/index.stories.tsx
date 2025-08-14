import type { Meta, StoryObj } from '@storybook/react';
import { CreateListingButton } from './index';

const meta: Meta<typeof CreateListingButton> = {
  title: 'Molecules/Create Listing Button',
  component: CreateListingButton,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof CreateListingButton>;

export const Default: Story = {
  render: () => <CreateListingButton />,
};
